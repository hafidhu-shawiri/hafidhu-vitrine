# HAFIDHU — Site vitrine

> **HAFIDHU — Le Gardien**
> Le Gardien des traces qui comptent.

Site vitrine officiel du projet HAFIDHU, plateforme conçue pour organiser et
conserver les cotisations, contributions, événements et engagements collectifs
des familles et des communautés.

Projet porté par **MORA Shawiri**.

> ⚠️ **Ce dépôt ne contient aucun identifiant, aucune clé et aucun mot de passe.**
> Toutes les valeurs sensibles vivent dans `.env.local`, qui n'est jamais versionné.

---

## Démarrage

```bash
npm install                  # dépendances
cp .env.example .env.local   # puis renseigner les valeurs
npm run assets               # prépare logos et images depuis 02_Images HAFIDHU
npm run dev                  # http://localhost:3000
```

`npm run assets` lit `../02_Images HAFIDHU` et écrit dans `public/`. Il ne
crée, ne retouche et ne recadre aucune image : il convertit et redimensionne,
rien de plus.

---

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Sert le build de production |
| `npm run typecheck` | Vérification TypeScript |
| `npm run assets` | Prépare logos et images, génère le manifeste |
| `npm run check:terms` | Vérifie l'absence du terme interdit |
| `npm run check:secrets` | Vérifie qu'aucun secret ne fuit côté client |
| `npm run verify` | Enchaîne les trois contrôles ci-dessus |
| `node scripts/capture.mjs` | Captures de recette → `05_Captures du Site Vitrine` |
| `node scripts/create-admin.mjs` | Crée le compte administrateur (une seule fois) |

---

## Architecture

```
src/
├── app/
│   ├── (site)/          Pages publiques (en-tête + pied de page)
│   ├── admin/           Espace privé (aucun en-tête public, non indexé)
│   ├── api/             Routes d'écriture serveur
│   ├── sitemap.ts  robots.ts  manifest.ts
│   └── layout.tsx
├── components/
│   ├── layout/  ui/  sections/  forms/  gallery/  admin/
├── content/             Tout le texte du site
│   └── generated/       Manifeste d'images (produit par npm run assets)
├── lib/                 Supabase, e-mail, SEO, validation, limitation de débit
└── middleware.ts        Session et protection de /admin
```

**Principe :** tout le texte vit dans `src/content/`. Modifier une phrase ne
demande jamais de toucher à un composant.

### Pages

| # | Page | Route |
|---|---|---|
| 1 | Accueil | `/` |
| 2 | Notre vision | `/notre-vision` |
| 3 | Solutions | `/solutions` |
| 4 | Mtsango | `/solutions/mtsango` |
| 5 | Anda | `/solutions/anda` |
| 6 | Mafunvu | `/solutions/mafunvu` |
| 7 | Diaspora | `/solutions/diaspora` |
| 8 | Paiements | `/solutions/paiements` |
| 9 | Historique & mémoire familiale | `/solutions/historique-memoire-familiale` |
| 10 | Comment ça marche | `/comment-ca-marche` |
| 11 | Pour qui ? | `/pour-qui` |
| 12 | Sécurité & confidentialité | `/securite-confidentialite` |
| 13 | FAQ | `/faq` |
| 14 | Ressources | `/ressources` |
| 15 | Contact | `/contact` |
| 16 | Rejoindre la liste d'attente | `/rejoindre-la-liste-d-attente` |
| 17 | Mentions légales | `/mentions-legales` |
| 18 | Politique de confidentialité | `/politique-de-confidentialite` |
| 19 | Conditions d'utilisation | `/conditions-d-utilisation` |
| 20 | Galerie | `/galerie` |

La **Galerie figure dans le menu principal**, pas uniquement dans le pied de page.

---

## Base de données

Appliquer `supabase/migrations/0001_init.sql` dans l'éditeur SQL du projet
Supabase. Deux tables : `contacts` et `waitlist`.

### Modèle de sécurité

La RLS est activée sur les deux tables et **aucune politique n'est ouverte**
aux rôles `anon` et `authenticated`. Concrètement :

- un visiteur ne peut ni lire, ni écrire, ni modifier quoi que ce soit
  directement depuis le navigateur, même en possession de la clé `anon` ;
- les soumissions passent par les routes serveur (`/api/contact`,
  `/api/waitlist`), qui utilisent la clé `service_role` **après** validation,
  nettoyage et limitation de débit ;
- la lecture par l'administration passe elle aussi par le serveur, après
  vérification de la session.

Ce choix est plus strict qu'une politique `INSERT` publique : il rend
l'écriture directe depuis le navigateur structurellement impossible.

---

## Administration

`/admin` — titre : **Dashboard MORA Shawiri — Site HAFIDHU**

Création du compte, une seule fois :

