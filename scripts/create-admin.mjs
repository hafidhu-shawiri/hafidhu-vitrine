/**
 * Création du compte administrateur initial.
 *
 * À exécuter UNE SEULE FOIS, manuellement, en local :
 *
 *     node scripts/create-admin.mjs
 *
 * Le mot de passe est transmis à Supabase Auth, qui le conserve sous
 * forme de hachage bcrypt. Il n'est écrit nulle part ailleurs : ni dans
 * le code, ni dans le dépôt, ni dans la base en clair, ni dans les
 * journaux. Ce script ne l'affiche jamais.
 *
 * Une fois le compte créé, ADMIN_USERNAME et ADMIN_PASSWORD peuvent —
 * et devraient — être vidés de .env.local. Le mot de passe se change
 * ensuite depuis Supabase, sans toucher au code.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Lecture minimale de .env.local (Node ne le charge pas seul). */
async function loadEnv() {
  const file = path.resolve(__dirname, '..', '.env.local');
  const raw = await readFile(file, 'utf8').catch(() => null);

  if (!raw) {
    console.error('\n✗ Fichier .env.local introuvable.');
    console.error('  Copiez .env.example en .env.local et renseignez les valeurs.\n');
    process.exit(1);
  }

  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.replace(/^["']|["']$/g, '');
    if (value && !process.env[key]) process.env[key] = value;
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`\n✗ Variable « ${name} » absente de .env.local.\n`);
    process.exit(1);
  }
  return value;
}

/** Masque une valeur sensible pour l'affichage. */
function mask(value) {
  return value.length <= 4 ? '••••' : `${value.slice(0, 2)}${'•'.repeat(6)}${value.slice(-2)}`;
}

async function main() {
  await loadEnv();

  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const username = requireEnv('ADMIN_USERNAME');
  const password = requireEnv('ADMIN_PASSWORD');

  /*
   * Supabase Auth identifie par e-mail. Si ADMIN_USERNAME n'est pas une
   * adresse, on en dérive une, stable et interne.
   */
  const email = username.includes('@') ? username.toLowerCase() : `${username.toLowerCase()}@hafidhu.local`;

  if (password.length < 8) {
    console.error('\n✗ Le mot de passe administrateur doit comporter au moins 8 caractères.');
    console.error('  Modifiez ADMIN_PASSWORD dans .env.local avant de relancer.\n');
    process.exit(1);
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  HAFIDHU — Création du compte administrateur');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`  Projet Supabase : ${url}`);
  console.log(`  Identifiant     : ${email}`);
  console.log(`  Mot de passe    : ${mask(password)} (jamais affiché en clair)\n`);

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Le compte existe-t-il déjà ?
  const { data: list, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (listError) {
    console.error('✗ Impossible de consulter les comptes existants :', listError.message);
    process.exit(1);
  }

  const existing = list.users.find((u) => u.email?.toLowerCase() === email);

  if (existing) {
    console.log('  Un compte existe déjà avec cet identifiant.');
    console.log('  Mise à jour du mot de passe…\n');

    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });

    if (error) {
      console.error('✗ Échec de la mise à jour :', error.message);
      process.exit(1);
    }

    console.log('✓ Mot de passe mis à jour.\n');
  } else {
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin', label: 'Administrateur HAFIDHU' },
    });

    if (error) {
      console.error('✗ Échec de la création :', error.message);
      process.exit(1);
    }

    console.log('✓ Compte administrateur créé.\n');
  }

  console.log('  Connexion : /admin/connexion');
  console.log('\n  ⚠ Pensez à vider ADMIN_PASSWORD de .env.local : le mot de passe');
  console.log('    est désormais stocké de façon sécurisée par Supabase Auth.\n');
}

main().catch((error) => {
  console.error('\n✗ Erreur inattendue :', error.message);
  process.exit(1);
});
