/**
 * Schémas de validation.
 *
 * Les mêmes schémas servent côté client (retour immédiat) et côté serveur
 * (seule validation qui fasse autorité). Le frontend n'est jamais
 * considéré comme fiable : toute soumission est revalidée à l'arrivée.
 *
 * Les messages d'erreur suivent la règle du design system :
 * dire ce qui s'est passé, pourquoi, et quoi faire ensuite.
 */

import { z } from 'zod';

const REQUIRED = 'Ce champ est nécessaire pour traiter votre demande. Merci de le renseigner.';

const name = z
  .string()
  .trim()
  .min(1, REQUIRED)
  .max(80, 'Ce nom dépasse 80 caractères. Merci de le raccourcir.');

const email = z
  .string()
  .trim()
  .min(1, REQUIRED)
  .max(180, 'Cette adresse est trop longue.')
  .regex(
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    'Cette adresse semble incomplète. Vérifiez le format : nom@domaine.com.'
  );

const optionalPhone = z
  .string()
  .trim()
  .max(40, 'Ce numéro est trop long.')
  .optional()
  .or(z.literal(''));

export const CONTACT_SUBJECTS = [
  'Question générale',
  'Participer à la validation du produit',
  'Partenariat',
  'Presse',
  'Autre',
] as const;

export const WAITLIST_PROFILES = [
  'Famille',
  'Organisateur',
  "Membre d'une communauté",
  'Diaspora',
  'Autre',
] as const;

/** Valeurs autorisées en base — voir supabase/migrations. */
export const CONTACT_SOURCES = [
  'Contact',
  "Liste d'attente",
  'Validation produit',
  'Partenariat',
] as const;

export const CONTACT_STATUSES = [
  'Nouveau',
  'À traiter',
  'En cours',
  'Répondu',
  'Archivé',
] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

/**
 * Champ leurre. Un robot remplit tous les champs qu'il trouve ;
 * un visiteur ne le voit jamais.
 *
 * Le schéma l'accepte volontairement rempli : le rejet est traité APRÈS
 * validation, par un succès silencieux côté route. Le refuser ici
 * renverrait une erreur de validation — ce qui apprendrait au robot que
 * le champ est piégé, et risquerait d'afficher un message technique.
 */
const honeypot = z.string().max(200).optional().or(z.literal(''));

export const contactSchema = z.object({
  firstName: name,
  lastName: name,
  email,
  phone: optionalPhone,
  subject: z.enum(CONTACT_SUBJECTS, {
    message: 'Merci de choisir un sujet dans la liste.',
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Merci de détailler un peu votre demande (au moins 10 caractères).')
    .max(5000, 'Ce message dépasse 5 000 caractères. Merci de le raccourcir.'),
  website: honeypot,
});

export const waitlistSchema = z.object({
  firstName: name,
  lastName: name,
  email,
  country: z
    .string()
    .trim()
    .min(1, REQUIRED)
    .max(80, 'Ce nom de pays est trop long.'),
  profile: z.enum(WAITLIST_PROFILES, {
    message: 'Merci de choisir un profil dans la liste.',
  }),
  featureInterest: z
    .string()
    .trim()
    .max(2000, 'Cette réponse dépasse 2 000 caractères. Merci de la raccourcir.')
    .optional()
    .or(z.literal('')),
  website: honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;

/** Convertit une erreur Zod en dictionnaire champ → message. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Neutralise les caractères qui pourraient être interprétés par un
 * tableur lors d'un export CSV (injection de formule).
 */
export function sanitizeForStorage(value: string): string {
  const trimmed = value.trim();
  return /^[=+\-@\t\r]/.test(trimmed) ? `'${trimmed}` : trimmed;
}
