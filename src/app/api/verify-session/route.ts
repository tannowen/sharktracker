import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_placeholder", {
  apiVersion: "2026-02-25.clover",
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ isPremium: false });
  }

  const requestOptions: Stripe.RequestOptions = {};
  if (process.env.STRIPE_ACCOUNT_ID) {
    requestOptions.stripeContext = process.env.STRIPE_ACCOUNT_ID;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {}, requestOptions);
    const isPremium =
      session.status === "complete" &&
      session.mode === "subscription" &&
      session.payment_status === "paid";

    return NextResponse.json({ isPremium, email: session.customer_details?.email });
  } catch (err) {
    console.error("[verify-session]", err);
    return NextResponse.json({ isPremium: false });
  }
}
