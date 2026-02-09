import type { Metadata } from 'next';

const siteName = 'SiteJSON';

export const buildBaseMetadata = (): Metadata => ({
  metadataBase: new URL(process.env.PUBLIC_SITE_BASE_URL ?? 'https://sitejson.com'),
  title: {
    default: `${siteName} — Website Intelligence, Structured Data`,
    template: `%s | ${siteName}`,
  },
  description: 'Website intelligence API for traffic estimates, tech stack detection, SEO analysis, and trust signals.',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icons/icon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'manifest', url: '/site.webmanifest' }],
  },
  openGraph: {
    type: 'website',
    siteName,
    title: `${siteName} — Website Intelligence, Structured Data`,
    description: 'Website intelligence API for traffic estimates, tech stack detection, SEO analysis, and trust signals.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — Website Intelligence, Structured Data`,
    description: 'Website intelligence API for traffic estimates, tech stack detection, SEO analysis, and trust signals.',
  },
});

export const buildReportMetadata = (domain: string): Metadata => ({
  title: `${domain} Website Intelligence Report`,
  description: `Analyze ${domain} with SEO, infrastructure, monetization, and trust signals.`,
  alternates: {
    canonical: `/data/${domain}`,
  },
  openGraph: {
    title: `${domain} Website Intelligence Report`,
    description: `Analyze ${domain} with SEO, infrastructure, monetization, and trust signals.`,
    url: `/data/${domain}`,
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
