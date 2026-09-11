import type { Metadata } from 'next';
import { editorialPages } from '@/content/pages';
import { routes } from '@/content/navigation';
import { EditorialPageView } from '@/components/sections/EditorialPage';
import { pageMetadata } from '@/lib/seo';

const page = editorialPages['politique-de-confidentialite']!;

export const metadata: Metadata = pageMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: routes.privacy,
});

export default function PrivacyPage() {
  return <EditorialPageView page={page} />;
}
