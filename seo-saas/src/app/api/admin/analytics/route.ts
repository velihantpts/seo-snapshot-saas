import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifyAdminToken(token, process.env.NEXTAUTH_SECRET || ''))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = Date.now();
  const d7 = new Date(now - 7 * 86400_000);
  const d30 = new Date(now - 30 * 86400_000);

  const [
    views7, views30,
    uniq7, uniq30,
    topPages, topReferrers,
    analyses30, totalUsers, paidUsers,
  ] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: d7 } } }),
    prisma.pageView.count({ where: { createdAt: { gte: d30 } } }),
    prisma.pageView.groupBy({ by: ['visitorHash'], where: { createdAt: { gte: d7 } } }),
    prisma.pageView.groupBy({ by: ['visitorHash'], where: { createdAt: { gte: d30 } } }),
    prisma.pageView.groupBy({ by: ['path'], where: { createdAt: { gte: d30 } }, _count: { path: true }, orderBy: { _count: { path: 'desc' } }, take: 8 }),
    prisma.pageView.groupBy({ by: ['referrer'], where: { createdAt: { gte: d30 }, referrer: { not: null } }, _count: { referrer: true }, orderBy: { _count: { referrer: 'desc' } }, take: 8 }),
    prisma.analysis.count({ where: { createdAt: { gte: d30 } } }),
    prisma.user.count(),
    prisma.user.count({ where: { plan: { not: 'free' } } }),
  ]);

  return NextResponse.json({
    pageviews: { d7: views7, d30: views30 },
    visitors: { d7: uniq7.length, d30: uniq30.length },
    topPages: topPages.map((p) => ({ path: p.path, count: p._count.path })),
    topReferrers: topReferrers.map((r) => ({ referrer: r.referrer, count: r._count.referrer })),
    funnel: { analyses30: analyses30, users: totalUsers, paid: paidUsers },
  });
}
