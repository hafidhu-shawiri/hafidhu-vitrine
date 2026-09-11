import type { Metadata } from 'next';
import { conceptChain } from '@/content/modules';
import { routes } from '@/content/navigation';
import {
  Breadcrumb,
  ChainDiagram,
  FinalCta,
  ModuleGrid,
} from '@/components/sections/shared';
import { Container, Section, SectionTitle } from '@/components/ui/primitives';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Solutions — Un écosystème, une même logique',
  description:
    'Les six modules de HAFIDHU partagent la même colonne vertébrale : une personne appartient à un groupe, un groupe organise un événement ou une cotisation, chaque contribution possède un statut.',
  path: routes.solutions,
});

export default function SolutionsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'Solutions', path: routes.solutions },
        ])}
      />

      <Section spacing="tight" className="pb-0!">
        <Container>
          <Breadcrumb trail={[{ name: 'Solutions' }]} />

          <SectionTitle as="h1" className="mt-5">
            Un écosystème, une même logique.
          </SectionTitle>

          <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-muted">
            Chaque module de HAFIDHU répond à un usage précis, mais tous partagent la même colonne
            vertébrale : une personne appartient à un groupe, un groupe organise un événement ou une
            cotisation, chaque contribution possède un statut, et tout reste consultable dans
            l’historique.
          </p>

          <div className="mt-8">
            <ChainDiagram items={conceptChain} />
          </div>
        </Container>
      </Section>

      <Section spacing="loose">
        <Container>
          <h2 className="sr-only">Les six modules</h2>
          <ModuleGrid showExample />
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
