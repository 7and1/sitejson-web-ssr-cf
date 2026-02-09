import React from 'react';
import { SiteData } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { BarChart3, Globe, TrendingUp } from 'lucide-react';
import { cn, formatNumber, getRankBadgeColor } from '../../lib/utils';
import { Badge } from '../ui/Badge';

export const MarketTrafficCard: React.FC<{ data: SiteData }> = ({ data }) => {
  const { radar, traffic_data } = data;

  if (!traffic_data) return null;

  return (
    <Card className="border border-slate-200 shadow-sm h-full flex flex-col">
      <CardHeader className="border-b border-slate-50 py-4 bg-slate-50/30">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700">
          <BarChart3 size={16} className="text-emerald-600" />
          Market & Traffic
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex flex-col gap-6 flex-1">
        
        {/* Global Rank */}
        <div>
          <div className="flex items-center justify-between mb-1">
             <span className="text-xs text-slate-500 font-medium">Global Rank</span>
             <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 border-0", getRankBadgeColor(radar.global_rank))}>
                {radar.rank_bucket}
             </Badge>
          </div>
          <div className="text-3xl font-mono font-bold text-slate-900">
            #{formatNumber(radar.global_rank)}
          </div>
        </div>

        {/* Visits & Country */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <div className="text-xs text-slate-500 mb-1">Visits</div>
                <div className="text-lg font-bold text-slate-900 flex items-baseline gap-1">
                    {formatNumber(traffic_data.monthly_visits)}
                    <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1 rounded">
                        <TrendingUp size={8} className="inline mr-0.5" /> 12%
                    </span>
                </div>
            </div>
            <div>
                <div className="text-xs text-slate-500 mb-1">Top Geo</div>
                <div className="text-sm font-medium text-slate-900 flex items-center gap-1.5 truncate">
                    <Globe size={14} className="text-slate-400" />
                    {traffic_data.top_country}
                </div>
            </div>
        </div>

        {/* Sparkline Visual (Static SVG) */}
        <div className="mt-auto h-10 w-full flex items-end opacity-50">
            <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,20 L0,10 L10,12 L20,5 L30,15 L40,8 L50,18 L60,10 L70,12 L80,4 L90,14 L100,2 L100,20 Z" fill="url(#gradient)" className="text-emerald-100" />
                <path d="M0,10 L10,12 L20,5 L30,15 L40,8 L50,18 L60,10 L70,12 L80,4 L90,14 L100,2" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>

      </CardContent>
    </Card>
  );
};