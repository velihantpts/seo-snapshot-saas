import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeURL } from '@/lib/seo-analyzer';
import { validateTargetURL } from '@/lib/ssrf-protection';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

// Public API endpoint — requires API key
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const apiKey = searchParams.get('key') || req.headers.get('x-api-key');

  if (!apiKey) {
    return NextResponse.json({ error: 'API key required. Pass as ?key=xxx or X-API-Key header.' }, { status: 401 });
  }

  if (!url) {
    return NextResponse.json({ error: 'URL required. Pass as ?url=https://example.com' }, { status: 400 });
  }

  // Validate API key
  const user = await prisma.user.findUnique({ where: { apiKey } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const isPro = user.plan === 'pro_monthly' || user.plan === 'pro_lifetime' || user.plan === 'pro';
  if (!isPro) {
    return NextResponse.json({ error: 'API access requires a Pro plan' }, { status: 403 });
  }

  // Rate limit: 50/day for API
  const rateResult = checkRateLimit(`api:${user.id}`, 50);
  if (!rateResult.allowed) {
    return NextResponse.json({ error: 'API rate limit exceeded (50/day)' }, { status: 429 });
  }

  // SSRF check
  const validation = validateTargetURL(url);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const result = await analyzeURL(validation.url!.toString());

    // Save to DB
    const analysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        url: validation.url!.toString(),
        score: result.score,
        data: JSON.stringify(result),
        issues: JSON.stringify(result.issues),
      },
    });

    logger.info('api.analysis', { userId: user.id, url: validation.url!.toString(), score: result.score });

    return NextResponse.json({ ...result, id: analysis.id });
  } catch (err: any) {
    logger.error('api.analysis_failed', { userId: user.id, url, error: err.message });
    return NextResponse.json({ error: `Analysis failed: ${err.message}` }, { status: 500 });
  }
}
