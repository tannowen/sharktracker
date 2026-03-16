import { NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_placeholder", {
  apiVersion: "2026-02-25.clover",
});

export async function POST() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ error: "No email found on account." }, { status: 400 });
  }

  const requestOptions: Stripe.RequestOptions = {};
  if (process.env.STRIPE_ACCOUNT_ID) {
    requestOptions.stripeContext = process.env.STRIPE_ACCOUNT_ID;
  }

  try {
    const customers = await stripe.customers.list({ email, limit: 1 }, requestOptions);
    if (!customers.data.length) {
      return NextResponse.json(
        { error: "No active subscription found for this account." },
        { status: 404 }
      );
    }

    const session = await stripe.billingPortal.sessions.create(
      { customer: customers.data[0].id, return_url: appUrl },
      requestOptions
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to open billing portal";
    console.error("[billing-portal]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
