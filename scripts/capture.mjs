/**
 * Captures de recette.
 *
 * Parcourt les pages aux différentes largeurs demandées et enregistre
 * les captures dans 05_Captures du Site Vitrine.
 *
 * Détecte aussi automatiquement les débordements horizontaux, qui sont
 * la panne responsive la plus fréquente.
 *
 *   node scripts/capture.mjs [--url http://localhost:3000] [--only accueil]
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', '..', '05_Captures du Site Vitrine');

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = getArg('url', 'http://localhost:3000');
const ONLY = getArg('only', null);
const FULL = args.includes('--full');

const PAGES = [
  { name: 'accueil', path: '/' },
  { name: 'solutions', path: '/solutions' },
  { name: 'mtsango', path: '/solutions/mtsango' },
  { name: 'anda', path: '/solutions/anda' },
  { name: 'mafunvu', path: '/solutions/mafunvu' },
  { name: 'diaspora', path: '/solutions/diaspora' },
  { name: 'paiements', path: '/solutions/paiements' },
  { name: 'historique', path: '/solutions/historique-memoire-familiale' },
  { name: 'notre-vision', path: '/notre-vision' },
  { name: 'comment-ca-marche', path: '/comment-ca-marche' },
  { name: 'pour-qui', path: '/pour-qui' },
  { name: 'securite', path: '/securite-confidentialite' },
  { name: 'faq', path: '/faq' },
  { name: 'ressources', path: '/ressources' },
  { name: 'galerie', path: '/galerie' },
  { name: 'contact', path: '/contact' },
  { name: 'liste-attente', path: '/rejoindre-la-liste-d-attente' },
  { name: 'mentions-legales', path: '/mentions-legales' },
  { name: 'confidentialite', path: '/politique-de-confidentialite' },
  { name: 'conditions', path: '/conditions-d-utilisation' },
  { name: 'admin-connexion', path: '/admin' },
];

const VIEWPORTS = [
  { name: '320', width: 320, height: 800 },
  { name: '375', width: 375, height: 812 },
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1440', width: 1440, height: 900 },
];

/** Largeurs retenues pour les captures pleine page (les autres : au-dessus de la ligne de flottaison). */
const FULLPAGE = new Set(['375', '1280']);

async function main() {
  const pages = ONLY ? PAGES.filter((p) => p.name === ONLY) : PAGES;
  if (pages.length === 0) {
    console.error(`Aucune page nommée « ${ONLY} ».`);
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const problems = [];
  let shots = 0;

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      // 1× suffit pour la recette et garde les captures légères.
      deviceScaleFactor: 1,
      locale: 'fr-FR',
      reducedMotion: 'reduce',
    });

    const dir = path.join(OUT, `${vp.name}px`);
    await mkdir(dir, { recursive: true });

    for (const p of pages) {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (m) => {
        if (m.type() === 'error') consoleErrors.push(m.text());
      });

      try {
        // « networkidle » n'aboutit pas de façon fiable ici : on attend
        // le DOM, puis explicitement le décodage des images.
        const res = await page.goto(`${BASE}${p.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 45000,
        });

        const status = res?.status() ?? 0;
        if (status >= 400) {
          problems.push(`[${vp.name}px] ${p.path} → HTTP ${status}`);
        }

        // Le défilement déclenche le chargement différé.
        await page.evaluate(async () => {
          const step = window.innerHeight;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 80));
          }
          window.scrollTo(0, 0);
        });

        // Attente du décodage réel de chaque image visible.
        await page
          .evaluate(async () => {
            const images = Array.from(document.images);
            await Promise.all(
              images.map((img) =>
                img.complete
                  ? Promise.resolve()
                  : new Promise((resolve) => {
                      img.addEventListener('load', resolve, { once: true });
                      img.addEventListener('error', resolve, { once: true });
                    })
              )
            );
            if (document.fonts?.ready) await document.fonts.ready;
          })
          .catch(() => {});

        await page.waitForTimeout(400);

        // Débordement horizontal ?
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const diff = doc.scrollWidth - doc.clientWidth;
          if (diff <= 1) return null;

          const guilty = [];
          for (const el of document.querySelectorAll('*')) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.right > doc.clientWidth + 1) {
              guilty.push(
                `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? `.${el.className.split(' ').slice(0, 3).join('.')}` : ''} (right=${Math.round(r.right)})`
              );
            }
            if (guilty.length >= 4) break;
          }
          return { diff, guilty };
        });

        if (overflow) {
          problems.push(
            `[${vp.name}px] ${p.path} → débordement de ${overflow.diff}px : ${overflow.guilty.join(' | ')}`
          );
        }

        for (const err of consoleErrors) {
          problems.push(`[${vp.name}px] ${p.path} → console : ${err.slice(0, 160)}`);
        }

        const fullPage = FULL || FULLPAGE.has(vp.name);
        await page.screenshot({
          path: path.join(dir, `${p.name}.png`),
          fullPage,
        });
        shots++;
      } catch (err) {
        problems.push(`[${vp.name}px] ${p.path} → ${err.message.split('\n')[0]}`);
      } finally {
        await page.close();
      }
    }

    await context.close();
    console.log(`✓ ${vp.name}px — ${pages.length} page(s)`);
  }

  await browser.close();

  const report = [
    `Captures de recette — ${new Date().toISOString()}`,
    `Base : ${BASE}`,
    `${shots} capture(s) enregistrée(s) dans 05_Captures du Site Vitrine`,
    '',
    problems.length === 0
      ? '✓ Aucun débordement horizontal, aucune erreur console, aucune page en erreur.'
      : `⚠ ${problems.length} problème(s) détecté(s) :\n\n${problems.map((p) => `  - ${p}`).join('\n')}`,
  ].join('\n');

  await writeFile(path.join(OUT, '_rapport-captures.txt'), report, 'utf8');
  console.log(`\n${report}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
