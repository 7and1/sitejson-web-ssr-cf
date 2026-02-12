import type { SiteReport } from './api-client/types';

export type { SiteReport };

export interface ApiResponse {
  status: 'processing' | 'completed' | 'error';
  data?: SiteReport;
  is_stale?: boolean;
  message?: string;
  progress?: number;
  stage?: string;
}
