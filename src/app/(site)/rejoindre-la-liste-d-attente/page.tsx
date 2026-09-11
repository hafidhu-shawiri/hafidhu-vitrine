import type { Metadata } from 'next';
import { routes } from '@/content/navigation';
import { WaitlistForm } from '@/components/forms/WaitlistForm';
import { Breadcrumb } from '@/components/sections/shared';
import { Container, Section, SectionTitle } from '@/components/ui/primitives';
import { Icon } from '@/components/ui/Icon';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: "Rejoindre la liste d'attente",
  description:
    'HAFIDHU est en construction. Rejoignez la liste d’attente pour suivre son évolution et participer à la construction d’un outil pensé pour nos réalités.',
  path: routes.waitlist,
});

const notes = [
  "Aucune offre commerciale n'est proposée à ce stade.",
  "Vous recevrez des informations sur l'avancement du produit, rien de plus.",
  'Vos réponses aident à prioriser les fonctionnalités.',
];

export default function WaitlistPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: "Rejoindre la liste d'attente", path: routes.waitlist },
        ])}
      />

      <Section spacing="loose">
        <Container width="prose">
          <Breadcrumb trail={[{ name: "Rejoindre la liste d'attente" }]} />

          <div className="mt-6 grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
            <div>
              <p>
                <span className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">
                  <span aria-hidden="true" className="block h-px w-[22px] shrink-0 bg-gold" />
                  Liste d’attente
                </span>
              </p>

              <SectionTitle as="h1" className="mt-4">
                Soyez parmi les premiers à découvrir HAFIDHU.
              </SectionTitle>

              <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-[1.7] text-muted">
                HAFIDHU est en construction. Rejoignez la liste d’attente pour suivre son évolution
                et participer à la construction d’un outil pensé pour nos réalités.
              </p>

              <ul className="mt-7 flex flex-col gap-3">
                {notes.map((note) => (
                  <li
                    key={note}
                    className="border-l-2 border-gold pl-4 text-[0.875rem] leading-[1.6] text-ink"
                  >
                    {note}
                  </li>
                ))}
              </ul>

              <p className="mt-7 flex items-start gap-2.5 rounded-[12px] border border-border bg-surface px-4 py-3 text-[0.8125rem] leading-[1.6] text-muted-strong">
                <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-teal" />
                La liste des inscrits n’est jamais rendue publique et n’est transmise à aucun tiers.
              </p>
            </div>

            <div className="min-w-0">
              <h2 className="sr-only">Formulaire d’inscription</h2>
              <WaitlistForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
