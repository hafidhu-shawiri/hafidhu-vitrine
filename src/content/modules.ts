/**
 * Les six modules de l'écosystème HAFIDHU.
 *
 * Contenu rédactionnel repris du prototype de référence
 * (03_Site à reproduire). Il n'a pas été réécrit : le ton y est déjà
 * juste — sobre, honnête, sans promesse excessive.
 *
 * Le terme officiel est MAFUNVU.
 */

export type PreviewState = 'ok' | 'wait' | 'late';

export type PreviewRow = {
  label: string;
  meta: string;
  state: PreviewState;
  tag: string;
};

export type ModuleContent = {
  slug: string;
  name: string;
  /** Sous-titre court affiché sous le nom dans les cartes et menus. */
  tag: string;
  icon: 'coins' | 'event' | 'hands' | 'globe' | 'link' | 'archive';
  /** Titre H1 de la page dédiée. */
  title: string;
  /** Chapô de la page dédiée. */
  lead: string;
  /** Description utilisée dans les cartes de l'écosystème. */
  card: string;
  /** Bénéfice mis en exergue (filet or). */
  benefit: string;
  /** Exemple d'usage concret. */
  example: string;
  /** Aperçu d'interface — toujours signalé comme tel. */
  preview: { title: string; sub: string; rows: readonly PreviewRow[] };
  problem: readonly string[];
  how: readonly { title: string; body: string }[];
  benefits: readonly string[];
  /** Métadonnées de référencement propres à la page. */
  seo: { title: string; description: string };
};

