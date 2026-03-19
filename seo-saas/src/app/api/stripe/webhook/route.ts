import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    logger.error('stripe.webhook_signature_failed', { error: err.message });
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  logger.stripe(event.type);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      if (userId) {
        // Determine plan type based on payment mode
        const planType = session.mode === 'subscription' ? 'pro_monthly' : 'pro_lifetime';
        await prisma.user.update({
          where: { id: userId },
          data: { plan: planType, stripeId: session.customer },
        });
        logger.stripe('user.upgraded', { userId, planType });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as any;
      const user = await prisma.user.findFirst({ where: { stripeId: sub.customer } });
      if (user) {
        // Only downgrade if they're on monthly (lifetime users keep access)
        if (user.plan === 'pro_monthly') {
          await prisma.user.update({ where: { id: user.id }, data: { plan: 'free' } });
          logger.stripe('user.downgraded', { userId: user.id });
        }
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as any;
      const customer = invoice.customer;
      const user = await prisma.user.findFirst({ where: { stripeId: customer } });
      if (user) {
        logger.stripe('payment.failed', { userId: user.id, invoiceId: invoice.id });
        // Grace period: don't downgrade immediately, let Stripe retry
        // Stripe will eventually send customer.subscription.deleted if all retries fail
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as any;
      const user = await prisma.user.findFirst({ where: { stripeId: sub.customer } });
      if (user) {
        // Handle plan changes (upgrade/downgrade between tiers)
        const isActive = sub.status === 'active' || sub.status === 'trialing';
        if (!isActive && user.plan === 'pro_monthly') {
          await prisma.user.update({ where: { id: user.id }, data: { plan: 'free' } });
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
