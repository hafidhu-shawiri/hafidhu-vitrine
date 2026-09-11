/**
 * Tests fonctionnels des interactions.
 *
 * Vérifie au clavier et à la souris les comportements annoncés :
 * menus, accordéons, visionneuse de galerie, formulaires. Ces points
 * étaient les principales faiblesses du prototype de référence.
 *
 *     node scripts/test-interactions.mjs [--url http://localhost:3000]
 */

import { chromium } from 'playwright';

const args = process.argv.slice(2);
const i = args.indexOf('--url');
const BASE = i >= 0 && args[i + 1] ? args[i + 1] : 'http://localhost:3000';

const results = [];
const record = (name, passed, detail = '') => {
  results.push({ name, passed, detail });
  console.log(`  ${passed ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};

async function run(browser) {
  /* ── Menu déroulant « Solutions » (bureau) ─────────────────── */
  console.log('\n── Menu « Solutions » (bureau, 1280px)');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });

    const button = page.getByRole('button', { name: /Solutions/ });
    record('aria-expanded vaut false au repos', (await button.getAttribute('aria-expanded')) === 'false');

    await button.click();
    record('aria-expanded passe à true au clic', (await button.getAttribute('aria-expanded')) === 'true');
    record('les six modules sont listés', (await page.locator('a[href^="/solutions/"]').count()) >= 6);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    record('Échap referme le menu', (await button.getAttribute('aria-expanded')) === 'false');
    record(
      'le focus revient sur le déclencheur',
      await button.evaluate((el) => el === document.activeElement)
    );

    await button.click();
    await page.waitForTimeout(120);
    await page.mouse.click(20, 500);
    await page.waitForTimeout(180);
    record('un clic extérieur referme le menu', (await button.getAttribute('aria-expanded')) === 'false');

    await ctx.close();
  }

  /* ── Menu mobile ───────────────────────────────────────────── */
  console.log('\n── Menu mobile (375px)');
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });

    // Ciblé par nom accessible : le bouton « Solutions » du menu bureau
    // reste dans le DOM à cette largeur, simplement masqué.
    const burger = page.getByRole('button', { name: 'Ouvrir le menu' });
    await burger.click();
    await page.waitForTimeout(200);

    // Le libellé bascule à l'ouverture : on reprend le bouton par sa position.
    const burgerOpen = page.locator('header > div > button').last();
    record('le panneau s’ouvre', (await burgerOpen.getAttribute('aria-expanded')) === 'true');
    record(
      'l’arrière-plan ne défile plus',
      (await page.evaluate(() => document.body.style.overflow)) === 'hidden'
    );
    record('« Galerie » est présent dans le menu mobile', await page.getByRole('link', { name: 'Galerie' }).first().isVisible());

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    record('Échap referme le panneau', (await burgerOpen.getAttribute('aria-expanded')) === 'false');
    record(
      'le défilement est rendu',
      (await page.evaluate(() => document.body.style.overflow)) !== 'hidden'
    );

    await ctx.close();
  }

  /* ── Accordéon FAQ ─────────────────────────────────────────── */
  console.log('\n── Accordéon FAQ');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/faq`, { waitUntil: 'domcontentloaded' });

    // Restreint à <main> : le bouton « Solutions » de l'en-tête porte lui
    // aussi aria-controls, et serait sélectionné en premier.
    const first = page.locator('main button[aria-controls][aria-expanded]').first();
    const controls = await first.getAttribute('aria-controls');
    record('le bouton déclare aria-controls', Boolean(controls));
    record('fermé au chargement', (await first.getAttribute('aria-expanded')) === 'false');

    await first.click();
    await page.waitForTimeout(150);
    record('ouvert au clic', (await first.getAttribute('aria-expanded')) === 'true');
    // Sélecteur d'attribut : les identifiants générés par React peuvent
    // contenir des caractères qu'un sélecteur « # » n'accepte pas.
    record(
      'le panneau ciblé existe et est relié au bouton',
      (await page.locator(`[id="${controls}"]`).count()) > 0
    );

    // Activation au clavier.
    await first.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    record('Entrée referme le panneau', (await first.getAttribute('aria-expanded')) === 'false');

    record(
      'les 15 questions sont présentes',
      (await page.locator('main button[aria-controls]').count()) === 15
    );

    await ctx.close();
  }

  /* ── Galerie ───────────────────────────────────────────────── */
  console.log('\n── Galerie');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/galerie`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(700);

    const tiles = page.locator('main ul li button:has(img)');
    record('les 77 images uniques sont affichées', (await tiles.count()) === 77);

    // Filtre
    const filter = page.getByRole('button', { name: /^Madjilis/ });
    await filter.click();
    await page.waitForTimeout(250);
    record('le filtre « Madjilis » restreint à 5 images', (await tiles.count()) === 5);
    record('le filtre actif est annoncé', (await filter.getAttribute('aria-pressed')) === 'true');

    await page.getByRole('button', { name: /^Toutes/ }).click();
    await page.waitForTimeout(250);

    // Visionneuse
    await tiles.first().click();
    await page.waitForTimeout(350);
    const dialog = page.locator('[role="dialog"]');
    record('la visionneuse s’ouvre', await dialog.isVisible());
    record('elle est déclarée modale', (await dialog.getAttribute('aria-modal')) === 'true');

    const labelBefore = await dialog.getAttribute('aria-label');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    record('la flèche droite avance', (await dialog.getAttribute('aria-label')) !== labelBefore);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    record('Échap ferme la visionneuse', (await page.locator('[role="dialog"]').count()) === 0);

    await ctx.close();
  }

  /* ── Formulaire de contact ─────────────────────────────────── */
  console.log('\n── Formulaire de contact');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/contact`, { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: 'Envoyer' }).click();
    await page.waitForTimeout(350);

    const alerts = page.locator('[role="alert"]');
    record('la soumission vide déclenche des erreurs annoncées', (await alerts.count()) > 0);

    const firstNameInvalid = await page
      .locator('input[name="firstName"]')
      .getAttribute('aria-invalid');
    record('le champ fautif porte aria-invalid', firstNameInvalid === 'true');

    const describedBy = await page
      .locator('input[name="firstName"]')
      .getAttribute('aria-describedby');
    record('le champ est relié à son message d’erreur', Boolean(describedBy));

    const focused = await page.evaluate(() => document.activeElement?.getAttribute('name'));
    record('le focus est placé sur le premier champ fautif', focused === 'firstName', `focus sur « ${focused} »`);

    // Le leurre ne doit pas être atteignable au clavier.
    const hpTabIndex = await page.locator('input[name="website"]').getAttribute('tabindex');
    record('le champ leurre est hors navigation clavier', hpTabIndex === '-1');

    await ctx.close();
  }

  /* ── Protection de l'administration ────────────────────────── */
  console.log('\n── Administration');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const res = await page.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded' });
    record(
      'un visiteur non authentifié est redirigé vers la connexion',
      page.url().includes('/admin/connexion'),
      `statut ${res?.status()}`
    );

    const html = await page.content();
    record(
      'aucune donnée privée n’apparaît sur la page de connexion',
      !/contacts|waitlist|service_role/i.test(html)
    );

    await ctx.close();
  }
}

const browser = await chromium.launch();
try {
  await run(browser);
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.passed);
console.log(`\n${results.length - failed.length}/${results.length} vérifications réussies.`);

if (failed.length > 0) {
  console.error(`\n✗ ${failed.length} échec(s) :`);
  for (const f of failed) console.error(`  - ${f.name}${f.detail ? ` (${f.detail})` : ''}`);
  process.exit(1);
}
console.log('✓ Toutes les interactions se comportent comme prévu.\n');
