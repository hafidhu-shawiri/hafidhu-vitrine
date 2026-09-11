/**
 * Vérifie qu'aucun terme interdit ne figure dans le site.
 *
 * Le terme officiel est MAFUNVU. « Mukaranga » ne doit apparaître nulle
 * part : ni contenu, ni code, ni commentaire, ni URL, ni métadonnée,
 * ni fichier généré.
 *
 *     node scripts/check-forbidden-terms.mjs
 *
 * Sort en code 1 si une occurrence est trouvée : le contrôle peut donc
 * servir de garde-fou avant publication.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const FORBIDDEN = [{ term: 'mukaranga', label: 'Mukaranga (terme interdit — utiliser MAFUNVU)' }];

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'out', 'dist', '.vercel', 'tmp']);
const EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.json', '.md', '.css', '.html', '.sql', '.txt', '.webmanifest',
]);

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      yield full;
    }
  }
}

async function main() {
  const findings = [];
  let scanned = 0;

  for await (const file of walk(ROOT)) {
    // Le script de contrôle contient les termes par nature.
    if (file === fileURLToPath(import.meta.url)) continue;

    const content = await readFile(file, 'utf8').catch(() => null);
    if (content === null) continue;
    scanned++;

    const lines = content.split(/\r?\n/);
    for (const { term, label } of FORBIDDEN) {
      lines.forEach((line, i) => {
        if (line.toLowerCase().includes(term)) {
          findings.push({
            file: path.relative(ROOT, file),
            line: i + 1,
            label,
            excerpt: line.trim().slice(0, 120),
          });
        }
      });
    }
  }

  console.log(`Fichiers analysés : ${scanned}`);

  if (findings.length === 0) {
    console.log('✓ Aucun terme interdit trouvé.');

    // Contrôle positif : le terme officiel doit bien être présent.
    const modules = await readFile(path.join(ROOT, 'src/content/modules.ts'), 'utf8').catch(
      () => ''
    );
    if (!modules.includes('Mafunvu')) {
      console.error('✗ Le terme officiel « Mafunvu » est introuvable dans le contenu des modules.');
      process.exit(1);
    }
    console.log('✓ Le terme officiel « Mafunvu » est bien présent.');
    return;
  }

  console.error(`\n✗ ${findings.length} occurrence(s) interdite(s) :\n`);
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line} — ${f.label}`);
    console.error(`     ${f.excerpt}`);
  }
  console.error('');
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
