/**
 * Test RÉEL de l'authentification administrateur.
 *
 *     node scripts/test-auth.mjs
 *
 * Rejoue exactement ce que fait la page /admin/connexion : ouverture de
 * session par mot de passe contre Supabase Auth, relecture du profil avec
 * le jeton obtenu, puis fermeture de session. Un mauvais mot de passe est
 * également essayé, pour vérifier que le refus fonctionne.
 *
 * Aucun secret n'est affiché.
 */

import { createClient } from '@supabase/supabase-js';
import { loadEnv, requireEnv } from './db.mjs';

let failures = 0;

function check(ok, label, detail = '') {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

async function main() {
  await loadEnv();

  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const publicKey = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const username = requireEnv('ADMIN_USERNAME');
  const password = requireEnv('ADMIN_PASSWORD');
  const email = username.includes('@') ? username.toLowerCase() : `${username.toLowerCase()}@hafidhu.local`;

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  HAFIDHU — Test de l’authentification administrateur');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`  Identifiant testé : ${email}\n`);

  const supabase = createClient(url, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Mauvais mot de passe — doit échouer.
  const bad = await supabase.auth.signInWithPassword({
    email,
    password: `${password}-invalide`,
  });
  check(Boolean(bad.error), 'mot de passe erroné refusé', bad.error?.message ?? 'ACCEPTÉ (anormal)');

  // 2. Identifiant inexistant — doit échouer.
  const ghost = await supabase.auth.signInWithPassword({
    email: 'inconnu@hafidhu.local',
    password: 'motdepassequelconque',
  });
  check(Boolean(ghost.error), 'identifiant inconnu refusé', ghost.error?.message ?? 'ACCEPTÉ (anormal)');

  // 3. Bons identifiants — doit réussir.
  const good = await supabase.auth.signInWithPassword({ email, password });
  check(!good.error && Boolean(good.data.session), 'connexion avec les bons identifiants',
    good.error?.message ?? 'session ouverte');

  if (good.error || !good.data.session) {
    console.log('\n  ✗ Impossible de poursuivre sans session.\n');
    process.exit(1);
  }

  const token = good.data.session.access_token;

  // 4. Le jeton identifie bien le compte.
  const authed = createClient(url, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const me = await authed.auth.getUser(token);
  check(me.data.user?.email === email, 'le jeton identifie le bon compte', me.data.user?.email ?? 'aucun');

  // 5. Un administrateur connecté ne doit PAS pouvoir lire les tables
  //    directement : la RLS reste fermée même pour « authenticated ».
  //    La lecture passe uniquement par le serveur, avec la clé secrète.
  const read = await fetch(`${url}/rest/v1/contacts?select=id&limit=1`, {
    headers: { apikey: publicKey, Authorization: `Bearer ${token}` },
  });
  check(read.status !== 200,
    'un compte connecté ne lit pas la table directement (RLS)',
    `HTTP ${read.status}`);

  // 6. Fermeture de session.
  const out = await authed.auth.signOut();
  check(!out.error, 'fermeture de session', out.error?.message ?? 'OK');

  console.log('\n═══════════════════════════════════════════════════');
  console.log(failures === 0 ? '  ✓ Authentification conforme.' : `  ✗ ${failures} contrôle(s) en échec.`);
  console.log('═══════════════════════════════════════════════════\n');

  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('\n✗ Erreur inattendue :', error.message, '\n');
  process.exit(1);
});
