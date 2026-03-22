'use client';
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Search, Zap, Shield, Smartphone, BarChart3, FileText, ArrowRight, Globe, Code, Eye } from 'lucide-react';
import Link from 'next/link';
import { Aurora } from '@/components/Aurora';
import { GlowCard } from '@/components/GlowCard';
import { TypeWriter } from '@/components/TypeWriter';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnalysisLoader } from '@/components/AnalysisLoader';
import { useLocale } from '@/lib/i18n';


export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ totalAnalyses: number; avgScore: number } | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Analysis failed'); setLoading(false); return; }
      if (data.id) {
        router.push(`/analyze/${data.id}`);
      } else {
        sessionStorage.setItem('seo-result', JSON.stringify(data));
        router.push('/analyze');
      }
    } catch { setError('Network error. Please try again.'); }
    setLoading(false);
  };

  const handleCrawl = async () => {
    if (!url.trim()) return;
    if (!session) { signIn(); return; }
    setCrawling(true);
    setError('');
    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Crawl failed'); setCrawling(false); return; }
      router.push(`/crawl/${data.id}`);
    } catch { setError('Network error.'); }
    setCrawling(false);
  };

  const features = [
    { icon: BarChart3, title: t('feat.seo'), desc: t('feat.seo.d') },
    { icon: Zap, title: t('feat.cwv'), desc: t('feat.cwv.d') },
    { icon: Shield, title: t('feat.sec'), desc: t('feat.sec.d') },
    { icon: Smartphone, title: t('feat.mob'), desc: t('feat.mob.d') },
    { icon: Eye, title: t('feat.a11y'), desc: t('feat.a11y.d') },
    { icon: FileText, title: t('feat.pdf'), desc: t('feat.pdf.d') },
    { icon: Globe, title: t('feat.social'), desc: t('feat.social.d') },
    { icon: Code, title: t('feat.tech'), desc: t('feat.tech.d') },
    { icon: BarChart3, title: t('feat.mon'), desc: t('feat.mon.d') },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background effects */}
      <Aurora />
      <div className="fixed inset-0 bg-grid opacity-40 pointer-events-none" />


      {/* Hero */}
      <section className="relative z-10 pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-8 opacity-0 animate-fade-in">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-white/50 text-[11px]">
              <Zap className="w-3 h-3 text-accent-400" /> {t('hero.badge')}
            </span>
          </div>

          <h1 className="heading-display mb-6 opacity-0 animate-fade-in-up">
            {t('hero.title1')}<br />
            <span className="gradient-text">{t('hero.title2')}</span>
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto mb-10 sm:mb-12 leading-relaxed opacity-0 animate-fade-in-up-delay-1">
            {t('hero.desc')}
          </p>

          {/* URL Input with typing placeholder */}
          <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto opacity-0 animate-fade-in-up-delay-2" role="search" aria-label="SEO Analysis">
            <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] input-glow transition-all duration-200">
              <div className="flex-1 flex items-center gap-3 px-4 relative">
                <Search className="w-5 h-5 text-white/45 flex-shrink-0" />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder=""
                    className="w-full bg-transparent outline-none text-white text-base min-w-0 relative z-10"
                    aria-label="URL to analyze"
                  />
                  {!url && (
                    <div className="absolute inset-0 flex items-center pointer-events-none z-0">
                      <TypeWriter />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading || crawling}
                  className="btn-primary flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>{t('hero.analyze')} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCrawl}
                  disabled={loading || crawling || !url.trim()}
                  className="btn-ghost flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-30 text-accent-400 whitespace-nowrap"
                  title="Crawl entire site (Pro)"
                >
                  {crawling ? (
                    <div className="w-4 h-4 border-2 border-accent-400/30 border-t-accent-400 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('hero.crawl')}</span>
                      <span className="text-[9px] bg-accent-500/15 px-1.5 py-0.5 rounded-full hidden sm:inline">PRO</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mt-3" role="alert">{error}</p>}
          </form>

          {/* Multi-step loading animation */}
          {loading && <AnalysisLoader />}

          {!loading && (
            <p className="text-white/50 text-xs mt-5 opacity-0 animate-fade-in-up-delay-3">
              {t('hero.free')}
            </p>
          )}

          {/* Why Different — inline with hero */}
          {!loading && (
            <div className="mt-16 max-w-2xl mx-auto opacity-0 animate-fade-in-up-delay-3">
              <div className="grid grid-cols-2 gap-3 text-left">
                {/* Others */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">{t('diff.others')}</div>
                  <div className="space-y-2">
                    <p className="text-xs text-white/45 flex gap-2"><span className="text-red-400/60">✗</span> {t('diff.ex1')}</p>
                    <p className="text-xs text-white/45 flex gap-2"><span className="text-red-400/60">✗</span> {t('diff.ex2')}</p>
                    <p className="text-xs text-white/45 flex gap-2"><span className="text-red-400/60">✗</span> {t('diff.ex3')}</p>
                  </div>
                </div>
                {/* Us */}
                <div className="rounded-xl bg-accent-500/[0.04] border border-accent-500/10 p-4">
                  <div className="text-[10px] text-accent-400 uppercase tracking-wider mb-3">{t('diff.wegive')}</div>
                  <div className="space-y-2">
                    <p className="text-xs text-white/60 flex gap-2"><span className="text-emerald-400">✓</span> {t('diff.us.copy')} <code className="text-accent-300/70 text-[10px]">&lt;meta&gt;</code> tag</p>
                    <p className="text-xs text-white/60 flex gap-2"><span className="text-emerald-400">✓</span> nginx / next.config.js code</p>
                    <p className="text-xs text-white/60 flex gap-2"><span className="text-emerald-400">✓</span> Complete JSON-LD schema</p>
                  </div>
                </div>
              </div>
              {/* Unique badges */}
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-[10px] text-white/45">
                  <span className="text-amber-400 font-bold text-xs">A+→F</span> {t('diff.secgrade')}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/45">
                  <span className="text-emerald-400 font-bold text-xs">+15</span> {t('diff.impact')}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/45">
                  <span className="text-accent-400 font-bold text-xs">56</span> {t('diff.snippets')}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats bar */}
      <ScrollReveal>
        <section className="relative z-10 py-12 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '100', label: t('stats.checks') },
              { value: stats && stats.totalAnalyses > 50 ? `${stats.totalAnalyses.toLocaleString()}` : '< 10s', label: stats && stats.totalAnalyses > 50 ? t('stats.analyzed') : t('stats.time') },
              { value: '100%', label: t('stats.serverside') },
              { value: 'Free', label: t('stats.nosignup') },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/90">{stat.value}</div>
                <div className="text-white/45 text-xs mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Demo preview */}
      <ScrollReveal>
        <section className="relative z-10 py-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <span className="text-xs text-white/35 ml-2 font-mono">seosnapshot.dev/analyze</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-5">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg width={80} height={80} className="score-ring">
                    <circle cx={40} cy={40} r={33} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                    <circle cx={40} cy={40} r={33} fill="none" stroke="#34d399" strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={207} strokeDashoffset={207 - (85/100)*207} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-semibold text-emerald-400">85</span>
                    <span className="text-[8px] text-emerald-400/60 uppercase">Good</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white/80 mb-1">example.com</div>
                  <div className="text-xs text-white/45">3 issues found · 1.2s response · 42 KB</div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { sev: 'critical', text: 'Meta description is missing', impact: 15 },
                  { sev: 'warning', text: 'No structured data (JSON-LD)', impact: 5 },
                  { sev: 'warning', text: '4 images not using WebP format', impact: 3 },
                ].map((issue, i) => (
                  <div key={i} className={`flex items-center justify-between text-xs py-2 px-3 rounded-lg ${
                    issue.sev === 'critical' ? 'bg-red-500/[0.06] text-red-400/80' : 'bg-amber-500/[0.06] text-amber-400/80'
                  }`}>
                    <span>{issue.text}</span>
                    <span className="text-emerald-400/60 text-[10px]">+{issue.impact} pts</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.04] text-center">
                <span className="text-xs text-white/35">{t('demo.try')}</span>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Features with mouse-tracking glow */}
      <section className="relative z-10 py-20 sm:py-28 px-4 sm:px-6">
        <div className="divider max-w-6xl mx-auto mb-20" />
        <ScrollReveal className="max-w-5xl mx-auto">
          <h2 className="heading-section text-center mb-4">{t('features.title')}</h2>
          <p className="text-white/40 text-center mb-14 sm:mb-16 max-w-md mx-auto text-sm leading-relaxed">
            {t('features.desc')}
          </p>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 60}>
              <GlowCard className="p-5 sm:p-6 group h-full">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4 group-hover:bg-accent-500/15 transition-colors duration-150">
                  <Icon className="w-5 h-5 text-accent-400" />
                </div>
                <h3 className="font-medium text-[15px] mb-2 text-white/90">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 sm:py-28 px-4 sm:px-6">
        <div className="divider max-w-6xl mx-auto mb-20" />
        <ScrollReveal className="max-w-xl mx-auto text-center">
          <h2 className="heading-section mb-4">{t('cta.title')}</h2>
          <p className="text-white/40 mb-6 text-sm">{t('cta.desc')}</p>
          <p className="text-white/40 mb-10 text-xs leading-relaxed max-w-md mx-auto">
            {t('cta.longdesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pricing" className="btn-primary text-center min-h-[44px] flex items-center justify-center">
              {t('cta.pricing')}
            </Link>
            {!session && (
              <button onClick={() => signIn()} className="btn-ghost min-h-[44px]">
                {t('cta.signin')}
              </button>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-xs">
          <span>&copy; 2026 SEO Snapshot · <span className="text-white/30">v1.129.0</span></span>
          <div className="flex gap-4">
            <Link href="/pricing" className="hover:text-white/50 transition-colors duration-150">Pricing</Link>
            <Link href="/blog" className="hover:text-white/50 transition-colors duration-150">Blog</Link>
            <Link href="/docs" className="hover:text-white/50 transition-colors duration-150">API</Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors duration-150">Terms</Link>
            <Link href="/privacy" className="hover:text-white/50 transition-colors duration-150">Privacy</Link>
            <a href="mailto:support@seosnapshot.dev" className="hover:text-white/50 transition-colors duration-150">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
