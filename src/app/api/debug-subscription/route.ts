import { NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_placeholder", {
  apiVersion: "2026-02-25.clover",
});

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" });

  const email = user.emailAddresses[0]?.emailAddress;

  const requestOptions: Stripe.RequestOptions = {};
  if (process.env.STRIPE_ACCOUNT_ID) {
    requestOptions.stripeContext = process.env.STRIPE_ACCOUNT_ID;
  }

  try {
    const customers = await stripe.customers.list({ email, limit: 5 }, requestOptions);

    const result = await Promise.all(
      customers.data.map(async (c) => {
        const subs = await stripe.subscriptions.list(
          { customer: c.id, status: "all", limit: 10, expand: ["data.items.data.price.product"] },
          requestOptions
        );
        return {
          customerId: c.id,
          email: c.email,
          subscriptions: subs.data.map((s) => ({
            id: s.id,
            status: s.status,
            metadata: s.metadata,
            items: s.items.data.map((i) => ({
              priceId: i.price.id,
              amount: i.price.unit_amount,
              productName: typeof i.price.product === "object" && i.price.product !== null && "name" in i.price.product
                ? (i.price.product as { name: string }).name
                : i.price.product,
            })),
          })),
        };
      })
    );

    return NextResponse.json({ clerkEmail: email, customers: result });
  } catch (err) {
    return NextResponse.json({ error: String(err) });
  }
}