export const modules: readonly ModuleContent[] = [
  {
    slug: 'mtsango',
    name: 'Mtsango',
    tag: 'Cotisations & tontines',
    icon: 'coins',
    title: 'Mtsango — Organiser les cotisations simplement.',
    lead: "Un groupe, des membres, des échéances et des contributions attendues. Mtsango vise à rendre cette organisation lisible pour tout le monde, pas seulement pour la personne qui tient le carnet.",
    card: "Structurer un groupe de cotisation : membres, échéances, contributions attendues et reçues, statuts et historique.",
    benefit: "La personne qui organise n'a plus à être la seule mémoire du groupe.",
    example: "Un groupe de douze membres cotise chaque mois. Chacun voit ce qui a été reçu, ce qui reste attendu et à quelle échéance, sans avoir à demander.",
    preview: {
      title: 'Mtsango — Groupe',
      sub: 'Échéance du mois · 12 membres',
      rows: [
        { label: 'Fatima M.', meta: 'Contribution du mois', state: 'ok', tag: 'Reçue' },
        { label: 'Ahmed S.', meta: 'Contribution du mois', state: 'ok', tag: 'Reçue' },
        { label: 'Nadjma B.', meta: 'Échéance dépassée de 6 jours', state: 'late', tag: 'En retard' },
        { label: 'Said A.', meta: 'Échéance le 30/09', state: 'wait', tag: 'Attendue' },
      ],
    },
    problem: [
      "Le suivi repose souvent sur un carnet, une conversation de groupe ou la mémoire d'une seule personne.",
      "Quand un membre demande où en est sa contribution, la réponse prend du temps à reconstituer.",
      "Les retards sont difficiles à identifier sans relire tout l'historique.",
      "Au changement de responsable, une partie de l'information se perd.",
    ],
    how: [
      { title: 'Groupe et membres', body: "Créer un groupe, y inscrire les membres et définir qui peut consulter ou enregistrer une contribution." },
      { title: 'Échéances', body: "Poser un rythme (mensuel, par tour, ponctuel) et les montants attendus, tels que le groupe les a décidés." },
      { title: 'Statuts explicites', body: "Attendue, reçue, partielle, en retard, annulée, corrigée : le statut est écrit, pas déduit d'une couleur." },
      { title: 'Historique', body: "Chaque enregistrement reste consultable, y compris les corrections, pour comprendre ce qui s'est passé." },
    ],
    benefits: [
      'Moins de vérifications manuelles.',
      'Une information identique pour tous les membres.',
      "Des retards visibles avant qu'ils ne s'accumulent.",
      'Une continuité même si le responsable change.',
    ],
    seo: {
      title: 'Mtsango — Organiser les cotisations et les tontines',
      description:
        "Mtsango structure les groupes de cotisation : membres, échéances, contributions attendues et reçues, statuts explicites et historique consultable.",
    },
  },

  {
    slug: 'anda',
    name: 'Anda',
    tag: 'Événements & grands moments',
    icon: 'event',
    title: 'Anda — Organiser les engagements autour des grands moments.',
    lead: "Les grands moments familiaux, dont le Grand Mariage, mobilisent de nombreuses personnes et de nombreux engagements. HAFIDHU ne modifie pas ces pratiques : il aide à en garder une trace claire.",
    card: "Structurer les informations d'un événement : participants, engagements pris, contributions, suivi et historique.",
    benefit: "Les engagements restent lisibles avant, pendant et après l'événement.",
    example: "Pour un événement familial, les engagements annoncés sont consignés au fur et à mesure, puis rapprochés de ce qui a effectivement été reçu.",
    preview: {
      title: 'Anda — Événement',
      sub: 'Engagements consignés',
      rows: [
        { label: 'Engagement — branche maternelle', meta: 'Annoncé, en attente de réception', state: 'wait', tag: 'Attendu' },
        { label: 'Engagement — voisinage', meta: 'Reçu et consigné', state: 'ok', tag: 'Reçu' },
        { label: 'Engagement — diaspora France', meta: 'Partiellement reçu', state: 'late', tag: 'Partiel' },
        { label: 'Engagement — amis de la famille', meta: 'Reçu et consigné', state: 'ok', tag: 'Reçu' },
      ],
    },
    problem: [
      'Les engagements sont nombreux, annoncés à des moments différents et parfois par des intermédiaires.',
      'Le rapprochement entre ce qui a été annoncé et ce qui a été reçu se fait souvent de mémoire.',
      "Après l'événement, il reste peu de traces consultables.",
      'Plusieurs personnes organisent en parallèle sans vision commune.',
    ],
    how: [
      { title: "Informations de l'événement", body: "Rassembler au même endroit les informations utiles à ceux qui organisent." },
      { title: 'Participants et rôles', body: "Identifier qui participe et qui a la responsabilité de consigner une information." },
      { title: 'Engagements et contributions', body: "Distinguer ce qui a été annoncé de ce qui a été effectivement reçu." },
      { title: "Après l'événement", body: "Conserver un récapitulatif consultable, utile pour les événements suivants." },
    ],
    benefits: [
      'Une vision commune entre organisateurs.',
      'Moins de malentendus sur les engagements.',
      "Un récapitulatif disponible après l'événement.",
      'Un respect du déroulement décidé par la famille.',
    ],
    seo: {
      title: 'Anda — Organiser les engagements du Grand Mariage et des grands moments',
      description:
        "Anda aide à structurer les informations d'un événement familial comorien : participants, engagements annoncés, contributions reçues, suivi et historique.",
    },
  },

  {
    slug: 'mafunvu',
    name: 'Mafunvu',
    tag: 'Contributions collectives',
    icon: 'hands',
    title: 'Mafunvu — Donner, contribuer, suivre.',
    lead: "Une contribution collective se met en place pour un besoin précis : un événement, un projet, une initiative, une urgence. Mafunvu vise à rendre cette collecte claire pour ceux qui donnent comme pour ceux qui organisent.",
    card: "Ouvrir une contribution autour d'un objectif : contributeurs, montants, statuts, suivi et transparence.",
    benefit: "Ceux qui contribuent voient où en est l'objectif commun.",
    example: "Une contribution est ouverte pour un besoin collectif. Chaque contribution enregistrée alimente un suivi consultable par les personnes concernées.",
    preview: {
      title: 'Mafunvu — Contribution',
      sub: 'Objectif collectif · suivi',
      rows: [
        { label: 'Contribution enregistrée', meta: 'Consignée par un responsable', state: 'ok', tag: 'Reçue' },
        { label: 'Contribution annoncée', meta: 'En attente de réception', state: 'wait', tag: 'Attendue' },
        { label: 'Contribution à vérifier', meta: 'Information incomplète', state: 'late', tag: 'À vérifier' },
        { label: 'Contribution enregistrée', meta: 'Consignée par un responsable', state: 'ok', tag: 'Reçue' },
      ],
    },
    problem: [
      'Les contributions arrivent par des canaux différents et à des moments différents.',
      "Les contributeurs n'ont pas toujours de retour sur ce qui a été reçu.",
      "Le total est reconstitué à la main, avec un risque d'erreur.",
      "La transparence dépend de la disponibilité de l'organisateur.",
    ],
    how: [
      { title: 'Objectif clair', body: "Décrire le besoin, la période et ce qui est attendu." },
      { title: 'Contributeurs', body: "Consigner qui contribue, avec le niveau de visibilité décidé par le groupe." },
      { title: 'Suivi', body: "Voir l'avancement sans avoir à demander." },
      { title: 'Transparence', body: "Un même état de la collecte pour toutes les personnes concernées." },
    ],
    benefits: [
      'Une collecte compréhensible.',
      'Moins de relances individuelles.',
      'Une confiance renforcée par la clarté.',
      'Un historique conservé après la clôture.',
    ],
    seo: {
      title: 'Mafunvu — Donner, contribuer et suivre une contribution collective',
      description:
        "Mafunvu rend lisible une contribution collective : objectif, contributeurs, montants, statuts et suivi partagé avec les personnes concernées.",
    },
  },

  {
    slug: 'diaspora',
    name: 'Diaspora',
    tag: 'Participation à distance',
    icon: 'globe',
    title: 'À des milliers de kilomètres, toujours présent.',
    lead: "Vivre à l'étranger ne devrait pas signifier être en dehors des décisions et des engagements de sa famille. HAFIDHU cherche à rendre la participation à distance simple et visible.",
    card: "Rester impliqué malgré la distance : visibilité, coordination, contribution et suivi depuis l'étranger.",
    benefit: "Participer sans devoir appeler quelqu'un pour comprendre la situation.",
    example: "Un membre de la famille installé à l'étranger consulte ce qui est attendu, enregistre sa participation et suit l'avancement, dans le même espace que les autres.",
    preview: {
      title: 'Diaspora — Ma participation',
      sub: "Vue d'un membre à distance",
      rows: [
        { label: 'Cotisation familiale', meta: 'Ma contribution du mois', state: 'ok', tag: 'Reçue' },
        { label: 'Événement familial', meta: 'Engagement à confirmer', state: 'wait', tag: 'À confirmer' },
        { label: 'Contribution collective', meta: 'Échéance proche', state: 'late', tag: 'À suivre' },
        { label: 'Historique', meta: 'Mes participations passées', state: 'ok', tag: 'Consultable' },
      ],
    },
    problem: [
      "L'information arrive de façon fragmentée, souvent par messages successifs.",
      'Le décalage horaire et la distance compliquent la coordination.',
      'Difficile de savoir si une participation a bien été prise en compte.',
      'Le lien avec la vie familiale repose sur quelques interlocuteurs.',
    ],
    how: [
      { title: 'Visibilité', body: "Consulter depuis l'étranger ce qui est attendu et ce qui a été reçu." },
      { title: 'Coordination', body: "Un même espace pour les personnes sur place et celles à distance." },
      { title: 'Participation', body: "Enregistrer une participation et savoir qu'elle a été consignée." },
      { title: 'Continuité du lien', body: "Suivre les moments importants sans dépendre d'un seul intermédiaire." },
    ],
    benefits: [
      'Moins de va-et-vient pour comprendre la situation.',
      'Une participation reconnue et consignée.',
      'Un lien maintenu avec la famille et le groupe.',
      'Une information disponible quel que soit le fuseau horaire.',
    ],
    seo: {
      title: 'Diaspora — Participer à la vie familiale depuis l’étranger',
      description:
        "Consulter ce qui est attendu, enregistrer sa participation et suivre l'avancement depuis l'étranger, dans le même espace que les membres sur place.",
    },
  },

  {
    slug: 'paiements',
    name: 'Paiements',
    tag: 'Suivi & traçabilité',
    icon: 'link',
    title: 'Des contributions plus simples à suivre.',
    lead: "Le paiement n'est pas le cœur de HAFIDHU : c'est un moyen au service de la contribution. Ce qui compte, c'est le lien entre un règlement, la contribution qu'il concerne et la trace qu'il en reste.",
    card: "Relier un règlement à une contribution : confirmation, historique, traçabilité et rapprochement.",
    benefit: "Une contribution reste rattachée à son contexte, pas à une simple transaction.",
    example: "Une contribution enregistrée peut être rapprochée d'une confirmation de règlement, afin que le suivi et l'historique restent cohérents.",
    preview: {
      title: "Suivi d'une contribution",
      sub: 'Rapprochement — aperçu',
      rows: [
        { label: 'Contribution enregistrée', meta: 'Rattachée à une échéance', state: 'ok', tag: 'Consignée' },
        { label: 'Confirmation attendue', meta: 'En attente de vérification', state: 'wait', tag: 'Attendue' },
        { label: 'Écart constaté', meta: 'À vérifier avant validation', state: 'late', tag: 'À vérifier' },
        { label: 'Historique', meta: 'Trace conservée', state: 'ok', tag: 'Consultable' },
      ],
    },
    problem: [
      "Un règlement effectué ne dit pas toujours à quelle contribution il correspond.",
      'Les preuves de contribution sont dispersées entre plusieurs supports.',
      'Le rapprochement se fait manuellement, longtemps après.',
      "En cas de doute, il est difficile de reconstituer ce qui s'est passé.",
    ],
    how: [
      { title: 'Rattachement', body: "Relier une contribution à son groupe, son événement ou son objectif." },
      { title: 'Confirmation', body: "Distinguer ce qui est annoncé de ce qui est confirmé." },
      { title: 'Traçabilité', body: "Conserver la trace des enregistrements et des corrections." },
      { title: 'Architecture ouverte', body: "Prévoir l'ajout ultérieur de moyens de paiement, sans en présumer aujourd'hui." },
    ],
    benefits: [
      'Un suivi compréhensible.',
      'Moins de recherches pour retrouver une preuve.',
      'Une cohérence entre règlement et contribution.',
      'Une base saine pour les évolutions futures.',
    ],
    seo: {
      title: 'Paiements — Relier un règlement à la contribution qu’il concerne',
      description:
        "HAFIDHU relie une contribution à sa confirmation et à son historique. Aucun prestataire de paiement n'est présenté comme intégré : cette partie est en construction.",
    },
  },

  {
    slug: 'historique-memoire-familiale',
    name: 'Historique & mémoire familiale',
    tag: 'Mémoire & continuité',
    icon: 'archive',
    title: "Ce que nous construisons aujourd'hui peut devenir la mémoire de demain.",
    lead: "Les contributions, les cotisations, les événements et les engagements racontent une histoire collective. HAFIDHU vise à en conserver une trace structurée, stable et consultable.",
    card: "Conserver une trace structurée des contributions, événements, engagements et informations importantes.",
    benefit: "Ce qui a été fait reste consultable, des années plus tard.",
    example: "Consulter une période passée, retrouver un événement, comprendre une correction : l'historique reste stable et lisible dans le temps.",
    preview: {
      title: 'Historique',
      sub: 'Traces successives — aperçu',
      rows: [
        { label: '2026 — Cotisation familiale', meta: 'Période clôturée', state: 'ok', tag: 'Archivée' },
        { label: '2025 — Événement familial', meta: 'Récapitulatif conservé', state: 'ok', tag: 'Archivé' },
        { label: '2025 — Contribution corrigée', meta: 'Correction consignée', state: 'late', tag: 'Corrigée' },
        { label: '2024 — Contribution collective', meta: 'Période clôturée', state: 'ok', tag: 'Archivée' },
      ],
    },
    problem: [
      "L'information ancienne devient rapidement introuvable.",
      "Les corrections ne sont pas toujours expliquées.",
      'Les supports changent : carnets, téléphones, conversations.',
      'La mémoire du groupe dépend de quelques personnes.',
    ],
    how: [
      { title: 'Trace structurée', body: "Chaque contribution appartient à un groupe, une période et un contexte." },
      { title: 'Corrections visibles', body: "Une correction est indiquée lorsqu'elle aide à comprendre l'historique." },
      { title: 'Stabilité', body: "Les éléments historiques gardent une présentation stable dans le temps." },
      { title: 'Transmission', body: "Une base consultable par ceux qui prendront le relais." },
    ],
    benefits: [
      'Retrouver une information ancienne.',
      'Comprendre une correction.',
      "Transmettre l'organisation, pas seulement les décisions.",
      'Une continuité au-delà des personnes.',
    ],
    seo: {
      title: 'Historique & mémoire familiale — Conserver une trace structurée',
      description:
        "Conserver une trace structurée et consultable des contributions, cotisations, événements et engagements, stable et lisible dans le temps.",
    },
  },
] as const;

export const moduleSlugs = modules.map((m) => m.slug);

export function getModule(slug: string): ModuleContent | undefined {
  return modules.find((m) => m.slug === slug);
}

/** Chaîne conceptuelle du produit : Personne → … → Historique. */
export const conceptChain = [
  'Personne',
  'Groupe / Famille',
  'Événement',
  'Contribution',
  'Statut',
  'Historique',
] as const;
