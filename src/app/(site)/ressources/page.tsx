import type { Metadata } from 'next';
import { editorialPages } from '@/content/pages';
import { routes } from '@/content/navigation';
import { EditorialPageView } from '@/components/sections/EditorialPage';
import { FinalCta } from '@/components/sections/shared';
import { NoticeBox } from '@/components/ui/primitives';
import { pageMetadata } from '@/lib/seo';

const page = editorialPages['ressources']!;

export const metadata: Metadata = pageMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: routes.resources,
});

export default function ResourcesPage() {
  return (
    <>
      <EditorialPageView page={page}>
        {/*
          Aucun article n'est publié à ce jour. Plutôt que d'afficher de
          fausses cartes d'articles avec des titres et des dates fictifs
          — ce que faisait le prototype — la page dit simplement la vérité.
        */}
        <div>
          <h2 className="mb-5 text-[1.3125rem] font-bold text-navy sm:text-[1.5rem]">
            Premières publications
          </h2>
          <NoticeBox>
            Aucun article n’est encore publié. Les premières ressources paraîtront au fil de
            l’avancement du produit. Rejoignez la liste d’attente pour en être informé.
          </NoticeBox>
          <p className="mt-5 text-[1rem] leading-[1.75] text-muted">
            Les contenus prévus s’appuieront sur des situations réelles : organisation d’une
            cotisation, préparation d’un grand moment familial, coordination entre membres répartis
            dans plusieurs pays. Si vous souhaitez qu’un sujet précis soit traité, écrivez-nous — les
            retours orientent directement ce qui est publié.
          </p>
        </div>
      </EditorialPageView>
      <FinalCta />
    </>
  );
}
