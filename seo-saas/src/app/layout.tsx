import './globals.css';
import { Metadata, Viewport } from 'next';
import AuthProvider from '@/components/AuthProvider';
import { ToastProvider } from '@/components/Toast';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://seosnapshot.dev'),
  title: {
    default: 'SEO Snapshot — Free SEO Analyzer',
    template: '%s | SEO Snapshot',
  },
  description: 'Free SEO analyzer with 100 checks. Get copy-paste code fixes for meta tags, security headers, structured data, and more.',
  alternates: { canonical: 'https://seosnapshot.dev' },
  keywords: ['SEO', 'SEO analyzer', 'SEO audit', 'website analysis', 'Core Web Vitals', 'meta tags', 'accessibility'],
  authors: [{ name: 'SEO Snapshot' }],
  creator: 'SEO Snapshot',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://seosnapshot.dev',
    siteName: 'SEO Snapshot',
    title: 'SEO Snapshot — Free SEO Analyzer',
    description: '100 SEO checks with copy-paste code fixes. Free, no signup.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'SEO Snapshot - Free SEO Analyzer with 100 checks' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Snapshot — Free SEO Analyzer',
    description: '100 SEO checks with copy-paste code fixes. Free, no signup.',
    images: ['/og-image.svg'],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "SEO Snapshot",
          "url": "https://seosnapshot.dev",
          "description": "Free SEO analyzer with 100 checks. Get copy-paste code fixes for meta tags, security headers, and more.",
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
            <Navbar />
            <main id="main-content">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
