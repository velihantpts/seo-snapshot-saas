'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SEOReport } from '@/components/SEOReport';

export default function AnalyzePage() {
  const { data: session } = useSession();
  const userPlan = (session?.user as any)?.plan || 'free';
  const isPro = userPlan === 'pro_monthly' || userPlan === 'pro_lifetime' || userPlan === 'pro';
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
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SEOReport result={result} isPro={isPro} />
      </div>
    </div>
  );
}
