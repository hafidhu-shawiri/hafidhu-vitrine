/**
 * Recette des animations et du responsive.
 *
 *     node scripts/test-motion.mjs [--url http://127.0.0.1:3000]
 *
 * Le risque propre à une apparition au défilement est qu'un élément
 * reste invisible : masqué par la feuille de style, jamais révélé. Ce
 * script le cherche activement.
 *
 * Pour chaque route et chaque format :
 *   • défilement complet de la page ;
 *   • recensement des éléments encore opacity: 0 après stabilisation ;
 *   • absence de débordement horizontal ;
 *   • absence d'erreur de console et de requête en échec.
 *
 * Puis, en simulant « prefers-reduced-motion: reduce » : tout le contenu
 * doit être visible SANS avoir défilé, et aucune transition ne doit être
 * active.
 */

import { chromium } from 'playwright';

const args = process.argv.slice(2);
const flag = args.indexOf('--url');
const BASE = flag >= 0 && args[flag + 1] ? args[flag + 1] : 'http://127.0.0.1:3000';

const ROUTES = [
  '/',
  '/solutions',
  '/solutions/mtsango',
  '/solutions/mafunvu',
  '/comment-ca-marche',
  '/pour-qui',
  '/notre-vision',
  '/securite-confidentialite',
  '/faq',
  '/ressources',
  '/galerie',
  '/contact',
  '/rejoindre-la-liste-d-attente',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/conditions-d-utilisation',
];

const VIEWPORTS = [
  { name: 'mobile 375', width: 375, height: 812 },
  { name: 'tablette 768', width: 768, height: 1024 },
  { name: 'bureau 1440', width: 1440, height: 900 },
];

let failures = 0;

function check(ok, label, detail = '') {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

/**
 * Défile jusqu'en bas par paliers, pour déclencher chaque observateur.
 *
 * La passe est répétée tant que la page grandit. Sur la galerie, les
 * images en chargement différé allongent le document PENDANT le
 * défilement : une passe unique s'arrête à une hauteur déjà périmée et
 * laisse des éléments jamais atteints. Ce n'est pas un défaut du site —
 * c'est un défaut de la mesure, et il fausserait le verdict.
 */
async function scrollThrough(page) {
  let previous = 0;

  for (let pass = 0; pass < 6; pass += 1) {
    const height = await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.7);
      for (let y = window.scrollY; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 110));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 320));
      return document.body.scrollHeight;
    });

    if (height === previous) break;
    previous = height;
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(120);
  }

  // Le temps que les transitions (600 ms + décalage max 450 ms) s'achèvent.
  await page.waitForTimeout(1300);
}

/** Éléments porteurs de contenu restés totalement transparents. */
function invisibleContent() {
  const out = [];
  for (const el of document.querySelectorAll('.hfd-reveal, .hfd-enter')) {
    const style = getComputedStyle(el);
    if (parseFloat(style.opacity) >= 0.99) continue;
    const text = (el.textContent ?? '').trim().slice(0, 40);
    out.push(`${el.tagName.toLowerCase()}.${el.className.split(' ')[0]} « ${text} »`);
  }
  return out;
}

