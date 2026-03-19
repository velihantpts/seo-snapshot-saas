'use client';
import { useEffect, useState, useRef } from 'react';

function getScoreColor(score: number) {
  if (score >= 75) return '#34d399';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

function getScoreLabel(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Needs Work';
  return 'Poor';
}

export function ScoreRing({ score, potentialScore, size = 140, label, showLabel = true }: {
  score: number; potentialScore?: number; size?: number; label?: string; showLabel?: boolean;
}) {
  const [displayScore, setDisplayScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (displayScore / 100) * circ;
  const color = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  // Count-up animation with requestAnimationFrame
  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          const duration = 1200;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayScore(Math.round(eased * score));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [score, hasAnimated]);

  return (
    <div
      ref={ref}
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label || 'SEO'} score: ${score} out of 100 — ${scoreLabel}`}
    >
      {/* Glow behind ring */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-20"
        style={{ background: color }}
      />

      <svg width={size} height={size} className="score-ring relative z-10">
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"
        />
        {/* Potential score ghost ring */}
        {potentialScore && potentialScore > score && (
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (potentialScore / 100) * circ}
            opacity="0.12"
            strokeDashoffset-transition="1.5s"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        )}
        {/* Score arc glow (behind) */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          opacity="0.15"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)', filter: 'blur(6px)' }}
        />
        {/* Score arc */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <span className="text-4xl font-semibold tracking-tight" style={{ color }}>
          {displayScore}
        </span>
        {showLabel && (
          <span className="text-[10px] font-medium tracking-wide uppercase mt-0.5" style={{ color: `${color}80` }}>
            {scoreLabel}
          </span>
        )}
      </div>
    </div>
  );
}

// Mini version for cards
export function ScoreBadge({ score, size = 48 }: { score: number; size?: number }) {
  const color = getScoreColor(score);
  const bg = score >= 75 ? 'rgba(52,211,153,0.1)' : score >= 50 ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)';

  return (
    <div
      className="flex items-center justify-center rounded-xl font-bold font-mono text-sm"
      style={{ width: size, height: size, background: bg, color }}
    >
      {score}
    </div>
  );
}
