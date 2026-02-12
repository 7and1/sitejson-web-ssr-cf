import { useState, useEffect, useCallback, useRef } from 'react';
import type { SiteReport } from '../lib/api-client/types';
import { fetchSiteData } from '../services/api';

interface UseSiteDataResult {
  data: SiteReport | null;
  isStale: boolean;
  isLoading: boolean;
  isProcessing: boolean;
  progress: number;
  error: string | null;
  refresh: () => void;
  statusMessage: string;
}

export function useSiteData(domain: string): UseSiteDataResult {
  const [data, setData] = useState<SiteReport | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing...");

  const stopPollingRef = useRef(false);

  const poll = useCallback(async () => {
    try {
      const response = await fetchSiteData(domain);

      if (stopPollingRef.current) return;

      if (response.status === 'error') {
        setError(response.message || 'Unknown error occurred');
        setIsLoading(false);
        setIsProcessing(false);
        return;
      }

      if (response.status === 'completed' && response.data) {
        setData(response.data);
        setIsStale(Boolean(response.is_stale));
        setProgress(100);
        setStatusMessage('Analysis complete');
        setIsLoading(false);
        setIsProcessing(false);
      } else if (response.status === 'processing') {
        setIsProcessing(true);
        setIsLoading(false);
        if (typeof response.progress === 'number' && Number.isFinite(response.progress)) {
          setProgress((prev) => {
            const normalized = Math.max(0, Math.min(95, Math.floor(response.progress ?? 0)));
            return Math.max(prev, normalized);
          });
        }

        setStatusMessage(response.message || response.stage || 'Analyzing...');

        setTimeout(() => {
            if (!stopPollingRef.current) poll();
        }, 2000);
      }
    } catch {
      setError('Failed to fetch data');
      setIsLoading(false);
      setIsProcessing(false);
    }
  }, [domain]);

  useEffect(() => {
    if (!domain) return;

    setIsLoading(true);
    setError(null);
    setProgress(0);
    stopPollingRef.current = false;

    poll();

    return () => {
      stopPollingRef.current = true;
    };
  }, [domain, poll]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isProcessing && progress < 90) {
      interval = setInterval(() => {
        setProgress(prev => {
          const increment = prev > 60 ? 2 : 8;
          return Math.min(prev + increment, 90);
        });

        const messages = ["Queued...", "Fetching DNS...", "Running Providers...", "Building Report..."];
        setStatusMessage(prev => {
            const idx = messages.indexOf(prev);
            if (idx === -1) return messages[0];
            return messages[(idx + 1) % messages.length];
        });

      }, 800);
    }
    return () => clearInterval(interval);
  }, [isProcessing, progress]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setData(null);
    setIsStale(false);
    setProgress(0);
    stopPollingRef.current = false;
    fetchSiteData(domain, true).then((res) => {
        if (res.status === 'processing') {
            setIsLoading(false);
            setIsProcessing(true);
            if (typeof res.progress === 'number' && Number.isFinite(res.progress)) {
              setProgress(Math.max(0, Math.min(95, Math.floor(res.progress))));
            }
            setStatusMessage(res.message || res.stage || 'Analysis queued');
            setTimeout(poll, 2000);
        } else if (res.status === 'error') {
            setError(res.message || 'Refresh failed');
            setIsLoading(false);
            setIsProcessing(false);
        } else if (res.data) {
            setData(res.data);
            setIsStale(Boolean(res.is_stale));
            setIsLoading(false);
        }
    }).catch(() => {
        setError('Network error during refresh');
        setIsLoading(false);
        setIsProcessing(false);
    });
  }, [domain, poll]);

  return { data, isStale, isLoading, isProcessing, progress, error, refresh, statusMessage };
}
