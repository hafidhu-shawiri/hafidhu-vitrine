/**
 * HAFIDHU — Préparation des assets
 *
 * Ce script ne CRÉE aucune image et ne MODIFIE aucun contenu visuel.
 * Il se limite à des opérations techniques non destructives :
 *   - extraction du PNG embarqué dans les logos « SVG »
 *     (les fichiers .svg fournis encapsulent un bitmap en base64) ;
 *   - conversion en WebP et redimensionnement pour le web ;
 *   - génération d'un manifeste avec dimensions réelles.
 *
 * Aucune personne, aucun visage, aucun vêtement, aucun élément culturel
 * n'est retouché. Les fichiers sources restent intacts.
 *
 *   node scripts/prepare-assets.mjs
 */

import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.resolve(ROOT, '..', '02_Images HAFIDHU');

const OUT_BRAND = path.join(ROOT, 'public', 'brand');
const OUT_IMG = path.join(ROOT, 'public', 'images');
const OUT_MANIFEST = path.join(ROOT, 'src', 'content', 'generated');

/** Dossiers thématiques servant de source de catégories. */
const THEME_FOLDERS = [
  'Zone Hero',
  'Images clés',
  'Accessoires',
  'Céremonies',
  'Mari Notable',
  'Mariées Notable',
  'Notables Comoriens',
];

const GALLERY_FOLDER = 'Page Galerie';
const LOGO_FOLDER = 'Logos & Favicon';

/**
 * Catégories publiques, dérivées des noms de dossiers réels.
 *
 * « Madjilis » reprend le terme figurant dans les noms de fichiers
 * d'origine (« Céremonie 01_Madjilis.jpg »). Il est préféré à
 * « Cérémonies », trop proche de la catégorie générale et source de
 * confusion dans les filtres.
 */
const CATEGORY_LABELS = {
  'Zone Hero': 'Parures & patrimoine',
  'Images clés': 'Vie familiale',
  Accessoires: 'Parures & patrimoine',
  'Céremonies': 'Madjilis',
  'Mari Notable': 'Grand Mariage',
  'Mariées Notable': 'Grand Mariage',
  'Notables Comoriens': 'Notables',
};

const log = (...a) => console.log(...a);

function slugify(input) {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function md5(file) {
  return createHash('md5').update(await readFile(file)).digest('hex');
}

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((e) => e.isFile() && /\.(jpe?g|png)$/i.test(e.name))
    .map((e) => path.join(dir, e.name));
}

/* ═══════════════════════════════════════════════════════════════════
   1. LOGOS
   Les .svg fournis contiennent un PNG en base64. On l'extrait tel quel
   pour éviter ~33 % de surpoids d'encodage et permettre à Next.js
   d'optimiser. Les pixels sont strictement identiques.
   ═══════════════════════════════════════════════════════════════════ */
async function prepareLogos() {
  log('\n── Logos ─────────────────────────────────────────');
  await mkdir(OUT_BRAND, { recursive: true });

  const map = {
    'Logo HAFIDHU Horizontal  Transparent.svg': 'logo-horizontal',
    'Logo HAFIDHU Carré Transparent.svg': 'logo-square',
    'Favicon Transparent.svg': 'favicon-source',
  };

  const result = {};

  for (const [file, name] of Object.entries(map)) {
    const src = path.join(ASSETS, LOGO_FOLDER, file);
    const svg = await readFile(src, 'utf8').catch(() => null);
    if (!svg) {
      log(`  ⚠ introuvable : ${file}`);
      continue;
    }

    const m = svg.match(/href="data:image\/png;base64,([A-Za-z0-9+/=]+)"/);
    if (!m) {
      log(`  ⚠ aucun PNG embarqué : ${file}`);
      continue;
    }

    const buf = Buffer.from(m[1], 'base64');
    const meta = await sharp(buf).metadata();

    // PNG ré-encodé sans perte : mêmes pixels, meilleure compression.
    const png = await sharp(buf).png({ compressionLevel: 9, effort: 10 }).toBuffer();
    await writeFile(path.join(OUT_BRAND, `${name}.png`), png);

    result[name] = { width: meta.width, height: meta.height };
    log(
      `  ✓ ${name}.png  ${meta.width}×${meta.height}  ` +
        `${Math.round(svg.length / 1024)} Ko → ${Math.round(png.length / 1024)} Ko`
    );
  }

  // Icônes dérivées du favicon officiel — simple redimensionnement.
  const favSrc = path.join(OUT_BRAND, 'favicon-source.png');
  const fav = await readFile(favSrc).catch(() => null);
  if (fav) {
    for (const size of [32, 180, 192, 512]) {
      const name = size === 180 ? 'apple-touch-icon' : `icon-${size}`;
      await sharp(fav)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9 })
        .toFile(path.join(OUT_BRAND, `${name}.png`));
      log(`  ✓ ${name}.png  ${size}×${size}`);
    }
  }

  return result;
}

/* ═══════════════════════════════════════════════════════════════════
   2. CATÉGORIES PAR EMPREINTE
   Les 8 dossiers thématiques sont des sous-ensembles de « Page Galerie ».
   On associe donc chaque image de la galerie à sa catégorie via son MD5 —
   aucune correspondance n'est codée en dur.
   ═══════════════════════════════════════════════════════════════════ */
