import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'API Docs',
  description: 'Developer documentation for the SEO Snapshot API: POST a URL to /api/v1/analyze and get back an SEO score, issues, security grade, and tech stack as JSON. Includes rate limits and auth.',
  alternates: { canonical: '/docs' },
};

export default function Page() {
  return <Client />;
}
