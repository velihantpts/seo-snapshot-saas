'use client';
import { useEffect, useState } from 'react';
import { Search, FileText, Shield, Zap, CheckCircle } from 'lucide-react';

const STEPS = [
  { icon: Search, label: 'Fetching page...' },
  { icon: FileText, label: 'Analyzing meta tags...' },
  { icon: Shield, label: 'Checking security headers...' },
  { icon: Zap, label: 'Measuring performance...' },
  { icon: CheckCircle, label: 'Generating report...' },
];

const FLOATING_WORDS = [
  'title tag', 'meta description', 'h1', 'canonical', 'robots.txt',
  'sitemap.xml', 'og:image', 'HSTS', 'alt text', 'JSON-LD',
  'viewport', 'HTTPS', 'schema', 'Core Web Vitals',
];

export function AnalysisLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s < STEPS.length - 1 ? s + 1 : s));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative py-8">
      {/* Floating keywords background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {FLOATING_WORDS.map((word, i) => (
          <span
            key={word}
            className="absolute text-[10px] sm:text-xs font-mono text-white/[0.06] whitespace-nowrap floating-word"
            style={{
              left: `${5 + (i * 37) % 90}%`,
              top: `${10 + (i * 23) % 80}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Steps */}
      <div className="relative z-10 max-w-sm mx-auto space-y-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          return (
            <div
              key={i}
              className="flex items-center gap-3 transition-all duration-500"
              style={{
                opacity: i <= step ? 1 : 0.2,
                transform: i <= step ? 'translateX(0)' : 'translateX(8px)',
              }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isDone ? 'bg-emerald-500/15' : isActive ? 'bg-accent-500/15' : 'bg-white/[0.03]'
              }`}>
                {isDone
                  ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                  : <Icon className={`w-4 h-4 ${isActive ? 'text-accent-400' : 'text-white/20'}`} />
                }
              </div>
              <span className={`text-sm transition-colors duration-300 ${
                isDone ? 'text-white/40 line-through' : isActive ? 'text-white/80' : 'text-white/20'
              }`}>
                {s.label}
              </span>
              {isActive && (
                <div className="w-3 h-3 border-2 border-accent-400/40 border-t-accent-400 rounded-full animate-spin ml-auto" />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-1 rounded-full bg-white/[0.04] overflow-hidden max-w-sm mx-auto">
        <div
          className="h-full bg-gradient-to-r from-accent-600 via-accent-400 to-violet-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
      <p className="text-center text-white/25 text-xs mt-3">Running 119 checks — typically 5-15 seconds</p>
    </div>
  );
}
