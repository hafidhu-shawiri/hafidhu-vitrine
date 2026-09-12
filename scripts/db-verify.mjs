/**
 * Vérification RÉELLE du schéma et du modèle de sécurité.
 *
 *     node scripts/db-verify.mjs
 *
 * Ne se contente pas de relire le SQL : interroge le catalogue Postgres,
 * puis rejoue de vraies requêtes avec la clé publique du navigateur pour
 * confirmer que la RLS ferme bien l'accès.
 *
 * Aucune donnée personnelle n'est affichée : seuls des compteurs et des
 * noms de contraintes le sont.
 */

import { connect, loadEnv, requireEnv } from './db.mjs';

const EXPECTED_COLUMNS = {
  contacts: [
    'id', 'created_at', 'updated_at', 'first_name', 'last_name', 'email',
    'phone', 'subject', 'message', 'source', 'status', 'notes',
  ],
  waitlist: [
    'id', 'created_at', 'first_name', 'last_name', 'email', 'country',
    'profile', 'feature_interest',
  ],
};

let failures = 0;

function check(ok, label, detail = '') {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

async function inspectSchema(client) {
  console.log('\n── 1. Tables et colonnes ───────────────────────────\n');

  for (const [table, expected] of Object.entries(EXPECTED_COLUMNS)) {
    const { rows } = await client.query(
      `select column_name, data_type, is_nullable
         from information_schema.columns
        where table_schema = 'public' and table_name = $1
        order by ordinal_position`,
      [table]
    );

    const names = rows.map((r) => r.column_name);
    const missing = expected.filter((c) => !names.includes(c));
    const extra = names.filter((c) => !expected.includes(c));

    check(rows.length > 0, `table public.${table}`, `${rows.length} colonnes`);
    check(missing.length === 0, `  colonnes attendues`, missing.length ? `manquantes : ${missing}` : 'toutes présentes');
    if (extra.length) console.log(`    (colonnes supplémentaires : ${extra.join(', ')})`);
  }
}

async function inspectConstraints(client) {
  console.log('\n── 2. Contraintes ──────────────────────────────────\n');

  const { rows } = await client.query(
    `select rel.relname as table_name, con.conname as name, con.contype as type
       from pg_constraint con
       join pg_class rel on rel.oid = con.conrelid
       join pg_namespace ns on ns.oid = rel.relnamespace
      where ns.nspname = 'public' and rel.relname in ('contacts','waitlist')
      order by rel.relname, con.conname`
  );

  const byTable = {};
  for (const r of rows) (byTable[r.table_name] ??= []).push(r);

  for (const [table, list] of Object.entries(byTable)) {
    const checks = list.filter((r) => r.type === 'c').length;
    const pk = list.filter((r) => r.type === 'p').length;
    console.log(`  ${table} : ${pk} clé primaire, ${checks} contraintes CHECK`);
    for (const r of list) console.log(`      · ${r.name} (${r.type})`);
  }

  check((byTable.contacts ?? []).filter((r) => r.type === 'c').length >= 10,
    'contacts — contraintes de longueur, format et valeurs autorisées');
  check((byTable.waitlist ?? []).filter((r) => r.type === 'c').length >= 6,
    'waitlist — contraintes de longueur, format et profils autorisés');

  const { rows: idx } = await client.query(
    `select tablename, indexname from pg_indexes
      where schemaname = 'public' and tablename in ('contacts','waitlist')
      order by tablename, indexname`
  );
  console.log(`\n  Index : ${idx.length}`);
  for (const r of idx) console.log(`      · ${r.tablename}.${r.indexname}`);
  check(idx.some((r) => r.indexname === 'waitlist_email_unique_idx'),
    'unicité de l’e-mail sur la liste d’attente');
}

async function inspectRls(client) {
  console.log('\n── 3. Row Level Security (catalogue) ───────────────\n');

  const { rows } = await client.query(
    `select relname, relrowsecurity, relforcerowsecurity
       from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and relname in ('contacts','waitlist')`
  );

  for (const r of rows) {
    check(r.relrowsecurity, `${r.relname} — RLS activée`);
    check(r.relforcerowsecurity, `${r.relname} — RLS forcée (s'applique aussi au propriétaire)`);
  }

  const { rows: policies } = await client.query(
    `select tablename, policyname from pg_policies
      where schemaname = 'public' and tablename in ('contacts','waitlist')`
  );
  check(policies.length === 0,
    'aucune politique ouverte aux rôles anon / authenticated',
    `${policies.length} politique(s)`);

  const { rows: grants } = await client.query(
    `select table_name, grantee, privilege_type
       from information_schema.role_table_grants
      where table_schema = 'public'
        and table_name in ('contacts','waitlist')
        and grantee in ('anon','authenticated')`
  );
  check(grants.length === 0,
    'aucun droit de table pour anon / authenticated',
    `${grants.length} droit(s)`);
}

async function probeAsBrowser() {
  console.log('\n── 4. RLS — requêtes réelles avec la clé du navigateur ──\n');

  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

  /*
   * Chaque charge utile est VALIDE pour sa table. Sans cela, PostgREST
   * répondrait 400 pour colonne inconnue et le test conclurait à un refus
   * de sécurité alors qu'il ne s'agirait que d'une erreur de forme.
   */
  const payloads = {
    contacts: {
      first_name: 'Sonde', last_name: 'RLS', email: 'sonde-rls@example.com',
      subject: 'Question générale',
      message: 'Tentative d’écriture directe depuis le navigateur — doit être refusée.',
    },
    waitlist: {
      first_name: 'Sonde', last_name: 'RLS', email: 'sonde-rls@example.com',
      country: 'Comores', profile: 'Autre',
    },
  };

  for (const table of ['contacts', 'waitlist']) {
    const read = await fetch(`${url}/rest/v1/${table}?select=*`, { headers });
    check(read.status !== 200, `lecture publique de ${table} refusée`, `HTTP ${read.status}`);

    const write = await fetch(`${url}/rest/v1/${table}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payloads[table]),
    });
    const body = await write.text();
    check(
      write.status !== 201,
      `écriture publique dans ${table} refusée (charge valide)`,
      `HTTP ${write.status} ${body.slice(0, 90)}`
    );
  }
}

async function probeAsServer() {
  console.log('\n── 5. Accès serveur (clé secrète) ──────────────────\n');

  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const headers = { apikey: key, Authorization: `Bearer ${key}` };

  for (const table of ['contacts', 'waitlist']) {
    const r = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, { headers });
    check(r.ok, `lecture serveur de ${table} autorisée`, `HTTP ${r.status}`);
  }
}

async function main() {
  await loadEnv();

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  HAFIDHU — Vérification de la base et de la RLS');
  console.log('═══════════════════════════════════════════════════');

  const client = await connect('session');
  try {
    await inspectSchema(client);
    await inspectConstraints(client);
    await inspectRls(client);
  } finally {
    await client.end().catch(() => {});
  }

  await probeAsBrowser();
  await probeAsServer();

  console.log('\n═══════════════════════════════════════════════════');
  console.log(failures === 0 ? '  ✓ Tous les contrôles passent.' : `  ✗ ${failures} contrôle(s) en échec.`);
  console.log('═══════════════════════════════════════════════════\n');

  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('\n✗ Erreur inattendue :', error.message, '\n');
  process.exit(1);
});
