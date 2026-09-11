/**
 * Garde-fou anti-fuite de secrets.
 *
 * Vérifie que :
 *   1. aucun composant client ('use client') n'accède à une variable
 *      d'environnement non préfixée NEXT_PUBLIC_ ;
 *   2. aucun composant client n'importe un module marqué « server-only » ;
 *   3. aucun secret n'est écrit en dur dans les sources ;
 *   4. .env.local n'est pas suivi par Git ;
 *   5. .env.example ne contient que des noms de variables, sans valeur.
 *
 *     node scripts/check-client-secrets.mjs
 */

import { execSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const SERVER_ONLY_MODULES = [
  '@/lib/supabase/server',
  '@/lib/email',
  '@/lib/rate-limit',
  '@/lib/admin/data',
  '@/lib/admin/auth',
];

/** Motifs de secrets réellement écrits en dur. */
const HARDCODED = [
  { re: /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\./, label: 'jeton JWT en dur' },
  { re: /sb_secret_[A-Za-z0-9_-]{10,}/, label: 'clé secrète Supabase en dur' },
  { re: /service_role[^\n]{0,40}=\s*['"][^'"\s]{20,}['"]/i, label: 'clé service_role en dur' },
  { re: /gh[pousr]_[A-Za-z0-9]{30,}/, label: 'jeton GitHub en dur' },
  {
    re: /(password|passwd|mot_de_passe)\s*[:=]\s*['"][^'"\s]{6,}['"]/i,
    label: 'mot de passe en dur',
  },
];

const problems = [];

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      yield full;
    }
  }
}

async function checkSources() {
  let clientFiles = 0;

  for await (const file of walk(SRC)) {
    const content = await readFile(file, 'utf8');
    const rel = path.relative(ROOT, file);
    const isClient = /^\s*['"]use client['"]/m.test(content);

    if (isClient) {
      clientFiles++;

      // 1. Variables d'environnement privées dans un composant client.
      for (const match of content.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
        const name = match[1];
        if (!name.startsWith('NEXT_PUBLIC_')) {
          problems.push(
            `${rel} — composant client : accès à « ${name} », variable non publique. ` +
              `Seules les variables NEXT_PUBLIC_ peuvent être lues côté navigateur.`
          );
        }
      }

      // 2. Import d'un module serveur depuis un composant client.
      for (const mod of SERVER_ONLY_MODULES) {
        if (content.includes(`from '${mod}'`) || content.includes(`from "${mod}"`)) {
          problems.push(
            `${rel} — composant client : import de « ${mod} », réservé au serveur.`
          );
        }
      }
    }

    // 3. Secrets écrits en dur, côté client comme côté serveur.
    const lines = content.split(/\r?\n/);
    lines.forEach((line, i) => {
      // Les lignes de commentaire décrivant les règles sont ignorées.
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
      for (const { re, label } of HARDCODED) {
        if (re.test(line)) {
          problems.push(`${rel}:${i + 1} — ${label}.`);
        }
      }
    });
  }

  console.log(`Composants client analysés : ${clientFiles}`);
}

async function checkEnvFiles() {
  // 4. .env.local ne doit pas être suivi par Git.
  try {
    const tracked = execSync('git ls-files .env.local .env .env.production', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    if (tracked) {
      problems.push(
        `Fichier(s) d'environnement suivi(s) par Git : ${tracked.split('\n').join(', ')}. ` +
          `À retirer immédiatement de l'index.`
      );
    }
  } catch {
    // Pas encore de dépôt Git : rien à vérifier.
  }

  // 5. .env.example ne doit contenir aucune valeur.
  const example = await readFile(path.join(ROOT, '.env.example'), 'utf8').catch(() => null);
  if (example) {
    example.split(/\r?\n/).forEach((line, i) => {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)$/);
      if (match && match[2].trim() !== '') {
        problems.push(
          `.env.example:${i + 1} — la variable « ${match[1]} » porte une valeur. ` +
            `Ce fichier ne doit contenir que des noms.`
        );
      }
    });
  } else {
    problems.push('.env.example est introuvable.');
  }
}

async function main() {
  await checkSources();
  await checkEnvFiles();

  if (problems.length === 0) {
    console.log('✓ Aucun secret exposé, aucun import serveur côté client.');
    return;
  }

  console.error(`\n✗ ${problems.length} problème(s) de sécurité :\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('');
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
