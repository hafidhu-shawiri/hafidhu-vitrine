'use server';

/**
 * Actions serveur de l'espace d'administration.
 *
 * Chaque action revérifie la session avant d'agir : aucune ne fait
 * confiance à l'appelant. Les lectures et écritures passent par la clé
 * service_role, qui ne quitte jamais le serveur.
 */

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServiceClient, createSessionClient } from '@/lib/supabase/server';
import { CONTACT_STATUSES, type ContactStatus } from '@/lib/validation';
import { requireAdmin } from './auth';

export type ActionResult = { ok: boolean; message: string };

/* ═══════════════════════════════════════════════════════════════════
   AUTHENTIFICATION
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Supabase Auth identifie par adresse. Le compte administrateur a été
 * créé par scripts/create-admin.mjs, qui dérive l'adresse du nom
 * d'utilisateur lorsque celui-ci n'en est pas une.
 *
 * La même dérivation doit être appliquée ici, sans quoi saisir
 * « rachade » enverrait « rachade » à Supabase, qui attend
 * « rachade@hafidhu.local » — et refuserait la connexion.
 *
 * Une adresse complète reste acceptée telle quelle.
 */
function toAuthEmail(identifier: string): string {
  const value = identifier.trim().toLowerCase();
  return value.includes('@') ? value : `${value}@hafidhu.local`;
}

export async function signIn(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const identifier = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!identifier || !password) {
    return { ok: false, message: 'Identifiant et mot de passe sont nécessaires.' };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: toAuthEmail(identifier),
    password,
  });

  if (error) {
    // Message volontairement identique dans tous les cas d'échec : il ne
    // doit pas permettre de deviner si un compte existe.
    // Le mot de passe n'est jamais journalisé.
    console.warn('[admin] Tentative de connexion refusée.');
    return {
      ok: false,
      message: 'Identifiant ou mot de passe incorrect. Vérifiez votre saisie et réessayez.',
    };
  }

  redirect('/admin');
}

export async function signOut(): Promise<void> {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect('/admin/connexion');
}

/* ═══════════════════════════════════════════════════════════════════
   CONTACTS
   ═══════════════════════════════════════════════════════════════════ */

export async function updateContactStatus(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');

  if (!id) return { ok: false, message: 'Contact introuvable.' };
  if (!CONTACT_STATUSES.includes(status as ContactStatus)) {
    return { ok: false, message: 'Statut non reconnu.' };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from('contacts').update({ status }).eq('id', id);

  if (error) {
    console.error('[admin] Échec de mise à jour du statut :', error.code ?? 'code inconnu');
    return { ok: false, message: 'Le statut n’a pas pu être enregistré. Merci de réessayer.' };
  }

  revalidatePath('/admin');
  revalidatePath(`/admin/contacts/${id}`);
  return { ok: true, message: `Statut mis à jour : ${status}.` };
}

export async function updateContactNotes(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  const notes = String(formData.get('notes') ?? '').trim();

  if (!id) return { ok: false, message: 'Contact introuvable.' };
  if (notes.length > 5000) {
    return { ok: false, message: 'Cette note dépasse 5 000 caractères. Merci de la raccourcir.' };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('contacts')
    .update({ notes: notes || null })
    .eq('id', id);

  if (error) {
    console.error('[admin] Échec d’enregistrement des notes :', error.code ?? 'code inconnu');
    return { ok: false, message: 'La note n’a pas pu être enregistrée. Merci de réessayer.' };
  }

  revalidatePath(`/admin/contacts/${id}`);
  return { ok: true, message: 'Note enregistrée.' };
}
