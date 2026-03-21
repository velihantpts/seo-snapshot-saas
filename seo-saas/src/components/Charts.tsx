'use client';

// ===== Issue Distribution Donut Chart =====
export function IssueDonut({ critical, warning }: { critical: number; warning: number }) {
  const total = critical + warning;
  if (total === 0) return null;

  const critPct = (critical / total) * 100;
  const warnPct = (warning / total) * 100;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const critOffset = circ - (critPct / 100) * circ;
  const warnStart = (critPct / 100) * circ;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg width={96} height={96} className="-rotate-90">
          <circle cx={48} cy={48} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
          {critical > 0 && (
            <circle cx={48} cy={48} r={r} fill="none" stroke="#f87171" strokeWidth="10"
              strokeDasharray={circ} strokeDashoffset={critOffset} strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
          )}
          {warning > 0 && (
            <circle cx={48} cy={48} r={r} fill="none" stroke="#fbbf24" strokeWidth="10"
              strokeDasharray={`${(warnPct / 100) * circ} ${circ}`}
              strokeDashoffset={-warnStart} strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold">{total}</span>
          <span className="text-[9px] text-white/40 uppercase">issues</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-xs text-white/60">{critical} Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-xs text-white/60">{warning} Warning</span>
        </div>
      </div>
    </div>
  );
}

// ===== Score Radar Chart (6 axes) =====
export function ScoreRadar({ scores }: { scores: { label: string; value: number }[] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 75;
  const sides = scores.length;

  const getPoint = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Background rings
  const rings = [25, 50, 75, 100].map(pct => {
    const r = (pct / 100) * maxR;
    const pts = Array.from({ length: sides }, (_, i) => getPoint(i, r));
    return pts.map(p => `${p.x},${p.y}`).join(' ');
  });

  // Data polygon
  const dataPoints = scores.map((s, i) => getPoint(i, (s.value / 100) * maxR));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Axis labels
  const labelPoints = scores.map((_, i) => getPoint(i, maxR + 18));

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background rings */}
        {rings.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}
        {/* Axes */}
        {scores.map((_, i) => {
          const p = getPoint(i, maxR);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
        })}
        {/* Data polygon */}
        <polygon points={dataPolygon} fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="2" />
        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="#6366f1" />
        ))}
        {/* Labels */}
        {labelPoints.map((p, i) => (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            className="fill-white/50 text-[9px]">
            {scores[i].label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ===== Score Trend Line Chart =====
export function ScoreTrend({ data }: { data: { date: string; score: number }[] }) {
  const dedupMap = new Map<string, number>();
  data.forEach(d => dedupMap.set(d.date, d.score));
  const deduped = Array.from(dedupMap.entries()).map(([date, score]) => ({ date, score }));

  if (deduped.length < 2) return null;

  const allSame = deduped.every(d => d.score === deduped[0].score);
  if (allSame) {
    return (
      <div>
        <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Score History</h4>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-white/50">{deduped.length} analyses &middot; Consistent score</span>
          <span className="text-2xl font-semibold text-accent-400 font-mono">{deduped[0].score}</span>
        </div>
      </div>
    );
  }

  const chartData = deduped.slice(-8);
  const scores = chartData.map(d => d.score);
  const minS = Math.max(0, Math.min(...scores) - 10);
  const maxS = Math.min(100, Math.max(...scores) + 10);
  const range = maxS - minS || 1;

  const w = 300, h = 100;
  const pL = 24, pR = 8, pT = 10, pB = 16;
  const cW = w - pL - pR, cH = h - pT - pB;

  const pts = chartData.map((d, i) => ({
    x: pL + (chartData.length > 1 ? (i / (chartData.length - 1)) * cW : cW / 2),
    y: pT + cH - ((d.score - minS) / range) * cH,
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${pT + cH} L ${pts[0].x} ${pT + cH} Z`;
  const yLabels = [minS, Math.round((minS + maxS) / 2), maxS];

  return (
    <div>
      <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Score History</h4>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.12)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </linearGradient>
        </defs>
        {yLabels.map(v => {
          const y = pT + cH - ((v - minS) / range) * cH;
          return <line key={v} x1={pL} x2={w - pR} y1={y} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />;
        })}
        <path d={areaD} fill="url(#trendGrad)" />
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={2.5} fill="#0a0e1a" stroke="#6366f1" strokeWidth="1.5" />
            <text x={p.x} y={p.y - 5} textAnchor="middle" className="fill-white/50 text-[5px] font-mono">{chartData[i].score}</text>
          </g>
        ))}
        {yLabels.map(v => {
          const y = pT + cH - ((v - minS) / range) * cH;
          return <text key={`y${v}`} x={pL - 3} y={y + 3} textAnchor="end" className="fill-white/25 text-[5px] font-mono">{v}</text>;
        })}
        {chartData.map((d, i) => {
          const show = chartData.length <= 4 || i === 0 || i === chartData.length - 1;
          return show ? <text key={i} x={pts[i].x} y={h - 2} textAnchor="middle" className="fill-white/25 text-[5px]">{d.date.slice(5)}</text> : null;
        })}
      </svg>
    </div>
  );
}

// ===== Mini Progress Bar =====
export function MiniProgress({ value, max = 100, color }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const barColor = color || (pct >= 75 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#f87171');

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <span className="text-xs font-mono text-white/40 w-7 text-right">{value}</span>
    </div>
  );
}

// ===== Benchmark Badge =====
export function BenchmarkBadge({ score, average }: { score: number; average: number }) {
  const diff = score - average;
  const pct = average > 0 ? Math.round((diff / average) * 100) : 0;
  const isAbove = diff >= 0;

  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-3">
      <div className={`text-2xl font-semibold ${isAbove ? 'text-emerald-400' : 'text-red-400'}`}>
        {isAbove ? '+' : ''}{pct}%
      </div>
      <div>
        <div className="text-xs text-white/50">vs. global average</div>
        <div className="text-xs text-white/30">Avg: {average}/100</div>
      </div>
    </div>
  );
}

// ===== Security Grade Card =====
export function SecurityGrade({ grade, score }: { grade: string; score: number }) {
  const colors: Record<string, { bg: string; text: string; glow: string }> = {
    'A+': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]' },
    'A':  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.12)]' },
    'B':  { bg: 'bg-blue-500/15', text: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(96,165,250,0.12)]' },
    'C':  { bg: 'bg-amber-500/15', text: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.12)]' },
    'D':  { bg: 'bg-orange-500/15', text: 'text-orange-400', glow: 'shadow-[0_0_20px_rgba(251,146,60,0.12)]' },
    'F':  { bg: 'bg-red-500/15', text: 'text-red-400', glow: 'shadow-[0_0_20px_rgba(248,113,113,0.15)]' },
  };
  const c = colors[grade] || colors['F'];

  return (
    <div className={`glass-card rounded-xl p-5 text-center ${c.glow}`}>
      <div className={`text-4xl font-bold tracking-tight ${c.text}`}>{grade}</div>
      <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">Security Grade</div>
      <div className="mt-3 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, background: grade.startsWith('A') ? '#34d399' : grade === 'B' ? '#60a5fa' : grade === 'C' ? '#fbbf24' : '#f87171' }} />
      </div>
      <div className="text-[10px] text-white/20 mt-1">{score}/100</div>
    </div>
  );
}

// ===== Tech Stack Badges =====
export function TechStackBadges({ stack }: { stack: { name: string; confidence: string; icon: string }[] }) {
  if (!stack || stack.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {stack.map(tech => (
        <div key={tech.name} className="glass-card rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-accent-500/10 flex items-center justify-center text-[9px] font-bold text-accent-400">
            {tech.icon}
          </span>
          <div>
            <span className="text-xs text-white/70">{tech.name}</span>
            {tech.confidence === 'medium' && <span className="text-[9px] text-white/20 ml-1">?</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== Category Health Bars =====
export function CategoryBars({ categories }: { categories: { label: string; count: number; color: string }[] }) {
  const maxCount = Math.max(...categories.map(c => c.count), 1);

  return (
    <div className="space-y-2">
      {categories.map(cat => (
        <div key={cat.label} className="flex items-center gap-3">
          <span className="text-xs text-white/50 w-20 flex-shrink-0 text-right">{cat.label}</span>
          <div className="flex-1 h-5 bg-white/[0.03] rounded-md overflow-hidden">
            <div
              className="h-full rounded-md transition-all duration-700 ease-out"
              style={{
                width: `${(cat.count / maxCount) * 100}%`,
                background: cat.color,
                minWidth: cat.count > 0 ? '8px' : '0',
              }}
            />
          </div>
          <span className="text-xs text-white/40 w-6 font-mono">{cat.count}</span>
        </div>
      ))}
    </div>
  );
}
