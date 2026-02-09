export interface SiteReportResponse {
  ok: boolean;
  data?: {
    domain: string;
    status: string;
    freshness: {
      is_stale: boolean;
      updated_at: string;
    };
    report: {
      meta?: {
        title?: string;
        description?: string;
      };
      seo?: {
        h1Count?: number;
        h2Count?: number;
      };
      dns?: {
        provider?: string;
        mxRecords?: string[];
      };
      aiAnalysis?: {
        classification?: {
          category?: string;
          subCategory?: string;
        };
        risk?: {
          sentiment?: string;
          score?: number;
        };
      };
      score?: {
        value: number;
        signals: string[];
      };
    };
  };
}

export interface DirectoryResponse {
  ok: boolean;
  data?: {
    items: Array<{
      domain: string;
      title: string;
      score: number;
      rank?: number;
    }>;
    pagination: {
      page: number;
      page_size: number;
      total: number;
    };
  };
}
