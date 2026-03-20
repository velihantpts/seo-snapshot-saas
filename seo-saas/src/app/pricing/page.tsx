'use client';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { useState } from 'react';


export default function Pricing() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceType: string) => {
    if (!session) { signIn(); return; }
    if (!process.env.NEXT_PUBLIC_STRIPE_ENABLED) {
      alert('Payments coming soon! Contact support@seosnapshot.dev');
      return;
    }
    setLoading(priceType);
    try {
      const res = await fetch('/api/stripe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priceType }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
    setLoading(null);
  };

  const plans = [
    {
      name: 'Free', price: '$0', period: '', description: 'Try it out',
      cta: 'Get started', style: 'btn-ghost', href: '/',
      features: [
        { text: '5 analyses per day', ok: true }, { text: 'SEO score & issues', ok: true },
        { text: 'Meta tag analysis', ok: true }, { text: 'Open Graph & schema', ok: true },
        { text: 'JSON export', ok: true }, { text: 'Core Web Vitals', ok: false },
        { text: 'PDF reports', ok: false }, { text: 'Scheduled monitoring', ok: false },
      ],
    },
    {
      name: 'Pro', price: '$9.99', period: '/mo', description: 'For professionals',
      cta: 'Unlock All Issues', style: 'btn-primary', priceType: 'monthly', popular: true,
      features: [
        { text: 'Unlimited analyses', ok: true }, { text: 'Everything in Free', ok: true },
        { text: 'Core Web Vitals (FCP, LCP, CLS)', ok: true }, { text: 'Security & accessibility audit', ok: true },
        { text: 'PDF report export', ok: true }, { text: 'Shareable public reports', ok: true },
        { text: 'Weekly monitoring', ok: true }, { text: 'Priority support', ok: true },
      ],
    },
    {
      name: 'Lifetime', price: '$19.99', period: '', description: 'One-time. Forever.',
      cta: 'Buy Lifetime', style: 'lifetime', priceType: 'lifetime',
      features: [
        { text: 'Everything in Pro', ok: true }, { text: 'No recurring fees', ok: true },
        { text: 'All future features', ok: true }, { text: 'Daily monitoring', ok: true },
        { text: 'API access (coming soon)', ok: true }, { text: 'Early access', ok: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-14 sm:mb-16">
          <h1 className="heading-section mb-4 opacity-0 animate-fade-in-up">Simple, transparent pricing</h1>
          <p className="text-white/40 text-base opacity-0 animate-fade-in-up-delay-1">Start free. Upgrade when you need more power.</p>
          <p className="text-white/20 text-xs mt-3 opacity-0 animate-fade-in-up-delay-2">Trusted by developers, freelancers & agencies worldwide</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 opacity-0 animate-fade-in-up-delay-2">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-2xl p-6 sm:p-7 relative transition-all duration-200 ${
              plan.popular ? 'glass-card glow-border scale-[1.02] shadow-glow' : plan.name === 'Lifetime' ? 'glass-card border-amber-500/20' : 'glass-card'
            }`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent-500 text-xs font-bold tracking-wide shadow-glow-sm">POPULAR</div>}
              <h3 className="font-medium text-lg mb-1 text-white/90">{plan.name}</h3>
              <p className="text-white/30 text-xs mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-white/30 text-sm ml-1">{plan.period}</span>}
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
                  <li key={f.text} className={`flex items-start gap-2.5 text-sm ${f.ok ? 'text-white/60' : 'text-white/20'}`}>
                    {f.ok ? <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-accent-400' : plan.name === 'Lifetime' ? 'text-amber-400' : 'text-white/30'}`} />
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
          <h2 className="text-2xl font-medium tracking-tight text-center mb-10">FAQ</h2>
          <div className="space-y-3">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your Stripe billing portal. You keep access until the end of your billing period.' },
              { q: 'What happens at the free limit?', a: 'You can still view past analyses. The limit resets daily at midnight UTC.' },
              { q: 'What is scheduled monitoring?', a: 'Pro users can set up automatic SEO checks. We run the analysis on your schedule and notify you if your score drops.' },
              { q: 'Do you offer refunds?', a: 'Yes. Full refund within 7 days of purchase, no questions asked.' },
            ].map(faq => (
              <details key={faq.q} className="group glass-card rounded-xl">
                <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-white/70 hover:text-white/90 transition-colors duration-150 list-none flex items-center justify-between">
                  {faq.q}
                  <svg className="w-4 h-4 text-white/20 group-open:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
