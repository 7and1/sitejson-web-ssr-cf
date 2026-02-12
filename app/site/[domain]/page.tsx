import type { Metadata } from 'next';
import SiteReport from '@/screens/SiteReport';
import { buildSitePageMetadata } from '@/lib/seo/metadata';

export const runtime = 'edge';

type SitePageProps = {
  params: Promise<{
    domain: string;
  }>;
};

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const { domain } = await params;
  return buildSitePageMetadata(domain);
}

export default async function SitePage({ params }: SitePageProps) {
  const { domain } = await params;
  return <SiteReport domain={domain} />;
}
