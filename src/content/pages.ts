/**
 * Pages éditoriales, construites par blocs typés.
 *
 * Contenu repris du prototype de référence, enrichi des coordonnées
 * réelles désormais disponibles.
 *
 * Règle appliquée aux trois pages juridiques : tout ce qui peut être
 * rédigé l'est réellement. Le bandeau « À compléter » est réservé aux
 * informations obligatoires que nous ne connaissons pas encore —
 * immatriculation, adresse de l'hébergeur, crédits photographiques,
 * base légale, durées de conservation, droit applicable. Aucune de ces
 * données n'est inventée, approximée ni citée de mémoire.
 */

/**
 * Article d'une page juridique.
 *
 * « body » accepte plusieurs paragraphes : une page de mentions légales
 * lisible se rédige en phrases courtes, pas en un pavé unique.
 *
 * Deux encadrés très différents cohabitent :
 *   • « note » informe (fond neutre) — il sert à préciser une règle ;
 *   • « todo » signale une information obligatoire réellement inconnue
 *     (fond ambre). Il ne doit rester que là où nous ne savons pas.
 */
export type LegalItem = {
  title: string;
  body: string | readonly string[];
  /** Liste à puces, intercalée après les paragraphes. */
  list?: readonly string[];
  /** Intitulé facultatif introduisant la liste. */
  listLead?: string;
  /** Paragraphes de conclusion, après la liste. */
  after?: string | readonly string[];
  note?: string;
  todo?: string;
};

