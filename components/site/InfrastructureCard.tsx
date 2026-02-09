import React from 'react';
import { SiteData } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Server, Mail, Cpu, Zap } from 'lucide-react';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

export const InfrastructureCard: React.FC<{ data: SiteData }> = ({ data }) => {
  const { dns, meta } = data;

  if (!dns) return null;

  return (
    <Card className="border border-slate-200 shadow-sm h-full flex flex-col">
      <CardHeader className="border-b border-slate-50 py-4 bg-slate-50/30">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700">
          <Server size={16} className="text-indigo-500" />
          Infrastructure
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex flex-col gap-6">
        
        {/* DNS / Email */}
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 flex items-center gap-1">
              <Zap size={10} /> DNS Provider
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-mono">
                {dns.provider}
              </Badge>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 flex items-center gap-1">
              <Mail size={10} /> Mail Exchange
            </div>
            <div className="text-xs font-mono text-slate-600 truncate bg-slate-50 p-1.5 rounded border border-slate-100">
              {dns.mx_records[0] || 'No MX records found'}
            </div>
          </div>
        </div>

        {/* Detected Tech */}
        <div className="mt-auto pt-4 border-t border-slate-50">
          <div className="text-[10px] font-bold uppercase text-slate-400 mb-2 flex items-center gap-1">
            <Cpu size={10} /> Detected Stack
          </div>
          <div className="flex flex-wrap gap-1.5">
            {meta.tech_stack_detected.map((tech) => (
              <Link key={tech} href={`/directory/technology/${tech.toLowerCase()}`}>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 hover:border-slate-400 cursor-pointer bg-white">
                  {tech}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
