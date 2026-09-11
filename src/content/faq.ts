/**
 * Questions fréquentes.
 *
 * Reprises du prototype de référence. Les réponses restent délibérément
 * prudentes : aucune fonctionnalité n'est présentée comme disponible,
 * aucune certification n'est revendiquée, aucun prestataire de paiement
 * n'est annoncé comme intégré.
 */

export type FaqEntry = { q: string; a: string };

export const faq: readonly FaqEntry[] = [
  {
    q: "Qu'est-ce que HAFIDHU ?",
    a: "HAFIDHU est une plateforme conçue pour organiser et conserver les contributions, cotisations, événements et engagements collectifs des familles et des communautés. Son rôle est de garder la trace de ce qui compte.",
  },
  {
    q: "À qui s'adresse HAFIDHU ?",
    a: "Aux familles, aux organisateurs d'événements, aux membres de groupes et de communautés, et aux personnes vivant à l'étranger qui souhaitent continuer à participer.",
  },
  {
    q: 'Quelle différence entre HAFIDHU et une simple application de paiement ?',
    a: "Une application de paiement transfère de l'argent. HAFIDHU s'intéresse au contexte : qui participe, à quel engagement, dans quel groupe, avec quel statut, et ce qu'il en reste dans l'historique.",
  },
  {
    q: "Qu'est-ce que Mtsango ?",
    a: 'Mtsango concerne les cotisations et les tontines : groupes, membres, échéances, contributions attendues et reçues, statuts et historique.',
  },
  {
    q: "Qu'est-ce que Anda ?",
    a: 'Anda concerne les événements et les grands moments familiaux, dont le Grand Mariage : informations, participants, engagements, contributions et suivi.',
  },
  {
    q: "Qu'est-ce que Mafunvu ?",
    a: "Mafunvu concerne les contributions collectives réunies autour d'un objectif : un événement, un projet, une initiative ou un besoin commun.",
  },
  {
    q: 'Comment la diaspora peut-elle utiliser HAFIDHU ?',
    a: "En consultant ce qui est attendu, en enregistrant sa participation et en suivant l'avancement depuis l'étranger, dans le même espace que les membres sur place.",
  },
  {
    q: 'Comment fonctionnent les paiements ?',
    a: "HAFIDHU est conçu pour relier une contribution à sa confirmation et à son historique. Aucun prestataire de paiement n'est présenté comme intégré : cette partie est en cours de construction.",
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: "La sécurité et la confidentialité sont des principes de conception : accès limités selon le rôle, information visible par ceux qui doivent la voir, traçabilité des enregistrements. HAFIDHU ne revendique aucune certification à ce stade.",
  },
  {
    q: 'Puis-je utiliser HAFIDHU pour une famille ou un groupe ?',
    a: "Oui, c'est l'usage prévu : un espace commun pour une famille, un groupe de cotisation ou une communauté.",
  },
  {
    q: 'HAFIDHU est-il déjà disponible ?',
    a: 'Non. HAFIDHU est en construction. Les interfaces présentées sur ce site sont des aperçus, clairement identifiés comme tels.',
  },
  {
    q: "Comment rejoindre la liste d'attente ?",
    a: "Depuis la page « Rejoindre la liste d'attente ». Le formulaire recueille les informations nécessaires pour vous tenir informé de l'avancement.",
  },
  {
    q: 'Comment participer à la validation du produit ?',
    a: 'En nous écrivant depuis la page Contact : les retours sur des situations réelles orientent directement les fonctionnalités développées.',
  },
  {
    q: 'HAFIDHU remplacera-t-il les pratiques traditionnelles ?',
    a: "Non. Les règles, les usages et les décisions restent ceux de la famille ou du groupe. HAFIDHU aide seulement à mieux organiser et conserver l'information.",
  },
  {
    q: "Puis-je suivre l'historique de mes contributions ?",
    a: 'C’est un axe central du produit : conserver une trace structurée et consultable des contributions, engagements et périodes passées.',
  },
];

/** Sélection affichée sur la page d'accueil. */
export const faqHome = faq.slice(0, 5);
