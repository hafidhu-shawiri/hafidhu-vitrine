/**
 * Contrôle des liens internes.
 *
 *     node scripts/check-links.mjs
 *
 * Compare l'ensemble des destinations internes du site à l'arborescence
 * réelle de « src/app ». Un lien qui ne correspond ni à une page, ni à une
 * redirection déclarée dans next.config.ts est signalé.
 *
 * Trois sources sont examinées, car le site n'écrit presque jamais ses
 * URL en clair :
 *   1. les constantes de « content/navigation.ts » (routes nommées) ;
 *   2. les slugs de « content/modules.ts », qui alimentent /solutions/… ;
 *   3. les href littéraux restants, écrits directement dans le JSX.
 *
 * Ce contrôle existe parce qu'un lien mort ne casse pas la compilation :
 * il ne se voit qu'en production, sur une page 404.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP = path.join(ROOT, 'src', 'app');

const isGroup = (name) => name.startsWith('(') && name.endsWith(')');
const isDynamic = (name) => name.startsWith('[');

async function collectRoutes(dir = APP, prefix = '') {
  const routes = new Set();

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      if (/^(page|route)\.(t|j)sx?$/.test(entry.name)) routes.add(prefix || '/');
      continue;
    }
    const next = isGroup(entry.name) ? prefix : `${prefix}/${entry.name}`;
    for (const r of await collectRoutes(path.join(dir, entry.name), next)) routes.add(r);
  }

  return routes;
}

async function collectSources(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await collectSources(full)));
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

async function collectRedirects() {
  const raw = await readFile(path.join(ROOT, 'next.config.ts'), 'utf8');
  return new Set([...raw.matchAll(/source:\s*'([^']+)'/g)].map((m) => m[1]));
}

/** Les routes nommées, lues textuellement : pas de dépendance à un transpileur. */
async function namedRoutes() {
  const raw = await readFile(path.join(ROOT, 'src', 'content', 'navigation.ts'), 'utf8');
  const block = raw.match(/export const routes = \{([\s\S]*?)\} as const;/);
  if (!block) throw new Error('Bloc « routes » introuvable dans navigation.ts');

  const out = new Map();
  for (const m of block[1].matchAll(/(\w+):\s*'([^']+)'/g)) out.set(m[1], m[2]);
  return out;
}

async function moduleSlugs() {
  const raw = await readFile(path.join(ROOT, 'src', 'content', 'modules.ts'), 'utf8');
  return [...raw.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
}

function resolves(link, routes) {
  const parts = link.split('/').filter(Boolean);
  for (const route of routes) {
    const segs = route.split('/').filter(Boolean);
    if (segs.length !== parts.length) continue;
    if (segs.every((s, i) => isDynamic(s) || s === parts[i])) return true;
  }
  return false;
}

async function main() {
  const routes = await collectRoutes();
  const redirects = await collectRedirects();
  const named = await namedRoutes();
  const slugs = await moduleSlugs();
  const files = await collectSources(path.join(ROOT, 'src'));

  /** destination -> origines */
  const targets = new Map();
  const add = (link, origin) => {
    const clean = link.split('#')[0].split('?')[0].replace(/(.)\/$/, '$1');
    if (!targets.has(clean)) targets.set(clean, new Set());
    targets.get(clean).add(origin);
  };

  for (const [key, value] of named) add(value, `navigation.ts → routes.${key}`);
  for (const slug of slugs) add(`${named.get('solutions')}/${slug}`, `modules.ts → ${slug}`);

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    for (const m of raw.matchAll(/href=(?:"|\{')(\/[^"'\s{}]*)(?:"|'\})/g)) add(m[1], rel);
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  HAFIDHU — Contrôle des liens internes');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`  Pages réelles          : ${routes.size}`);
  console.log(`  Redirections déclarées : ${redirects.size}`);
  console.log(`  Destinations internes  : ${targets.size}\n`);

  const broken = [];
  for (const [link, origins] of [...targets].sort()) {
    const ok =
      routes.has(link) || redirects.has(link) || resolves(link, routes) || link.startsWith('/api/');
    console.log(`  ${ok ? '✓' : '✗'} ${link}`);
    if (!ok) broken.push([link, origins]);
  }

  if (broken.length === 0) {
    console.log('\n  ✓ Toutes les destinations internes existent.\n');
    return;
  }

  console.log(`\n  ✗ ${broken.length} destination(s) sans page ni redirection :\n`);
  for (const [link, origins] of broken) {
    console.log(`      ${link}`);
    for (const o of origins) console.log(`          ← ${o}`);
  }
  console.log();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error('\n✗ Erreur inattendue :', error.message, '\n');
  process.exit(1);
});
