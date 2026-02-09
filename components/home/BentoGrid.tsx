"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Layers, Network, ShieldCheck, TrendingUp, Cpu, Database, Server, Code2, Globe, Box, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

export const BentoGrid: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            More than just a screenshot. <br/>
            <span className="text-slate-500">Full X-Ray vision for any URL.</span>
          </h2>
          <p className="text-lg text-slate-600">
            We aggregate 50+ data points from DNS, HTML, and Traffic providers to give you the complete picture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* Card 1: Visual Intelligence (Browser Mockup) */}
          <motion.div 
            className="col-span-1 md:col-span-2 row-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative group flex flex-col"
            whileHover={{ y: -4 }}
          >
            <div className="p-6 pb-2">
                <div className="flex items-center gap-2 text-slate-900 font-semibold mb-1">
                <Layers className="text-blue-500" />
                <h3>Visual & Brand Analysis</h3>
                </div>
                <p className="text-slate-500 text-sm">
                Automated screenshots, UI scoring, and brand color extraction via computer vision.
                </p>
            </div>
            
            {/* Browser Window Mockup */}
            <div className="flex-1 px-6 pb-6 relative">
                 <div className="w-full h-full bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex flex-col shadow-inner">
                    {/* Browser Header */}
                    <div className="h-8 bg-white border-b border-slate-200 flex items-center px-3 gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div className="ml-3 flex-1 h-4 bg-slate-50 rounded border border-slate-100"></div>
                    </div>
                    {/* Browser Body (Wireframe) */}
                    <div className="flex-1 bg-white p-4 relative overflow-hidden">
                        <div className="w-full h-32 bg-slate-50 rounded-lg border border-slate-100 mb-4 flex items-center justify-center">
                            <div className="text-slate-200 text-4xl opacity-20"><Globe /></div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/3 h-20 bg-slate-50 rounded-lg border border-slate-100"></div>
                            <div className="w-1/3 h-20 bg-slate-50 rounded-lg border border-slate-100"></div>
                            <div className="w-1/3 h-20 bg-slate-50 rounded-lg border border-slate-100"></div>
                        </div>

                        {/* Floating AI Analysis Badge */}
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md border border-indigo-100 shadow-xl rounded-xl p-3 flex items-center gap-3 z-10"
                        >
                             <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Activity size={16} />
                             </div>
                             <div>
                                 <div className="text-xs font-bold text-slate-800">UI Score: 98/100</div>
                                 <div className="text-[10px] text-slate-400 font-mono">Brand: #6366F1</div>
                             </div>
                        </motion.div>
                    </div>
                 </div>
            </div>
          </motion.div>

          {/* Card 2: Traffic */}
          <motion.div 
            className="col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
            whileHover={{ y: -4 }}
          >
             <div className="flex items-center justify-between mb-2">
                <TrendingUp className="text-emerald-500" />
                <span className="text-xs font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">+12%</span>
             </div>
             <div>
                <div className="text-3xl font-bold text-slate-900 font-mono">1.2M</div>
                <div className="text-sm text-slate-500">Monthly Visits</div>
             </div>
             {/* Fake Chart */}
             <div className="h-12 w-full flex items-end gap-1 mt-4">
                {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-100 rounded-sm" style={{ height: `${h}%` }}></div>
                ))}
             </div>
          </motion.div>

          {/* Card 3: Tech Stack (Icons) */}
          <motion.div 
            className="col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-2 mb-2">
               <Cpu className="text-purple-500" />
               <h3 className="font-semibold text-slate-900">Technology Fingerprinting</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
               Detect 500+ technologies including CMS, frameworks, analytics, and payment processors.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
                {[
                    { icon: <Code2 size={20} />, label: "React" },
                    { icon: <Server size={20} />, label: "Node" },
                    { icon: <Database size={20} />, label: "SQL" },
                    { icon: <Box size={20} />, label: "Docker" },
                    { icon: <Globe size={20} />, label: "CDN" },
                    { icon: <Zap size={20} />, label: "Vercel" },
                ].map((tech, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 group/icon cursor-default">
                        <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover/icon:bg-slate-900 group-hover/icon:text-white transition-colors">
                            {tech.icon}
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">{tech.label}</span>
                    </div>
                ))}
            </div>
          </motion.div>

          {/* Card 4: Network */}
          <motion.div 
            className="col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-2 mb-4">
               <Network className="text-blue-400" />
               <h3 className="font-semibold">Ownership & Networks</h3>
            </div>
            <div className="text-sm text-slate-300 mb-4">
                Uncover hidden connections. Map domains via shared AdSense IDs and analytics tags.
            </div>
            <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs">A</div>
                    <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800 flex items-center justify-center text-xs">B</div>
                    <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-slate-800 flex items-center justify-center text-xs">+5</div>
                </div>
                <span className="text-xs font-mono text-blue-300">pub-8192...</span>
            </div>
          </motion.div>

          {/* Card 5: AI Risk */}
          <motion.div 
            className="col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                    <ShieldCheck className="text-indigo-500" />
                    <h3 className="font-semibold text-slate-900">AI Legitimacy Score</h3>
               </div>
               <span className="text-2xl font-bold text-indigo-600">98</span>
            </div>
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[98%] bg-gradient-to-r from-rose-400 to-indigo-500"></div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
                Multi-modal AI analysis to detect phishing, spam, and parked domains instantly.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};