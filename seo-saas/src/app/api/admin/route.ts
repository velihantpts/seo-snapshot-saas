import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, createAdminToken, verifyAdminToken, verifyCredential } from '@/lib/admin-auth';

// GET — report whether the current request carries a valid admin session cookie.
// Lets the client restore auth state on reload instead of relying on ephemeral
// in-memory state.
export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const authed = await verifyAdminToken(token, process.env.NEXTAUTH_SECRET || '');
  return NextResponse.json({ authed });
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  // Accept either name — the route historically read ADMIN_EMAIL while
  // .env.example documented ADMIN_USER.
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_USER || '';
  const adminPass = process.env.ADMIN_PASS || '';
  const secret = process.env.NEXTAUTH_SECRET || '';

  if (!adminEmail || !adminPass || !secret) {
    return NextResponse.json({ ok: false, error: 'Admin not configured' }, { status: 500 });
  }

  // Always evaluate both to keep timing constant regardless of which is wrong.
  const emailOk = await verifyCredential(secret, String(email ?? ''), adminEmail);
  const passOk = await verifyCredential(secret, String(password ?? ''), adminPass);

  if (!emailOk || !passOk) {
    return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createAdminToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 12 * 60 * 60,
  });
  return res;
}
