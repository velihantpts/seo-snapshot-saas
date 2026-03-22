import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
const WEBHOOK_SECRET = process.env.LEMON_WEBHOOK_SECRET || 'seosnapshot_lemon_wh_2026_secret';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';

    // Verify signature
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    hmac.update(rawBody);
    const digest = hmac.digest('hex');

    if (digest !== signature) {
      console.error('Lemon Squeezy webhook signature mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data;
    const email = customData?.email || payload.data?.attributes?.user_email || '';
    const variantId = payload.data?.attributes?.first_order_item?.variant_id?.toString() ||
                      payload.data?.attributes?.variant_id?.toString() || '';

    console.log(`[Lemon Webhook] Event: ${eventName}, Email: ${email}, Variant: ${variantId}`);

    if (!email) {
      console.error('No email found in webhook payload');
      return NextResponse.json({ ok: true });
    }

    const MONTHLY_VARIANT = process.env.LEMON_MONTHLY_VARIANT || '1432493';
    const LIFETIME_VARIANT = process.env.LEMON_LIFETIME_VARIANT || '1432511';

    if (eventName === 'order_created' || eventName === 'subscription_created') {
      let plan = 'pro_monthly';
      if (variantId === LIFETIME_VARIANT) plan = 'pro_lifetime';

      await prisma.user.updateMany({
        where: { email },
        data: { plan },
      });
      console.log(`[Lemon Webhook] User ${email} upgraded to ${plan}`);
    }

    if (eventName === 'subscription_cancelled') {
      await prisma.user.updateMany({
        where: { email },
        data: { plan: 'free' },
      });
      console.log(`[Lemon Webhook] User ${email} downgraded to free`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Lemon webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
