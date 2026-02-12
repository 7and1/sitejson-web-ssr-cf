import React from 'react';
import type { SiteReport } from '../../lib/api-client/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Briefcase, FileText, CheckCircle2, XCircle, Megaphone } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const MonetizationCard: React.FC<{ data: SiteReport }> = ({ data }) => {
  const ads = data.ads;
  const publisher = data.publisher;

  const hasAds = ads?.isAdvertiser;
  const hasAdsTxt = publisher?.hasAdsTxt;
  const hasAnyData = ads || publisher;

  if (!hasAnyData) return null;

  return (
    <Card className="border border-slate-200 shadow-sm h-full flex flex-col">
      <CardHeader className="border-b border-slate-50 py-4 bg-slate-50/30">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700">
          <Briefcase size={16} className="text-amber-500" />
          Ads & Monetization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex flex-col gap-4">

        {/* Advertiser Status */}
        {ads && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Google Ads</span>
              <div className="flex items-center gap-1.5">
                {hasAds ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-emerald-700">Active</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <span className="text-xs font-medium text-slate-500">Not Detected</span>
                  </>
                )}
              </div>
            </div>
            {hasAds && typeof ads.resultCount === 'number' && (
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Megaphone size={10} />
                {ads.resultCount} ad{ads.resultCount !== 1 ? 's' : ''} found in transparency center
              </div>
            )}
            {ads.transparencySignals && ads.transparencySignals.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {ads.transparencySignals.slice(0, 3).map((signal) => (
                  <Badge key={signal} variant="outline" className="text-[10px] px-1.5 py-0 text-amber-700 border-amber-200">
                    {signal}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Publisher / ads.txt */}
        {publisher && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <FileText size={14} />
                <span>ads.txt</span>
              </div>
              {hasAdsTxt ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <XCircle size={16} className="text-slate-300" />
              )}
            </div>

            {publisher.adSystems && publisher.adSystems.length > 0 && (
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Ad Networks</div>
                <div className="flex flex-wrap gap-1">
                  {publisher.adSystems.slice(0, 4).map((sys) => (
                    <Badge key={sys} variant="secondary" className="text-[10px] px-1.5 py-0 bg-slate-100 text-slate-600">
                      {sys}
                    </Badge>
                  ))}
                  {publisher.adSystems.length > 4 && (
                    <span className="text-[10px] text-slate-400">+{publisher.adSystems.length - 4}</span>
                  )}
                </div>
              </div>
            )}

            {publisher.monetizationSignals && publisher.monetizationSignals.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {publisher.monetizationSignals.slice(0, 3).map((signal) => (
                  <Badge key={signal} variant="outline" className="text-[10px] px-1.5 py-0 text-slate-500 border-slate-200">
                    {signal}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
};
