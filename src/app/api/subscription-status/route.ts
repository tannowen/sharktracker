import { NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_placeholder", {
  apiVersion: "2026-02-25.clover",
});

export async function GET() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ isPremium: false });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ isPremium: false });
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ isPremium: false });
  }

  const requestOptions: Stripe.RequestOptions = {};
  if (process.env.STRIPE_ACCOUNT_ID) {
    requestOptions.stripeContext = process.env.STRIPE_ACCOUNT_ID;
  }

  try {
    const customers = await stripe.customers.list({ email, limit: 1 }, requestOptions);
    if (!customers.data.length) {
      return NextResponse.json({ isPremium: false });
    }

    const subscriptions = await stripe.subscriptions.list(
      { customer: customers.data[0].id, status: "all", limit: 10 },
      requestOptions
    );

    const isPremium = subscriptions.data.some(
      (sub) =>
        (sub.status === "active" || sub.status === "trialing") &&
        sub.metadata?.type === "pro"
    );

    return NextResponse.json({ isPremium });
  } catch (err) {
    console.error("[subscription-status]", err);
    return NextResponse.json({ isPremium: false });
  }
}
