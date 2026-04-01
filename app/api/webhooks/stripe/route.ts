import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '../../../../lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email;
        const stripeCustomerId = session.customer as string;

        if (customerEmail) {
          // Find the user by email and upgrade them to pro
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', customerEmail)
            .single();

          if (profile) {
            await supabase
              .from('profiles')
              .update({
                plan: 'pro',
                stripe_customer_id: stripeCustomerId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', profile.id);

            console.log(`Upgraded ${customerEmail} to pro`);
          } else {
            // User paid but hasn't created an account yet
            // Store the Stripe customer ID so we can link later
            console.log(`Payment from ${customerEmail} - no account yet, will link on signup`);
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = subscription.customer as string;
        const status = subscription.status;
        const plan = status === 'active' ? 'pro' : 'free';

        await supabase
          .from('profiles')
          .update({
            plan,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', stripeCustomerId);

        console.log(`Subscription ${status} for customer ${stripeCustomerId} → plan: ${plan}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = subscription.customer as string;

        // Downgrade to free when subscription is cancelled
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', stripeCustomerId);

        console.log(`Subscription cancelled for customer ${stripeCustomerId} → downgraded to free`);
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
