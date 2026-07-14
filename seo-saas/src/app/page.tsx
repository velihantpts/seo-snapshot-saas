import type { Metadata } from 'next';
import HomeClient from './HomeClient';

// The homepage is the one page that most needs a self-referencing canonical.
// It lives here (a server component) so it can export metadata; all the
// interactive UI is in HomeClient. Without this, the homepage shipped no
// canonical tag at all while every subpage had one.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Page() {
  return <HomeClient />;
}
