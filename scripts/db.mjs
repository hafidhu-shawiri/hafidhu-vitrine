/**
 * Accès direct à la base Postgres de Supabase — OUTIL LOCAL UNIQUEMENT.
 *
 * Le domaine « direct connection » (db.<ref>.supabase.co) n'est plus
 * résolu en IPv4 sur les projets récents. On passe donc par le pooler
 * régional en mode « session », seul mode qui accepte le DDL et les
 * transactions longues.
 *
 * Ce module ne journalise jamais le mot de passe ni la chaîne complète.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');

/** Lecture minimale de .env.local (Node ne le charge pas seul). */
export async function loadEnv() {
  const raw = await readFile(path.join(ROOT, '.env.local'), 'utf8').catch(() => null);
  if (!raw) {
    console.error('\n✗ Fichier .env.local introuvable.\n');
    process.exit(1);
  }
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const value = match[2].replace(/^["']|["']$/g, '').trim();
    if (value && !process.env[match[1]]) process.env[match[1]] = value;
  }
}

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`\n✗ Variable « ${name} » absente de .env.local.\n`);
    process.exit(1);
  }
  return value;
}

/**
 * Hôtes candidats du pooler. Supabase a fait migrer les projets de
 * « aws-0 » vers « aws-1 » ; on essaie les deux plutôt que de coder en
 * dur celui qui se trouve être exact aujourd'hui.
 */
function poolerHosts(region) {
  return [`aws-1-${region}.pooler.supabase.com`, `aws-0-${region}.pooler.supabase.com`];
}

/**
 * Ouvre une connexion Postgres en mode session.
 * @param {'session'|'transaction'} mode
 */
export async function connect(mode = 'session') {
  const ref = requireEnv('SUPABASE_PROJECT_REF');
  const password = requireEnv('SUPABASE_DB_PASSWORD');
  const region = process.env.SUPABASE_DB_REGION || 'eu-west-1';
  const port = mode === 'transaction' ? 6543 : 5432;

  let lastError;

  for (const host of poolerHosts(region)) {
    const client = new pg.Client({
      host,
      port,
      user: `postgres.${ref}`,
      password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
      application_name: 'hafidhu-vitrine-cli',
    });

    try {
      await client.connect();
      console.log(`  Connecté : ${host}:${port} (mode ${mode})`);
      return client;
    } catch (error) {
      lastError = error;
      await client.end().catch(() => {});
    }
  }

  console.error('\n✗ Connexion impossible à la base.');
  console.error(`  ${lastError?.message ?? 'raison inconnue'}\n`);
  process.exit(1);
}
