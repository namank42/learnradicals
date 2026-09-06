import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ATTR_COOKIE, parseAttribution, stripeMetadata } from "@/lib/attribution";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const attr = parseAttribution(cookieStore.get(ATTR_COOKIE)?.value);
    const metadata = stripeMetadata(attr);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      ...(attr?.vid ? { client_reference_id: attr.vid } : {}),
      ...(Object.keys(metadata).length > 0
        ? { metadata, payment_intent_data: { metadata } }
        : {}),
    });

    console.log(
      "[attr]",
      JSON.stringify({
        event: "checkout",
        vid: attr?.vid || null,
        session_id: session.id,
        source: metadata.last_utm_source || metadata.first_utm_source || null,
        campaign: metadata.last_utm_campaign || null,
      })
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
