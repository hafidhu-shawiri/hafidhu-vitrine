import 'server-only';

/**
 * Lectures de l'espace d'administration.
 *
 * Toutes les requêtes passent par la clé service_role, exclusivement
 * côté serveur, et après vérification de la session par l'appelant.
 */

import { createServiceClient } from '@/lib/supabase/server';
import type { ContactStatus } from '@/lib/validation';

export type ContactRow = {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  source: string;
  status: ContactStatus;
  notes: string | null;
};

export type WaitlistRow = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  profile: string;
  feature_interest: string | null;
};

export type Stats = {
  contactsTotal: number;
  contactsNew: number;
  contactsPending: number;
  waitlistTotal: number;
  waitlistLast30Days: number;
};

export async function getStats(): Promise<Stats> {
  const supabase = createServiceClient();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [total, fresh, pending, wait, waitRecent] = await Promise.all([
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'Nouveau'),
    supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .in('status', ['À traiter', 'En cours']),
    supabase.from('waitlist').select('*', { count: 'exact', head: true }),
    supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since),
  ]);

  return {
    contactsTotal: total.count ?? 0,
    contactsNew: fresh.count ?? 0,
    contactsPending: pending.count ?? 0,
    waitlistTotal: wait.count ?? 0,
    waitlistLast30Days: waitRecent.count ?? 0,
  };
}

export async function listContacts(options: {
  search?: string;
  status?: string;
  source?: string;
  limit?: number;
}): Promise<{ rows: ContactRow[]; error: string | null }> {
  const supabase = createServiceClient();

  let query = supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(options.limit ?? 100);

  if (options.status && options.status !== 'Tous') {
    query = query.eq('status', options.status);
  }
  if (options.source && options.source !== 'Toutes') {
    query = query.eq('source', options.source);
  }
  if (options.search) {
    // Les caractères propres au motif LIKE sont neutralisés pour que la
    // recherche reste littérale.
    const term = options.search.replace(/[%_\\]/g, (c) => `\\${c}`);
    query = query.or(
      [
        `first_name.ilike.%${term}%`,
        `last_name.ilike.%${term}%`,
        `email.ilike.%${term}%`,
        `subject.ilike.%${term}%`,
        `message.ilike.%${term}%`,
      ].join(',')
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error('[admin] Échec de lecture des contacts :', error.code ?? 'code inconnu');
    return { rows: [], error: 'Les contacts n’ont pas pu être chargés.' };
  }

  return { rows: (data ?? []) as ContactRow[], error: null };
}

export async function getContact(id: string): Promise<ContactRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('contacts').select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error('[admin] Échec de lecture du contact :', error.code ?? 'code inconnu');
    return null;
  }

  return (data as ContactRow) ?? null;
}

export async function listWaitlist(options: {
  search?: string;
  profile?: string;
  limit?: number;
}): Promise<{ rows: WaitlistRow[]; error: string | null }> {
  const supabase = createServiceClient();

  let query = supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(options.limit ?? 200);

  if (options.profile && options.profile !== 'Tous') {
    query = query.eq('profile', options.profile);
  }
  if (options.search) {
    const term = options.search.replace(/[%_\\]/g, (c) => `\\${c}`);
    query = query.or(
      [
        `first_name.ilike.%${term}%`,
        `last_name.ilike.%${term}%`,
        `email.ilike.%${term}%`,
        `country.ilike.%${term}%`,
      ].join(',')
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error('[admin] Échec de lecture de la liste d’attente :', error.code ?? 'code inconnu');
    return { rows: [], error: 'La liste d’attente n’a pas pu être chargée.' };
  }

  return { rows: (data ?? []) as WaitlistRow[], error: null };
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Indian/Comoro',
  }).format(new Date(iso));
}
