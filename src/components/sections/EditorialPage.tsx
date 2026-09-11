/**
 * Rendu des pages éditoriales à partir de blocs typés.
 *
 * Le prototype rendait tous les intitulés de cartes dans des <p> en gras :
 * aucune hiérarchie de titres n'existait. Ici, chaque bloc porte un vrai
 * h2 et chaque carte un h3 lorsque c'est sémantiquement juste.
 */

import type { Block, EditorialPage as EditorialPageType } from '@/content/pages';
import { contact, socials } from '@/content/contact';
import {
  Card,
  CardBody,
  Container,
  NoticeBox,
  Section,
  SectionTitle,
} from '@/components/ui/primitives';
import { Icon } from '@/components/ui/Icon';
import { InlineCta, PageHeader, StepList } from './shared';

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'prose':
      return (
        <div className="flex flex-col gap-4">
          {block.items.map((item, i) => (
            <p key={i} className="text-[1rem] leading-[1.75] text-muted">
              {item.body}
            </p>
          ))}
        </div>
      );

    case 'cards':
      return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item) => (
            <li key={item.title}>
              <Card className="h-full">
                <h3 className="text-[1rem] font-semibold text-navy">{item.title}</h3>
                <CardBody className="mt-2">{item.body}</CardBody>
              </Card>
            </li>
          ))}
        </ul>
      );

    case 'categories':
      return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item) => (
            <li key={item.title}>
              <Card className="h-full">
                <span
                  aria-hidden="true"
                  className="mb-3 block h-0.5 w-6 bg-gold"
                />
                <h3 className="text-[1rem] font-semibold text-navy">{item.title}</h3>
                <CardBody className="mt-2">{item.body}</CardBody>
              </Card>
            </li>
          ))}
        </ul>
      );

    case 'steps':
      return <StepList items={block.items} />;

    case 'legal':
      return (
        <div className="flex flex-col gap-7">
          {block.items.map((item) => (
            <div key={item.title}>
              <h3 className="text-[1.0625rem] font-semibold text-navy">{item.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-[1.7] text-muted">{item.body}</p>
              {item.todo ? (
                <NoticeBox className="mt-3">
                  <span className="font-semibold">À compléter :</span> {item.todo}
                </NoticeBox>
              ) : null}
            </div>
          ))}
        </div>
      );

    case 'contact':
      return (
        <ul className="grid gap-4 sm:grid-cols-2">
          <li>
            <Card className="h-full">
              <Icon name="mail" size={20} className="text-teal" />
              <h3 className="mt-3 text-[1rem] font-semibold text-navy">Écrire</h3>
              <a
                href={`mailto:${contact.email}`}
                className="mt-1.5 block text-[0.9375rem] no-underline hover:underline"
              >
                {contact.email}
              </a>
            </Card>
          </li>
          <li>
            <Card className="h-full">
              <Icon name="phone" size={20} className="text-teal" />
              <h3 className="mt-3 text-[1rem] font-semibold text-navy">Téléphone & WhatsApp</h3>
              <a
                href={contact.phoneHref}
                className="mt-1.5 block text-[0.9375rem] no-underline hover:underline"
              >
                {contact.phone}
              </a>
            </Card>
          </li>
        </ul>
      );

    default:
      return null;
  }
}

export function EditorialPageView({
  page,
  children,
}: {
  page: EditorialPageType;
  children?: React.ReactNode;
}) {
  return (
    <>
      <PageHeader
        crumb={[{ name: page.crumb }]}
        kicker={page.kicker}
        title={page.title}
        lead={page.lead}
      />

      <Section spacing="loose">
        <Container width="prose">
          <div className="flex flex-col gap-11 sm:gap-14">
            {page.blocks.map((block, i) => (
              <div key={i}>
                {'title' in block && block.title ? (
                  <SectionTitle as="h2" className="mb-5 text-[1.3125rem]! sm:text-[1.5rem]!">
                    {block.title}
                  </SectionTitle>
                ) : null}
                <BlockRenderer block={block} />
              </div>
            ))}

            {children}

            <InlineCta text={page.ctaText} />

            {page.slug.startsWith('mentions') ||
            page.slug.startsWith('politique') ||
            page.slug.startsWith('conditions') ? (
              <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8125rem] text-muted">
                <span>Une question&nbsp;? Écrivez-nous :</span>
                <a href={`mailto:${contact.email}`} className="no-underline hover:underline">
                  {contact.email}
                </a>
                <a
                  href={socials[0]?.href ?? contact.website.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline hover:underline"
                >
                  {contact.website.label}
                </a>
              </p>
            ) : null}
          </div>
        </Container>
      </Section>
    </>
  );
}
