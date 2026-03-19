'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SEOReport } from '@/components/SEOReport';

export default function PublicReportPage() {
  const params = useParams();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/analyze/${params.id}?public=true`);
        if (!res.ok) { setError(res.status === 404 ? 'Report not found' : 'This report is not public'); setLoading(false); return; }
        setResult(await res.json());
      } catch { setError('Failed to load report'); }
      setLoading(false);
    }
    if (params.id) load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-4">
        <p className="text-white/40 text-lg">{error || 'Report not found'}</p>
        <Link href="/" className="btn-primary text-sm">Analyze your own site</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-50 border-b border-white/[0.06] print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-xs shadow-glow-sm">S</div>
            <span className="font-semibold text-sm tracking-tight">SEO <span className="text-accent-400">Snapshot</span></span>
          </Link>
          <Link href="/" className="btn-primary !py-2 text-sm">Analyze your site</Link>
        </div>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SEOReport result={result} isPublic={true} />
      </div>
    </div>
  );
}
