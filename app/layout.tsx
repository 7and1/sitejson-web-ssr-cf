import type { Metadata } from 'next';
import { buildBaseMetadata } from '@/lib/seo/metadata';
import { UiShell } from './ui-shell';
import './globals.css';

export const metadata: Metadata = buildBaseMetadata();

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'SiteJSON',
      url: 'https://sitejson.com',
      description: 'Website intelligence API for traffic estimates, tech stack detection, SEO analysis, and trust signals.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://sitejson.com/site/{search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      name: 'SiteJSON',
      url: 'https://sitejson.com',
      logo: 'https://sitejson.com/icons/icon-192x192.png',
    },
  ],
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <UiShell>{children}</UiShell>
      </body>
    </html>
  );
}
