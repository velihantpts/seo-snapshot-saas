import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const adminEmail = process.env.ADMIN_EMAIL || '';
  const adminPass = process.env.ADMIN_PASS || '';

  if (!adminEmail || !adminPass) {
    return NextResponse.json({ ok: false, error: 'Admin not configured' }, { status: 500 });
  }

  if (email === adminEmail && password === adminPass) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
}
