import stripe from "../stripe";
import config from "../config";
import { addCredits } from "./user";

/**
 * Create a Stripe checkout session for credit pack purchases.
 */
export async function createCheckoutSession(userId, planId, userEmail) {
  const plan = config.stripe.plans[planId];
  if (!plan) {
    throw new Error(`Plan not found: ${planId}`);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: plan.name,
            description: `Purchase ${plan.credits} generation credits for Relive AI`,
          },
          unit_amount: plan.price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      userId,
      planId,
      credits: plan.credits.toString(),
    },
    customer_email: userEmail,
    success_url: `${config.auth.url}/gallery?success=true`,
    cancel_url: `${config.auth.url}/pricing?canceled=true`,
  });

  return session;
}

/**
 * Handle Stripe webhook events.
 */
export async function handleStripeWebhook(signature, rawBody) {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe.webhookSecret || ""
    );
  } catch (err) {
    console.error(`[BILLING SERVICE] Webhook signature verification failed:`, err.message);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const creditsStr = session.metadata?.credits;

    if (userId && creditsStr) {
      const credits = parseInt(creditsStr, 10);
      console.log(`[BILLING SERVICE] Payment successful. Crediting user ${userId} with ${credits} credits.`);
      await addCredits(userId, credits);
    } else {
      console.warn(`[BILLING SERVICE] Session completed but metadata is missing:`, session.metadata);
    }
  }

  return { received: true };
}
