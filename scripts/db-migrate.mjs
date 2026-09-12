/**
 * Application des migrations SQL du dossier supabase/migrations.
 *
 *     node scripts/db-migrate.mjs
 *
 * Chaque fichier est joué UNE fois, dans l'ordre alphabétique, à
 * l'intérieur d'une transaction. L'historique est tenu dans la table
 * « public.schema_migrations » : rejouer la commande ne refait rien.
 *
 * Les migrations restent par ailleurs écrites de façon idempotente
 * (« create table if not exists », « create or replace »), de sorte
 * qu'une reprise après incident soit sans danger.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { connect, loadEnv, ROOT } from './db.mjs';

const DIR = path.join(ROOT, 'supabase', 'migrations');

async function main() {
  await loadEnv();

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  HAFIDHU — Migrations de base de données');
  console.log('═══════════════════════════════════════════════════\n');

  const files = (await readdir(DIR)).filter((f) => f.endsWith('.sql')).sort();

  if (files.length === 0) {
    console.log('  Aucune migration à appliquer.\n');
    return;
  }

  const client = await connect('session');

  try {
    await client.query(`
      create table if not exists public.schema_migrations (
        version     text primary key,
        applied_at  timestamptz not null default now()
      );
    `);

    const { rows } = await client.query('select version from public.schema_migrations');
    const done = new Set(rows.map((r) => r.version));

    let applied = 0;

    for (const file of files) {
      const version = file.replace(/\.sql$/, '');

      if (done.has(version)) {
        console.log(`  ○ ${file} — déjà appliquée`);
        continue;
      }

      const sql = await readFile(path.join(DIR, file), 'utf8');

      await client.query('begin');
      try {
        await client.query(sql);
        await client.query('insert into public.schema_migrations (version) values ($1)', [version]);
        await client.query('commit');
        console.log(`  ✓ ${file} — appliquée`);
        applied += 1;
      } catch (error) {
        await client.query('rollback');
        console.error(`\n  ✗ ${file} — ÉCHEC`);
        console.error(`    ${error.message}`);
        if (error.position) console.error(`    position ${error.position}`);
        process.exitCode = 1;
        return;
      }
    }

    console.log(`\n  ${applied} migration(s) appliquée(s), ${files.length - applied} déjà en place.\n`);
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((error) => {
  console.error('\n✗ Erreur inattendue :', error.message, '\n');
  process.exit(1);
});
