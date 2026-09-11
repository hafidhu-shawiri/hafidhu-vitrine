/**
 * Pages éditoriales, construites par blocs typés.
 *
 * Contenu repris du prototype de référence, enrichi des coordonnées
 * réelles désormais disponibles. Les informations légales encore
 * inconnues restent signalées « À compléter » plutôt qu'inventées.
 */

export type Block =
  | { type: 'prose'; title?: string; items: readonly { body: string }[] }
  | { type: 'cards'; title?: string; items: readonly { title: string; body: string }[] }
  | { type: 'steps'; title?: string; items: readonly { title: string; body: string }[] }
  | {
      type: 'categories';
      title?: string;
      items: readonly { title: string; body: string }[];
    }
  | {
      type: 'legal';
      title?: string;
      items: readonly { title: string; body: string; todo?: string }[];
    }
  | { type: 'contact'; title?: string };

export type EditorialPage = {
  slug: string;
  crumb: string;
  kicker: string;
  title: string;
  lead: string;
  ctaText: string;
  blocks: readonly Block[];
  seo: { title: string; description: string };
};

export const editorialPages: Record<string, EditorialPage> = {
  'notre-vision': {
    slug: 'notre-vision',
    crumb: 'Notre vision',
    kicker: 'Notre vision',
    title: 'Protéger les traces qui comptent.',
    lead: "HAFIDHU part d'une observation simple : les familles et les communautés comoriennes s'organisent depuis toujours, mais l'information qui soutient cette organisation se perd facilement.",
    ctaText: 'Suivre la construction de HAFIDHU',
    blocks: [
      {
        type: 'prose',
        title: 'Pourquoi HAFIDHU existe',
        items: [
          { body: "Chaque cotisation, chaque événement, chaque contribution suppose de savoir qui participe, ce qui a été reçu et ce qui reste attendu. Cette information existe déjà : elle est dans des carnets, des conversations et des mémoires." },
          { body: "Le problème n'est pas l'organisation : c'est sa fragilité. Un carnet se perd, une conversation se noie, un responsable change. Ce qui a été fait devient difficile à prouver et à transmettre." },
        ],
      },
      {
        type: 'prose',
        title: 'Le problème',
        items: [
          { body: "Informations dispersées, suivi manuel, contributions difficiles à retrouver, membres répartis dans plusieurs pays, coordination reposant sur quelques personnes, historique difficile à conserver." },
          { body: "Rien de tout cela ne remet en cause les pratiques. Cela montre simplement qu'un outil adapté manque." },
        ],
      },
      {
        type: 'prose',
        title: 'Notre vision',
        items: [
          { body: "Nous voulons que la technologie serve les pratiques existantes, sans les redéfinir. Un outil sobre, compréhensible par des personnes plus ou moins familières du numérique, et suffisamment durable pour que l'information reste consultable dans dix ans." },
        ],
      },
      {
        type: 'prose',
        title: 'Tradition et technologie',
        items: [
          { body: "La tradition définit ce qui doit être fait. La technologie peut aider à le suivre. HAFIDHU se place du côté de l'outil : il enregistre, organise et conserve. Il ne décide pas." },
        ],
      },
      {
        type: 'prose',
        title: 'La diaspora',
        items: [
          { body: "Une part importante de la vie familiale se joue désormais entre plusieurs pays. Participer à distance ne devrait pas demander plus d'efforts que participer sur place." },
        ],
      },
      {
        type: 'cards',
        title: 'Nos principes',
        items: [
          { title: 'Simplicité', body: 'Une interface compréhensible sans formation.' },
          { title: 'Transparence', body: 'Une même information pour les personnes concernées.' },
          { title: 'Respect culturel', body: 'Les pratiques restent celles du groupe.' },
          { title: 'Sécurité', body: 'Des accès définis, une information protégée.' },
          { title: 'Confidentialité', body: "Le minimum d'informations nécessaires." },
          { title: 'Transmission', body: 'Un historique consultable dans le temps.' },
          { title: 'Accessibilité', body: 'Utilisable sur téléphone, en mobilité, à distance.' },
        ],
      },
    ],
    seo: {
      title: 'Notre vision — Protéger les traces qui comptent',
      description:
        "Pourquoi HAFIDHU existe : mettre la technologie au service des pratiques collectives comoriennes, sans les redéfinir, et conserver une information durable.",
    },
  },

  'comment-ca-marche': {
    slug: 'comment-ca-marche',
    crumb: 'Comment ça marche',
    kicker: 'Parcours',
    title: 'Cinq étapes, pas une de plus.',
    lead: "Le parcours prévu reste volontairement simple : créer un espace, réunir les personnes concernées, suivre les contributions, conserver l'historique.",
    ctaText: "Être informé de l'ouverture",
    blocks: [
      {
        type: 'steps',
        items: [
          { title: 'Créer son espace', body: 'Un espace personnel, point de départ pour rejoindre ou créer un groupe.' },
          { title: 'Créer ou rejoindre un groupe, un événement ou une contribution', body: "Selon l'usage : cotisation régulière, grand moment familial, ou contribution ponctuelle autour d'un objectif." },
          { title: 'Inviter les participants', body: "Les membres rejoignent l'espace commun, avec un niveau d'accès adapté à leur rôle." },
          { title: 'Suivre les contributions', body: "Ce qui est attendu, ce qui a été reçu, ce qui est en retard : le statut est écrit et compréhensible." },
          { title: "Consulter l'historique", body: 'Les périodes passées, les événements et les corrections restent consultables.' },
        ],
      },
      {
        type: 'cards',
        title: 'Ce que cela change au quotidien',
        items: [
          { title: 'Pour la personne qui organise', body: 'Moins de vérifications manuelles et de relances individuelles.' },
          { title: 'Pour les membres', body: "La réponse à « où en est ma contribution ? » est disponible sans demander." },
          { title: 'Pour la diaspora', body: 'La même information, quel que soit le pays.' },
          { title: 'Pour la suite', body: 'Un historique transmissible à ceux qui prendront le relais.' },
        ],
      },
    ],
    seo: {
      title: 'Comment ça marche — Le parcours HAFIDHU en cinq étapes',
      description:
        "Créer son espace, réunir un groupe ou un événement, inviter les participants, suivre les contributions et consulter l'historique.",
    },
  },

  'pour-qui': {
    slug: 'pour-qui',
    crumb: 'Pour qui ?',
    kicker: 'Pour qui ?',
    title: 'Conçu pour ceux qui organisent déjà.',
    lead: "HAFIDHU s'adresse à quatre situations proches mais distinctes. Chacune part d'un problème concret.",
    ctaText: 'Rejoindre les premiers utilisateurs',
    blocks: [
      {
        type: 'cards',
        title: 'Familles',
        items: [
          { title: 'Le problème', body: 'Les contributions familiales circulent entre plusieurs personnes, sans trace commune.' },
          { title: 'La solution', body: 'Un espace familial où les engagements et contributions sont consignés.' },
          { title: 'Les bénéfices', body: 'Moins de malentendus, une mémoire partagée, une transmission possible.' },
        ],
      },
      {
        type: 'cards',
        title: 'Organisateurs',
        items: [
          { title: 'Le problème', body: "L'organisateur devient la seule mémoire du groupe ou de l'événement." },
          { title: 'La solution', body: 'Un suivi structuré, consultable par les personnes concernées.' },
          { title: 'Les bénéfices', body: "Moins de relances, moins d'erreurs, une charge partagée." },
        ],
      },
      {
        type: 'cards',
        title: 'Communautés',
        items: [
          { title: 'Le problème', body: "Les membres sont nombreux et l'information circule inégalement." },
          { title: 'La solution', body: 'Un même état des contributions pour tous les membres.' },
          { title: 'Les bénéfices', body: 'Une confiance renforcée par la clarté.' },
        ],
      },
      {
        type: 'cards',
        title: 'Diaspora',
        items: [
          { title: 'Le problème', body: 'La distance rend la participation dépendante de quelques interlocuteurs.' },
          { title: 'La solution', body: "Consulter, participer et suivre depuis l'étranger." },
          { title: 'Les bénéfices', body: 'Rester présent malgré les kilomètres.' },
        ],
      },
    ],
    seo: {
      title: 'Pour qui ? — Familles, organisateurs, communautés et diaspora',
      description:
        "HAFIDHU s'adresse aux familles, aux organisateurs d'événements, aux communautés et à la diaspora comorienne. Quatre situations, quatre problèmes concrets.",
    },
  },

  'securite-confidentialite': {
    slug: 'securite-confidentialite',
    crumb: 'Sécurité & confidentialité',
    kicker: 'Sécurité & confidentialité',
    title: 'HAFIDHU est conçu avec la sécurité et la confidentialité comme principes fondamentaux.',
    lead: "Les informations confiées à HAFIDHU concernent des familles, des engagements et parfois de l'argent. Elles demandent de la retenue plutôt que des promesses.",
    ctaText: 'Une question sur la confidentialité ?',
    blocks: [
      {
        type: 'prose',
        title: 'Pourquoi la confidentialité est importante',
        items: [
          { body: "Une contribution dit quelque chose d'une personne : sa participation, ses moyens, sa situation. Ces informations ne doivent être visibles que par les personnes concernées, dans le cadre décidé par le groupe." },
        ],
      },
      {
        type: 'cards',
        title: 'Nos principes',
        items: [
          { title: 'Contrôle des accès', body: 'Les droits dépendent du rôle dans le groupe : consulter, enregistrer, administrer.' },
          { title: 'Protection des informations', body: "Le minimum d'informations nécessaires est collecté." },
          { title: 'Traçabilité', body: 'Les enregistrements et corrections restent identifiables.' },
          { title: 'Gestion des utilisateurs', body: 'Les membres et leurs droits peuvent évoluer avec le groupe.' },
          { title: 'Clarté avant effet', body: "Sur les sujets sensibles, la lisibilité prime sur l'esthétique." },
          { title: 'Pas de promesse non tenue', body: "Aucune certification n'est revendiquée à ce stade du projet." },
        ],
      },
      {
        type: 'prose',
        title: 'Ce que nous ne faisons pas',
        items: [
          { body: "Nous n'affichons pas de certification non obtenue, ni de partenariat non confirmé, ni de fonctionnalité présentée comme disponible alors qu'elle est en construction." },
        ],
      },
      {
        type: 'prose',
        title: 'Et sur ce site',
        items: [
          { body: "Les informations transmises via les formulaires de contact et de liste d'attente sont enregistrées dans une base de données protégée, accessible uniquement à l'équipe du projet. Elles ne sont ni revendues, ni cédées à des tiers à des fins commerciales." },
          { body: "Ce site ne dépose aucun cookie publicitaire et n'utilise aucun traceur tiers." },
        ],
      },
    ],
    seo: {
      title: 'Sécurité & confidentialité — Des principes de conception',
      description:
        "Contrôle des accès selon le rôle, collecte minimale, traçabilité des enregistrements. HAFIDHU ne revendique aucune certification à ce stade.",
    },
  },

  ressources: {
    slug: 'ressources',
    crumb: 'Ressources',
    kicker: 'Ressources',
    title: 'Comprendre, organiser, transmettre.',
    lead: "Un espace éditorial est prévu pour partager des repères sur l'organisation collective, la participation à distance et le suivi des contributions.",
    ctaText: 'Être prévenu des premières publications',
    blocks: [
      {
        type: 'categories',
        title: 'Catégories prévues',
        items: [
          { title: 'Traditions', body: 'Comprendre les pratiques et leur organisation.' },
          { title: 'Diaspora', body: "Participer depuis l'étranger." },
          { title: 'Organisation familiale', body: 'Structurer sans rigidifier.' },
          { title: 'Contributions', body: 'Suivi, statuts, transparence.' },
          { title: 'Technologie', body: "Ce qu'un outil peut et ne peut pas faire." },
          { title: 'HAFIDHU', body: 'Avancement du produit.' },
        ],
      },
    ],
    seo: {
      title: 'Ressources — Comprendre, organiser, transmettre',
      description:
        "Un espace éditorial en préparation autour de l'organisation collective, de la participation à distance et du suivi des contributions.",
    },
  },

  'mentions-legales': {
    slug: 'mentions-legales',
    crumb: 'Mentions légales',
    kicker: 'Informations légales',
    title: 'Mentions légales',
    lead: "Cette page présente les mentions légales de HAFIDHU. Les informations d'immatriculation seront complétées avant la mise en ligne publique définitive.",
    ctaText: 'Une question ?',
    blocks: [
      {
        type: 'legal',
        items: [
          {
            title: 'Éditeur du site',
            body: "Le site HAFIDHU est édité dans le cadre du projet HAFIDHU, porté par MORA Shawiri. Adresse : Moroni Oasis, route les puffins, Moroni, Comores. Contact : contact@morashawiri.com — +269 430 63 06.",
            todo: "dénomination sociale exacte, forme juridique et numéro d'immatriculation de la structure porteuse.",
          },
          {
            title: 'Responsable de la publication',
            body: 'La responsabilité de la publication est assurée par le porteur du projet, MORA Shawiri.',
          },
          {
            title: 'Hébergement',
            body: "Le site est hébergé par Vercel Inc., qui assure la mise à disposition technique des pages.",
            todo: "adresse postale complète de l'hébergeur, à reprendre depuis ses conditions officielles.",
          },
          {
            title: 'Contact',
            body: "Toute demande peut être adressée via le formulaire de contact du site, ou directement à contact@morashawiri.com.",
          },
          {
            title: 'Propriété intellectuelle',
            body: "La marque HAFIDHU, son identité visuelle et les contenus du site sont protégés. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation préalable est interdite.",
          },
          {
            title: 'Crédits photographiques',
            body: "Les photographies présentées sur ce site documentent des pratiques et cérémonies comoriennes. Elles sont publiées dans le cadre du projet HAFIDHU.",
            todo: "crédits des photographes et mentions d'autorisation des personnes représentées.",
          },
        ],
      },
    ],
    seo: {
      title: 'Mentions légales',
      description: 'Éditeur, responsable de la publication, hébergement et propriété intellectuelle du site HAFIDHU.',
    },
  },

  'politique-de-confidentialite': {
    slug: 'politique-de-confidentialite',
    crumb: 'Politique de confidentialité',
    kicker: 'Informations légales',
    title: 'Politique de confidentialité',
    lead: "Cette page décrit les informations collectées par le site et l'usage qui en est fait. HAFIDHU applique un principe de collecte minimale.",
    ctaText: 'Une question sur vos données ?',
    blocks: [
      {
        type: 'legal',
        items: [
          {
            title: 'Données collectées',
            body: "Le site collecte uniquement les informations que vous transmettez volontairement. Formulaire de contact : prénom, nom, adresse e-mail, téléphone (facultatif), sujet et message. Formulaire de liste d'attente : prénom, nom, adresse e-mail, pays de résidence, profil et, facultativement, la fonctionnalité qui vous serait la plus utile. La date d'envoi est également enregistrée.",
          },
          {
            title: 'Finalité du traitement',
            body: "Ces informations servent exclusivement à répondre à votre demande, à vous tenir informé de l'avancement du projet et à orienter les fonctionnalités développées. Elles ne font l'objet d'aucune prospection commerciale.",
            todo: 'base légale retenue pour chaque traitement (consentement ou intérêt légitime).',
          },
          {
            title: 'Durée de conservation',
            body: "Les informations sont conservées le temps nécessaire à la finalité annoncée, puis supprimées.",
            todo: 'durées de conservation précises par catégorie de données.',
          },
          {
            title: 'Destinataires',
            body: "Les informations sont accessibles uniquement à l'équipe du projet HAFIDHU. Elles ne sont ni vendues, ni cédées, ni transmises à des tiers à des fins commerciales. Elles sont hébergées chez Supabase (base de données) et transitent par un service de messagerie pour la notification.",
          },
          {
            title: 'Cookies et mesure d’audience',
            body: "Ce site ne dépose aucun cookie publicitaire et n'utilise aucun traceur tiers. Aucun profilage n'est effectué.",
          },
          {
            title: 'Sécurité',
            body: "Les données sont stockées dans une base protégée par des règles d'accès strictes. Aucune donnée personnelle n'est accessible publiquement. Les échanges avec le site sont chiffrés (HTTPS).",
          },
          {
            title: 'Vos droits',
            body: "Vous pouvez demander l'accès, la rectification, la limitation ou la suppression de vos informations, ainsi que vous opposer à leur traitement. Adressez votre demande à contact@morashawiri.com : elle sera traitée dans les meilleurs délais.",
            todo: "modalités de vérification d'identité et délai de réponse engagé.",
          },
        ],
      },
    ],
    seo: {
      title: 'Politique de confidentialité',
      description:
        'Données collectées par le site HAFIDHU, finalité, durée de conservation, destinataires, sécurité et exercice de vos droits.',
    },
  },

  'conditions-d-utilisation': {
    slug: 'conditions-d-utilisation',
    crumb: "Conditions d'utilisation",
    kicker: 'Informations légales',
    title: "Conditions d'utilisation",
    lead: "Ces conditions encadrent l'utilisation du site HAFIDHU. Elles seront complétées avant l'ouverture du service.",
    ctaText: 'Une question ?',
    blocks: [
      {
        type: 'legal',
        items: [
          {
            title: 'Objet',
            body: "Les présentes conditions encadrent l'utilisation du site et, à terme, de la plateforme HAFIDHU.",
          },
          {
            title: 'Statut du service',
            body: "HAFIDHU est en construction. Le site présente des aperçus de fonctionnalités qui ne sont pas encore disponibles. Aucune offre commerciale n'est proposée à ce stade.",
          },
          {
            title: 'Utilisation attendue',
            body: "L'utilisateur s'engage à fournir des informations exactes et à respecter les personnes concernées par les informations enregistrées.",
          },
          {
            title: 'Responsabilité',
            body: 'Les décisions relatives aux contributions, cotisations et événements appartiennent aux familles, groupes et communautés utilisateurs. HAFIDHU est un outil de consignation et de suivi : il ne décide pas et n’arbitre pas.',
          },
          {
            title: 'Disponibilité',
            body: "Le site est fourni en l'état. Des interruptions peuvent survenir pour maintenance ou évolution.",
          },
          {
            title: 'Évolution des conditions',
            body: "Les conditions pourront évoluer avec le produit ; les utilisateurs seront informés des modifications importantes.",
            todo: 'modalités de notification des modifications.',
          },
        ],
      },
    ],
    seo: {
      title: "Conditions d'utilisation",
      description:
        "Objet, statut du service, utilisation attendue et responsabilités liées à l'utilisation du site HAFIDHU.",
    },
  },
};

export function getEditorialPage(slug: string): EditorialPage | undefined {
  return editorialPages[slug];
}
