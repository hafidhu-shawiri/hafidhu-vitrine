import Image from 'next/image';
import type { Metadata } from 'next';
import { editorialPages } from '@/content/pages';
import { keyImages } from '@/content/images';
import { routes } from '@/content/navigation';
import { EditorialPageView } from '@/components/sections/EditorialPage';
import { FinalCta } from '@/components/sections/shared';
import { pageMetadata } from '@/lib/seo';

const page = editorialPages['notre-vision']!;

export const metadata: Metadata = pageMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: routes.vision,
});

export default function VisionPage() {
  return (
    <>
      <EditorialPageView page={page}>
        <figure className="m-0">
          <div className="overflow-hidden rounded-[16px] border border-border">
            <Image
              src={keyImages.famille.src}
              alt={keyImages.famille.alt}
              width={keyImages.famille.width}
              height={keyImages.famille.height}
              placeholder="blur"
              blurDataURL={keyImages.famille.blurDataURL}
              sizes="(max-width: 959px) 100vw, 920px"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-2.5 text-[0.8125rem] text-muted">
            Ce que HAFIDHU cherche à soutenir : une organisation familiale qui existe déjà, et qui
            mérite de durer.
          </figcaption>
        </figure>
      </EditorialPageView>
      <FinalCta />
    </>
  );
}
