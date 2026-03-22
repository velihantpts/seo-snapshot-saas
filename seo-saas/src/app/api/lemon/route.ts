import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const LEMON_API_KEY = process.env.LEMON_API_KEY || '';
const STORE_ID = process.env.LEMON_STORE_ID || '163498';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please sign in first' }, { status: 401 });
    }

    const { plan } = await req.json();

    const MONTHLY_VARIANT = process.env.LEMON_MONTHLY_VARIANT || '1432493';
    const LIFETIME_VARIANT = process.env.LEMON_LIFETIME_VARIANT || '1432511';

    const variantId = plan === 'lifetime' ? LIFETIME_VARIANT : MONTHLY_VARIANT;

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${LEMON_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: session.user.email,
              name: session.user.name || '',
              custom: {
                email: session.user.email,
              },
            },
            product_options: {
              redirect_url: 'https://seosnapshot.dev/dashboard?upgraded=true',
            },
          },
          relationships: {
            store: { data: { type: 'stores', id: STORE_ID } },
            variant: { data: { type: 'variants', id: variantId } },
          },
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Lemon Squeezy checkout error:', err);
      return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }

    const data = await response.json();
    const checkoutUrl = data.data?.attributes?.url;

    if (!checkoutUrl) {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error('Lemon checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
