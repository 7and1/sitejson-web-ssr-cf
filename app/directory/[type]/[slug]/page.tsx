import type { Metadata } from 'next';
import Directory from '@/screens/Directory';
import { buildDirectoryMetadata } from '@/lib/seo/metadata';

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

  return <Directory mode={normalizedType} value={slug} />;
}
