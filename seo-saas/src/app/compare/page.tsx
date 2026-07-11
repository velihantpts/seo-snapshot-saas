import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Compare Two Websites Side by Side',
  description: 'Run two URLs through SEO Snapshot at once and compare their SEO score, security grade, response time, word count, and issues side by side to see which site wins.',
  alternates: { canonical: '/compare' },
};

export default function Page() {
  return <Client />;
}