export type Block =
  | { type: 'prose'; title?: string; items: readonly { body: string }[] }
  | { type: 'cards'; title?: string; items: readonly { title: string; body: string }[] }
  | { type: 'steps'; title?: string; items: readonly { title: string; body: string }[] }
  | {
      type: 'categories';
      title?: string;
      items: readonly { title: string; body: string }[];
    }
  | { type: 'legal'; title?: string; items: readonly LegalItem[] }
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
    lead: "Cette page rassemble les informations légales relatives au site HAFIDHU : qui l’édite, qui l’héberge, ce qu’il contient et dans quelles limites il engage. HAFIDHU étant un projet en construction, quelques mentions administratives ne sont pas encore arrêtées : elles sont signalées comme telles plutôt qu’approximées.",
    ctaText: 'Une question sur ces mentions ?',
    blocks: [
      {
        type: 'legal',
        title: 'Éditeur et publication',
        items: [
          {
            title: 'Éditeur du site',
            body: [
              'Ce site est édité dans le cadre du projet HAFIDHU, porté par MORA Shawiri.',
              'HAFIDHU n’est pas une plateforme ouverte au public. C’est un projet numérique en cours de construction, dont ce site présente l’intention, le périmètre envisagé et l’état d’avancement.',
            ],
            listLead: 'Coordonnées de l’éditeur :',
            list: [
              'Projet : HAFIDHU, porté par MORA Shawiri',
              'Adresse : Moroni Oasis, route les puffins — Moroni, Comores',
              'Adresse électronique : contact@morashawiri.com',
              'Téléphone : +269 430 63 06',
              'Site du porteur de projet : www.morashawiri.com',
            ],
            todo: 'la dénomination sociale exacte, la forme juridique et le numéro d’immatriculation de la structure qui portera HAFIDHU. Ces éléments ne sont pas encore arrêtés ; ils seront publiés ici dès qu’ils le seront.',
          },
          {
            title: 'Responsable de la publication',
            body: [
              'La responsabilité de la publication est assurée par MORA Shawiri, porteur du projet, joignable à l’adresse indiquée ci-dessus.',
              'Concrètement, les textes, les visuels et les affirmations présentés sur ce site relèvent de sa responsabilité éditoriale. Toute demande de rectification peut lui être adressée directement.',
              'Aucune autre personne n’est désignée à ce titre à ce jour. Si une direction de la publication distincte est constituée avec la structure porteuse, cette mention sera mise à jour.',
            ],
          },
          {
            title: 'Conception et réalisation',
            body: 'Le site a été conçu et développé dans le cadre du projet HAFIDHU. Il repose sur des technologies web standard et n’intègre aucune régie publicitaire, aucun réseau de suivi, ni aucune ressource chargée depuis un domaine externe.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Hébergement',
        items: [
          {
            title: 'Hébergeur du site',
            body: [
              'Le site est hébergé par Vercel Inc., société de droit américain, qui assure la mise à disposition technique des pages et leur distribution sur le réseau.',
              'Vercel intervient comme prestataire technique : la société exécute et sert l’application, sans intervenir sur le contenu éditorial, qui relève exclusivement de l’éditeur.',
            ],
            after: 'Les informations officielles de la société, dont son siège, figurent sur son propre site : vercel.com.',
            todo: 'l’adresse postale complète de l’hébergeur, à reprendre depuis ses conditions officielles plutôt qu’à citer de mémoire.',
          },
          {
            title: 'Hébergement des données',
            body: 'Les informations transmises par les formulaires sont enregistrées dans une base de données gérée par Supabase, hébergée dans la région européenne (Irlande). Le détail des traitements figure dans la politique de confidentialité.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Objet du site',
        items: [
          {
            title: 'Ce qu’est HAFIDHU',
            body: [
              'HAFIDHU est un projet numérique consacré à la conservation des traces qui comptent dans la vie collective : ce qui a été donné, reçu, promis, organisé et transmis.',
              'Les familles, les groupes et les communautés s’organisent depuis toujours. HAFIDHU ne cherche pas à modifier cette organisation : il cherche à en conserver la trace de façon lisible et durable.',
            ],
            listLead: 'Le projet s’articule autour de quelques usages :',
            list: [
              'les contributions : savoir ce qui a été apporté, par qui et quand ;',
              'les cotisations : suivre les échéances, les versements et ce qui reste attendu ;',
              'les événements : préparer, tenir et clôturer les grands moments collectifs ;',
              'les pratiques collectives : accompagner les usages existants sans les redéfinir ;',
              'la mémoire : conserver un historique consultable dans la durée ;',
              'l’organisation : réunir au même endroit une information aujourd’hui dispersée ;',
              'la confiance et la continuité : faire qu’un changement de responsable ne fasse pas disparaître l’information.',
            ],
          },
          {
            title: 'Ce que ce site présente aujourd’hui',
            body: [
              'Ce site est un site de présentation. Il expose la vision du projet, les usages envisagés, des aperçus d’interface et une manière de rester informé de son avancement.',
              'Les maquettes d’interface visibles sur le site portent la mention « Aperçu ». Elles illustrent une intention de conception à partir de données d’exemple : elles ne reflètent aucune donnée réelle et ne sont pas des captures d’un produit en service.',
            ],
          },
          {
            title: 'Ce que ce site ne propose pas',
            body: 'Aucun compte utilisateur, aucun service de paiement, aucune souscription et aucune offre commerciale ne sont proposés à ce jour. Les seules actions possibles pour un visiteur sont l’envoi d’un message et l’inscription à la liste d’attente.',
            note: 'HAFIDHU est en construction. Les fonctionnalités décrites sur ce site expriment une intention de conception et peuvent évoluer avant toute ouverture au public.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Propriété intellectuelle',
        items: [
          {
            title: 'Éléments protégés',
            body: 'L’ensemble des éléments qui composent ce site est protégé au titre de la propriété intellectuelle.',
            listLead: 'Sont notamment concernés :',
            list: [
              'la marque HAFIDHU et sa signature ;',
              'le logo, dans toutes ses déclinaisons ;',
              'l’identité visuelle : palette, typographie, système d’icônes, principes de mise en page ;',
              'les textes et contenus éditoriaux publiés sur le site ;',
              'le design de l’interface, ses composants et ses maquettes ;',
              'les éléments graphiques, illustrations et schémas ;',
              'la structure du site et l’organisation de ses rubriques ;',
              'les noms des modules présentés : Mtsango, Anda, Mafunvu, Diaspora, Paiements, Historique & mémoire familiale.',
            ],
          },
          {
            title: 'Usages autorisés',
            body: [
              'La consultation du site, l’impression de pages pour un usage strictement personnel et le partage d’un lien vers une page publique sont libres.',
              'La citation d’un extrait est admise si elle reste brève, si elle indique clairement HAFIDHU comme source et si elle renvoie vers la page d’origine.',
            ],
          },
          {
            title: 'Usages soumis à autorisation',
            body: 'Toute reproduction, représentation, adaptation, traduction, extraction ou diffusion, totale ou partielle, sur quelque support que ce soit et par quelque procédé que ce soit, est interdite sans autorisation écrite préalable. Cela vaut en particulier pour un usage commercial, pour la reprise de l’identité visuelle et pour la réutilisation des maquettes d’interface.',
            after: 'Une demande d’autorisation peut être adressée à contact@morashawiri.com. Elle sera examinée au cas par cas.',
          },
          {
            title: 'Signalement',
            body: 'Si vous estimez qu’un contenu publié sur ce site porte atteinte à un droit dont vous êtes titulaire, écrivez à contact@morashawiri.com en précisant la page concernée et la nature de l’atteinte. Le signalement sera examiné et, le cas échéant, le contenu retiré.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Photographies et contenus visuels',
        items: [
          {
            title: 'Rôle des images sur le site',
            body: [
              'Les photographies présentées documentent des pratiques, des cérémonies et des moments de vie collective aux Comores : grands mariages, réunions de famille, organisation de contributions.',
              'Elles ne sont pas décoratives. Elles servent à situer le projet dans un contexte réel plutôt que dans une abstraction : HAFIDHU parle de pratiques existantes, et le site les montre telles qu’elles sont.',
            ],
          },
          {
            title: 'Origine et crédits',
            body: 'Les visuels publiés proviennent des ressources rassemblées dans le cadre du projet HAFIDHU. Aucun visuel générique issu d’une banque d’images n’est utilisé sur ce site.',
            todo: 'les crédits nominatifs des photographes et l’état des autorisations des personnes représentées. Tant que ces éléments ne sont pas réunis et vérifiés, aucun crédit n’est affirmé. Toute personne apparaissant sur une photographie et souhaitant son retrait peut écrire à contact@morashawiri.com : la demande sera traitée sans délai et sans justification à fournir.',
          },
          {
            title: 'Maquettes et données d’exemple',
            body: 'Les écrans d’interface reproduits sur le site sont des maquettes. Les noms, montants et statuts qu’ils affichent sont fictifs et servent uniquement à illustrer une logique d’affichage. Ils ne correspondent à aucune personne ni à aucune somme réelle.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Liens externes',
        items: [
          {
            title: 'Liens vers les réseaux sociaux et services externes',
            body: 'Le site renvoie vers les espaces publics du porteur de projet sur plusieurs plateformes, ainsi que vers une messagerie permettant une mise en relation directe.',
            listLead: 'Ces liens concernent aujourd’hui :',
            list: [
              'Facebook',
              'YouTube',
              'LinkedIn',
              'Instagram',
              'TikTok',
              'Telegram',
              'WhatsApp, pour une mise en relation directe',
            ],
            after: 'Ces liens s’ouvrent dans un nouvel onglet. Aucun script, aucun bouton de partage et aucun contenu embarqué provenant de ces plateformes n’est chargé par le site : ce sont de simples liens.',
          },
          {
            title: 'Absence de contrôle sur les sites tiers',
            body: [
              'Une fois le lien suivi, vous quittez le site HAFIDHU. Les contenus, les pratiques de collecte de données et les conditions d’utilisation du site de destination relèvent de son seul éditeur.',
              'HAFIDHU n’exerce aucun contrôle sur ces contenus et ne peut être tenu responsable de ce qui y est publié, ni de l’usage que ces plateformes font de vos données. Nous vous invitons à consulter leurs propres politiques.',
            ],
          },
          {
            title: 'Liens vers ce site',
            body: 'Établir un lien vers une page publique de ce site est libre, à condition que le lien n’induise pas en erreur sur l’origine du contenu et ne s’inscrive pas dans un contexte portant atteinte à l’image du projet. Un référencement dans un cadre trompeur peut faire l’objet d’une demande de retrait.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Responsabilité',
        items: [
          {
            title: 'Portée informative du site',
            body: [
              'Ce site a une vocation informative. Il présente un projet en construction : son intention, son périmètre envisagé et son état d’avancement.',
              'Les informations qui y figurent sont fournies de bonne foi et tenues à jour avec soin. Elles ne constituent ni un engagement contractuel, ni une garantie de disponibilité future, ni une offre de service.',
            ],
          },
          {
            title: 'Distinction entre le projet présenté et les services à venir',
            body: [
              'Deux choses doivent être distinguées : ce que ce site décrit, et ce qui existe aujourd’hui.',
              'Ce que le site décrit relève d’une conception en cours. Ce qui existe aujourd’hui se limite à ce site de présentation, à son formulaire de contact et à sa liste d’attente.',
              'Aucune fonctionnalité de suivi de cotisations, de gestion d’événements ou de conservation d’historique n’est en service. Les délais, les modalités d’accès et le périmètre effectif d’une éventuelle ouverture ne sont pas arrêtés.',
            ],
          },
          {
            title: 'Ce que HAFIDHU ne fait pas',
            body: 'Y compris lorsque le service sera ouvert, HAFIDHU restera un outil de consignation, d’organisation et de suivi. Il n’arbitre pas les désaccords, ne décide pas à la place des familles, des groupes ou des communautés, et ne se substitue à aucune autorité familiale, coutumière, associative ou administrative.',
          },
          {
            title: 'Disponibilité et exactitude',
            body: [
              'Le site peut être momentanément inaccessible pour maintenance, mise à jour ou pour une raison technique indépendante de notre volonté.',
              'Malgré le soin apporté à sa rédaction, une erreur ou une omission peut subsister. Si vous en constatez une, signalez-la à contact@morashawiri.com : elle sera corrigée.',
            ],
          },
          {
            title: 'Droit applicable',
            body: 'Le site est édité depuis les Comores et s’adresse notamment aux personnes résidant aux Comores ainsi qu’à la diaspora comorienne.',
            todo: 'le droit applicable et la juridiction compétente en cas de litige. Cette détermination dépend de la structure juridique qui portera le projet : elle sera précisée en même temps que les mentions d’immatriculation.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Contact',
        items: [
          {
            title: 'Adresser une demande',
            body: 'Toute demande relative à ces mentions — rectification, autorisation, signalement, exercice d’un droit — peut être adressée par courrier électronique, par téléphone ou via le formulaire de contact du site. Une demande précise obtient une réponse précise.',
          },
        ],
      },

      { type: 'contact' },
    ],
    seo: {
      title: 'Mentions légales',
      description:
        'Éditeur, responsable de la publication, hébergement, objet du site, propriété intellectuelle, crédits visuels, liens externes et responsabilité du site HAFIDHU.',
    },
  },

  'politique-de-confidentialite': {
    slug: 'politique-de-confidentialite',
    crumb: 'Politique de confidentialité',
    kicker: 'Informations légales',
    title: 'Politique de confidentialité',
    lead: "HAFIDHU applique un principe simple : ne demander que ce qui est nécessaire, l’utiliser pour ce qui a été annoncé, et le dire clairement. Cette page décrit les informations que ce site collecte réellement, pourquoi il les collecte et ce qu’il en fait.",
    ctaText: 'Une question sur vos données ?',
    blocks: [
      {
        type: 'legal',
        title: 'Notre approche',
        items: [
          {
            title: 'Pourquoi cette page existe',
            body: [
              'Une politique de confidentialité n’a d’intérêt que si elle est lue. Celle-ci est donc écrite pour être comprise par un visiteur, pas seulement par un juriste.',
              'Elle décrit l’état réel du site aujourd’hui. Elle ne décrit pas des traitements hypothétiques et ne revendique aucune conformité qui n’aurait pas été vérifiée.',
            ],
          },
          {
            title: 'Le principe : collecter le moins possible',
            body: [
              'Un projet consacré à la conservation des traces se doit d’être exemplaire sur la façon dont il traite les informations qu’on lui confie. Le site ne demande donc que ce qui est nécessaire pour répondre à une demande ou tenir une liste d’attente.',
              'Il n’y a ni compte à créer, ni mot de passe à choisir, ni profil à remplir. Aucune information n’est demandée pour le simple fait de consulter une page.',
            ],
          },
          {
            title: 'Ce que nous ne faisons pas',
            body: 'Certaines pratiques courantes sur le web sont absentes de ce site. Il vaut mieux l’écrire que le laisser supposer.',
            listLead: 'Aujourd’hui, sur ce site :',
            list: [
              'aucune information n’est vendue, louée ni cédée à un tiers ;',
              'aucune prospection commerciale n’est effectuée ;',
              'aucun profilage ni aucune décision automatisée n’est appliqué ;',
              'aucun cookie publicitaire n’est déposé ;',
              'aucun outil de mesure d’audience tiers n’est installé ;',
              'aucune police de caractères ni aucun script n’est chargé depuis un domaine externe.',
            ],
          },
        ],
      },

      {
        type: 'legal',
        title: 'Informations que vous nous transmettez',
        items: [
          {
            title: 'Formulaire de contact',
            body: 'Ce formulaire sert à nous écrire. Il enregistre exactement les champs suivants :',
            list: [
              'prénom — obligatoire ;',
              'nom — obligatoire ;',
              'adresse électronique — obligatoire ;',
              'téléphone — facultatif ;',
              'sujet, choisi dans une liste fermée — obligatoire ;',
              'message — obligatoire ;',
              'date et heure d’envoi, ajoutées automatiquement.',
            ],
            after: 'Un statut de traitement interne (« Nouveau », « En cours », « Répondu »…) est associé au message pour permettre son suivi. Il est renseigné par l’équipe du projet, jamais par vous.',
          },
          {
            title: 'Formulaire de liste d’attente',
            body: 'Ce formulaire sert à être tenu informé de l’avancement du projet. Il enregistre exactement les champs suivants :',
            list: [
              'prénom — obligatoire ;',
              'nom — obligatoire ;',
              'adresse électronique — obligatoire ;',
              'pays de résidence — obligatoire ;',
              'profil, choisi dans une liste fermée : famille, organisateur, membre d’une communauté, diaspora, autre — obligatoire ;',
              'fonctionnalité qui vous serait la plus utile — facultatif ;',
              'date et heure d’inscription, ajoutées automatiquement.',
            ],
            after: 'Une même adresse électronique ne peut figurer qu’une seule fois dans la liste d’attente.',
          },
          {
            title: 'Rien d’autre n’est demandé',
            body: [
              'Ces deux formulaires sont les seuls points de collecte du site. Aucune autre page ne demande d’information personnelle.',
              'Les champs facultatifs peuvent rester vides : leur absence n’empêche pas l’envoi et n’a aucune conséquence sur le traitement de votre demande.',
            ],
          },
        ],
      },

      {
        type: 'legal',
        title: 'Données techniques',
        items: [
          {
            title: 'Ce que le site utilise réellement',
            body: 'Deux éléments techniques méritent d’être mentionnés, car ils ne relèvent pas de ce que vous saisissez.',
            list: [
              'L’adresse IP de la connexion est utilisée au moment de l’envoi d’un formulaire, pour limiter le nombre d’envois successifs depuis une même origine. Ce compteur vit en mémoire, de façon temporaire, et n’est enregistré dans aucune base de données.',
              'L’hébergeur produit des journaux techniques — requêtes reçues, erreurs serveur — nécessaires au fonctionnement et à la sécurité de la plateforme. Ces journaux relèvent de l’hébergeur et ne sont pas exploités pour analyser un comportement de navigation.',
            ],
          },
          {
            title: 'Ce que le site n’utilise pas',
            body: 'Pour lever toute ambiguïté, voici ce qui est absent de ce site.',
            list: [
              'Aucun outil de mesure d’audience : aucun service d’analyse tiers n’est installé.',
              'Aucun pixel de suivi ni balise publicitaire.',
              'Aucun bouton de réseau social embarqué : les renvois vers les plateformes sont de simples liens, qui ne chargent aucun script.',
              'Aucune police de caractères distante : la typographie est servie depuis le site lui-même.',
              'Aucune carte, vidéo ou ressource intégrée depuis un service externe.',
            ],
            after: 'Conséquence directe : consulter une page de ce site n’envoie aucune information à un tiers.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Pourquoi ces informations sont collectées',
        items: [
          {
            title: 'Finalités',
            body: 'Chaque information demandée sert une finalité précise, annoncée à l’avance.',
            list: [
              'Répondre à vos demandes : traiter les messages reçus par le formulaire de contact et vous apporter une réponse.',
              'Gérer la liste d’attente : conserver les inscriptions afin d’informer les personnes intéressées de l’avancement du projet et, le cas échéant, de son ouverture.',
              'Échanger avec les personnes intéressées : poursuivre une conversation entamée, préciser un besoin, organiser un échange.',
              'Comprendre les besoins : lire ce que les personnes attendent de HAFIDHU, notamment par le champ facultatif de la liste d’attente.',
              'Améliorer le projet : orienter les fonctionnalités développées en fonction des usages réellement exprimés.',
              'Assurer la sécurité : détecter et limiter les envois automatisés, les tentatives d’abus et les dysfonctionnements.',
            ],
            after: 'Aucune de ces finalités ne suppose de transmettre vos informations à un tiers à des fins commerciales, et aucune ne sert à vous adresser de la publicité.',
          },
          {
            title: 'Base légale',
            body: 'Les informations ne sont enregistrées qu’à la suite d’une action volontaire de votre part : remplir un formulaire et l’envoyer. Aucune collecte n’a lieu sans cette démarche.',
            todo: 'la base légale retenue pour chaque traitement. Cette qualification dépend du cadre juridique applicable au projet, qui n’est pas encore arrêté. Elle sera précisée ici, traitement par traitement, avant l’ouverture du service — plutôt qu’affirmée aujourd’hui sans vérification.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Conservation',
        items: [
          {
            title: 'Principe de conservation limitée',
            body: [
              'Une information n’est conservée que tant qu’elle sert la finalité pour laquelle elle a été transmise. Passé ce délai, elle a vocation à être supprimée.',
              'Concrètement : un message de contact est conservé le temps du traitement de la demande et de son suivi éventuel ; une inscription en liste d’attente est conservée jusqu’à l’ouverture du service ou jusqu’à votre demande de retrait, selon ce qui intervient en premier.',
              'Vous pouvez à tout moment demander la suppression de vos informations, sans avoir à motiver votre demande.',
            ],
            todo: 'les durées de conservation chiffrées, catégorie par catégorie. Elles seront fixées avec le cadre juridique du projet et publiées ici. Aucune durée arbitraire n’est annoncée en attendant.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Qui a accès à vos informations',
        items: [
          {
            title: 'L’équipe du projet',
            body: 'L’accès aux messages et aux inscriptions est réservé à l’administration du site, protégée par une authentification. Il n’existe aucun accès public, ni aucune page permettant de consulter ces informations sans être connecté.',
          },
          {
            title: 'Nos prestataires techniques',
            body: 'Faire fonctionner un site suppose des prestataires. Voici ceux qui interviennent réellement, et pour quoi.',
            list: [
              'Supabase — base de données et authentification de l’administration. Les données sont hébergées dans la région européenne (Irlande).',
              'Vercel — hébergement et distribution du site.',
              'Hostinger — serveur de messagerie utilisé pour envoyer la notification interne signalant l’arrivée d’un nouveau message ou d’une nouvelle inscription.',
            ],
            after: 'Ces prestataires agissent pour le compte du projet, dans le cadre de leurs propres conditions de service. Aucun autre destinataire n’existe.',
          },
          {
            title: 'Aucune cession',
            body: 'Vos informations ne sont ni vendues, ni louées, ni échangées, ni transmises à des tiers à des fins commerciales ou publicitaires. Elles ne quittent pas le périmètre décrit ci-dessus.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Sécurité',
        items: [
          {
            title: 'Mesures réellement mises en œuvre',
            body: 'Les mesures suivantes sont en place sur le site et ont été vérifiées.',
            list: [
              'Chiffrement des échanges : l’ensemble du site est servi en HTTPS, avec une politique de transport strict imposant systématiquement la connexion sécurisée.',
              'Authentification : l’accès à l’espace privé passe par une connexion par mot de passe gérée par Supabase, qui n’en conserve qu’une empreinte chiffrée. Aucun mot de passe ne figure dans le code du site.',
              'Contrôle des accès : chaque page d’administration revérifie la session côté serveur, indépendamment du filtre d’entrée. Une session absente ferme l’accès.',
              'Sécurité au niveau des lignes (RLS) : les tables refusent toute lecture et toute écriture depuis le navigateur, y compris avec la clé publique du site et y compris pour un compte connecté. Seul le serveur, avec une clé qui ne quitte jamais l’hébergement, peut y accéder.',
              'Séparation des secrets : aucune clé sensible n’est exposée au navigateur ; les clés serveur sont conservées comme variables chiffrées chez l’hébergeur.',
              'Espace administrateur privé : l’administration est exclue de l’indexation par les moteurs de recherche et n’est jamais mise en cache.',
              'Validation à l’arrivée : toute donnée envoyée par un formulaire est revalidée par le serveur, quelle que soit la validation déjà faite dans le navigateur.',
              'Limitation des envois et piège à robots : un compteur par origine et un champ invisible aux visiteurs limitent les soumissions automatisées.',
            ],
          },
          {
            title: 'Ce que nous ne promettons pas',
            body: [
              'Aucun système n’est invulnérable, et nous ne prétendrons pas le contraire. Les mesures ci-dessus réduisent le risque ; elles ne le suppriment pas.',
              'En cas d’incident de sécurité affectant vos informations, nous nous engageons à en informer les personnes concernées de façon claire et sans délai injustifié.',
            ],
          },
        ],
      },

      {
        type: 'legal',
        title: 'Cookies et traceurs',
        items: [
          {
            title: 'Situation actuelle',
            body: [
              'Ce site ne dépose aucun cookie publicitaire, aucun cookie de mesure d’audience et aucun traceur tiers. Aucune bannière de consentement n’est affichée, parce qu’il n’y a rien à consentir.',
              'La consultation des pages publiques n’entraîne le dépôt d’aucun cookie.',
            ],
          },
          {
            title: 'Le seul cas où un cookie est utilisé',
            body: [
              'L’espace d’administration, réservé à l’équipe du projet, utilise un cookie de session pour maintenir la connexion d’un administrateur authentifié. Il est strictement nécessaire au fonctionnement de cet espace.',
              'Ce cookie n’est jamais déposé lors de la visite des pages publiques : il ne concerne donc aucun visiteur.',
            ],
          },
          {
            title: 'Si cela devait changer',
            body: 'Si un outil de mesure d’audience venait un jour à être ajouté, cette page serait mise à jour avant sa mise en service et les moyens de s’y opposer y seraient indiqués.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Vos droits',
        items: [
          {
            title: 'Droits dont vous disposez',
            body: 'Sur les informations que vous nous avez transmises, vous pouvez demander :',
            list: [
              'l’accès : savoir quelles informations vous concernant sont enregistrées ;',
              'la rectification : corriger une information inexacte ou incomplète ;',
              'l’effacement : obtenir la suppression de vos informations ;',
              'la limitation : demander que vos informations soient conservées sans être utilisées ;',
              'l’opposition : vous opposer à un traitement ;',
              'la portabilité : recevoir une copie des informations que vous avez fournies, dans un format lisible.',
            ],
          },
          {
            title: 'Comment les exercer',
            body: [
              'Une seule adresse : contact@morashawiri.com. Indiquez ce que vous demandez ; il n’est pas nécessaire de motiver une demande de suppression.',
              'Nous traitons ces demandes dans les meilleurs délais. Nous pouvons vous demander un élément permettant de rattacher la demande à l’adresse enregistrée, uniquement pour éviter qu’un tiers n’obtienne ou ne supprime vos informations à votre place.',
            ],
            todo: 'le délai de réponse maximal engagé et l’autorité de contrôle compétente en cas de réclamation. Ces éléments dépendent du cadre juridique applicable, en cours de détermination.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Évolution de cette politique',
        items: [
          {
            title: 'Mise à jour',
            body: [
              'HAFIDHU est en construction. Cette politique évoluera avec le projet : nouvelles fonctionnalités, nouveaux prestataires, cadre juridique précisé.',
              'Toute modification substantielle — nouvelle catégorie de données collectées, nouvelle finalité, nouveau destinataire — sera publiée sur cette page avant d’entrer en vigueur.',
              'Les personnes inscrites à la liste d’attente en seront informées par courrier électronique lorsqu’un changement les concerne directement.',
            ],
          },
          {
            title: 'Une question',
            body: 'Toute question sur cette page, sur une information enregistrée ou sur une pratique décrite ici peut être adressée à contact@morashawiri.com.',
          },
        ],
      },

      { type: 'contact' },
    ],
    seo: {
      title: 'Politique de confidentialité',
      description:
        'Données réellement collectées par le site HAFIDHU, finalités, conservation, destinataires, sécurité, cookies et exercice de vos droits.',
    },
  },

  'conditions-d-utilisation': {
    slug: 'conditions-d-utilisation',
    crumb: "Conditions d'utilisation",
    kicker: 'Informations légales',
    title: "Conditions d'utilisation",
    lead: "Ces conditions décrivent ce que ce site propose, ce qu’il attend de ses visiteurs et les limites de ce à quoi il engage. HAFIDHU étant un projet en construction, elles portent aujourd’hui sur le site de présentation ; des conditions distinctes accompagneront l’ouverture du service.",
    ctaText: 'Une question sur ces conditions ?',
    blocks: [
      {
        type: 'legal',
        title: 'Objet et champ d’application',
        items: [
          {
            title: 'Objet',
            body: [
              'Les présentes conditions encadrent l’accès au site HAFIDHU et son utilisation. Elles s’appliquent à toute personne qui consulte une page du site ou utilise l’un de ses formulaires.',
              'Consulter le site vaut acceptation de ces conditions. Si vous ne les acceptez pas, il vous suffit de ne pas l’utiliser.',
            ],
          },
          {
            title: 'Ce que ces conditions couvrent aujourd’hui',
            body: 'À ce jour, elles portent sur un site de présentation : la consultation de ses pages, l’envoi d’un message et l’inscription à la liste d’attente. Elles ne couvrent aucun service de gestion, aucun compte utilisateur et aucune transaction, puisqu’aucun n’existe.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Présentation de HAFIDHU',
        items: [
          {
            title: 'Un projet en construction',
            body: [
              'HAFIDHU est un projet numérique consacré à la conservation des traces qui comptent : contributions, cotisations, événements, engagements et mémoire collective.',
              'Le projet est en construction. Ce que le site décrit relève d’une conception en cours, non d’un service en fonctionnement.',
            ],
          },
          {
            title: 'Ce qui existe aujourd’hui',
            body: 'Concrètement, le site met à disposition :',
            list: [
              'des pages présentant l’intention du projet et les usages envisagés ;',
              'des aperçus d’interface, explicitement signalés comme des maquettes ;',
              'un formulaire de contact ;',
              'un formulaire d’inscription à la liste d’attente.',
            ],
            after: 'Rien d’autre n’est accessible, et aucune fonctionnalité de suivi n’est en service.',
          },
          {
            title: 'Ce qui n’existe pas encore',
            body: 'Il n’y a ni compte utilisateur, ni espace personnel, ni service de paiement, ni offre commerciale. Aucun tarif n’est annoncé et aucune souscription n’est possible. Les délais d’ouverture ne sont pas arrêtés.',
            note: 'Les maquettes visibles sur le site portent la mention « Aperçu » et affichent des données d’exemple. Elles ne représentent aucune personne, aucune somme et aucun événement réels.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Accès au site',
        items: [
          {
            title: 'Conditions d’accès',
            body: [
              'L’accès aux pages publiques est libre et gratuit. Il ne nécessite ni inscription, ni création de compte.',
              'Les frais liés à l’accès à Internet, au matériel et à la connexion restent à la charge du visiteur.',
            ],
          },
          {
            title: 'Compatibilité',
            body: 'Le site est conçu pour fonctionner sur un navigateur récent, sur téléphone, tablette et ordinateur. Un navigateur ancien, ou une configuration bloquant l’exécution des scripts, peut dégrader certaines fonctions — en particulier l’envoi des formulaires.',
          },
          {
            title: 'Espace d’administration',
            body: 'Le site comporte un espace d’administration réservé à l’équipe du projet. Il est protégé par une authentification et n’est pas destiné au public. Toute tentative d’accès non autorisé est interdite.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Utilisation du site',
        items: [
          {
            title: 'Engagements de l’utilisateur',
            body: 'En utilisant ce site, vous vous engagez à :',
            list: [
              'fournir des informations exactes lorsque vous remplissez un formulaire, et notamment une adresse électronique valide et vous appartenant ;',
              'ne pas frauder : ne pas usurper l’identité d’un tiers, ne pas soumettre d’informations volontairement fausses, ne pas détourner les formulaires de leur objet ;',
              'ne pas contourner les mesures de sécurité, ni tenter d’accéder à une partie non publique du site, à la base de données ou à l’espace d’administration ;',
              'ne pas perturber le fonctionnement du site, notamment par des envois automatisés, une sollicitation massive des formulaires, l’injection de contenu ou toute action visant à le rendre indisponible ;',
              'respecter les droits d’autrui, en n’envoyant aucun contenu diffamatoire, injurieux, discriminatoire ou menaçant, ni aucune information personnelle concernant un tiers sans son accord.',
            ],
          },
          {
            title: 'Usage attendu des contenus',
            body: 'Les contenus du site sont mis à disposition pour information. Leur reproduction et leur réutilisation sont encadrées par les mentions légales, rubrique « Propriété intellectuelle ».',
          },
          {
            title: 'En cas de manquement',
            body: 'Un usage contraire à ces engagements peut conduire au blocage des envois depuis l’origine concernée et à la suppression des données transmises, sans préavis. Les faits susceptibles de constituer une infraction peuvent être signalés aux autorités compétentes.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Formulaires',
        items: [
          {
            title: 'Formulaire de contact',
            body: [
              'Il permet d’adresser une question, une proposition de partenariat, une demande de presse ou un souhait de participer à la validation du produit.',
              'L’envoi déclenche l’enregistrement du message et une notification interne. Un accusé de réception s’affiche à l’écran : il confirme la bonne réception, non une réponse. Les réponses sont apportées manuellement, sans délai garanti.',
            ],
          },
          {
            title: 'Formulaire de liste d’attente',
            body: [
              'Il permet d’être informé de l’avancement du projet. L’inscription est gratuite et n’engage à rien : elle ne constitue ni une réservation, ni une commande, ni une garantie d’accès prioritaire au service.',
              'Une même adresse électronique ne peut être inscrite qu’une seule fois. Vous pouvez demander votre retrait à tout moment en écrivant à contact@morashawiri.com.',
            ],
          },
          {
            title: 'Traitement des informations envoyées',
            body: 'Les informations transmises par ces formulaires sont traitées selon la politique de confidentialité du site, qui en détaille la nature, les finalités, les destinataires et les droits dont vous disposez.',
          },
          {
            title: 'Contrôles appliqués',
            body: 'Les envois font l’objet d’une validation côté serveur, d’une limitation du nombre de soumissions par origine et d’un dispositif de détection des envois automatisés. Ces mesures visent uniquement à préserver le bon fonctionnement du site.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Propriété intellectuelle',
        items: [
          {
            title: 'Éléments protégés',
            body: 'La marque HAFIDHU, son logo, son identité visuelle, ses textes, son design, son interface, ses maquettes, ses éléments graphiques et l’organisation de ses pages sont protégés. Ils demeurent la propriété du projet ou de leurs titulaires respectifs.',
          },
          {
            title: 'Ce que l’utilisation du site n’accorde pas',
            body: 'L’accès au site ne confère aucun droit sur ces éléments. Il n’emporte aucune cession, aucune licence d’exploitation et aucune autorisation de reproduction au-delà de la consultation et de l’usage strictement personnel.',
          },
          {
            title: 'Demandes d’autorisation',
            body: 'Toute reproduction, adaptation ou diffusion en dehors de ce cadre suppose une autorisation écrite préalable, à demander à contact@morashawiri.com. Le détail figure dans les mentions légales.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Responsabilité',
        items: [
          {
            title: 'Le rôle de HAFIDHU',
            body: [
              'Ce point est central, et il vaut aussi bien pour le site que pour le service à venir.',
              'HAFIDHU est un outil de consignation, d’organisation et de suivi. Il enregistre ce qu’on lui confie, le range de façon lisible et le conserve. C’est tout, et c’est délibéré.',
            ],
          },
          {
            title: 'Ce que HAFIDHU ne fait pas',
            body: 'Pour être explicite :',
            list: [
              'HAFIDHU ne décide pas à la place des familles, des groupes ou des communautés.',
              'HAFIDHU n’arbitre pas les conflits entre membres et ne tranche aucun désaccord.',
              'HAFIDHU ne valide pas le bien-fondé d’une contribution, d’un montant ou d’un engagement.',
              'HAFIDHU ne se substitue à aucune autorité familiale, coutumière, associative ou administrative.',
              'HAFIDHU ne certifie pas l’exactitude des informations que ses utilisateurs y consignent.',
            ],
            after: 'Les décisions relatives aux cotisations, aux contributions, aux engagements et aux événements restent entièrement sous la responsabilité des personnes et des groupes concernés. Un désaccord sur un montant, une participation ou une organisation se règle entre les personnes, selon leurs propres règles.',
          },
          {
            title: 'Exactitude des informations du site',
            body: 'Les informations publiées sur ce site sont fournies de bonne foi et vérifiées avec soin. Elles n’emportent toutefois aucune garantie d’exhaustivité ni d’absence d’erreur. Une erreur signalée à contact@morashawiri.com sera corrigée.',
          },
          {
            title: 'Absence d’engagement contractuel',
            body: 'La présentation d’une fonctionnalité sur ce site ne constitue ni une offre, ni une promesse de livraison, ni un engagement sur un délai, un périmètre ou un tarif. Le projet peut évoluer, être reporté ou être modifié.',
          },
          {
            title: 'Usage du site',
            body: 'Le site est mis à disposition en l’état. Sa consultation relève de la responsabilité du visiteur, qui reste responsable de la sécurité de son propre équipement, notamment vis-à-vis des programmes malveillants.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Disponibilité et maintenance',
        items: [
          {
            title: 'Disponibilité',
            body: [
              'Nous nous efforçons de maintenir le site accessible en permanence. Aucune disponibilité continue n’est pour autant garantie.',
              'Une interruption peut résulter d’une opération de maintenance, d’une mise à jour, d’une défaillance technique, d’une panne réseau ou d’un incident chez un prestataire d’hébergement.',
            ],
          },
          {
            title: 'Maintenance',
            body: [
              'Des opérations de maintenance peuvent être menées à tout moment, sans préavis lorsque l’urgence le justifie.',
              'Lorsqu’une interruption prolongée est planifiée, l’information est donnée sur le site dans la mesure du possible.',
            ],
          },
          {
            title: 'Conséquences d’une indisponibilité',
            body: 'Une indisponibilité temporaire n’ouvre droit à aucune indemnité : le site est gratuit, sans engagement et ne conditionne aucun service en cours.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Évolution du projet et des conditions',
        items: [
          {
            title: 'Évolution du projet',
            body: [
              'HAFIDHU est en construction : son périmètre, ses fonctionnalités et son calendrier peuvent évoluer. Des rubriques peuvent être ajoutées, modifiées ou retirées.',
              'Le passage éventuel du site de présentation à un service en fonctionnement s’accompagnera de conditions spécifiques, distinctes de celles-ci, qui devront être acceptées séparément.',
            ],
          },
          {
            title: 'Modification des conditions',
            body: [
              'Ces conditions peuvent être modifiées pour tenir compte de l’évolution du projet, du site ou du cadre juridique applicable.',
              'La version applicable est celle publiée sur cette page au moment de votre visite. Toute modification substantielle sera signalée sur cette page.',
              'Poursuivre l’utilisation du site après une modification vaut acceptation de la version en vigueur.',
            ],
            todo: 'les modalités de notification individuelle des modifications aux personnes inscrites à la liste d’attente, à arrêter avec le cadre juridique du projet.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Liens externes',
        items: [
          {
            title: 'Liens sortants',
            body: [
              'Le site renvoie vers des espaces publics du porteur de projet sur des plateformes tierces — réseaux sociaux et messagerie.',
              'Ces liens sont proposés pour votre commodité. Une fois suivis, vous quittez le site HAFIDHU et relevez des conditions du site de destination, sur lesquelles nous n’avons aucun contrôle.',
            ],
          },
          {
            title: 'Responsabilité sur les contenus tiers',
            body: 'HAFIDHU ne peut être tenu responsable du contenu, des pratiques ni de la disponibilité des sites tiers accessibles depuis ses pages.',
          },
        ],
      },

      {
        type: 'legal',
        title: 'Droit applicable et contact',
        items: [
          {
            title: 'Droit applicable',
            body: 'Le site est édité depuis les Comores.',
            todo: 'le droit applicable et la juridiction compétente en cas de litige, qui dépendent de la structure juridique portant le projet. La détermination sera publiée en même temps que les mentions d’immatriculation.',
          },
          {
            title: 'Règlement amiable',
            body: 'En cas de difficulté ou de désaccord relatif au site, nous vous invitons à écrire d’abord à contact@morashawiri.com. La très grande majorité des situations se règle par un échange direct.',
          },
          {
            title: 'Nous contacter',
            body: 'Pour toute question sur ces conditions : contact@morashawiri.com, ou +269 430 63 06.',
          },
        ],
      },

      { type: 'contact' },
    ],
    seo: {
      title: "Conditions d'utilisation",
      description:
        'Objet, état du projet, accès, engagements de l’utilisateur, formulaires, propriété intellectuelle, responsabilité, disponibilité et évolution des conditions du site HAFIDHU.',
    },
  },
};

export function getEditorialPage(slug: string): EditorialPage | undefined {
  return editorialPages[slug];
}
