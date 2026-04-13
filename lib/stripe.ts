import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const apiKey = process.env.STRIPE_SECRET_KEY;

    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    stripeClient = new Stripe(apiKey);
  }

  return stripeClient;
}

// Legacy export for compatibility
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
