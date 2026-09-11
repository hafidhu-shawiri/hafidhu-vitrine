import type { Metadata } from 'next';
import { faq } from '@/content/faq';
import { primaryCta, routes } from '@/content/navigation';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { Breadcrumb, FinalCta } from '@/components/sections/shared';
import { ButtonLink, Container, Section, SectionTitle } from '@/components/ui/primitives';
import { breadcrumbJsonLd, faqJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Questions fréquentes',
  description:
    'Ce qu’est HAFIDHU, à qui il s’adresse, comment fonctionnent les modules Mtsango, Anda et Mafunvu, ce qu’il en est des paiements, de la sécurité et de la disponibilité du produit.',
  path: routes.faq,
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'FAQ', path: routes.faq },
        ])}
      />

      <Section spacing="tight" className="pb-0!">
        <Container width="narrow">
          <Breadcrumb trail={[{ name: 'FAQ' }]} />
          <SectionTitle as="h1" className="mt-5">
            Questions fréquentes
          </SectionTitle>
          <p className="mt-5 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-muted">
            Si une réponse manque, la question vaut la peine d’être posée : elle nous aide à
            construire HAFIDHU.
          </p>
        </Container>
      </Section>

      <Section spacing="loose">
        <Container width="narrow">
          <FaqAccordion entries={faq} />

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={routes.contact} variant="secondary">
              Poser une question
            </ButtonLink>
            <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
          </div>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
