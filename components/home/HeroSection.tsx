"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { CodeViewer } from './CodeViewer';

export const HeroSection: React.FC = () => {
  const [demoDomain, setDemoDomain] = useState('openai.com');
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  // Typing effect simulation if empty
  useEffect(() => {
    if (!inputValue) {
      const domains = ['stripe.com', 'vercel.com', 'figma.com', 'linear.app'];
      let i = 0;
      let interval = setInterval(() => {
        setDemoDomain(domains[i]);
        i = (i + 1) % domains.length;
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputValue || demoDomain;
    const cleanDomain = raw
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0];

    if (!cleanDomain || !cleanDomain.includes('.')) {
      return;
    }

    router.push(`/data/${cleanDomain}`);
  };

  // Pass either the user's typed input OR the cycling demo domain
  const displayDomain = inputValue || demoDomain;

  return (
    <section className="relative w-full overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-32">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Value Prop */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 border border-slate-200">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              v2.0 Now Live: 1M+ Domains Indexed
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Website intelligence, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                structured data.
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              The all-in-one API for traffic estimates, tech stack detection, and AI risk analysis. Enrich your app in &lt; 200ms.
            </p>

            <div className="mt-4 w-full max-w-md">
              <form onSubmit={handleAnalyze} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Enter a domain to analyze (e.g. linear.app)"
                  className="block w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-32 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm text-lg font-medium"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-2 right-2">
                  <Button type="submit" size="md" className="h-full rounded-lg px-6 font-semibold shadow-md bg-slate-900 hover:bg-slate-800">
                    Analyze
                  </Button>
                </div>
              </form>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Zap size={14} className="text-amber-500"/> No credit card required</span>
                <span className="hidden sm:inline">•</span>
                <span>100 free requests/mo</span>
                <span className="hidden sm:inline">•</span>
                <span>Cancel anytime</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <a href="https://api.sitejson.com/api/docs" target="_blank" rel="noreferrer">
                <Button size="lg" className="font-semibold px-8 h-12 bg-slate-900 text-white hover:bg-slate-800">
                  Get API Key
                </Button>
              </a>
              <a href="https://api.sitejson.com/api/docs" target="_blank" rel="noreferrer">
                <Button variant="outline" className="font-semibold px-8 h-12 border-slate-300 text-slate-600 hover:border-slate-800 hover:text-slate-900">
                  View Documentation
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Code Viewer */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[500px] w-full"
          >
            {/* Abstract Background Blurs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl"></div>
            
            <div className="relative h-full transform hover:scale-[1.01] transition-transform duration-500 ease-out">
              <CodeViewer domain={displayDomain} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
