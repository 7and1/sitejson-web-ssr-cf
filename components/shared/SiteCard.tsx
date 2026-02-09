import React from 'react';
import Link from 'next/link';
import { SiteData } from '../../lib/types';
import { Card } from '../ui/Card';
import { formatNumber } from '../../lib/utils';
import { Globe, TrendingUp } from 'lucide-react';

interface SiteCardProps {
  site: SiteData;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  return (
    <Link href={`/site/${site.domain}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300 group-hover:-translate-y-1">
        {/* Header / Thumbnail Area */}
        <div className="relative h-32 bg-slate-100 border-b border-slate-100 overflow-hidden">
          <img 
            src={site.screenshot_url} 
            alt={site.domain}
            className="w-full h-full object-cover object-top opacity-90 transition-opacity group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
             <span className="bg-white/90 backdrop-blur text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-slate-200">
                #{formatNumber(site.radar.global_rank)}
             </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <img 
                src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`} 
                alt="" 
                className="w-4 h-4 rounded-sm"
            />
            <h3 className="font-bold text-slate-900 truncate">{site.domain}</h3>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8 leading-relaxed">
            {site.ai_analysis?.business.summary || site.meta.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
             <div className="flex items-center gap-1 text-xs text-slate-400">
                <Globe size={12} />
                <span>{site.traffic_data?.top_country || 'N/A'}</span>
             </div>
             {site.traffic_data && (
               <div className="flex items-center gap-1 text-xs font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  <TrendingUp size={12} />
                  {formatNumber(site.traffic_data.monthly_visits)}
               </div>
             )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
