import React from 'react';
import { SiteData } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Sparkles, ShieldAlert, ShieldCheck, Target } from 'lucide-react';
import { Badge } from '../ui/Badge';
import Link from 'next/link';
import { cn } from '../../lib/utils';

export const AiInsightsCard: React.FC<{ data: SiteData }> = ({ data }) => {
  const { ai_analysis } = data;

  if (!ai_analysis) return null;

  const riskScore = ai_analysis.risk.score;
  const isSafe = ai_analysis.risk.sentiment === 'Professional';

  // Calculate gauge rotation (0 to 180 deg)
  const rotation = (riskScore / 100) * 180;

  return (
    <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-white to-violet-50/30">
      <CardHeader className="border-b border-slate-100 py-4">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <div className="p-1.5 bg-violet-100 rounded-md text-violet-600">
             <Sparkles size={16} />
          </div>
          AI Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Left: Content Analysis */}
            <div className="flex-1 space-y-4">
                <p className="text-slate-700 leading-relaxed font-medium">
                    {ai_analysis.business.summary}
                </p>
                
                <div className="flex flex-wrap gap-2">
                    <Link href={`/directory/category/${ai_analysis.classification.category.toLowerCase()}`}>
                        <Badge className="bg-slate-900 text-white cursor-pointer px-3 py-1">
                            {ai_analysis.classification.category}
                        </Badge>
                    </Link>
                    <Badge variant="secondary" className="text-slate-600 bg-white border border-slate-200">
                        {ai_analysis.classification.sub_category}
                    </Badge>
                    {ai_analysis.classification.tags.slice(0,3).map(tag => (
                         <Badge key={tag} variant="outline" className="text-slate-500 border-slate-200">
                            #{tag}
                        </Badge>
                    ))}
                </div>

                <div className="flex items-start gap-2 pt-2">
                     <Target size={14} className="text-slate-400 mt-1" />
                     <div>
                         <span className="text-xs font-bold text-slate-500 uppercase">Target Audience</span>
                         <p className="text-sm text-slate-600">{ai_analysis.business.target_audience}</p>
                     </div>
                </div>
            </div>

            {/* Right: Risk Gauge */}
            <div className="w-full md:w-48 shrink-0 flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-32 h-16 overflow-hidden mb-2">
                    <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-slate-100 border-b-0 border-r-0"></div>
                    <div 
                        className={cn(
                            "absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-b-0 border-r-0 transition-all duration-1000 ease-out origin-bottom",
                            isSafe ? "border-emerald-500" : "border-rose-500"
                        )}
                        style={{ transform: `rotate(${rotation - 180}deg)` }}
                    ></div>
                </div>
                <div className="text-2xl font-bold text-slate-900 -mt-8">{riskScore}/100</div>
                <div className={cn("text-xs font-bold uppercase mt-1 flex items-center gap-1", isSafe ? "text-emerald-600" : "text-rose-600")}>
                    {isSafe ? <ShieldCheck size={12}/> : <ShieldAlert size={12}/>}
                    {ai_analysis.risk.sentiment}
                </div>
            </div>

        </div>
      </CardContent>
    </Card>
  );
};
