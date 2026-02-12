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
    title: `${domain} Website Intelligence Report | ${siteName}`,
    description: `Analyze ${domain} with SEO, infrastructure, monetization, and trust signals.`,
    url: `/data/${domain}`,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${domain} Website Intelligence Report | ${siteName}`,
    description: `Analyze ${domain} with SEO, infrastructure, monetization, and trust signals.`,
  },
});

export const buildSitePageMetadata = (domain: string): Metadata => ({
  title: `Analyzing ${domain}`,
  description: `Live analysis of ${domain} — SEO, traffic, tech stack, and trust score.`,
  robots: { index: false, follow: true },
  alternates: {
    canonical: `/data/${domain}`,
  },
});

export const buildDataSubPageMetadata = (
  domain: string,
  subPage: 'traffic' | 'seo' | 'tech' | 'business',
): Metadata => {
  const titles: Record<string, string> = {
    traffic: `${domain} Traffic Statistics & Analytics`,
    seo: `${domain} SEO Analysis & Score`,
    tech: `${domain} Technology Stack & Infrastructure`,
    business: `${domain} Business Intelligence & Trust`,
  };
  const descriptions: Record<string, string> = {
    traffic: `Monthly visits, bounce rate, traffic sources, top regions, and keywords for ${domain}.`,
    seo: `SEO score, heading structure, link analysis, technical files, and taxonomy for ${domain}.`,
    tech: `Technology stack, DNS records, infrastructure details, and provider health for ${domain}.`,
    business: `AI business intelligence, trust assessment, advertising, and monetization data for ${domain}.`,
  };
  return {
    title: titles[subPage],
    description: descriptions[subPage],
    alternates: {
      canonical: `/data/${domain}/${subPage}`,
    },
    openGraph: {
      title: `${titles[subPage]} | ${siteName}`,
      description: descriptions[subPage],
      url: `/data/${domain}/${subPage}`,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${titles[subPage]} | ${siteName}`,
      description: descriptions[subPage],
    },
  };
};

export const buildDirectoryMetadata = (type: string, slug: string): Metadata => {
  const display = slug.charAt(0).toUpperCase() + slug.slice(1);
  const label = type === 'technology' ? 'built with' : 'in';
  return {
    title: `Top ${display} Websites — ${type.charAt(0).toUpperCase() + type.slice(1)} Directory`,
    description: `Discover the most popular websites ${label} ${display}. Ranked by traffic, authority, and AI analysis.`,
    alternates: {
      canonical: `/directory/${type}/${slug}`,
    },
    openGraph: {
      title: `Top ${display} Websites — ${type.charAt(0).toUpperCase() + type.slice(1)} Directory | ${siteName}`,
      description: `Discover the most popular websites ${label} ${display}. Ranked by traffic, authority, and AI analysis.`,
      url: `/directory/${type}/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `Top ${display} Websites | ${siteName}`,
      description: `Discover the most popular websites ${label} ${display}. Ranked by traffic, authority, and AI analysis.`,
    },
  };
};
