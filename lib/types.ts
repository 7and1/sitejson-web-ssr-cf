// src/core/types.ts (Backend Source)

export interface SiteData {
  domain: string;
  updated_at: string;
  screenshot_url: string; // From VisualProvider (WebP)
  
  // New Visual Data
  visual: {
    dominant_color: string;
    font_family?: string;
  };

  // 1. Cloudflare Radar & Traffic (The "Numbers")
  radar: {
    global_rank: number;
    rank_bucket: string; // e.g. "Top 10k"
  };
  traffic_data: {
    monthly_visits: number;
    bounce_rate: number;
    top_country: string;
  } | null;

  // 2. AI Deep Analysis (Gemini)
  ai_analysis: {
    classification: {
      category: string; // IAB Tier 1
      sub_category: string; // IAB Tier 2
      tags: string[];
    };
    business: {
      summary: string;
      model: string; // B2B/B2C/SaaS etc.
      target_audience: string;
    };
    tech_stack: {
      cms?: string;
      frameworks?: string[];
      ui?: string[];
      infrastructure?: string[]; // Cloudflare, Vercel
    };
    risk: {
      is_spam: boolean;
      sentiment: "Professional" | "Spammy";
      score: number; // 0-100
    };
  } | null;

  // 3. Technical Meta (Browser)
  meta: {
    title: string;
    description: string;
    tech_stack_detected: string[]; // Fallback regex detection
  };

  // New SEO & Structure Data
  seo: {
    h1_count: number;
    h2_count: number;
    internal_links: number;
    external_links: number;
    images_count: number;
  };
  files: {
    has_sitemap: boolean;
    has_robots: boolean;
  };

  // New Infrastructure Data
  dns: {
    provider: string;
    mx_records: string[];
  };
  
  // 4. Graph & Network (Publisher Radar)
  adsense_graph: {
    has_google_id: boolean;
    google_pub_id?: string;
    network_size?: number; // How many other sites they own
    associated_domains?: string[];
  };

  // 5. System Status (For Polling)
  processing_status: 'idle' | 'pending' | 'completed' | 'failed';
}

// API Response Wrapper
export interface ApiResponse {
  status: 'processing' | 'completed' | 'error';
  data?: SiteData;
  is_stale?: boolean; // If true, frontend should show "Refresh" button
  message?: string;
  progress?: number;
  stage?: string;
}
