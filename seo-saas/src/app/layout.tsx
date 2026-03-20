import './globals.css';
import { Metadata, Viewport } from 'next';
import AuthProvider from '@/components/AuthProvider';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://seosnapshot.dev'),
  title: {
    default: 'SEO Snapshot — Free SEO Analyzer',
    template: '%s | SEO Snapshot',
  },
  description: 'Analyze any webpage\'s SEO in seconds. Get actionable fix recommendations, Core Web Vitals, security checks, accessibility audit, and more.',
  keywords: ['SEO', 'SEO analyzer', 'SEO audit', 'website analysis', 'Core Web Vitals', 'meta tags', 'accessibility'],
  authors: [{ name: 'SEO Snapshot' }],
  creator: 'SEO Snapshot',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://seosnapshot.dev',
    siteName: 'SEO Snapshot',
    title: 'SEO Snapshot — Free SEO Analyzer',
    description: 'Analyze any webpage\'s SEO in seconds. 20+ checks with actionable fix recommendations.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SEO Snapshot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Snapshot — Free SEO Analyzer',
    description: 'Analyze any webpage\'s SEO in seconds. 20+ checks with actionable fix recommendations.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0e1a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-lg">
          Skip to main content
        </a>
        <main id="main-content">
          <AuthProvider><ToastProvider>{children}</ToastProvider></AuthProvider>
        </main>
      </body>
    </html>
  );
}
