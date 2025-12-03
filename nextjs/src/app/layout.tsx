import type { Metadata } from 'next';
import { Orbitron, Quicksand } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@/theme';
import { AuthProvider } from '@/contexts';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  display: 'swap',
});

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Benjamin Grauer - Personal Website',
  description: 'Personal website of Benjamin Grauer - Software Engineer, Creative, and Tech Enthusiast',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${quicksand.variable}`}>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
        <Analytics />
      </body>
    </html>
  );
}
