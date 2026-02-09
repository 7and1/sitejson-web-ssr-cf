'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutGrid, Cpu, Search, BarChart3, Briefcase, LucideIcon } from 'lucide-react';

interface NavTabsProps {
  domain: string;
}

interface Tab {
  name: string;
  href: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { name: 'Overview', href: '', icon: LayoutGrid },
  { name: 'Tech', href: '/tech', icon: Cpu },
  { name: 'SEO', href: '/seo', icon: Search },
  { name: 'Traffic', href: '/traffic', icon: BarChart3 },
  { name: 'Business', href: '/business', icon: Briefcase },
];

export function NavTabs({ domain }: NavTabsProps) {
  const pathname = usePathname();
  const basePath = `/data/${domain}`;

  return (
    <nav className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => {
          const href = `${basePath}${tab.href}`;
          const isActive = tab.href === ''
            ? pathname === basePath
            : pathname === href;

          const Icon = tab.icon;

          return (
            <a
              key={tab.name}
              href={href}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                isActive
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
