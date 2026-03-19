import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createCheckoutSession(userId: string, email: string, priceId: string) {
  return stripe.checkout.sessions.create({
    customer_email: email,
    metadata: { userId },
    line_items: [{ price: priceId, quantity: 1 }],
    mode: priceId === process.env.STRIPE_PRICE_LIFETIME ? 'payment' : 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
  });
}
