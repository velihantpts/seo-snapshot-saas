import { NextRequest, NextResponse } from 'next/server';
import { Paddle, Environment } from '@paddle/paddle-node-sdk';
import { PrismaClient } from '@prisma/client';

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: process.env.PADDLE_SANDBOX === 'true' ? Environment.sandbox : Environment.production,
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('paddle-signature') ?? '';

    let event: Awaited<ReturnType<typeof paddle.webhooks.unmarshal>>;
    try {
      event = await paddle.webhooks.unmarshal(rawBody, process.env.PADDLE_WEBHOOK_SECRET!, signature);
    } catch {
      console.error('[Paddle Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log(`[Paddle Webhook] Event: ${event.eventType}`);

    switch (event.eventType) {
      case 'subscription.created':
      case 'subscription.activated': {
        const sub = event.data as { customData?: { email?: string }; items?: { price?: { id?: string } }[] };
        const email = sub.customData?.email;
        if (!email) break;

        const priceId = sub.items?.[0]?.price?.id;
        const plan = priceId === process.env.PADDLE_PRICE_LIFETIME ? 'pro_lifetime' : 'pro_monthly';

        await prisma.user.updateMany({ where: { email }, data: { plan } });
        console.log(`[Paddle Webhook] ${email} → ${plan}`);
        break;
      }

      case 'transaction.completed': {
        // Handles one-time lifetime purchases
        const tx = event.data as { customData?: { email?: string }; items?: { price?: { id?: string } }[] };
        const email = tx.customData?.email;
        if (!email) break;

        const priceId = tx.items?.[0]?.price?.id;
        if (priceId === process.env.PADDLE_PRICE_LIFETIME) {
          await prisma.user.updateMany({ where: { email }, data: { plan: 'pro_lifetime' } });
          console.log(`[Paddle Webhook] ${email} → pro_lifetime (one-time)`);
        }
        break;
      }

      case 'subscription.canceled': {
        const sub = event.data as { customData?: { email?: string } };
        const email = sub.customData?.email;
        if (!email) break;

        await prisma.user.updateMany({ where: { email }, data: { plan: 'free' } });
        console.log(`[Paddle Webhook] ${email} → free (cancelled)`);
        break;
      }

      case 'subscription.past_due': {
        // Payment failed — keep access until hard cancellation
        const sub = event.data as { customData?: { email?: string } };
        console.warn(`[Paddle Webhook] Payment past due for: ${sub.customData?.email}`);
        break;
      }

      default:
        console.log(`[Paddle Webhook] Unhandled event: ${event.eventType}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Paddle Webhook] Error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
