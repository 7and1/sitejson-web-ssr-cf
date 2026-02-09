import React from 'react';
import { SiteData } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Briefcase, Share2, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

export const MonetizationCard: React.FC<{ data: SiteData }> = ({ data }) => {
  const { adsense_graph } = data;

  const hasAds = adsense_graph.has_google_id; // Using this as proxy for now

  return (
    <Card className="border border-slate-200 shadow-sm h-full flex flex-col">
      <CardHeader className="border-b border-slate-50 py-4 bg-slate-50/30">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700">
          <Briefcase size={16} className="text-amber-500" />
          Business Network
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex flex-col gap-6">
        
        {/* Ad Status */}
        <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Ad Status</span>
            <div className="flex items-center gap-1.5">
                {hasAds ? (
                    <>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-emerald-700">Running Ads</span>
                    </>
                ) : (
                    <>
                         <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <span className="text-xs font-medium text-slate-500">No Active Ads</span>
                    </>
                )}
            </div>
        </div>

        {/* Network Graph */}
        {hasAds && adsense_graph.google_pub_id && (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                 <div className="flex items-center gap-2 mb-2 text-amber-700">
                     <Share2 size={14} />
                     <span className="text-xs font-bold uppercase tracking-wider">Publisher Network</span>
                 </div>
                 <div className="text-xs font-mono text-amber-800 bg-white/50 px-2 py-1 rounded w-fit mb-3">
                     {adsense_graph.google_pub_id}
                 </div>
                 
                 <div className="flex flex-wrap gap-1.5">
                     {adsense_graph.associated_domains?.slice(0, 3).map(d => (
                         <Link key={d} href={`/site/${d}`}>
                             <Badge variant="secondary" className="bg-white hover:bg-white text-[10px] px-1.5 py-0.5 border-amber-200/50 text-slate-600">
                                 {d}
                             </Badge>
                         </Link>
                     ))}
                     {(adsense_graph.network_size || 0) > 3 && (
                         <span className="text-[10px] text-amber-600 font-medium pl-1">
                             +{ (adsense_graph.network_size || 0) - 3 } more
                         </span>
                     )}
                 </div>
            </div>
        )}

      </CardContent>
    </Card>
  );
};
