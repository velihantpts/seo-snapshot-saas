import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in or create a free SEO Snapshot account with email, Google, or GitHub to run SEO audits, save your analysis history, and manage scheduled monitoring.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Client />;
}
