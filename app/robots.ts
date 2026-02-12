import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.PUBLIC_SITE_BASE_URL ?? 'https://sitejson.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/site/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
