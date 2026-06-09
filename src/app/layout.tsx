/**
 * Root layout for Teacher's Pet.
 * This wraps every page with providers (theme, toast, etc).
 * Uses Next.js App Router layout system.
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/shared/AuthProvider';

// Premium font — Inter is used by Notion, Linear, and many modern SaaS products
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Teacher's Pet — Plan Lessons in Minutes, Not Hours",
    template: "%s | Teacher's Pet",
  },
  description:
    "AI-powered lesson planning, worksheets, grading tools, classroom resources, and teacher productivity — all in one platform. Save 70% of your planning time.",
  keywords: [
    'teacher productivity',
    'AI lesson planner',
    'worksheet generator',
    'assessment maker',
    'rubric builder',
    'report comments',
    'curriculum alignment',
    'education technology',
    'edtech',
    "teacher's pet",
  ],
  authors: [{ name: "Teacher's Pet" }],
  creator: "Teacher's Pet",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://teacherspet.ai',
    title: "Teacher's Pet — Plan Lessons in Minutes, Not Hours",
    description:
      'AI-powered teacher productivity platform. Automate lesson planning, worksheets, assessments, and more.',
    siteName: "Teacher's Pet",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Teacher's Pet",
    description: 'Plan lessons in minutes, not hours.',
    creator: '@teacherspetai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f13' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  border: '1px solid var(--toast-border)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-inter)',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
