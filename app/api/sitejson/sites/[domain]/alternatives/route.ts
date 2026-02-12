import { proxyToSitejson } from '../../../_lib';

export const runtime = 'edge';

type RouteContext = {
  params: Promise<{
    domain: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { domain } = await params;
  return proxyToSitejson(`/api/v1/sites/${encodeURIComponent(domain)}/alternatives`);
}
