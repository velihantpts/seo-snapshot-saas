import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Paddle, Environment } from '@paddle/paddle-node-sdk';

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: process.env.PADDLE_SANDBOX === 'true' ? Environment.sandbox : Environment.production,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please sign in first' }, { status: 401 });
    }

    const { plan } = await req.json();

    const priceId =
      plan === 'lifetime'
        ? process.env.PADDLE_PRICE_LIFETIME!
        : process.env.PADDLE_PRICE_MONTHLY!;

    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 500 });
    }

    const transaction = await paddle.transactions.create({
      items: [{ priceId, quantity: 1 }],
      customData: { email: session.user.email },
      checkout: { url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true` },
    });

    const checkoutUrl = transaction.checkout?.url;
    if (!checkoutUrl) {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error('[Paddle] Checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
