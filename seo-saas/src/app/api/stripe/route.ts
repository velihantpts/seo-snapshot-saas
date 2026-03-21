import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { priceType } = await req.json();
  const priceId = priceType === 'lifetime' ? process.env.STRIPE_PRICE_LIFETIME! : process.env.STRIPE_PRICE_MONTHLY!;
  const userId = session.user.id;

  try {
    const checkout = await createCheckoutSession(userId, session.user.email, priceId);
    return NextResponse.json({ url: checkout.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