async function main() {
  const browser = await chromium.launch();

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  HAFIDHU — Recette des animations et du responsive');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`  Cible : ${BASE}\n`);

  /* ── 1. Parcours complet, trois formats ────────────────────── */
  for (const vp of VIEWPORTS) {
    console.log(`── ${vp.name} (${vp.width} × ${vp.height}) ──────────────────\n`);

    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    const errors = [];
    const badRequests = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('response', (r) => {
      if (r.status() >= 400) badRequests.push(`${r.status()} ${r.url()}`);
    });

    let overflow = [];
    let stuck = [];
    let revealed = 0;

    for (const route of ROUTES) {
      const res = await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
      if (!res || res.status() !== 200) {
        check(false, `${route} — HTTP`, String(res?.status()));
        continue;
      }

      await scrollThrough(page);

      const report = await page.evaluate((fn) => {
        const invisible = new Function(`return (${fn})()`)();
        return {
          invisible,
          revealed: document.querySelectorAll('.hfd-reveal.is-visible').length,
          total: document.querySelectorAll('.hfd-reveal').length,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        };
      }, invisibleContent.toString());

      revealed += report.revealed;
      if (report.invisible.length) stuck.push(`${route} : ${report.invisible.join(', ')}`);
      if (report.scrollWidth > report.clientWidth + 1) {
        overflow.push(`${route} (${report.scrollWidth} > ${report.clientWidth})`);
      }
    }

    check(overflow.length === 0, `aucun débordement horizontal sur ${ROUTES.length} routes`,
      overflow.slice(0, 3).join(' | '));
    check(stuck.length === 0, 'aucun élément resté invisible après défilement',
      stuck.slice(0, 2).join(' | '));
    check(errors.length === 0, 'aucune erreur de console', errors.slice(0, 2).join(' | '));
    check(badRequests.length === 0, 'aucune requête en échec', badRequests.slice(0, 2).join(' | '));
    console.log(`    (${revealed} éléments révélés au total sur ce format)\n`);

    await context.close();
  }

  /* ── 2. Préférence « moins de mouvement » ──────────────────── */
  console.log('── prefers-reduced-motion: reduce ──────────────────\n');
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    const problems = [];

    for (const route of ['/', '/solutions', '/galerie', '/mentions-legales']) {
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
      // Volontairement AUCUN défilement : tout doit être là d'emblée.
      await page.waitForTimeout(400);

      const report = await page.evaluate(() => {
        const hidden = [];
        let animated = 0;
        for (const el of document.querySelectorAll('.hfd-reveal, .hfd-enter')) {
          const s = getComputedStyle(el);
          if (parseFloat(s.opacity) < 0.99) hidden.push(el.tagName.toLowerCase());
          if (s.transitionDuration !== '0s' && s.transitionDuration !== '') animated += 1;
          if (s.transform !== 'none' && s.transform !== 'matrix(1, 0, 0, 1, 0, 0)') animated += 1;
        }
        return { hidden, animated, total: document.querySelectorAll('.hfd-reveal').length };
      });

      if (report.hidden.length) problems.push(`${route} : ${report.hidden.length} masqué(s)`);
      if (report.animated) problems.push(`${route} : ${report.animated} encore animé(s)`);
    }

    check(problems.length === 0,
      'tout le contenu est visible sans défilement et aucune animation n’est active',
      problems.join(' | '));

    await context.close();
  }

  /* ── 3. Ouverture de la FAQ ────────────────────────────────── */
  console.log('\n── Ouverture fluide de la FAQ ──────────────────────\n');
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${BASE}/faq`, { waitUntil: 'domcontentloaded' });

    /* Le bouton « Solutions » de l'en-tête porte lui aussi
       aria-expanded : on cible explicitement l'accordéon, dont chaque
       question est encapsulée dans un <h3>. */
    const button = page.locator('h3 > button[aria-expanded]').first();
    const panelId = await button.getAttribute('aria-controls');
    const panel = page.locator(`[id="${panelId}"]`);

    const closed = await panel.evaluate((el) => ({
      rows: getComputedStyle(el).gridTemplateRows,
      inert: el.hasAttribute('inert'),
      height: el.getBoundingClientRect().height,
    }));
    check(closed.height < 2, 'panneau fermé : hauteur nulle', `${closed.height.toFixed(1)} px`);
    check(closed.inert, 'panneau fermé : retiré du parcours clavier (inert)');

    await button.click();
    await page.waitForTimeout(500);

    const open = await panel.evaluate((el) => ({
      inert: el.hasAttribute('inert'),
      height: el.getBoundingClientRect().height,
    }));
    check(open.height > 20, 'panneau ouvert : le contenu occupe sa hauteur', `${open.height.toFixed(1)} px`);
    check(!open.inert, 'panneau ouvert : de nouveau accessible');

    await context.close();
  }

  await browser.close();

  console.log('\n═══════════════════════════════════════════════════');
  console.log(failures === 0 ? '  ✓ Animations et responsive conformes.' : `  ✗ ${failures} contrôle(s) en échec.`);
  console.log('═══════════════════════════════════════════════════\n');

  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('\n✗ Erreur inattendue :', error.message, '\n');
  process.exit(1);
});
