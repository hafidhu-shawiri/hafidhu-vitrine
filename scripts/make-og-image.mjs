/**
 * Genere l'image de partage social (Open Graph / Twitter) en 1200x630.
 *
 * La source est un portrait 1271x1800 : un recadrage automatique couperait
 * les visages. La zone est donc extraite explicitement autour du couple,
 * puis surmontee d'un bandeau ivoire portant le logo officiel — le logo
 * HAFIDHU etant sombre, un bandeau clair garantit son contraste.
 *
 * Sources : uniquement des assets HAFIDHU deja fournis.
 */
import sharp from 'sharp';
import path from 'node:path';
import { stat } from 'node:fs/promises';

const root = process.cwd();
const fond = path.join(root, 'public/images/galerie/image-hero-02-couple-de-notable.webp');
const logo = path.join(root, 'public/brand/logo-horizontal.png');
const sortie = path.join(root, 'public/brand/og-image.jpg');

const W = 1200;
const H = 630;
const BANDEAU = 140;
const PHOTO_H = H - BANDEAU; // 490

const IVOIRE = { r: 248, g: 247, b: 242 }; // #F8F7F2 — fond de la charte

// ── Extraction centree sur les visages ───────────────────────────────
// Le couple occupe les lignes ~254 a ~636 de la source. On cadre autour.
const SRC_TOP = 185;
const SRC_H = 519;

const photo = await sharp(fond)
  .extract({ left: 0, top: SRC_TOP, width: 1271, height: SRC_H })
  .resize(W, PHOTO_H, { fit: 'cover' })
  .toBuffer();

// ── Filet or : accent de la charte, jamais dominant ──────────────────
const filet = Buffer.from(
  `<svg width="${W}" height="4" xmlns="http://www.w3.org/2000/svg">
     <rect width="${W}" height="4" fill="#D4A72C"/>
   </svg>`
);

// ── Logo officiel, dimensionne pour le bandeau ───────────────────────
const logoBuf = await sharp(logo).resize({ height: 58 }).toBuffer();
const logoMeta = await sharp(logoBuf).metadata();

// ── Signature, dans le bleu nuit de la charte ────────────────────────
const signature = Buffer.from(
  `<svg width="620" height="30" xmlns="http://www.w3.org/2000/svg">
     <text x="0" y="21"
           font-family="Segoe UI, Helvetica, Arial, sans-serif"
           font-size="19" fill="#62727F">Le Gardien des traces qui comptent.</text>
   </svg>`
);

// ── Assemblage ───────────────────────────────────────────────────────
await sharp({ create: { width: W, height: H, channels: 3, background: IVOIRE } })
  .composite([
    { input: photo, top: 0, left: 0 },
    { input: filet, top: PHOTO_H, left: 0 },
    { input: logoBuf, top: PHOTO_H + Math.round((BANDEAU - logoMeta.height) / 2), left: 64 },
    { input: signature, top: PHOTO_H + Math.round(BANDEAU / 2) - 15, left: 64 + logoMeta.width + 40 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(sortie);

const meta = await sharp(sortie).metadata();
const { size } = await stat(sortie);

console.log('Image de partage generee :');
console.log(`  fichier    : public/brand/og-image.jpg`);
console.log(`  dimensions : ${meta.width}x${meta.height}`);
console.log(`  poids      : ${Math.round(size / 1024)} Ko`);
