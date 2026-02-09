"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Menu } from 'lucide-react';
import { SearchBar } from '../site/SearchBar';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between max-w-7xl gap-4">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <div className="bg-slate-900 text-white p-1.5 rounded-md">
            <LayoutGrid size={18} />
          </div>
          <span className="hidden sm:inline-block">SiteJson</span>
        </Link>

        {/* Middle: Compact Search (Hidden on Home Hero) */}
        {!isHomePage && (
          <div className="flex-1 max-w-md hidden md:block animate-in fade-in slide-in-from-top-2 duration-300">
            <SearchBar variant="compact" placeholder="Search any domain..." />
          </div>
        )}

        {/* Right: Navigation */}
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link href="/directory/category/technology" className="hidden md:block hover:text-slate-900 transition-colors">Directory</Link>
          <a href="#" className="hidden md:block hover:text-slate-900 transition-colors">API Pricing</a>
          <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
          <a href="#" className="hover:text-slate-900 transition-colors">Login</a>
          <Button size="sm" className="hidden sm:flex">Get API Key</Button>
          
          {/* Mobile Menu Toggle (Visual Only) */}
          <button className="md:hidden text-slate-500">
            <Menu size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
};
