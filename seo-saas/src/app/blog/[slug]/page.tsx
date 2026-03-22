'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { articles } from '@/lib/blog-articles';

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articles[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium mb-2">Article not found</h1>
          <Link href="/blog" className="text-accent-400 text-sm">Back to blog</Link>
        </div>
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-medium mt-8 mb-3 text-white/90">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-medium mt-6 mb-2 text-white/80">{line.slice(4)}</h3>;
      if (line.startsWith('```')) return null;
      if (line.startsWith('|')) {
        const cells = line.split('|').filter(Boolean).map(c => c.trim());
        if (cells.every(c => c.match(/^-+$/))) return null;
        return <div key={i} className="grid grid-cols-3 gap-2 text-xs text-white/50 py-1.5 border-b border-white/[0.04]">{cells.map((c, j) => <span key={j}>{c}</span>)}</div>;
      }
      if (line.match(/^\d+\./)) return <p key={i} className="text-sm text-white/50 leading-relaxed ml-4 mb-1">{line}</p>;
      if (line.startsWith('- ')) return <p key={i} className="text-sm text-white/50 leading-relaxed ml-4 mb-1">{line}</p>;
      if (line.trim() === '') return <div key={i} className="h-2" />;
      if (line.startsWith('  ') && (line.includes('<') || line.includes('{') || line.includes('}'))) {
        return <pre key={i} className="text-xs font-mono text-accent-300/70 bg-white/[0.02] px-3 py-0.5">{line}</pre>;
      }
      return <p key={i} className="text-sm text-white/50 leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/blog" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-8 text-white/90">{article.title}</h1>
        <div className="prose-custom">
          {renderContent(article.content)}
        </div>
        <div className="mt-12 glass-card rounded-xl p-6 text-center">
          <p className="text-white/60 text-sm mb-3">Check your site&apos;s SEO score for free</p>
          <Link href="/" className="btn-primary text-sm">Analyze your site</Link>
        </div>
      </div>
    </div>
  );
}
