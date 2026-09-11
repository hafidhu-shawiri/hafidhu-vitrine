import 'server-only';

/**
 * Clients Supabase — SERVEUR UNIQUEMENT.
 *
 * L'import « server-only » ci-dessus fait échouer la compilation si ce
 * fichier est importé depuis un composant client. C'est le garde-fou qui
 * garantit que la clé service_role ne peut pas atteindre le navigateur.
 */

import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variable d'environnement « ${name} » manquante. ` +
        `Renseignez-la dans .env.local (voir .env.example).`
    );
  }
  return value;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Client d'écriture privilégié.
 *
 * Contourne la RLS : à n'utiliser que dans des routes serveur, après
 * validation complète des données. Ne jamais exposer ce client, ni
 * l'une de ses réponses brutes, au navigateur.
 */
export function createServiceClient(): SupabaseClient {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { 'X-Client-Info': 'hafidhu-vitrine/server' } },
    }
  );
}

/**
 * Client lié à la session de l'utilisateur connecté.
 * Utilisé par l'espace d'administration pour vérifier qui agit.
 */
export async function createSessionClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            for (const { name, value, options } of list) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Appelé depuis un composant serveur : le middleware
            // rafraîchit déjà la session, l'échec est sans conséquence.
          }
        },
      },
    }
  );
}
