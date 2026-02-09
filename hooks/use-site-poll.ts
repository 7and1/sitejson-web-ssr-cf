import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiResponse, SiteData } from '../lib/types';
import { fetchSiteData } from '../services/mockApi';

interface UseSiteDataResult {
  data: SiteData | null;
  isLoading: boolean;     // Initial fetch
  isProcessing: boolean;  // Polling active
  progress: number;       // Fake progress 0-100
  error: string | null;
  refresh: () => void;
  statusMessage: string;
}

export function useSiteData(domain: string): UseSiteDataResult {
  const [data, setData] = useState<SiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  
  // To prevent race conditions and cleanup
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
        
        // Schedule next poll in 2 seconds
        setTimeout(() => {
            if (!stopPollingRef.current) poll();
        }, 2000);
      }
    } catch (err) {
      setError('Failed to fetch data');
      setIsLoading(false);
      setIsProcessing(false);
    }
  }, [domain]);

  // Initial Fetch
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

  // Fake Progress Bar Animation during processing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isProcessing && progress < 90) {
      interval = setInterval(() => {
        setProgress(prev => {
          // Slow down as we get closer to 90%
          const increment = prev > 60 ? 2 : 8;
          return Math.min(prev + increment, 90);
        });
        
        // Cycle messages
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
    setProgress(0);
    stopPollingRef.current = false;
    // Force refresh param
    fetchSiteData(domain, true).then((res) => {
        if (res.status === 'processing') {
            setIsLoading(false);
            setIsProcessing(true);
            if (typeof res.progress === 'number' && Number.isFinite(res.progress)) {
              setProgress(Math.max(0, Math.min(95, Math.floor(res.progress))));
            }
            setStatusMessage(res.message || res.stage || 'Analysis queued');
            setTimeout(poll, 2000);
        } else if (res.data) {
            setData(res.data);
            setIsLoading(false);
        }
    });
  }, [domain, poll]);

  return { data, isLoading, isProcessing, progress, error, refresh, statusMessage };
}
