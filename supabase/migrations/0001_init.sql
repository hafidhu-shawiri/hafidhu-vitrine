-- ═══════════════════════════════════════════════════════════════════
-- HAFIDHU — Site vitrine
-- Migration 0001 : tables « contacts » et « waitlist »
--
-- Modèle de sécurité
-- ------------------
-- La RLS est activée sur les deux tables et AUCUNE politique n'est
-- ouverte aux rôles « anon » et « authenticated ». Concrètement :
--
--   • un visiteur ne peut ni lire, ni écrire, ni modifier quoi que ce
--     soit directement depuis le navigateur, même avec la clé anon ;
--   • les soumissions de formulaire passent par les routes serveur de
--     l'application, qui utilisent la clé service_role après validation,
--     nettoyage et limitation de débit ;
--   • la lecture par l'administration passe elle aussi par le serveur,
--     après vérification de la session.
--
-- Ce choix est plus strict qu'une politique INSERT publique : il rend
-- l'écriture directe depuis le navigateur structurellement impossible.
-- ═══════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ───────────────────────────────────────────────────────────────────
-- CONTACTS
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  first_name  text not null,
  last_name   text not null,
  email       text not null,
  phone       text,
  subject     text not null,
  message     text not null,

  source      text not null default 'Contact',
  status      text not null default 'Nouveau',
  notes       text,

  constraint contacts_first_name_len check (char_length(first_name) between 1 and 80),
  constraint contacts_last_name_len  check (char_length(last_name)  between 1 and 80),
  constraint contacts_email_len      check (char_length(email)      between 3 and 180),
  constraint contacts_email_format   check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  constraint contacts_phone_len      check (phone is null or char_length(phone) <= 40),
  constraint contacts_subject_len    check (char_length(subject)    between 1 and 120),
  constraint contacts_message_len    check (char_length(message)    between 10 and 5000),
  constraint contacts_notes_len      check (notes is null or char_length(notes) <= 5000),

  constraint contacts_source_allowed check (
    source in ('Contact', 'Liste d''attente', 'Validation produit', 'Partenariat')
  ),
  constraint contacts_status_allowed check (
    status in ('Nouveau', 'À traiter', 'En cours', 'Répondu', 'Archivé')
  )
);

comment on table public.contacts is
  'Messages reçus via le formulaire de contact du site vitrine. Données privées.';

-- Index : la liste d'administration trie par date et filtre par statut.
create index if not exists contacts_created_at_idx on public.contacts (created_at desc);
create index if not exists contacts_status_idx     on public.contacts (status);
create index if not exists contacts_email_idx      on public.contacts (email);

-- Recherche plein texte sur nom, e-mail, sujet et message.
create index if not exists contacts_search_idx on public.contacts
  using gin (
    to_tsvector(
      'simple',
      coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' ||
      coalesce(email, '')      || ' ' || coalesce(subject, '')   || ' ' ||
      coalesce(message, '')
    )
  );

-- ───────────────────────────────────────────────────────────────────
-- WAITLIST
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.waitlist (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  first_name        text not null,
  last_name         text not null,
  email             text not null,
  country           text not null,
  profile           text not null,
  feature_interest  text,

  constraint waitlist_first_name_len check (char_length(first_name) between 1 and 80),
  constraint waitlist_last_name_len  check (char_length(last_name)  between 1 and 80),
  constraint waitlist_email_len      check (char_length(email)      between 3 and 180),
  constraint waitlist_email_format   check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  constraint waitlist_country_len    check (char_length(country)    between 1 and 80),
  constraint waitlist_feature_len    check (feature_interest is null or char_length(feature_interest) <= 2000),

  constraint waitlist_profile_allowed check (
    profile in ('Famille', 'Organisateur', 'Membre d''une communauté', 'Diaspora', 'Autre')
  )
);

comment on table public.waitlist is
  'Inscriptions à la liste d''attente. Données privées : ne jamais exposer publiquement.';

-- Une adresse ne peut s'inscrire qu'une fois (insensible à la casse).
create unique index if not exists waitlist_email_unique_idx
  on public.waitlist (lower(email));

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);
create index if not exists waitlist_profile_idx    on public.waitlist (profile);
create index if not exists waitlist_country_idx    on public.waitlist (country);

-- ───────────────────────────────────────────────────────────────────
-- Mise à jour automatique de updated_at
-- ───────────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contacts_touch_updated_at on public.contacts;
create trigger contacts_touch_updated_at
  before update on public.contacts
  for each row execute function public.touch_updated_at();

-- ───────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ───────────────────────────────────────────────────────────────────
alter table public.contacts enable row level security;
alter table public.waitlist enable row level security;

-- Aucune politique n'est créée volontairement.
-- Sans politique, la RLS refuse tout accès aux rôles « anon » et
-- « authenticated ». Seule la clé service_role, utilisée exclusivement
-- côté serveur, peut lire et écrire.
--
-- « force » étend la RLS au propriétaire de la table. Les rôles
-- « service_role » et « postgres » disposent de l'attribut BYPASSRLS :
-- l'application côté serveur et l'éditeur SQL de Supabase continuent
-- donc de fonctionner normalement.
alter table public.contacts force row level security;
alter table public.waitlist force row level security;

-- Ceinture et bretelles : on retire aussi les droits de table.
revoke all on public.contacts from anon, authenticated;
revoke all on public.waitlist from anon, authenticated;
