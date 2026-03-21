import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// GET — list user's monitors
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const userId = session.user.id;
  const plan = session.user.plan || 'free';

  if (plan === 'free') {
    return NextResponse.json({ error: 'Upgrade to Pro for scheduled monitoring' }, { status: 403 });
  }

  const monitors = await prisma.scheduledMonitor.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(monitors);
}

// POST — create a new monitor
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const userId = session.user.id;
  const plan = session.user.plan || 'free';

  if (plan === 'free') {
    return NextResponse.json({ error: 'Upgrade to Pro for scheduled monitoring' }, { status: 403 });
  }

  const { url, frequency } = await req.json();

  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });
  if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
    return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 });
  }

  // Limit monitors per user
  const count = await prisma.scheduledMonitor.count({ where: { userId } });
  if (count >= 10) {
    return NextResponse.json({ error: 'Maximum 10 monitors per account' }, { status: 400 });
  }

  const monitor = await prisma.scheduledMonitor.create({
    data: { userId, url, frequency },
  });

  logger.info('monitor.created', { userId, url, frequency });

  return NextResponse.json(monitor, { status: 201 });
}

// DELETE — remove a monitor
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const userId = session.user.id;
  const { id } = await req.json();

  const monitor = await prisma.scheduledMonitor.findUnique({ where: { id } });
  if (!monitor || monitor.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.scheduledMonitor.delete({ where: { id } });
  logger.info('monitor.deleted', { userId, monitorId: id });

  return NextResponse.json({ deleted: true });
}
