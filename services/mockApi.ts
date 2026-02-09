import type { ApiResponse, SiteData } from '../lib/types';

type DirectoryType = 'category' | 'technology' | 'topic';

type BackendErrorPayload = {
  code?: string;
  message?: string;
};

type BackendAnalyzeResponse = {
  ok?: boolean;
  data?: {
    job_id?: string | null;
    status?: string;
    priority?: string;
    reason?: string;
  };
  error?: BackendErrorPayload;
};

type BackendJobResponse = {
  ok?: boolean;
  data?: {
    job_id?: string;
    status?: 'pending' | 'running' | 'completed' | 'failed';
    progress?: number;
    stage?: string;
  };
  error?: BackendErrorPayload;
};

type BackendSiteResponse = {
  ok?: boolean;
  data?: {
    domain?: string;
    freshness?: {
      is_stale?: boolean;
      updated_at?: string;
    };
    report?: {
      domain?: string;
      updatedAt?: string;
      meta?: {
        title?: string;
        description?: string;
        techStackDetected?: string[];
      };
      seo?: {
        h1Count?: number;
        h2Count?: number;
        internalLinks?: number;
        externalLinks?: number;
        imagesCount?: number;
      };
      dns?: {
        provider?: string;
        mxRecords?: string[];
      };
      trafficData?: {
        monthlyVisits?: number;
        globalRank?: number | null;
        bounceRate?: number | null;
        topCountry?: string;
        topRegions?: Array<{
          country: string;
          share: number;
        }>;
      };
      radar?: {
        globalRank?: number | null;
        rankBucket?: string;
      };
      aiAnalysis?: {
        classification?: {
          category?: string;
          subCategory?: string;
          tags?: string[];
        };
        business?: {
          summary?: string;
          model?: string;
          targetAudience?: string;
        };
        risk?: {
          sentiment?: 'Professional' | 'Spammy';
          score?: number;
          isSpam?: boolean;
        };
      };
      score?: {
        value?: number;
      };
    };
  };
  error?: BackendErrorPayload;
};

type BackendDirectoryResponse = {
  ok?: boolean;
  data?: {
    items?: Array<{
      domain?: string;
      title?: string;
      score?: number;
      rank?: number;
    }>;
    pagination?: {
      page?: number;
      page_size?: number;
      total?: number;
    };
  };
};

