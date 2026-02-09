import type { DirectoryResponse, SiteReportResponse } from './types';

const baseUrl = process.env.SITEJSON_API_BASE_URL ?? 'http://127.0.0.1:8787';

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'x-api-key': process.env.SITEJSON_API_KEY ?? 'dev-api-key',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const getSiteReport = (domain: string) => {
  return fetchJson<SiteReportResponse>(`/api/v1/sites/${domain}`);
};

export const getDirectory = (type: string, slug: string) => {
  return fetchJson<DirectoryResponse>(`/api/v1/directory/${type}/${slug}`);
};
