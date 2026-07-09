'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Fires a first-party pageview beacon on initial load and every route change.
export function Analytics() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  useEffect(() => {
    const referrer = firstLoad.current ? document.referrer : '';
    firstLoad.current = false;
    const payload = JSON.stringify({ path: pathname, referrer });
    // sendBeacon survives navigation; fetch is the fallback.
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true });
      }
    } catch { /* ignore */ }
  }, [pathname]);

  return null;
}
