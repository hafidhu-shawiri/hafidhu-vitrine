/**
 * Test RÉEL de l'espace d'administration, dans un navigateur.
 *
 *     node scripts/test-admin.mjs [--url http://127.0.0.1:3000]
 *
 * Rien n'est simulé : un vrai navigateur ouvre les pages, saisit les
 * identifiants, clique, et l'effet des actions est vérifié DANS LA BASE.
 *
 * Une ligne de contrôle est créée avant le parcours puis supprimée à la
 * fin — le test ne laisse aucune trace.
 *
 * Aucun identifiant n'est affiché.
 */

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { loadEnv, requireEnv } from './db.mjs';

const args = process.argv.slice(2);
const flag = args.indexOf('--url');
const BASE = flag >= 0 && args[flag + 1] ? args[flag + 1] : 'http://127.0.0.1:3000';
const RUN = Date.now();
const PROBE_EMAIL = `test-hafidhu-admin-${RUN}@example.com`;

let failures = 0;
const consoleErrors = [];

function check(ok, label, detail = '') {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

async function main() {
  await loadEnv();

  const supabase = createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const username = requireEnv('ADMIN_USERNAME');
  const password = requireEnv('ADMIN_PASSWORD');
  const email = username.includes('@') ? username.toLowerCase() : `${username.toLowerCase()}@hafidhu.local`;

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  HAFIDHU — Test de l’espace d’administration');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`  Cible : ${BASE}\n`);

  /* Une ligne de contrôle, pour que les écrans aient de quoi afficher. */
  const { data: probe, error: insertError } = await supabase
    .from('contacts')
    .insert({
      first_name: 'Sonde',
      last_name: 'Administration',
      email: PROBE_EMAIL,
      subject: 'Question générale',
      message: 'Ligne de contrôle créée par scripts/test-admin.mjs. Supprimée en fin de test.',
      source: 'Contact',
      status: 'Nouveau',
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('✗ Impossible de préparer la ligne de contrôle :', insertError.message);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });

  try {
    /* ── 1. Accès sans session ─────────────────────────────────── */
    console.log('── 1. Accès sans session ───────────────────────────\n');

    for (const path of ['/admin', '/admin/contacts', '/admin/liste-attente']) {
      await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
      check(
        new URL(page.url()).pathname === '/admin/connexion',
        `${path} renvoie vers la page de connexion`,
        new URL(page.url()).pathname
      );
    }

    /* ── 2. Mauvais mot de passe ───────────────────────────────── */
    console.log('\n── 2. Identifiants erronés ─────────────────────────\n');

    await page.goto(`${BASE}/admin/connexion`, { waitUntil: 'domcontentloaded' });
    await page.fill('#admin-email', email);
    await page.fill('#admin-password', `${password}-invalide`);
    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.click('button[type="submit"]'),
    ]);

    check(
      new URL(page.url()).pathname === '/admin/connexion',
      'la connexion échoue et reste sur la page',
      new URL(page.url()).pathname
    );
    const alert = page.locator('[role="alert"]');
    check(await alert.first().isVisible(), 'un message d’erreur explicite est affiché');

    /* ── 3. Connexion réelle ───────────────────────────────────── */
    console.log('\n── 3. Connexion avec les bons identifiants ─────────\n');

    await page.fill('#admin-email', email);
    await page.fill('#admin-password', password);
    await Promise.all([
      page.waitForURL(`${BASE}/admin`, { timeout: 20000 }),
      page.click('button[type="submit"]'),
    ]);

    check(new URL(page.url()).pathname === '/admin', 'redirection vers le tableau de bord');
    check(
      await page.getByRole('heading', { name: /Vue d’ensemble/ }).isVisible(),
      'le tableau de bord s’affiche'
    );

    const statsText = await page.locator('section[aria-label="Chiffres clés"]').innerText();
    check(/\d/.test(statsText), 'les chiffres clés sont calculés', statsText.replace(/\s+/g, ' ').slice(0, 90));

    /* ── 4. Liste des contacts ─────────────────────────────────── */
    console.log('\n── 4. Écran « Contacts » ───────────────────────────\n');

    await page.goto(`${BASE}/admin/contacts`, { waitUntil: 'networkidle' });
    check(
      await page.getByRole('heading', { name: 'Contacts', level: 1 }).isVisible(),
      'la page Contacts s’affiche'
    );
    check(
      (await page.getByText(PROBE_EMAIL).count()) > 0,
      'la ligne de contrôle apparaît dans la liste'
    );

    // Recherche plein texte.
    await page.fill('#q', 'Sonde');
    await Promise.all([page.waitForLoadState('networkidle'), page.press('#q', 'Enter')]);
    check(
      (await page.getByText(PROBE_EMAIL).count()) > 0,
      'la recherche retrouve la ligne de contrôle'
    );

    /* ── 5. Détail et changement de statut ─────────────────────── */
    console.log('\n── 5. Détail d’un contact ──────────────────────────\n');

    await page.goto(`${BASE}/admin/contacts/${probe.id}`, { waitUntil: 'networkidle' });
    check(
      (await page.getByText(PROBE_EMAIL).count()) > 0,
      'la fiche du contact s’ouvre'
    );

    const statusSelect = page.locator('select[name="status"]').first();
    if (await statusSelect.count()) {
      await statusSelect.selectOption('En cours');
      const submit = page.locator('form:has(select[name="status"]) button[type="submit"]').first();
      await Promise.all([page.waitForLoadState('networkidle'), submit.click()]);
      await page.waitForTimeout(600);

      const { data: after } = await supabase
        .from('contacts')
        .select('status, updated_at, created_at')
        .eq('id', probe.id)
        .single();

      check(after?.status === 'En cours', 'le statut est réellement modifié en base', after?.status);
      check(
        after && new Date(after.updated_at) > new Date(after.created_at),
        'le déclencheur a mis « updated_at » à jour'
      );
    } else {
      check(false, 'sélecteur de statut introuvable sur la fiche');
    }

    /* ── 6. Liste d'attente ────────────────────────────────────── */
    console.log('\n── 6. Écran « Liste d’attente » ────────────────────\n');

    await page.goto(`${BASE}/admin/liste-attente`, { waitUntil: 'networkidle' });
    check(
      new URL(page.url()).pathname === '/admin/liste-attente',
      'la page reste accessible avec une session'
    );
    check(
      (await page.locator('h1').innerText()).length > 0,
      'la page affiche un titre',
      await page.locator('h1').innerText()
    );

    /* ── 7. Indexation et cache ────────────────────────────────── */
    console.log('\n── 7. En-têtes de l’espace privé ───────────────────\n');

    const head = await page.request.get(`${BASE}/admin`, { maxRedirects: 0 });
    check(
      (head.headers()['x-robots-tag'] ?? '').includes('noindex'),
      'X-Robots-Tag : noindex',
      head.headers()['x-robots-tag']
    );
    check(
      (head.headers()['cache-control'] ?? '').includes('no-store'),
      'Cache-Control : no-store',
      head.headers()['cache-control']
    );

    /* ── 8. Déconnexion ────────────────────────────────────────── */
    console.log('\n── 8. Déconnexion ──────────────────────────────────\n');

    await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
    const logout = page.getByRole('button', { name: /Déconnexion|Se déconnecter|Quitter/i }).first();

    if (await logout.count()) {
      await Promise.all([
        page.waitForURL(/\/admin\/connexion/, { timeout: 20000 }),
        logout.click(),
      ]);
      check(
        new URL(page.url()).pathname === '/admin/connexion',
        'la déconnexion renvoie à la page de connexion'
      );

      await page.goto(`${BASE}/admin/contacts`, { waitUntil: 'domcontentloaded' });
      check(
        new URL(page.url()).pathname === '/admin/connexion',
        'la session est bien fermée : l’accès est de nouveau refusé'
      );
    } else {
      check(false, 'bouton de déconnexion introuvable');
    }

    /* ── 9. Console ────────────────────────────────────────────── */
    console.log('\n── 9. Console du navigateur ────────────────────────\n');
    check(consoleErrors.length === 0, 'aucune erreur de console', consoleErrors.slice(0, 2).join(' | '));
  } finally {
    await browser.close();
    await supabase.from('contacts').delete().eq('id', probe.id);
    const { count } = await supabase
      .from('contacts')
      .select('id', { count: 'exact', head: true })
      .eq('email', PROBE_EMAIL);
    console.log(`\n  Nettoyage : ${count === 0 ? '✓ ligne de contrôle supprimée' : `✗ ${count} ligne(s) restante(s)`}`);
    if (count !== 0) failures += 1;
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log(failures === 0 ? '  ✓ Administration conforme.' : `  ✗ ${failures} contrôle(s) en échec.`);
  console.log('═══════════════════════════════════════════════════\n');

  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('\n✗ Erreur inattendue :', error.message, '\n');
  process.exit(1);
});