export type DirectoryListingResult = {
  items: SiteData[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const pendingJobs = new Map<string, string>();
const pendingWithoutJob = new Set<string>();

const parseJson = <T>(text: string): T | null => {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

const requestJson = async <T>(path: string, init?: RequestInit): Promise<{ status: number; body: T | null }> => {
  try {
    const response = await fetch(path, {
      ...init,
      cache: 'no-store',
      headers: {
        accept: 'application/json',
        ...(init?.headers ?? {}),
      },
    });

    const text = await response.text();
    return {
      status: response.status,
      body: parseJson<T>(text),
    };
  } catch {
    return {
      status: 0,
      body: null,
    };
  }
};

const normalizeDomain = (input: string): string => {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0] ?? '';
};

const colorFromDomain = (domain: string): string => {
  let hash = 0;
  for (const char of domain) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }

  const hex = Math.abs(hash).toString(16).padStart(6, '0').slice(0, 6);
  return `#${hex}`;
};

const rankBucketFromRank = (rank: number): string => {
  if (rank <= 100) {
    return 'Top 100';
  }
  if (rank <= 1000) {
    return 'Top 1k';
  }
  if (rank <= 10000) {
    return 'Top 10k';
  }
  if (rank <= 100000) {
    return 'Top 100k';
  }
  return 'Global';
};

const toScreenshotUrl = (domain: string): string => {
  return `https://image.thum.io/get/width/1200/noanimate/https://${domain}`;
};

const toSiteData = (domain: string, payload: BackendSiteResponse): SiteData => {
  const report = payload.data?.report;
  const freshness = payload.data?.freshness;

  const globalRank =
    report?.radar?.globalRank ?? report?.trafficData?.globalRank ?? Math.max(1000000 - (report?.score?.value ?? 0) * 5000, 1000);

  const safeRank = typeof globalRank === 'number' && Number.isFinite(globalRank) && globalRank > 0 ? Math.floor(globalRank) : 999999;

  const topCountry = report?.trafficData?.topCountry ?? report?.trafficData?.topRegions?.[0]?.country ?? 'Unknown';
  const monthlyVisits = report?.trafficData?.monthlyVisits;
  const bounceRate = report?.trafficData?.bounceRate;

  const techStackDetected = report?.meta?.techStackDetected ?? [];

  return {
    domain,
    updated_at: freshness?.updated_at ?? report?.updatedAt ?? new Date().toISOString(),
    screenshot_url: toScreenshotUrl(domain),
    visual: {
      dominant_color: colorFromDomain(domain),
      font_family: 'Inter, sans-serif',
    },
    radar: {
      global_rank: safeRank,
      rank_bucket: report?.radar?.rankBucket ?? rankBucketFromRank(safeRank),
    },
    traffic_data:
      typeof monthlyVisits === 'number'
        ? {
            monthly_visits: monthlyVisits,
            bounce_rate: typeof bounceRate === 'number' ? bounceRate : 0,
            top_country: topCountry,
          }
        : null,
    ai_analysis: report?.aiAnalysis
      ? {
          classification: {
            category: report.aiAnalysis.classification?.category ?? 'Unknown',
            sub_category: report.aiAnalysis.classification?.subCategory ?? 'Unknown',
            tags: report.aiAnalysis.classification?.tags ?? [],
          },
          business: {
            summary: report.aiAnalysis.business?.summary ?? `${domain} website profile`,
            model: report.aiAnalysis.business?.model ?? 'Unknown',
            target_audience: report.aiAnalysis.business?.targetAudience ?? 'General audience',
          },
          tech_stack: {
            frameworks: techStackDetected,
          },
          risk: {
            is_spam: Boolean(report.aiAnalysis.risk?.isSpam),
            sentiment: report.aiAnalysis.risk?.sentiment ?? 'Professional',
            score: report.aiAnalysis.risk?.score ?? 0,
          },
        }
      : null,
    meta: {
      title: report?.meta?.title ?? domain,
      description: report?.meta?.description ?? `${domain} website intelligence report`,
      tech_stack_detected: techStackDetected,
    },
    seo: {
      h1_count: report?.seo?.h1Count ?? 0,
      h2_count: report?.seo?.h2Count ?? 0,
      internal_links: report?.seo?.internalLinks ?? 0,
      external_links: report?.seo?.externalLinks ?? 0,
      images_count: report?.seo?.imagesCount ?? 0,
    },
    files: {
      has_sitemap: false,
      has_robots: false,
    },
    dns: {
      provider: report?.dns?.provider ?? 'Unknown',
      mx_records: report?.dns?.mxRecords ?? [],
    },
    adsense_graph: {
      has_google_id: false,
      network_size: 0,
      associated_domains: [],
    },
    processing_status: 'completed',
  };
};

const toDirectorySite = (
  item: NonNullable<NonNullable<BackendDirectoryResponse['data']>['items']>[number],
  type: DirectoryType,
  value: string,
): SiteData => {
  const domain = item.domain ?? 'unknown.example';
  const fallbackSummary = item.title ?? `${domain} ${type} site`;
  const rank = item.rank ?? Math.max(1000000 - Math.floor((item.score ?? 0) * 8000), 1000);

  return {
    domain,
    updated_at: new Date().toISOString(),
    screenshot_url: toScreenshotUrl(domain),
    visual: {
      dominant_color: colorFromDomain(domain),
      font_family: 'Inter, sans-serif',
    },
    radar: {
      global_rank: rank,
      rank_bucket: rankBucketFromRank(rank),
    },
    traffic_data: null,
    ai_analysis: {
      classification: {
        category: type === 'category' ? value : 'General',
        sub_category: value,
        tags: [value],
      },
      business: {
        summary: fallbackSummary,
        model: 'Unknown',
        target_audience: 'General audience',
      },
      tech_stack: {},
      risk: {
        is_spam: false,
        sentiment: 'Professional',
        score: Math.max(30, Math.min(99, item.score ?? 50)),
      },
    },
    meta: {
      title: item.title ?? domain,
      description: fallbackSummary,
      tech_stack_detected: [],
    },
    seo: {
      h1_count: 0,
      h2_count: 0,
      internal_links: 0,
      external_links: 0,
      images_count: 0,
    },
    files: {
      has_sitemap: false,
      has_robots: false,
    },
    dns: {
      provider: 'Unknown',
      mx_records: [],
    },
    adsense_graph: {
      has_google_id: false,
      network_size: 0,
      associated_domains: [],
    },
    processing_status: 'completed',
  };
};

const startAnalysis = async (domain: string, forceRefresh: boolean): Promise<{ jobId?: string; processing: boolean; message?: string; error?: string }> => {
  const payload = {
    domain,
    force_refresh: forceRefresh,
    force_ai: forceRefresh,
    priority: forceRefresh ? 'high' : 'normal',
  };

  const response = await requestJson<BackendAnalyzeResponse>('/api/sitejson/analyze', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 202 && response.body?.ok) {
    const jobId = response.body.data?.job_id ?? undefined;
    if (jobId) {
      return {
        jobId,
        processing: true,
        message: 'Analysis queued',
      };
    }

    return {
      processing: false,
    };
  }

  if (response.status === 409 && response.body?.error?.code === 'JOB_ALREADY_RUNNING') {
    return {
      processing: true,
      message: 'Analysis already running',
    };
  }

  return {
    processing: false,
    error: response.body?.error?.message ?? 'Failed to start analysis',
  };
};

const readJobStatus = async (
  jobId: string,
): Promise<{ state: 'processing' | 'completed' | 'failed'; message?: string; progress?: number; stage?: string }> => {
  const response = await requestJson<BackendJobResponse>(`/api/sitejson/jobs/${encodeURIComponent(jobId)}`);

  if (response.status === 200 && response.body?.ok && response.body.data) {
    const status = response.body.data.status;
    if (status === 'completed') {
      return {
        state: 'completed',
      };
    }

    if (status === 'failed') {
      return {
        state: 'failed',
        message: 'Analysis worker failed',
      };
    }

    return {
      state: 'processing',
      message: response.body.data.stage ?? 'Analyzing',
      progress: response.body.data.progress,
      stage: response.body.data.stage,
    };
  }

  if (response.status === 404) {
    return {
      state: 'processing',
      message: 'Awaiting job visibility',
    };
  }

  return {
    state: 'failed',
    message: response.body?.error?.message ?? 'Failed to poll job status',
  };
};

const readSiteReport = async (domain: string) => {
  const response = await requestJson<BackendSiteResponse>(`/api/sitejson/sites/${encodeURIComponent(domain)}`);
  return response;
};

export const fetchSiteData = async (domainInput: string, refresh = false): Promise<ApiResponse> => {
  const domain = normalizeDomain(domainInput);

  if (!domain || !domain.includes('.')) {
    return {
      status: 'error',
      message: 'Invalid domain',
    };
  }

  if (refresh) {
    pendingJobs.delete(domain);
    pendingWithoutJob.delete(domain);

    const started = await startAnalysis(domain, true);
    if (started.error) {
      return {
        status: 'error',
        message: started.error,
      };
    }

    if (started.processing) {
      if (started.jobId) {
        pendingJobs.set(domain, started.jobId);
      } else {
        pendingWithoutJob.add(domain);
      }

      return {
        status: 'processing',
        message: started.message ?? 'Analysis queued',
        progress: 5,
        stage: 'queued',
      };
    }
  }

  const trackedJob = pendingJobs.get(domain);
  if (trackedJob) {
    const status = await readJobStatus(trackedJob);
    if (status.state === 'completed') {
      pendingJobs.delete(domain);
      pendingWithoutJob.add(domain);
    } else if (status.state === 'failed') {
      pendingJobs.delete(domain);
      return {
        status: 'error',
        message: status.message ?? 'Analysis failed',
      };
    } else {
      return {
        status: 'processing',
        message: status.message ?? 'Analyzing...',
        progress: status.progress,
        stage: status.stage,
      };
    }
  }

  const reportResponse = await readSiteReport(domain);
  if (reportResponse.status === 200 && reportResponse.body?.ok) {
    pendingWithoutJob.delete(domain);
    return {
      status: 'completed',
      data: toSiteData(domain, reportResponse.body),
      is_stale: Boolean(reportResponse.body.data?.freshness?.is_stale),
    };
  }

  if (pendingWithoutJob.has(domain) && reportResponse.status === 404) {
    return {
      status: 'processing',
      message: 'Analysis running...',
      progress: 25,
      stage: 'orchestrator',
    };
  }

  if (reportResponse.status === 404) {
    const started = await startAnalysis(domain, false);

    if (started.error) {
      return {
        status: 'error',
        message: started.error,
      };
    }

    if (started.processing) {
      if (started.jobId) {
        pendingJobs.set(domain, started.jobId);
      } else {
        pendingWithoutJob.add(domain);
      }

      return {
        status: 'processing',
        message: started.message ?? 'Analysis queued',
        progress: 5,
        stage: 'queued',
      };
    }

    const refetched = await readSiteReport(domain);
    if (refetched.status === 200 && refetched.body?.ok) {
      return {
        status: 'completed',
        data: toSiteData(domain, refetched.body),
        is_stale: Boolean(refetched.body.data?.freshness?.is_stale),
      };
    }
  }

  return {
    status: 'error',
    message: reportResponse.body?.error?.message ?? 'Failed to load site report',
  };
};

export const fetchDirectoryListing = async (
  type: DirectoryType,
  value: string,
  page = 1,
  pageSize = 24,
): Promise<DirectoryListingResult> => {

  const response = await requestJson<BackendDirectoryResponse>(
    `/api/sitejson/directory/${encodeURIComponent(type)}/${encodeURIComponent(value)}?page=${encodeURIComponent(String(page))}&page_size=${encodeURIComponent(String(pageSize))}`,
  );

  if (response.status !== 200 || !response.body?.ok) {
    return {
      items: [],
      page,
      pageSize,
      total: 0,
      totalPages: 0,
    };
  }

  const items = response.body.data?.items ?? [];
  const normalizedPage = response.body.data?.pagination?.page ?? page;
  const normalizedPageSize = response.body.data?.pagination?.page_size ?? pageSize;
  const total = response.body.data?.pagination?.total ?? items.length;

  return {
    items: items
      .filter((item): item is NonNullable<typeof item> => Boolean(item?.domain))
      .map((item) => toDirectorySite(item, type, value)),
    page: normalizedPage,
    pageSize: normalizedPageSize,
    total,
    totalPages: total > 0 ? Math.ceil(total / normalizedPageSize) : 0,
  };
};
