import Image from 'next/image';
import type { Metadata } from 'next';
import { editorialPages } from '@/content/pages';
import { keyImages } from '@/content/images';
import { routes } from '@/content/navigation';
import { EditorialPageView } from '@/components/sections/EditorialPage';
import { FinalCta } from '@/components/sections/shared';
import { pageMetadata } from '@/lib/seo';

const page = editorialPages['pour-qui']!;

export const metadata: Metadata = pageMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: routes.audiences,
});

export default function AudiencesPage() {
  return (
    <>
      <EditorialPageView page={page}>
        <div className="grid gap-4 sm:grid-cols-2">
          <figure className="m-0 overflow-hidden rounded-[16px] border border-border">
            <Image
              src={keyImages.famille.src}
              alt={keyImages.famille.alt}
              width={keyImages.famille.width}
              height={keyImages.famille.height}
              placeholder="blur"
              blurDataURL={keyImages.famille.blurDataURL}
              sizes="(max-width: 639px) 100vw, 450px"
              className="h-auto w-full"
            />
          </figure>
          <figure className="m-0 overflow-hidden rounded-[16px] border border-border">
            <Image
              src={keyImages.diaspora.src}
              alt={keyImages.diaspora.alt}
              width={keyImages.diaspora.width}
              height={keyImages.diaspora.height}
              placeholder="blur"
              blurDataURL={keyImages.diaspora.blurDataURL}
              sizes="(max-width: 639px) 100vw, 450px"
              className="h-auto w-full"
            />
          </figure>
        </div>
      </EditorialPageView>
      <FinalCta />
    </>
  );
}
