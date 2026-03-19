'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SEOReport } from '@/components/SEOReport';
import { ScrollProgress } from '@/components/ScrollProgress';

export default function AnalyzeByIdPage() {
  const params = useParams();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/analyze/${params.id}`);
        if (!res.ok) { setError('Analysis not found'); setLoading(false); return; }
        setResult(await res.json());
      } catch { setError('Failed to load analysis'); }
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
        <p className="text-white/50">{error || 'Analysis not found'}</p>
        <Link href="/" className="text-accent-400 hover:text-accent-300 transition-colors duration-150 text-sm">← Go back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface relative">
      <ScrollProgress />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-50 border-b border-white/[0.06] print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors duration-150 text-sm">
            <ArrowLeft className="w-4 h-4" /> New analysis
          </Link>
          <Link href="/dashboard" className="text-sm text-white/40 hover:text-white/70 transition-colors duration-150">Dashboard</Link>
        </div>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SEOReport result={result} />
      </div>
    </div>
  );
}
