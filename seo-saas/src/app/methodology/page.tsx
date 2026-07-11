import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Scoring Methodology',
  description: 'Exactly how SEO Snapshot scores a page: the weighted formula across 10 categories, all individual meta, content, security, performance, and technical checks, and what we deliberately do not measure.',
  alternates: { canonical: '/methodology' },
};

export default function Page() {
  return <Client />;
}
