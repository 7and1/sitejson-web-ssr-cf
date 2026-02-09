import { proxyToSitejson } from '../../_lib';

export const runtime = 'edge';

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { jobId } = await params;
  return proxyToSitejson(`/api/v1/jobs/${encodeURIComponent(jobId)}`);
}
