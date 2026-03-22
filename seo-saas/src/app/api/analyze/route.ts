import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeURL } from '@/lib/seo-analyzer';
import { validateTargetURL } from '@/lib/ssrf-protection';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  const startTime = Date.now();
  const clientIP = getClientIP(req);
  const { url } = await req.json();

  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  // SSRF Protection — validate URL before fetching
  const validation = validateTargetURL(url);
  if (!validation.valid || !validation.url) {
    logger.ssrf(url, clientIP);
    return NextResponse.json({ error: validation.error || 'Invalid URL' }, { status: 400 });
  }
  const targetUrl = validation.url.toString();

  // Auth & plan check
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const plan = session?.user?.plan || 'free';
  const isPro = plan === 'pro_monthly' || plan === 'pro_lifetime' || plan === 'pro';

  // Rate limiting: IP-based for all users, stricter for free
  const dailyLimit = isPro ? 100 : 5;
  const rateLimitKey = userId ? `user:${userId}` : `ip:${clientIP}`;
  const rateResult = await checkRateLimit(rateLimitKey, dailyLimit);

  if (!rateResult.allowed) {
    logger.rateLimit(clientIP, '/api/analyze');
    return NextResponse.json(
      { error: isPro ? 'Daily limit reached. Please try again tomorrow.' : 'Daily limit reached (5/day). Upgrade to Pro for unlimited analyses.' },
      { status: 429, headers: { 'Retry-After': String(rateResult.retryAfter || 3600) } }
    );
  }

  try {
    const result = await analyzeURL(targetUrl);
    const duration = Date.now() - startTime;

    // Save to DB (for logged-in users always, for anonymous optionally)
    let analysisId: string | null = null;
    if (userId) {
      const analysis = await prisma.analysis.create({
        data: {
          userId,
          url: targetUrl,
          score: result.score,
          data: JSON.stringify(result),
          issues: JSON.stringify(result.issues),
          public: true,
        },
      });
      analysisId = analysis.id;
    } else {
      // Save anonymous analyses too (no userId) for shareable links
      const analysis = await prisma.analysis.create({
        data: {
          url: targetUrl,
          score: result.score,
          data: JSON.stringify(result),
          issues: JSON.stringify(result.issues),
          public: true,
        },
      });
      analysisId = analysis.id;
    }

    logger.analysis(targetUrl, duration, result.score, userId);

    return NextResponse.json({
      ...result,
      id: analysisId,
      remaining: rateResult.remaining,
    });
  } catch (err: any) {
    logger.analysisError(targetUrl, err.message, userId);

    // Descriptive error messages
    let userMessage = 'Failed to analyze this URL.';
    const msg = err.message?.toLowerCase() || '';
    if (msg.includes('abort') || msg.includes('timeout')) userMessage = 'The website took too long to respond (timeout). Try again or check if the site is online.';
    else if (msg.includes('enotfound') || msg.includes('dns')) userMessage = 'Could not resolve the domain name. Check the URL for typos.';
    else if (msg.includes('econnrefused')) userMessage = 'Connection refused by the server. The site may be down.';
    else if (msg.includes('ssl') || msg.includes('cert') || msg.includes('tls')) userMessage = 'SSL/TLS certificate error. The site may have an invalid or expired certificate.';
    else if (msg.includes('redirect')) userMessage = 'Too many redirects. The site has a redirect loop.';

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
