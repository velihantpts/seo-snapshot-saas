import { NextResponse } from 'next/server';
import { runScheduledMonitors } from '@/lib/worker/monitor-worker';
import { logger } from '@/lib/logger';

// Cron-triggered endpoint — call via external cron (Coolify, crontab, or Uptime Kuma)
// curl -X POST https://seosnapshot.dev/api/monitor/run -H "Authorization: Bearer $CRON_SECRET"
export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET || process.env.ADMIN_PASS;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  logger.info('monitor.cron.triggered');

  try {
    await runScheduledMonitors();
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    logger.error('monitor.cron.failed', { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
