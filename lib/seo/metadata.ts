import type { Metadata } from 'next';

const siteName = 'SiteJSON';

export const buildBaseMetadata = (): Metadata => ({
  metadataBase: new URL(process.env.PUBLIC_SITE_BASE_URL ?? 'https://sitejson.com'),
  title: {
    default: `${siteName} — Website Intelligence API`,
    template: `%s | ${siteName}`,
  },
  description: 'Structured website intelligence for SEO, infrastructure, traffic, and trust analysis.',
  openGraph: {
    type: 'website',
    siteName,
    title: `${siteName} — Website Intelligence API`,
    description: 'Analyze domains with production-grade intelligence and API access.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — Website Intelligence API`,
    description: 'Analyze domains with production-grade intelligence and API access.',
  },
});

export const buildReportMetadata = (domain: string): Metadata => ({
  title: `${domain} Website Intelligence Report`,
  description: `Analyze ${domain} with SEO, infrastructure, monetization, and trust signals.`,
  alternates: {
    canonical: `/site/${domain}`,
  },
  openGraph: {
    title: `${domain} Website Intelligence Report`,
    description: `Analyze ${domain} with SEO, infrastructure, monetization, and trust signals.`,
    url: `/site/${domain}`,
    type: 'article',
  },
});

export const buildDirectoryMetadata = (type: string, slug: string): Metadata => ({
  title: `${slug} ${type} Directory`,
  description: `Explore top ${slug} ${type} websites with rankings and trust insights.`,
  alternates: {
    canonical: `/directory/${type}/${slug}`,
  },
});
