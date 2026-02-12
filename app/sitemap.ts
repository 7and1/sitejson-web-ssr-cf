import type { MetadataRoute } from 'next';

const BASE = process.env.PUBLIC_SITE_BASE_URL ?? 'https://sitejson.com';
const API_BASE = process.env.SITEJSON_API_BASE_URL ?? 'http://127.0.0.1:8787';
const API_KEY = process.env.SITEJSON_API_KEY ?? '';

interface DomainEntry {
  domain: string;
  updated_at?: string;
}

interface DirectoryEntry {
  type: string;
  slug: string;
}

async function fetchDomains(): Promise<DomainEntry[]> {
  try {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (API_KEY) headers['x-api-key'] = API_KEY;

    const res = await fetch(`${API_BASE}/api/v1/sites?page_size=5000`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const body = await res.json() as { ok?: boolean; data?: { items?: DomainEntry[] } };
    return body?.data?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchDirectories(): Promise<DirectoryEntry[]> {
  try {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (API_KEY) headers['x-api-key'] = API_KEY;

    const types = ['category', 'technology', 'topic'];
    const entries: DirectoryEntry[] = [];

    for (const type of types) {
      const res = await fetch(`${API_BASE}/api/v1/directory/${type}?page_size=500`, {
        headers,
        next: { revalidate: 3600 },
      });
      if (!res.ok) continue;
      const body = await res.json() as { ok?: boolean; data?: { items?: { slug: string }[] } };
      const items = body?.data?.items ?? [];
      for (const item of items) {
        if (item.slug) entries.push({ type, slug: item.slug });
      }
    }

    return entries;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [domains, directories] = await Promise.all([
    fetchDomains(),
    fetchDirectories(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  const domainPages: MetadataRoute.Sitemap = domains.flatMap((d) => {
    const lastMod = d.updated_at ? new Date(d.updated_at) : new Date();
    return [
      {
        url: `${BASE}/data/${d.domain}`,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${BASE}/data/${d.domain}/traffic`,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      {
        url: `${BASE}/data/${d.domain}/seo`,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      {
        url: `${BASE}/data/${d.domain}/tech`,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      {
        url: `${BASE}/data/${d.domain}/business`,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
    ];
  });

  const directoryPages: MetadataRoute.Sitemap = directories.map((d) => ({
    url: `${BASE}/directory/${d.type}/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...domainPages, ...directoryPages];
}
