import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_placeholder", {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not configured. Add it to .env.local to enable checkout." },
      { status: 503 }
    );
  }

  const requestOptions: Stripe.RequestOptions = {};
  if (process.env.STRIPE_ACCOUNT_ID) {
    requestOptions.stripeContext = process.env.STRIPE_ACCOUNT_ID;
  }

  const body = await req.json().catch(() => ({})) as {
    type?: string;
    sharkId?: string;
    sharkName?: string;
    sharkSpecies?: string;
  };

  try {
    let sessionParams: Stripe.Checkout.SessionCreateParams;

    if (body.type === "adopt") {
      const sharkName = body.sharkName ?? "a shark";
      sessionParams = {
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: `Adopt ${sharkName}`,
              description: `Sponsor ${sharkName}${body.sharkSpecies ? ` (${body.sharkSpecies})` : ""} — your monthly contribution supports real tagging research and ocean conservation.`,
              images: [],
            },
            unit_amount: 299, // $2.99 / month
            recurring: { interval: "month" },
          },
          quantity: 1,
        }],
        allow_promotion_codes: true,
        success_url: `${appUrl}/?adopt=success&shark=${encodeURIComponent(sharkName)}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/`,
        metadata: { type: "adopt", sharkId: body.sharkId ?? "", sharkName },
      };
    } else {
      // Pro subscription — $9.99/month with 3-day free trial
      sessionParams = {
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shark Finder Pro",
              description: "Unlock historical migration routes, deep-dive analytics, unlimited shark tracking, and early access to new features.",
              images: [],
            },
            unit_amount: 999, // $9.99 / month
            recurring: { interval: "month" },
          },
          quantity: 1,
        }],
        subscription_data: { trial_period_days: 3 },
        allow_promotion_codes: true,
        success_url: `${appUrl}/?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/`,
        metadata: { type: "pro", source: "shark_finder_pro_unlock" },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams, requestOptions);
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe checkout failed";
    console.error("[checkout_sessions]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
