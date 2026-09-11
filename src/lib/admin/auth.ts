import 'server-only';

/**
 * Contrôle d'accès de l'espace d'administration.
 *
 * Le mot de passe n'est JAMAIS manipulé par l'application : il est
 * vérifié par Supabase Auth, qui le conserve sous forme de hachage
 * bcrypt. Aucun mot de passe n'existe en clair dans le code, dans le
 * dépôt, dans les variables lues à l'exécution, ni dans les journaux.
 */

import { redirect } from 'next/navigation';
import { createSessionClient } from '@/lib/supabase/server';

export type AdminUser = { id: string; email: string };

/**
 * Renvoie l'utilisateur connecté, ou redirige vers la page de connexion.
 *
 * Appelée par CHAQUE page d'administration : le middleware ne suffit pas.
 * Une vérification côté serveur, au plus près de la donnée, est la seule
 * qui fasse réellement autorité.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createSessionClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    redirect('/admin/connexion');
  }

  return { id: user.id, email: user.email };
}

/** Variante non bloquante, pour les cas où l'absence de session est normale. */
export async function getAdmin(): Promise<AdminUser | null> {
  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.email ? { id: user.id, email: user.email } : null;
  } catch {
    return null;
  }
}
