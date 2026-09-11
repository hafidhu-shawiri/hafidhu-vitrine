/**
 * Accès typé aux images du projet.
 *
 * Le manifeste est produit par « npm run assets » à partir des fichiers
 * de 02_Images HAFIDHU. Aucune image n'est générée, retouchée ni recadrée.
 *
 * Les textes alternatifs sont volontairement DESCRIPTIFS et NEUTRES :
 *   - aucune personne n'est nommée ni identifiée ;
 *   - aucune image n'est présentée comme une photographie
 *     d'utilisateurs réels de HAFIDHU ;
 *   - les trois « images clés » sont des illustrations, et leur
 *     libellé ne laisse pas entendre le contraire.
 */

import manifest from './generated/assets.json';

export type ManagedImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait' | 'square';
  folder: string | null;
  category: string | null;
  blurDataURL: string;
};

const assets = manifest as unknown as {
  logos: Record<string, { width: number; height: number }>;
  counts: { total: number; landscape: number; portrait: number };
  hero: { parures: ManagedImage | null; couple: ManagedImage | null };
  cles: {
    famille: ManagedImage | null;
    diaspora: ManagedImage | null;
    mafunvu: ManagedImage | null;
  };
  themes: Record<string, ManagedImage[]>;
  gallery: ManagedImage[];
};

/** Lève à la compilation si un visuel attendu manque — pas d'échec silencieux. */
function required(image: ManagedImage | null | undefined, label: string): ManagedImage {
  if (!image) {
    throw new Error(
      `Image « ${label} » absente du manifeste. Lancez « npm run assets » ` +
        `après avoir vérifié le dossier 02_Images HAFIDHU.`
    );
  }
  return image;
}

/* ═══════════════════════════════════════════════════════════════════
   IMAGES DE HERO
   Le dossier « Zone Hero » ne contient que deux images, toutes deux
   en portrait. Elles sont donc affectées aux deux pages où elles font
   réellement sens, plutôt que répétées partout.
   ═══════════════════════════════════════════════════════════════════ */

export const heroImages = {
  /** Accueil — image la plus humaine du fonds. */
  couple: {
    ...required(assets.hero.couple, 'Zone Hero / Couple de notable'),
    alt: "Couple en tenue de notable comorienne lors d'une cérémonie de Grand Mariage.",
  },
  /** Anda — les parures d'or sont un élément central du Grand Mariage. */
  parures: {
    ...required(assets.hero.parures, 'Zone Hero / Mtawo wa dhahabu'),
    alt: "Parures d'or comoriennes présentées sur une étoffe rouge lors d'une cérémonie.",
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════
   IMAGES CLÉS
   Illustrations produites pour le projet. Le libellé reste descriptif.
   ═══════════════════════════════════════════════════════════════════ */

export const keyImages = {
  famille: {
    ...required(assets.cles.famille, 'Images clés / Famille comorienne'),
    alt: 'Illustration : trois générations d’une famille comorienne consultent ensemble un téléphone, sur une terrasse donnant sur la mer.',
  },
  diaspora: {
    ...required(assets.cles.diaspora, 'Images clés / Diaspora comorien'),
    alt: 'Illustration : une femme en tenue comorienne participe à un appel vidéo familial depuis un appartement urbain, en fin de journée.',
  },
  mafunvu: {
    ...required(assets.cles.mafunvu, 'Images clés / Mafunvu'),
    alt: 'Illustration : des mains échangent des enveloppes autour d’une table où un carnet est ouvert, lors d’une réunion familiale.',
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════
   ENSEMBLES THÉMATIQUES
   ═══════════════════════════════════════════════════════════════════ */

export const themeImages = {
  ceremonies: (assets.themes.ceremonies ?? []) as ManagedImage[],
  notables: (assets.themes.notables ?? []) as ManagedImage[],
  mari: (assets.themes.mari ?? []) as ManagedImage[],
  mariees: (assets.themes.mariees ?? []) as ManagedImage[],
  accessoires: (assets.themes.accessoires ?? []) as ManagedImage[],
};

/** Libellé neutre pour les images thématiques — jamais de nom de personne. */
export const themeAlt: Record<string, string> = {
  'Céremonies': 'Assemblée réunie lors d’une cérémonie comorienne (madjilis).',
  'Notables Comoriens': 'Portrait d’un notable en tenue de cérémonie comorienne.',
  'Mari Notable': 'Marié en tenue de cérémonie du Grand Mariage comorien.',
  'Mariées Notable': 'Mariée en tenue et parures de cérémonie du Grand Mariage comorien.',
  Accessoires: 'Parures et accessoires de cérémonie comoriens.',
  'Zone Hero': 'Scène de cérémonie comorienne.',
  'Images clés': 'Illustration de la vie familiale comorienne.',
};

export function altFor(image: ManagedImage): string {
  if (image.folder && themeAlt[image.folder]) return themeAlt[image.folder]!;
  return 'Photographie documentant les pratiques et cérémonies comoriennes.';
}

/* ═══════════════════════════════════════════════════════════════════
   GALERIE
   ═══════════════════════════════════════════════════════════════════ */

export const galleryImages: ManagedImage[] = assets.gallery;
export const galleryCounts = assets.counts;
export const logoSizes = assets.logos;
