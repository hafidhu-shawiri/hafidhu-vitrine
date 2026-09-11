import type { Metadata } from 'next';
import { editorialPages } from '@/content/pages';
import { conceptChain } from '@/content/modules';
import { routes } from '@/content/navigation';
import { EditorialPageView } from '@/components/sections/EditorialPage';
import { ChainDiagram, FinalCta } from '@/components/sections/shared';
import { pageMetadata } from '@/lib/seo';

const page = editorialPages['comment-ca-marche']!;

export const metadata: Metadata = pageMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: routes.howItWorks,
});

export default function HowItWorksPage() {
  return (
    <>
      <EditorialPageView page={page}>
        <div>
          <h2 className="mb-5 text-[1.3125rem] font-bold text-navy sm:text-[1.5rem]">
            La logique sous-jacente
          </h2>
          <p className="mb-5 text-[1rem] leading-[1.75] text-muted">
            Quel que soit l’usage — cotisation, événement ou contribution collective — la même
            chaîne se répète. C’est ce qui rend l’ensemble cohérent.
          </p>
          <ChainDiagram items={conceptChain} />
        </div>
      </EditorialPageView>
      <FinalCta />
    </>
  );
}
