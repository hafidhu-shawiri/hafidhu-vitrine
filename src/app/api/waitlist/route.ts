import { NextResponse } from 'next/server';
import { sendWaitlistNotification } from '@/lib/email';
import { checkRateLimit, clientKey } from '@/lib/rate-limit';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { fieldErrors, sanitizeForStorage, waitlistSchema } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALREADY_REGISTERED =
  'Cette adresse est déjà inscrite à la liste d’attente. Vous serez informé de l’avancement — rien de plus à faire.';

export async function POST(request: Request) {
  const limit = checkRateLimit(clientKey(request, 'waitlist'));
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: `Trop de demandes envoyées depuis cet appareil. Merci de réessayer dans ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
      },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Requête illisible. Merci de réessayer.' },
      { status: 400 }
    );
  }

  const parsed = waitlistSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Certaines informations doivent être corrigées avant l’envoi.',
        errors: fieldErrors(parsed.error),
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data.website) {
    return NextResponse.json({ ok: true, message: 'Votre inscription est enregistrée.' });
  }

  if (!isSupabaseConfigured()) {
    console.error('[waitlist] Supabase non configuré : la soumission n’a pas pu être enregistrée.');
    return NextResponse.json(
      {
        ok: false,
        message:
          'Le service d’enregistrement est momentanément indisponible. ' +
          'Merci de réessayer plus tard, ou de nous écrire à contact@morashawiri.com.',
      },
      { status: 503 }
    );
  }

  const email = data.email.toLowerCase();

  try {
    const supabase = createServiceClient();

    const { error } = await supabase.from('waitlist').insert({
      first_name: sanitizeForStorage(data.firstName),
      last_name: sanitizeForStorage(data.lastName),
      email,
      country: sanitizeForStorage(data.country),
      profile: data.profile,
      feature_interest: data.featureInterest ? sanitizeForStorage(data.featureInterest) : null,
    });

    if (error) {
      // 23505 = violation de contrainte d'unicité sur l'e-mail.
      // Ce n'est pas un échec : la personne est déjà inscrite.
      if (error.code === '23505') {
        return NextResponse.json({ ok: true, message: ALREADY_REGISTERED, duplicate: true });
      }

      console.error('[waitlist] Échec de l’enregistrement :', error.code ?? 'code inconnu');
      return NextResponse.json(
        {
          ok: false,
          message:
            'Votre inscription n’a pas pu être enregistrée. Merci de réessayer, ' +
            'ou de nous écrire à contact@morashawiri.com.',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(
      '[waitlist] Erreur inattendue :',
      error instanceof Error ? error.name : 'erreur inconnue'
    );
    return NextResponse.json(
      {
        ok: false,
        message:
          'Une erreur inattendue est survenue. Merci de réessayer, ' +
          'ou de nous écrire à contact@morashawiri.com.',
      },
      { status: 500 }
    );
  }

  const mail = await sendWaitlistNotification({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    country: data.country,
    profile: data.profile,
    featureInterest: data.featureInterest || undefined,
  });

  if (!mail.sent) {
    console.warn(`[waitlist] Inscription enregistrée, notification non envoyée (${mail.reason}).`);
  }

  return NextResponse.json({ ok: true, message: 'Votre inscription est enregistrée.' });
}