async function buildHashIndex() {
  log('\n── Indexation par empreinte ──────────────────────');
  const index = new Map();

  for (const folder of THEME_FOLDERS) {
    const files = await listImages(path.join(ASSETS, folder));
    for (const f of files) {
      index.set(await md5(f), { folder, original: path.basename(f) });
    }
    log(`  ${folder.padEnd(22)} ${files.length} image(s)`);
  }

  return index;
}

/* ═══════════════════════════════════════════════════════════════════
   3. IMAGES
   ═══════════════════════════════════════════════════════════════════ */
async function prepareImages(hashIndex) {
  log('\n── Conversion des images ─────────────────────────');
  const outGallery = path.join(OUT_IMG, 'galerie');
  await rm(outGallery, { recursive: true, force: true });
  await mkdir(outGallery, { recursive: true });

  const files = (await listImages(path.join(ASSETS, GALLERY_FOLDER))).sort((a, b) => {
    const n = (s) => Number(s.match(/\((\d+)\)/)?.[1] ?? 0);
    return n(a) - n(b);
  });

  const seen = new Set();
  const items = [];
  let skipped = 0;

  for (const file of files) {
    const hash = await md5(file);
    if (seen.has(hash)) {
      skipped++;
      continue;
    }
    seen.add(hash);

    const theme = hashIndex.get(hash);
    const base = theme ? slugify(theme.original) : slugify(path.basename(file));

    const image = sharp(file, { failOn: 'none' }).rotate(); // respecte l'orientation EXIF
    const meta = await image.metadata();

    // Long bord plafonné à 1800 px : largement suffisant pour le web,
    // Next.js génère ensuite les tailles responsives.
    const MAX = 1800;
    const scale = Math.min(1, MAX / Math.max(meta.width, meta.height));
    const width = Math.round(meta.width * scale);
    const height = Math.round(meta.height * scale);

    const out = path.join(outGallery, `${base}.webp`);
    await image
      .resize(width, height, { withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(out);

    // Micro-vignette encodée en base64 pour le flou de transition :
    // évite tout décalage de mise en page au chargement.
    const blurBuf = await sharp(file, { failOn: 'none' })
      .rotate()
      .resize(12, null, { fit: 'inside' })
      .webp({ quality: 35 })
      .toBuffer();

    items.push({
      id: base,
      src: `/images/galerie/${base}.webp`,
      width,
      height,
      orientation: width > height ? 'landscape' : width < height ? 'portrait' : 'square',
      folder: theme?.folder ?? null,
      category: theme ? CATEGORY_LABELS[theme.folder] : null,
      blurDataURL: `data:image/webp;base64,${blurBuf.toString('base64')}`,
    });
  }

  log(`  ✓ ${items.length} images uniques converties`);
  log(`  ✓ ${skipped} doublon(s) écarté(s)`);

  const byCat = items.reduce((acc, i) => {
    const k = i.category ?? '(non catégorisée)';
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
  for (const [k, v] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
    log(`     ${String(v).padStart(3)}  ${k}`);
  }

  return items;
}

/* ═══════════════════════════════════════════════════════════════════
   4. MANIFESTE
   ═══════════════════════════════════════════════════════════════════ */
async function writeManifest(images, logos) {
  await mkdir(OUT_MANIFEST, { recursive: true });

  const byFolder = (folder) => images.filter((i) => i.folder === folder);
  const pick = (folder, originalName) =>
    images.find((i) => i.folder === folder && i.id === slugify(originalName)) ?? null;

  const manifest = {
    generatedBy: 'scripts/prepare-assets.mjs',
    note:
      'Fichier généré. Ne pas éditer à la main — relancer « npm run assets ». ' +
      'Aucune image n’a été créée, retouchée ni recadrée : conversion et ' +
      'redimensionnement uniquement.',
    logos,
    counts: {
      total: images.length,
      landscape: images.filter((i) => i.orientation === 'landscape').length,
      portrait: images.filter((i) => i.orientation === 'portrait').length,
    },
    hero: {
      parures: pick('Zone Hero', 'Image Hero 01_Mtawo wa dhahabu_Or.png'),
      couple: pick('Zone Hero', 'Image Hero 02_Couple de notable.jpg'),
    },
    cles: {
      famille: pick('Images clés', 'Famille comorienne.png'),
      diaspora: pick('Images clés', 'Diaspora comorien.png'),
      mafunvu: pick('Images clés', 'Mafunvu.png'),
    },
    themes: {
      ceremonies: byFolder('Céremonies'),
      notables: byFolder('Notables Comoriens'),
      mari: byFolder('Mari Notable'),
      mariees: byFolder('Mariées Notable'),
      accessoires: byFolder('Accessoires'),
    },
    gallery: images,
  };

  await writeFile(
    path.join(OUT_MANIFEST, 'assets.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  log(`\n  ✓ Manifeste écrit : src/content/generated/assets.json`);
}

/* ═══════════════════════════════════════════════════════════════════ */
async function main() {
  log('═══════════════════════════════════════════════════');
  log('  HAFIDHU — Préparation des assets');
  log('═══════════════════════════════════════════════════');

  const logos = await prepareLogos();
  const hashIndex = await buildHashIndex();
  const images = await prepareImages(hashIndex);
  await writeManifest(images, logos);

  log('\n✓ Terminé.\n');
}

main().catch((err) => {
  console.error('\n✗ Échec de la préparation des assets :', err);
  process.exit(1);
});
