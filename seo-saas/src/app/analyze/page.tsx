'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SEOReport } from '@/components/SEOReport';

export default function AnalyzePage() {
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('seo-result');
    if (stored) {
      const data = JSON.parse(stored);
      setResult(data);
      if (data.id) {
        sessionStorage.removeItem('seo-result');
        router.replace(`/analyze/${data.id}`);
      }
    } else {
      router.push('/');
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-50 border-b border-white/[0.06] print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors duration-150 text-sm">
            <ArrowLeft className="w-4 h-4" /> New analysis
          </Link>
        </div>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SEOReport result={result} />
      </div>
    </div>
  );
}
