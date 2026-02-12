import type { Metadata } from 'next';
import { buildDirectoryMetadata } from '@/lib/seo/metadata';
import { getDirectory } from '@/lib/api-client/client';
import DirectoryContent from './directory-content';

export const runtime = 'edge';

type DirectoryPageProps = {
  params: Promise<{
    type: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: DirectoryPageProps): Promise<Metadata> {
  const { type, slug } = await params;
  return buildDirectoryMetadata(type, slug);
}

export default async function DirectoryPage({ params }: DirectoryPageProps) {
  const { type, slug } = await params;
  const normalizedType = (['category', 'technology', 'topic'].includes(type) ? type : 'category') as
    | 'category'
    | 'technology'
    | 'topic';

  const data = await getDirectory(type, slug, 1, 24);
  const items = data?.items ?? [];
  const total = data?.pagination?.total ?? 0;
  const pageSize = data?.pagination?.page_size ?? 24;
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Top Websites ${normalizedType === 'technology' ? 'using' : 'in'} ${slug}`,
    description: `Discover the most popular websites ${normalizedType === 'technology' ? 'built with' : 'related to'} ${slug}.`,
    url: `https://sitejson.com/directory/${type}/${slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sitejson.com' },
        { '@type': 'ListItem', position: 2, name: type.charAt(0).toUpperCase() + type.slice(1) },
        { '@type': 'ListItem', position: 3, name: slug.charAt(0).toUpperCase() + slug.slice(1) },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DirectoryContent
        mode={normalizedType}
        value={slug}
        initialItems={items}
        initialTotal={total}
        initialTotalPages={totalPages}
        pageSize={pageSize}
      />
    </>
  );
}
