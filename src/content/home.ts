/**
 * Contenu de la page d'accueil.
 *
 * Direction de titre imposée par le cahier des charges :
 * « Ne perdez plus la trace de ce qui compte. »
 */

import type { PreviewRow } from './modules';

export const hero = {
  kicker: 'HAFIDHU — Le Gardien',
  title: 'Ne perdez plus la trace de ce qui compte.',
  lead: "HAFIDHU est une plateforme numérique conçue pour simplifier les cotisations, contributions, événements et engagements collectifs, tout en préservant ce qui nous lie.",
  statusNote: 'HAFIDHU est en construction. Les interfaces présentées sont des aperçus.',
} as const;

/** Aperçu produit affiché sur la page d'accueil. */
export const homePreview = {
  title: 'Mtsango — Famille Abdallah',
  sub: 'Cotisation mensuelle · 12 membres',
  stats: [
    { label: 'Reçues', value: '9 / 12' },
    { label: 'En retard', value: '2' },
    { label: 'Échéance', value: '30/09' },
  ],
  rows: [
    { label: 'Fatima M.', meta: 'Contribution du mois', state: 'ok', tag: 'Reçue' },
    { label: 'Ahmed S.', meta: 'Contribution du mois', state: 'ok', tag: 'Reçue' },
    { label: 'Nadjma B.', meta: 'Échéance dépassée de 6 jours', state: 'late', tag: 'En retard' },
    { label: 'Said A.', meta: 'Échéance le 30/09', state: 'wait', tag: 'Attendue' },
  ] satisfies PreviewRow[],
} as const;

export const problemSection = {
  title: 'Quand la tradition rencontre la complexité.',
  lead: "Les familles et les communautés savent déjà s'organiser. Mais l'information circule dans des carnets, des conversations et des mémoires différentes — et elle finit par se disperser.",
  items: [
    { title: 'Informations dispersées', body: "Carnets, conversations, messages : la même information existe en plusieurs versions." },
    { title: 'Suivi manuel', body: "Vérifier qui a contribué demande du temps et de la mémoire." },
    { title: 'Contributions difficiles à retrouver', body: "Les preuves de contribution sont réparties sur plusieurs supports." },
    { title: 'Membres dans plusieurs pays', body: "La coordination dépend des disponibilités et des fuseaux horaires." },
    { title: 'Historique fragile', body: "Ce qui a été fait il y a deux ans est rarement consultable." },
    { title: 'Manque de visibilité', body: "Les membres doivent demander pour savoir où en est leur participation." },
  ],
} as const;

export const valueSection = {
  title: 'Et si la technologie pouvait simplement nous aider à mieux faire ce que nous faisons déjà ?',
  body: "HAFIDHU ne remplace ni les pratiques, ni les décisions, ni les personnes qui organisent. La plateforme met de l'ordre là où l'information se perd : qui participe, ce qui a été reçu, ce qui reste attendu, et ce qui doit rester consultable demain.",
} as const;

export const ecosystemSection = {
  title: "L'écosystème HAFIDHU",
  lead: 'Six axes complémentaires, une même logique : personne, groupe, événement, contribution, statut, historique.',
} as const;

export const traditionSection = {
  title: "Moderniser l'organisation sans effacer la tradition.",
  paragraphs: [
    "Les règles, les usages et les responsabilités restent ceux de la famille ou du groupe. HAFIDHU se contente d'en garder la trace : une information écrite au même endroit, lisible par ceux qui doivent la voir, et conservée dans le temps.",
    "C'est le rôle du Gardien : protéger, pas décider.",
  ],
} as const;

export const diasporaSection = {
  title: 'La distance ne devrait pas empêcher de participer.',
  paragraphs: [
    "Une partie des familles vit aujourd'hui répartie entre plusieurs pays. Les décisions se prennent ici, les contributions arrivent d'ailleurs, et la coordination repose souvent sur quelques personnes.",
    "HAFIDHU vise à rendre visible, depuis n'importe où, ce qui est attendu et ce qui a déjà été fait.",
  ],
  steps: [
    { title: 'Voir ce qui est attendu', body: "Sans avoir à appeler quelqu'un pour comprendre la situation." },
    { title: 'Enregistrer sa participation', body: "Et savoir qu'elle a bien été consignée." },
    { title: "Suivre l'avancement", body: "Le même état d'information que les membres sur place." },
    { title: 'Rester dans la continuité', body: "Retrouver ses participations passées dans l'historique." },
  ],
} as const;

export const trustSection = {
  title: 'Vos données méritent autant de respect que vos traditions.',
  lead: "La confidentialité fait partie de la conception du produit, pas d'une option à activer plus tard.",
  items: [
    { title: 'Confidentialité', body: "Le minimum d'informations nécessaires est collecté." },
    { title: 'Contrôle des accès', body: 'Les droits dépendent du rôle dans le groupe.' },
    { title: 'Traçabilité', body: 'Les enregistrements et corrections restent identifiables.' },
    { title: 'Sécurité', body: "Un principe de conception, pas une option." },
    { title: 'Transparence', body: 'Une même information pour les personnes concernées.' },
  ],
  disclaimer: 'HAFIDHU ne revendique aucune certification.',
} as const;

export const stepsSection = {
  title: 'Comment ça marche',
  items: [
    { n: '1', title: 'Créer ou rejoindre un espace', body: 'Un espace familial, un groupe de cotisation ou une contribution collective.' },
    { n: '2', title: 'Organiser', body: 'Contributions, cotisations ou événements, selon les règles décidées par le groupe.' },
    { n: '3', title: 'Participer et suivre', body: "Ce qui est attendu, reçu, en retard : le statut est écrit et lisible." },
    { n: '4', title: "Conserver l'historique", body: 'Les périodes passées et les corrections restent consultables.' },
  ],
} as const;

export const coBuildSection = {
  title: 'HAFIDHU se construit avec vous.',
  body: "La plateforme est en cours de construction. Les fonctionnalités sont définies à partir de situations réelles : cotisations de groupe, grands moments familiaux, contributions collectives, participation depuis l'étranger.",
} as const;

export const finalCta = {
  title: 'Préservons ce qui nous rassemble.',
  subtitle: 'Construisons les outils qui nous permettront de le transmettre.',
} as const;
