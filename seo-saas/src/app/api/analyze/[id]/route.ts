import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const url = new URL(req.url);
  const isPublicRequest = url.searchParams.get('public') === 'true';

  const analysis = await prisma.analysis.findUnique({ where: { id } });

  if (!analysis) {
    return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
  }

  // Public report access — only if marked as public
  if (isPublicRequest) {
    if (!analysis.public) {
      return NextResponse.json({ error: 'This report is not public' }, { status: 403 });
    }
    return NextResponse.json(JSON.parse(analysis.data));
  }

  // Private access — user must own the analysis
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (analysis.userId && analysis.userId !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  return NextResponse.json(JSON.parse(analysis.data));
}

// Toggle public visibility
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const userId = (session.user as any).id;
  const analysis = await prisma.analysis.findUnique({ where: { id: params.id } });

  if (!analysis || analysis.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { public: isPublic } = await req.json();
  const updated = await prisma.analysis.update({
    where: { id: params.id },
    data: { public: isPublic },
  });

  return NextResponse.json({ public: updated.public });
}
