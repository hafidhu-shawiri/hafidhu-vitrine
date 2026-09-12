/**
 * Test RÉEL des deux formulaires, de bout en bout.
 *
 *     node scripts/test-forms.mjs [url-de-base]
 *
 * Par défaut : http://127.0.0.1:3000
 *
 * Chaque cas est envoyé sur la vraie route, puis l'effet est vérifié
 * DANS LA BASE — la réponse HTTP seule ne prouve rien. Les lignes de
 * test sont supprimées à la fin ; leur suppression est elle aussi
 * vérifiée.
 *
 * Les adresses employées portent le préfixe « test-hafidhu- » et le
 * domaine « example.com », réservé à cet usage : aucun message ne part
 * vers une vraie boîte de réception d'un tiers.
 */

import { createClient } from '@supabase/supabase-js';
import { loadEnv, requireEnv } from './db.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000';
const RUN = Date.now();

let failures = 0;
const created = { contacts: [], waitlist: [] };

function check(ok, label, detail = '') {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

function contactPayload(over = {}) {
  return {
    firstName: 'Sonde',
    lastName: 'Automatique',
    email: `test-hafidhu-contact-${RUN}@example.com`,
    phone: '+269 430 63 06',
    subject: 'Question générale',
    message: 'Message de contrôle automatique — vérification de la chaîne complète du formulaire.',
    website: '',
    ...over,
  };
}

function waitlistPayload(over = {}) {
  return {
    firstName: 'Sonde',
    lastName: 'Automatique',
    email: `test-hafidhu-waitlist-${RUN}@example.com`,
    country: 'Comores',
    profile: 'Autre',
    featureInterest: 'Contrôle automatique de la liste d’attente.',
    website: '',
    ...over,
  };
}

async function main() {
  await loadEnv();

  const supabase = createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  HAFIDHU — Test des formulaires de bout en bout');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`  Cible : ${BASE}\n`);

  /* ── CONTACT ─────────────────────────────────────────────────── */
  console.log('── Formulaire de contact ───────────────────────────\n');

  const valid = contactPayload();
  const a = await post('/api/contact', valid);
  check(a.status === 200 && a.json.ok === true, 'envoi valide accepté', `HTTP ${a.status}`);

  const { data: row } = await supabase
    .from('contacts')
    .select('id, first_name, last_name, email, phone, subject, message, source, status, created_at')
    .eq('email', valid.email)
    .maybeSingle();

  check(Boolean(row), 'ligne réellement écrite dans la table « contacts »');
  if (row) {
    created.contacts.push(row.id);
    check(row.first_name === valid.firstName, 'prénom enregistré tel quel');
    check(row.subject === valid.subject, 'sujet enregistré');
    check(row.status === 'Nouveau', 'statut initial « Nouveau »', row.status);
    check(row.source === 'Contact', 'source « Contact »', row.source);
    check(Boolean(row.created_at), 'date d’envoi enregistrée automatiquement');
  }

  const badSubject = await post('/api/contact', contactPayload({ subject: 'Sujet inventé' }));
  check(badSubject.status === 400, 'sujet hors liste refusé', `HTTP ${badSubject.status}`);

  const badEmail = await post('/api/contact', contactPayload({ email: 'pas-une-adresse' }));
  check(badEmail.status === 400, 'adresse invalide refusée', `HTTP ${badEmail.status}`);

  const shortMessage = await post('/api/contact', contactPayload({ message: 'court' }));
  check(shortMessage.status === 400, 'message trop court refusé', `HTTP ${shortMessage.status}`);

  const trapEmail = `test-hafidhu-robot-${RUN}@example.com`;
  const trap = await post(
    '/api/contact',
    contactPayload({ email: trapEmail, website: 'https://robot.example' })
  );
  const { count: trapCount } = await supabase
    .from('contacts')
    .select('id', { count: 'exact', head: true })
    .eq('email', trapEmail);
  check(
    trap.status === 200 && trapCount === 0,
    'champ leurre : succès factice, rien enregistré',
    `HTTP ${trap.status}, ${trapCount} ligne(s)`
  );

  /* ── LISTE D'ATTENTE ─────────────────────────────────────────── */
  console.log('\n── Formulaire de liste d’attente ───────────────────\n');

  const wl = waitlistPayload();
  const b = await post('/api/waitlist', wl);
  check(b.status === 200 && b.json.ok === true, 'inscription valide acceptée', `HTTP ${b.status}`);

  const { data: wrow } = await supabase
    .from('waitlist')
    .select('id, first_name, last_name, email, country, profile, feature_interest, created_at')
    .eq('email', wl.email)
    .maybeSingle();

  check(Boolean(wrow), 'ligne réellement écrite dans la table « waitlist »');
  if (wrow) {
    created.waitlist.push(wrow.id);
    check(wrow.country === wl.country, 'pays enregistré');
    check(wrow.profile === wl.profile, 'profil enregistré');
    check(Boolean(wrow.feature_interest), 'champ facultatif enregistré');
    check(Boolean(wrow.created_at), 'date d’inscription enregistrée automatiquement');
  }

  const dup = await post('/api/waitlist', wl);
  const { count: dupCount } = await supabase
    .from('waitlist')
    .select('id', { count: 'exact', head: true })
    .eq('email', wl.email);
  check(dupCount === 1, 'doublon d’adresse non créé', `${dupCount} ligne(s), HTTP ${dup.status}`);

  const badProfile = await post('/api/waitlist', waitlistPayload({ profile: 'Profil inventé' }));
  check(badProfile.status === 400, 'profil hors liste refusé', `HTTP ${badProfile.status}`);

  const noCountry = await post('/api/waitlist', waitlistPayload({ country: '' }));
  check(noCountry.status === 400, 'pays manquant refusé', `HTTP ${noCountry.status}`);

  /* ── NETTOYAGE ───────────────────────────────────────────────── */
  console.log('\n── Nettoyage des données de test ───────────────────\n');

  for (const [table, ids] of Object.entries(created)) {
    if (ids.length === 0) continue;
    const { error } = await supabase.from(table).delete().in('id', ids);
    check(!error, `${ids.length} ligne(s) de test supprimée(s) de « ${table} »`, error?.message);
  }

  const { count: leftA } = await supabase
    .from('contacts')
    .select('id', { count: 'exact', head: true })
    .like('email', 'test-hafidhu-%');
  const { count: leftB } = await supabase
    .from('waitlist')
    .select('id', { count: 'exact', head: true })
    .like('email', 'test-hafidhu-%');
  check(leftA === 0 && leftB === 0, 'aucune donnée de test résiduelle', `${leftA} + ${leftB}`);

  console.log('\n═══════════════════════════════════════════════════');
  console.log(failures === 0 ? '  ✓ Formulaires conformes.' : `  ✗ ${failures} contrôle(s) en échec.`);
  console.log('═══════════════════════════════════════════════════\n');

  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('\n✗ Erreur inattendue :', error.message, '\n');
  process.exit(1);
});
