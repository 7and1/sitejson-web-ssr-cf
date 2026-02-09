import type { Metadata } from 'next';
import { buildBaseMetadata } from '@/lib/seo/metadata';
import { UiShell } from './ui-shell';
import './globals.css';

export const metadata: Metadata = buildBaseMetadata();

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <UiShell>{children}</UiShell>
      </body>
    </html>
  );
}
