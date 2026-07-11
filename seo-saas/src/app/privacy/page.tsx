import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How SEO Snapshot handles your data: what we collect at sign-in, how analysis history is used, the third parties involved (Paddle, Google, GitHub), our cookie use, and how to delete your account.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Client />;
}
