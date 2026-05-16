import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Kelem.co | School Parent Engagement Platform',
  description: 'Empowering schools with better parent engagement and streamlined branch management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(outfit.variable)}>
      <body className="font-sans antialiased bg-slate-50/50" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
