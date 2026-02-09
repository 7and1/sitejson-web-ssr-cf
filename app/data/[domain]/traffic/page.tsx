import React from 'react';
import {
  BarChart3,
  Globe,
  TrendingUp,
  Users,
  Tag,
  Search,
  Clock,
  Calendar,
  DollarSign,
  Hash,
  FileText,
  Activity,
} from 'lucide-react';
import { DataCard, DataRow, TagList } from '@/components/domain/data-card';
import { getSiteReport } from '@/lib/api-client/client';
import { formatNumber, formatDuration } from '@/lib/utils';

export const runtime = 'edge';

type TrafficPageProps = {
  params: Promise<{
    domain: string;
  }>;
};

function bounceRateColor(rate: number): string {
  if (rate < 40) return 'text-emerald-600';
  if (rate <= 70) return 'text-amber-600';
  return 'text-red-600';
}

function bounceRateBg(rate: number): string {
  if (rate < 40) return 'bg-emerald-50 border-emerald-200';
  if (rate <= 70) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

export default async function TrafficPage({ params }: TrafficPageProps) {
  const { domain } = await params;
  const result = await getSiteReport(domain);
  if (!result) return null;

  const { report } = result;
  const traffic = report.trafficData;
  const radar = report.radar;
  const ai = report.aiAnalysis;
  const topRegions = traffic?.topRegions ?? [];
  const topKeywords = traffic?.topKeywords ?? [];
  const maxShare = topRegions.length > 0 ? Math.max(...topRegions.map((r) => r.share)) : 1;

  return (
    <div className="space-y-6">
      {/* Traffic Overview */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          Traffic Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {traffic?.monthlyVisits != null && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Monthly Visits</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(traffic.monthlyVisits)}
              </p>
            </div>
          )}

          {traffic?.bounceRate != null && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Bounce Rate</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {traffic.bounceRate}%
              </p>
            </div>
          )}

          {radar?.globalRank != null && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium">Global Rank</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                #{formatNumber(radar.globalRank)}
              </p>
            </div>
          )}

          {radar?.rankBucket && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs font-medium">Rank Bucket</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {radar.rankBucket}
              </p>
            </div>
          )}

          {traffic?.countryRank != null && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Hash className="w-4 h-4" />
                <span className="text-xs font-medium">Country Rank</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                #{formatNumber(traffic.countryRank)}
              </p>
            </div>
          )}

          {traffic?.avgVisitDuration != null && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Avg Visit Duration</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {formatDuration(traffic.avgVisitDuration)}
              </p>
            </div>
          )}

          {traffic?.pagesPerVisit != null && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium">Pages per Visit</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {traffic.pagesPerVisit.toFixed(1)}
              </p>
            </div>
          )}

          {traffic?.domainAgeYears != null && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Domain Age</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {traffic.domainAgeYears.toFixed(1)} years
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Engagement Metrics */}
      {(traffic?.bounceRate != null || traffic?.avgVisitDuration != null || traffic?.pagesPerVisit != null) && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-500" />
            Engagement Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {traffic?.bounceRate != null && (
              <div className={`rounded-lg border p-5 ${bounceRateBg(traffic.bounceRate)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-5 h-5 ${bounceRateColor(traffic.bounceRate)}`} />
                  <span className="text-sm font-medium text-gray-700">Bounce Rate</span>
                </div>
                <p className={`text-3xl font-bold ${bounceRateColor(traffic.bounceRate)}`}>
                  {traffic.bounceRate}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {traffic.bounceRate < 40
                    ? 'Excellent - visitors engage deeply'
                    : traffic.bounceRate <= 70
                      ? 'Average - room for improvement'
                      : 'High - most visitors leave quickly'}
                </p>
              </div>
            )}

            {traffic?.avgVisitDuration != null && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Avg Visit Duration</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatDuration(traffic.avgVisitDuration)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Average time spent per session
                </p>
              </div>
            )}

            {traffic?.pagesPerVisit != null && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">Pages per Visit</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {traffic.pagesPerVisit.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Average pages viewed per session
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Domain Profile */}
      {(traffic?.domainAgeYears != null || traffic?.countryRank != null || traffic?.globalRank != null || radar?.globalRank != null || radar?.rankBucket || radar?.sourceTimestamp) && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-500" />
            Domain Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataCard title="Domain Info" icon={Calendar}>
              {traffic?.domainAgeYears != null && (
                <DataRow label="Domain Age" value={`${traffic.domainAgeYears.toFixed(1)} years`} />
              )}
              {traffic?.countryRank != null && (
                <DataRow
                  label="Country Rank"
                  value={
                    <span>
                      #{formatNumber(traffic.countryRank)}
                      {traffic.topCountry ? ` (${traffic.topCountry})` : ''}
                    </span>
                  }
                />
              )}
              {traffic?.globalRank != null && (
                <DataRow label="Traffic Global Rank" value={`#${formatNumber(traffic.globalRank)}`} />
              )}
            </DataCard>

            <DataCard title="Radar Data" icon={BarChart3}>
              {radar?.globalRank != null && (
                <DataRow label="Radar Global Rank" value={`#${formatNumber(radar.globalRank)}`} />
              )}
              {radar?.rankBucket && (
                <DataRow label="Rank Bucket" value={radar.rankBucket} />
              )}
              {radar?.sourceTimestamp && (
                <DataRow
                  label="Last Updated"
                  value={new Date(radar.sourceTimestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                />
              )}
              {radar?.queued && (
                <DataRow
                  label="Status"
                  value={
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Queued for update
                    </span>
                  }
                />
              )}
            </DataCard>
          </div>
        </section>
      )}

      {/* Top Keywords */}
      {topKeywords.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            Top Keywords
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-10">#</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Keyword</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Volume</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">CPC</th>
                </tr>
              </thead>
              <tbody>
                {topKeywords.map((kw, index) => (
                  <tr
                    key={kw.keyword}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  >
                    <td className="px-4 py-3">
                      <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{kw.keyword}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatNumber(kw.volume)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-gray-400" />
                        {kw.cpc.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Geographic Distribution */}
      {topRegions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-500" />
            Geographic Distribution
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <div className="space-y-3">
              {topRegions.map((region, index) => (
                <div key={region.country} className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-500">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{region.country}</span>
                      <span className="text-sm text-gray-500">{region.share}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(region.share / maxShare) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Radar Categories */}
      {radar?.categories && radar.categories.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-500" />
            Radar Categories
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <TagList tags={radar.categories} />
            {radar.sourceTimestamp && (
              <p className="text-xs text-gray-400 mt-3">
                Source: {new Date(radar.sourceTimestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            )}
            {radar.queued && (
              <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                Queued for update
              </span>
            )}
          </div>
        </section>
      )}

      {/* Category & Taxonomy */}
      {ai?.classification && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-500" />
            Category Classification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataCard title="IAB Taxonomy" icon={Tag}>
              <DataRow label="Primary Category" value={ai.classification.category ?? 'N/A'} />
              <DataRow label="Sub-Category" value={ai.classification.subCategory ?? 'N/A'} />
            </DataCard>

            {ai.classification.tags && ai.classification.tags.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Content Tags</h3>
                <TagList tags={ai.classification.tags} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Traffic Insights */}
      {traffic && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Traffic Insights</h2>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {traffic.bounceRate != null && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Engagement Level</h4>
                  <p className="text-xs text-blue-700">
                    {traffic.bounceRate < 50 ? 'High' : traffic.bounceRate < 70 ? 'Medium' : 'Low'} engagement based on {traffic.bounceRate}% bounce rate
                  </p>
                </div>
              )}
              {traffic.topCountry && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <h4 className="text-sm font-medium text-purple-900 mb-1">Geographic Reach</h4>
                  <p className="text-xs text-purple-700">
                    Primary audience from {traffic.topCountry}
                    {topRegions[0] ? ` (${topRegions[0].share}%)` : ''}
                  </p>
                </div>
              )}
              {radar?.rankBucket && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <h4 className="text-sm font-medium text-emerald-900 mb-1">Authority</h4>
                  <p className="text-xs text-emerald-700">
                    Ranked in {radar.rankBucket} globally
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
