'use client';

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight mb-2">API Documentation</h1>
        <p className="text-white/40 text-sm mb-10">Integrate SEO Snapshot into your workflow with our REST API.</p>

        {/* Endpoint */}
        <div className="glass-card rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded">POST</span>
            <code className="text-sm text-white/80 font-mono">/api/v1/analyze</code>
          </div>
          <p className="text-white/40 text-sm mb-4">Analyze a URL and get a full SEO report with score, issues, and recommendations.</p>

          <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Request</h3>
          <pre className="bg-white/[0.03] rounded-lg p-4 text-xs font-mono text-white/70 overflow-x-auto mb-4">{`curl -X POST https://seosnapshot.dev/api/v1/analyze \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"url": "https://example.com"}'`}</pre>

          <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Response</h3>
          <pre className="bg-white/[0.03] rounded-lg p-4 text-xs font-mono text-white/70 overflow-x-auto">{`{
  "score": 72,
  "url": "https://example.com",
  "statusCode": 200,
  "fetchTime": 340,
  "issues": [
    {
      "severity": "critical",
      "problem": "Meta description is missing",
      "fix": "Add <meta name=\\"description\\" content=\\"...\\">",
      "category": "Meta",
      "impact": 15
    }
  ],
  "meta": { "title": {...}, "description": {...} },
  "security": { "grade": "B", "score": 73 },
  "techStack": [{ "name": "Next.js", "icon": "NX" }]
}`}</pre>
        </div>

        {/* Rate Limits */}
        <div className="glass-card rounded-xl p-5 mb-6">
          <h2 className="text-base font-medium mb-3">Rate Limits</h2>
          <div className="space-y-2 text-sm text-white/50">
            <div className="flex justify-between"><span>Free (no API key)</span><span className="text-white/70 font-mono">5/day</span></div>
            <div className="flex justify-between"><span>Pro (with API key)</span><span className="text-white/70 font-mono">100/day</span></div>
            <div className="flex justify-between"><span>Lifetime</span><span className="text-white/70 font-mono">500/day</span></div>
          </div>
        </div>

        {/* Response Fields */}
        <div className="glass-card rounded-xl p-5 mb-6">
          <h2 className="text-base font-medium mb-3">Response Fields</h2>
          <div className="space-y-1 text-sm">
            {[
              ['score', 'Overall SEO score 0-100'],
              ['issues[]', 'Array of detected issues with severity, problem, fix, category, impact'],
              ['meta', 'Title, description, canonical, viewport, lang, favicon, doctype'],
              ['security', 'Grade (A+ to F), score, headers, cookies, HTTPS'],
              ['performance', 'TTFB, HTML size, scripts, stylesheets, render-blocking'],
              ['techStack[]', 'Detected technologies (WordPress, Next.js, etc)'],
              ['categoryScores', 'Per-category scores: meta, technical, performance, security, content, social'],
              ['potentialScore', 'Estimated score if all critical issues are fixed'],
            ].map(([field, desc]) => (
              <div key={field} className="flex gap-3 py-2 border-b border-white/[0.04] last:border-0">
                <code className="text-xs font-mono text-accent-400 flex-shrink-0 w-32">{field}</code>
                <span className="text-white/50 text-xs">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Authentication */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-base font-medium mb-3">Authentication</h2>
          <p className="text-white/40 text-sm mb-3">
            API key is optional for free-tier usage. Pro users get an API key from their dashboard.
          </p>
          <pre className="bg-white/[0.03] rounded-lg p-3 text-xs font-mono text-white/70">Authorization: Bearer sk_live_...</pre>
        </div>
      </div>
    </div>
  );
}
