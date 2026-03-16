import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialise Stripe with the secret key from env.
// Falls back to a placeholder in development so the route doesn't hard-crash
// before real keys are added.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_placeholder", {
  apiVersion: "2026-02-25.clover",
});

export async function POST() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not configured. Add it to .env.local to enable checkout." },
      { status: 503 }
    );
  }

  // Organization API keys require stripeContext specifying the target account.
  const requestOptions: Stripe.RequestOptions = {};
  if (process.env.STRIPE_ACCOUNT_ID) {
    requestOptions.stripeContext = process.env.STRIPE_ACCOUNT_ID;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shark Finder Pro",
              description:
                "Unlock historical migration routes, deep-dive analytics, unlimited shark tracking, and early access to new features.",
              images: [],
            },
            unit_amount: 2999, // $29.99 / month
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${appUrl}/?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
      metadata: {
        source: "apex_tracker_pro_unlock",
      },
    }, requestOptions);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe checkout failed";
    console.error("[checkout_sessions]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
