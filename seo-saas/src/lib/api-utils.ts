import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export interface AuthResult {
  userId: string;
  plan: string;
  isPro: boolean;
  email: string | null;
}

export async function requireAuth(): Promise<AuthResult | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const plan = session.user.plan || 'free';
  return {
    userId: session.user.id,
    plan,
    isPro: plan === 'pro_monthly' || plan === 'pro_lifetime' || plan === 'pro',
    email: session.user.email || null,
  };
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Not authenticated' }, { status: 401 });
}

export function forbiddenResponse(message = 'Pro plan required') {
  return Response.json({ error: message }, { status: 403 });
}
