import type { Metadata } from 'next';
import { editorialPages } from '@/content/pages';
import { routes } from '@/content/navigation';
import { EditorialPageView } from '@/components/sections/EditorialPage';
import { FinalCta } from '@/components/sections/shared';
import { pageMetadata } from '@/lib/seo';

const page = editorialPages['securite-confidentialite']!;

export const metadata: Metadata = pageMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: routes.security,
});

export default function SecurityPage() {
  return (
    <>
      <EditorialPageView page={page} />
      <FinalCta />
    </>
  );
}
