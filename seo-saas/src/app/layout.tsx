import './globals.css';
import { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Bricolage_Grotesque } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider';
import { ToastProvider } from '@/components/Toast';
import { Navbar } from '@/components/Navbar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Analytics } from '@/components/Analytics';
import { Footer } from '@/components/Footer';

// Self-hosted at build time (served from our own domain) so the CSP
// (font-src 'self') is satisfied — no blocked Google Fonts CDN request.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
// Signature display face — characterful grotesque for headings, self-hosted at
// build time so the CSP (font-src 'self') is satisfied. Body stays Inter.
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://seosnapshot.dev'),
  title: {
    default: 'SEO Snapshot — Free SEO Report & Analyzer',
    template: '%s | SEO Snapshot',
  },
  description: 'Free SEO report in seconds. 100 on-page checks with copy-paste code fixes for meta tags, security headers, and Core Web Vitals. No signup.',
  // NOTE: no site-wide `alternates.canonical` here. A default canonical is
  // inherited by every child route that doesn't set its own, which made
  // /pricing, /compare, /docs, /methodology, /terms, /privacy, /login all
  // canonicalize to the homepage → Google deduped them out of the index.
  // Blog and tool pages set their own self-referencing canonical; every other
  // page now self-canonicalizes to its real URL (metadataBase resolves it).
  keywords: ['SEO', 'SEO analyzer', 'SEO audit', 'website analysis', 'Core Web Vitals', 'meta tags', 'accessibility'],
  authors: [{ name: 'SEO Snapshot' }],
  creator: 'SEO Snapshot',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://seosnapshot.dev',
    siteName: 'SEO Snapshot',
    title: 'SEO Snapshot — Free SEO Report & Analyzer',
    description: 'Get a free SEO report with 100 checks and copy-paste code fixes. No signup.',
    // Image supplied by the file-based `opengraph-image.tsx` (dynamic PNG).
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Snapshot — Free SEO Report & Analyzer',
    description: 'Get a free SEO report with 100 checks and copy-paste code fixes. No signup.',
    // Image supplied by the file-based `twitter-image.tsx` (dynamic PNG).
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
    <html lang="en" className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable} ${bricolage.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "SEO Snapshot",
          "url": "https://seosnapshot.dev",
          "description": "Free SEO report generator. Analyze any URL against 100 on-page checks and get copy-paste code fixes for meta tags, security headers, structured data, and Core Web Vitals.",
          "applicationCategory": "SEO Tool",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "author": { "@type": "Organization", "name": "SEO Snapshot" }
        })}} />
      </head>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-lg">
          Skip to main content
        </a>
        <AuthProvider>
          <ToastProvider>
            <Analytics />
            <Navbar />
            <ErrorBoundary><main id="main-content">{children}</main></ErrorBoundary>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