```bash
# renseigner ADMIN_USERNAME et ADMIN_PASSWORD dans .env.local
node scripts/create-admin.mjs
# puis vider ADMIN_PASSWORD : Supabase Auth a pris le relais
```

Le mot de passe est confié à **Supabase Auth**, qui le conserve sous forme de
hachage bcrypt. Il n'existe en clair ni dans le code, ni dans le dépôt, ni en
base, ni dans les journaux. Il se change ensuite depuis Supabase, **sans
modifier le code**.

Protections en place :

- vérification de session dans le middleware **et** dans chaque page — se
  reposer sur le seul middleware serait une erreur de conception ;
- `noindex`, `nofollow`, `no-store` sur tout `/admin` ;
- message d'erreur identique quel que soit l'échec : il ne révèle pas si un
  compte existe ;
- cookies de session `httpOnly`, `secure`, `sameSite=lax`.

---

## Domaine et SEO

**Aucune URL absolue n'est écrite en dur.** Tout — canoniques, sitemap, Open
Graph, JSON-LD — dérive de `NEXT_PUBLIC_SITE_URL`, avec repli automatique sur
`VERCEL_URL` puis `localhost`.

| Phase | `NEXT_PUBLIC_SITE_URL` |
|---|---|
| Actuelle | `https://<projet>.vercel.app` |
| Finale | `https://hafidhu.com` |

Le passage au domaine définitif se fait en **changeant cette seule variable**,
sans reconstruction ni refonte.

Les déploiements d'aperçu (`VERCEL_ENV=preview`) renvoient automatiquement un
`robots.txt` interdisant toute indexation et un sitemap vide.

---

## Déploiement Vercel

1. Pousser le dépôt sur GitHub.
2. Importer le projet dans Vercel (équipe **EQUI-HAFIDHU**).
3. Renseigner les variables d'environnement (voir `.env.example`) —
   `SUPABASE_SERVICE_ROLE_KEY` et les identifiants SMTP en **Production**
   uniquement.
4. Déployer, puis renseigner `NEXT_PUBLIC_SITE_URL` avec l'URL obtenue et
   redéployer une fois.

Aucune configuration particulière n'est requise : Next.js est détecté
automatiquement.

---

## Conventions de contenu

Ces règles ne sont pas décoratives : elles font partie du produit.

- **Aucune invention.** Ni statistique, ni client, ni partenaire, ni
  témoignage, ni certification, ni tarif, ni date, ni intégration de paiement.
- **Aperçus signalés.** Toute maquette d'interface porte la mention
  « Aperçu » et une note rappelant que les données sont illustratives.
- **Terme officiel : MAFUNVU.** `npm run check:terms` échoue si le terme
  interdit réapparaît, et vérifie aussi que le terme officiel est présent.
- **Images.** Aucune image n'est générée ni retouchée. Les personnes
  photographiées ne sont jamais nommées et aucune information ne leur est
  attribuée.
- **Statuts.** L'information ne dépend jamais de la seule couleur : chaque
  statut associe une icône, un libellé et une couleur.

---

## Identité visuelle

Source de vérité : `01_Documentations/32_Charte_graphique_de_HAFIDHU.md` et
`33_Design_System_de_HAFIDHU.md`.

| Rôle | Couleur |
|---|---|
| Principale | `#0F4C5C` Bleu pétrole |
| Structure | `#102A43` Bleu nuit |
| Accent | `#D4A72C` Or chaud |
| Fond | `#F8F7F2` Ivoire |
| Surface | `#FFFFFF` Blanc |
| Texte | `#24323D` Anthracite |
| Texte secondaire | `#62727F` Gris bleuté |

**L'or est un accent, jamais une dominante**, et n'est jamais employé comme
couleur de texte sur fond clair (contraste 2,24:1 — insuffisant). Toutes les
autres combinaisons de la palette sont conformes WCAG AA.

Typographie : **Inter**, auto-hébergée via `next/font`.

Les logos officiels ne sont ni redessinés, ni recolorés, ni déformés. Les
fichiers `.svg` fournis encapsulant un bitmap PNG en base64, le script
`assets` extrait ce PNG **à l'identique** pour alléger la charge et permettre
l'optimisation par Next.js.

---

## Points restant à traiter

Suivis en détail dans `06_Rapports du Site Vitrine/`.

- **Droit à l'image** — les photographies montrent des personnes réelles et
  identifiables. Autorisations à confirmer avant l'ouverture publique.
- **Images de hero** — `Zone Hero` ne contient que 2 images, toutes deux en
  portrait. 4 à 6 images paysage permettraient de différencier les heroes.
- **Logo** — une vraie version vectorielle et une déclinaison monochrome
  claire restent à produire.
- **Mentions légales** — dénomination, forme juridique et immatriculation à
  renseigner (emplacements signalés « À compléter » sur le site).
