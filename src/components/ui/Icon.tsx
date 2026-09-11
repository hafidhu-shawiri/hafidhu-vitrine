/**
 * Jeu d'icônes HAFIDHU.
 *
 * Tracés linéaires, épaisseur constante, faible niveau de détail —
 * conformément au design system. Aucune bibliothèque externe : les
 * icônes sont inlinées, donc sans requête réseau ni poids superflu.
 *
 * Le prototype de référence utilisait des glyphes Unicode (◎ ◈ ◇ ◐ ◍ ◔)
 * dont le rendu varie fortement selon les systèmes. Ils sont remplacés ici.
 */

import type { SVGProps } from 'react';

export type IconName =
  // Modules
  | 'coins'
  | 'event'
  | 'hands'
  | 'globe'
  | 'link'
  | 'archive'
  // Interface
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-right'
  | 'menu'
  | 'close'
  | 'check'
  | 'alert'
  | 'clock'
  | 'search'
  | 'mail'
  | 'phone'
  | 'map-pin'
  | 'shield'
  | 'external'
  | 'expand'
  // Réseaux sociaux
  | 'facebook'
  | 'youtube'
  | 'whatsapp'
  | 'linkedin'
  | 'telegram'
  | 'instagram'
  | 'tiktok';

const paths: Record<IconName, React.ReactNode> = {
  /* ── Modules ──────────────────────────────────────────────────── */

  // Mtsango — cotisations : pièces empilées (accumulation régulière)
  coins: (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="3" />
      <path d="M5 6.5v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" />
      <path d="M5 11.5v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" />
    </>
  ),

  // Anda — événement : calendrier avec un jour marqué
  event: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <circle cx="12" cy="15.5" r="1.75" fill="currentColor" stroke="none" />
    </>
  ),

  // Mafunvu — contribution : une main qui reçoit, un dépôt qui descend
  hands: (
    <>
      <path d="M4 14.5c0-1 .8-1.8 1.8-1.8h1.4l2.3 2.3h3.2a1.6 1.6 0 0 1 0 3.2h-2.4" />
      <path d="M9.3 18.2 6.6 21 3 17.4" />
      <path d="M20 13.5c0-1-.8-1.8-1.8-1.8" />
      <path d="M12 3v6m0 0 2.3-2.3M12 9 9.7 6.7" />
    </>
  ),

  // Diaspora — globe avec méridiens
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.6 3.7 5.7 3.7 9s-1.3 6.4-3.7 9c-2.4-2.6-3.7-5.7-3.7-9S9.6 5.6 12 3Z" />
    </>
  ),

  // Paiements — rapprochement : deux maillons reliés
  link: (
    <>
      <path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7L11.7 6.6" />
      <path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 1 0 5.7 5.7l1.4-1.4" />
    </>
  ),

  // Historique — archive : couches successives
  archive: (
    <>
      <rect x="3" y="4" width="18" height="4.5" rx="1.5" />
      <path d="M5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5" />
      <path d="M10 12.5h4" />
    </>
  ),

  /* ── Interface ────────────────────────────────────────────────── */

  'chevron-down': <path d="m6 9.5 6 6 6-6" />,
  'chevron-left': <path d="m14.5 6-6 6 6 6" />,
  'chevron-right': <path d="m9.5 6 6 6-6 6" />,
  'arrow-right': <path d="M4 12h15m0 0-6-6m6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,

  alert: (
    <>
      <path d="M12 3.5 21 19.5H3L12 3.5Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.75" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),

  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.2 2" />
    </>
  ),

  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),

  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.8 7 7.2 5.4a1.7 1.7 0 0 0 2 0L20.2 7" />
    </>
  ),

  phone: (
    <path d="M6.3 3.5h3l1.5 3.8-2 1.4a11.5 11.5 0 0 0 5.5 5.5l1.4-2 3.8 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.3 5.7a2 2 0 0 1 2-2.2Z" />
  ),

  'map-pin': (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),

  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.3 2.9 7.8 7 9.5 4.1-1.7 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),

  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </>
  ),

  expand: <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />,

  /* ── Réseaux sociaux ──────────────────────────────────────────────
     Glyphes pleins : c'est la convention pour les marques. */

  facebook: (
    <path
      fill="currentColor"
      stroke="none"
      d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"
    />
  ),

  youtube: (
    <path
      fill="currentColor"
      stroke="none"
      d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.51 2.51 0 0 0-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z"
    />
  ),

  whatsapp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.33 4.94L2 22l5.35-1.4a9.8 9.8 0 0 0 4.69 1.2h.01c5.43 0 9.85-4.42 9.85-9.86 0-2.63-1.02-5.1-2.88-6.96A9.78 9.78 0 0 0 12.04 2Zm0 18.05c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.16 8.16 0 0 1-1.25-4.32c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.86 5.8 2.41a8.14 8.14 0 0 1 2.4 5.8c0 4.52-3.68 8.18-8.16 8.18Zm4.5-6.13c-.25-.13-1.46-.72-1.68-.8-.23-.09-.39-.13-.55.12s-.64.8-.78.97c-.15.16-.29.18-.53.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.04s.87 2.37 1 2.53c.12.17 1.72 2.62 4.16 3.68.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.18.21-.57.21-1.07.15-1.17-.06-.11-.22-.17-.47-.29Z"
    />
  ),

  linkedin: (
    <path
      fill="currentColor"
      stroke="none"
      d="M20.45 2H3.55C2.7 2 2 2.69 2 3.53v16.94c0 .84.7 1.53 1.55 1.53h16.9c.85 0 1.55-.69 1.55-1.53V3.53C22 2.69 21.3 2 20.45 2ZM8.04 18.75h-2.9V9.4h2.9v9.35ZM6.59 8.12a1.68 1.68 0 1 1 0-3.36 1.68 1.68 0 0 1 0 3.36Zm12.17 10.63h-2.9v-4.55c0-1.08-.02-2.48-1.51-2.48-1.52 0-1.75 1.18-1.75 2.4v4.63h-2.9V9.4h2.78v1.28h.04c.39-.73 1.33-1.51 2.74-1.51 2.93 0 3.47 1.93 3.47 4.44v5.14Z"
    />
  ),

  telegram: (
    <path
      fill="currentColor"
      stroke="none"
      d="M21.94 4.6 18.9 19.1c-.23 1.02-.84 1.27-1.7.79l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.95.46l.34-4.8 8.73-7.89c.38-.34-.08-.53-.59-.19L6.98 13.01l-4.64-1.45c-1.01-.32-1.03-1.01.21-1.5l18.14-6.99c.84-.31 1.58.19 1.25 1.53Z"
    />
  ),

  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),

  tiktok: (
    <path
      fill="currentColor"
      stroke="none"
      d="M16.6 2h-3.1v13.3a2.4 2.4 0 1 1-2.4-2.4c.23 0 .45.03.66.1v-3.2a5.7 5.7 0 0 0-.66-.04 5.6 5.6 0 1 0 5.6 5.6V8.9a6.9 6.9 0 0 0 4 1.28V7.05a3.9 3.9 0 0 1-2.9-1.35A3.9 3.9 0 0 1 16.6 2Z"
    />
  ),
};

export type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  /**
   * Texte alternatif. Sans titre, l'icône est masquée aux technologies
   * d'assistance — ce qui est le bon comportement pour un décor.
   */
  title?: string;
};

export function Icon({ name, size = 20, title, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
