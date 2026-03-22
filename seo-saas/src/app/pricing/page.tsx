'use client';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from '@/lib/i18n';


export default function Pricing() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const { t } = useLocale();

  const handleCheckout = async (priceType: string) => {
    if (!session) { signIn(); return; }
    if (!process.env.NEXT_PUBLIC_STRIPE_ENABLED) {
      alert('Payments coming soon! Contact support@seosnapshot.dev');
      return;
    }
    setLoading(priceType);
    try {
      const res = await fetch('/api/lemon', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: priceType }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.error) alert(data.error);
    } catch (e) { if (typeof console !== "undefined") console.error(e); }
    setLoading(null);
  };

  const plans = [
    {
      name: t('pricing.free'), price: '$0', period: '', description: t('pricing.free.desc'),
      cta: t('pricing.free.cta'), style: 'btn-ghost', href: '/',
      features: [
        { text: t('pf.5day'), ok: true }, { text: t('pf.score'), ok: true },
        { text: t('pf.meta'), ok: true }, { text: t('pf.og'), ok: true },
        { text: t('pf.json'), ok: true }, { text: t('pf.cwv'), ok: false },
        { text: t('pf.pdf'), ok: false }, { text: t('pf.monitor'), ok: false },
      ],
    },
    {
      name: t('pricing.pro'), price: '$4.99', period: '/mo', description: t('pricing.pro.desc'),
      cta: t('pricing.pro.cta'), style: 'btn-primary', priceType: 'monthly', popular: true,
      features: [
        { text: t('pf.unlimited'), ok: true }, { text: t('pf.everything'), ok: true },
        { text: t('pf.cwvfull'), ok: true }, { text: t('pf.secaudit'), ok: true },
        { text: t('pf.pdfexport'), ok: true }, { text: t('pf.share'), ok: true },
        { text: t('pf.weekly'), ok: true }, { text: t('pf.priority'), ok: true },
      ],
    },
    {
      name: t('pricing.lifetime'), price: '$29.99', period: '', description: t('pricing.lifetime.desc'),
      cta: t('pricing.lifetime.cta'), style: 'lifetime', priceType: 'lifetime',
      features: [
        { text: t('pf.everythingpro'), ok: true }, { text: t('pf.norecurring'), ok: true },
        { text: t('pf.allfuture'), ok: true }, { text: t('pf.daily'), ok: true },
        { text: t('pf.api'), ok: true }, { text: t('pf.early'), ok: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-14 sm:mb-16">
          <h1 className="heading-section mb-4 opacity-0 animate-fade-in-up">{t('pricing.title')}</h1>
          <p className="text-white/40 text-base opacity-0 animate-fade-in-up-delay-1">{t('pricing.desc')}</p>
          <p className="text-white/35 text-xs mt-3 opacity-0 animate-fade-in-up-delay-2">{t('pricing.trust')}</p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 opacity-0 animate-fade-in-up-delay-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">{t('early.badge')}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 opacity-0 animate-fade-in-up-delay-2">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-2xl p-6 sm:p-7 relative transition-all duration-200 ${
              plan.popular ? 'glass-card glow-border scale-[1.02] shadow-glow' : plan.name === 'Lifetime' ? 'glass-card border-amber-500/20' : 'glass-card'
            }`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent-500 text-xs font-bold tracking-wide shadow-glow-sm">{t('pricing.popular')}</div>}
              <h3 className="font-medium text-lg mb-1 text-white/90">{plan.name}</h3>
              <p className="text-white/45 text-xs mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-white/45 text-sm ml-1">{plan.period}</span>}
              </div>
              {plan.href ? (
                <Link href={plan.href} className={`block w-full text-center py-3 rounded-xl text-sm font-medium transition-all duration-150 mb-7 ${plan.style}`}>{plan.cta}</Link>
              ) : (
                <button onClick={() => handleCheckout(plan.priceType!)} disabled={loading === plan.priceType}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50 mb-7 ${
                    plan.style === 'lifetime' ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-surface shadow-[0_0_20px_rgba(245,158,11,0.2)]' : plan.style
                  }`}>
                  {loading === plan.priceType ? 'Loading...' : plan.cta}
                </button>
              )}
              <ul className="space-y-3">
                {plan.features.map(f => (
                  <li key={f.text} className={`flex items-start gap-2.5 text-sm ${f.ok ? 'text-white/60' : 'text-white/35'}`}>
                    {f.ok ? <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-accent-400' : plan.name === 'Lifetime' ? 'text-amber-400' : 'text-white/45'}`} />
                      : <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/10" />}
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 sm:mt-24 max-w-2xl mx-auto">
          <h2 className="text-2xl font-medium tracking-tight text-center mb-10">{t('pricing.faq')}</h2>
          <div className="space-y-3">
            {[
              { q: t('faq.cancel.q'), a: t('faq.cancel.a') },
              { q: t('faq.limit.q'), a: t('faq.limit.a') },
              { q: t('faq.monitor.q'), a: t('faq.monitor.a') },
              { q: t('faq.refund.q'), a: t('faq.refund.a') },
            ].map(faq => (
              <details key={faq.q} className="group glass-card rounded-xl">
                <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-white/70 hover:text-white/90 transition-colors duration-150 list-none flex items-center justify-between">
                  {faq.q}
                  <svg className="w-4 h-4 text-white/35 group-open:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-5 pb-4 text-sm text-white/40 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
