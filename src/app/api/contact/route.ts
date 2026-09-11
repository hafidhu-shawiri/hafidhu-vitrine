import { NextResponse } from 'next/server';
import { sendContactNotification } from '@/lib/email';
import { checkRateLimit, clientKey } from '@/lib/rate-limit';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { contactSchema, fieldErrors, sanitizeForStorage } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // ── 1. Limitation de débit ────────────────────────────────────
  const limit = checkRateLimit(clientKey(request, 'contact'));
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: `Trop de demandes envoyées depuis cet appareil. Merci de réessayer dans ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
      },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  // ── 2. Lecture et validation serveur ──────────────────────────
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Requête illisible. Merci de réessayer.' },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(payload);
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

  // ── 3. Champ leurre ───────────────────────────────────────────
  // Rempli ⇒ robot. On renvoie un succès pour ne rien lui apprendre,
  // mais rien n'est enregistré.
  if (data.website) {
    return NextResponse.json({ ok: true, message: 'Votre message est enregistré.' });
  }

  // ── 4. Enregistrement ─────────────────────────────────────────
  if (!isSupabaseConfigured()) {
    console.error('[contact] Supabase non configuré : la soumission n’a pas pu être enregistrée.');
    return NextResponse.json(
      {
        ok: false,
        message:
          'Le service d’enregistrement est momentanément indisponible. ' +
          'Merci de réessayer plus tard, ou de nous écrire directement à contact@morashawiri.com.',
      },
      { status: 503 }
    );
  }

  try {
    const supabase = createServiceClient();

    const { error } = await supabase.from('contacts').insert({
      first_name: sanitizeForStorage(data.firstName),
      last_name: sanitizeForStorage(data.lastName),
      email: data.email.toLowerCase(),
      phone: data.phone ? sanitizeForStorage(data.phone) : null,
      subject: data.subject,
      message: sanitizeForStorage(data.message),
      source: data.subject === 'Partenariat' ? 'Partenariat' : 'Contact',
      status: 'Nouveau',
    });

    if (error) {
      console.error('[contact] Échec de l’enregistrement :', error.code ?? 'code inconnu');
      return NextResponse.json(
        {
          ok: false,
          message:
            'Votre message n’a pas pu être enregistré. Merci de réessayer, ' +
            'ou de nous écrire directement à contact@morashawiri.com.',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(
      '[contact] Erreur inattendue :',
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

  // ── 5. Notification ───────────────────────────────────────────
  // La donnée est déjà en base : un échec d'envoi ne remet pas en cause
  // la confirmation donnée au visiteur.
  const mail = await sendContactNotification({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone || undefined,
    subject: data.subject,
    message: data.message,
  });

  if (!mail.sent) {
    console.warn(`[contact] Message enregistré, notification non envoyée (${mail.reason}).`);
  }

  return NextResponse.json({ ok: true, message: 'Votre message est enregistré.' });
}
