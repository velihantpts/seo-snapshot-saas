import type { Metadata } from 'next';

// Public share/report pages are thin, near-duplicate, user-generated audits of
// *other* people's sites and are rendered client-side (Google only sees an empty
// shell on first paint). Indexing them wastes crawl budget and risks index bloat,
// so we keep them publicly shareable but tell search engines not to index them.
// `follow: true` still lets any links on the page pass through.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
