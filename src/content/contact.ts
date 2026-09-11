/**
 * Coordonnées publiques du projet HAFIDHU.
 *
 * Ces informations sont publiques et fournies par le porteur du projet.
 * Aucune donnée technique privée ne figure ici.
 */

export const contact = {
  email: 'contact@morashawiri.com',
  phone: '+269 430 63 06',
  phoneHref: 'tel:+2694306306',
  whatsapp: 'https://wa.me/2694306306',
  address: {
    line: 'Moroni Oasis, route les puffins',
    city: 'Moroni',
    country: 'Comores',
    countryCode: 'KM',
  },
  website: {
    label: 'www.morashawiri.com',
    href: 'https://www.morashawiri.com',
  },
} as const;

export type SocialLink = {
  label: string;
  href: string;
  /** Identifiant d'icône — voir components/ui/Icon.tsx */
  icon: 'facebook' | 'youtube' | 'whatsapp' | 'linkedin' | 'telegram' | 'instagram' | 'tiktok';
};

export const socials: readonly SocialLink[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/morashawiri', icon: 'facebook' },
  { label: 'YouTube', href: 'https://www.youtube.com/@morashawiri', icon: 'youtube' },
  { label: 'WhatsApp', href: 'https://wa.me/2694306306', icon: 'whatsapp' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/morashawiri', icon: 'linkedin' },
  { label: 'Telegram', href: 'https://t.me/morashawiri', icon: 'telegram' },
  { label: 'Instagram', href: 'https://www.instagram.com/shawiridigital/', icon: 'instagram' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@morashawiri', icon: 'tiktok' },
] as const;
