import type { Metadata } from 'next';
import { contact, socials } from '@/content/contact';
import { routes } from '@/content/navigation';
import { ContactForm } from '@/components/forms/ContactForm';
import { Breadcrumb } from '@/components/sections/shared';
import { Container, Section, SectionTitle } from '@/components/ui/primitives';
import { Icon } from '@/components/ui/Icon';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Une question, une idée, l’envie de participer à la construction de HAFIDHU ? Écrivez-nous : les retours issus de situations réelles orientent directement ce que nous construisons.',
  path: routes.contact,
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'Contact', path: routes.contact },
        ])}
      />

      <Section spacing="loose">
        <Container width="prose">
          <Breadcrumb trail={[{ name: 'Contact' }]} />

          <div className="mt-6 grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
            <div>
              <SectionTitle as="h1">
                Une question ? Une idée ? Vous souhaitez participer à la construction de HAFIDHU ?
              </SectionTitle>

              <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-[1.7] text-muted">
                Écrivez-nous. Les retours issus de situations réelles orientent directement ce que
                nous construisons.
              </p>

              <ul className="mt-7 flex flex-col gap-3">
                <li className="border-l-2 border-gold pl-4 text-[0.875rem] leading-[1.6] text-ink">
                  Nous répondons aux demandes liées au produit et à sa construction.
                </li>
                <li className="border-l-2 border-gold pl-4 text-[0.875rem] leading-[1.6] text-ink">
                  Aucune offre commerciale n’est proposée à ce stade.
                </li>
              </ul>

              <div className="mt-8 rounded-[16px] border border-border bg-surface p-5">
                <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted">
                  Coordonnées
                </h2>

                <address className="mt-4 flex flex-col gap-3.5 not-italic">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-3 text-[0.9375rem] text-ink no-underline hover:text-teal"
                  >
                    <Icon name="mail" size={18} className="shrink-0 text-teal" />
                    {contact.email}
                  </a>
                  <a
                    href={contact.phoneHref}
                    className="flex items-center gap-3 text-[0.9375rem] text-ink no-underline hover:text-teal"
                  >
                    <Icon name="phone" size={18} className="shrink-0 text-teal" />
                    {contact.phone}
                  </a>
                  <a
                    href={contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[0.9375rem] text-ink no-underline hover:text-teal"
                  >
                    <Icon name="whatsapp" size={18} className="shrink-0 text-teal" />
                    WhatsApp
                  </a>
                  <span className="flex items-start gap-3 text-[0.9375rem] text-ink">
                    <Icon name="map-pin" size={18} className="mt-0.5 shrink-0 text-teal" />
                    <span>
                      {contact.address.line}
                      <br />
                      {contact.address.city}, {contact.address.country}
                    </span>
                  </span>
                </address>

                <h2 className="mt-6 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted">
                  Réseaux
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border text-muted-strong transition-colors hover:border-teal hover:text-teal"
                      >
                        <Icon name={s.icon} size={18} />
                        <span className="sr-only">{s.label} (nouvelle fenêtre)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="sr-only">Formulaire de contact</h2>
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
