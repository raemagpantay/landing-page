import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment system unavailable: missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY.startsWith("sk_test_")) {
      return NextResponse.json(
        { error: "Instant test pay is only available with Stripe test keys." },
        { status: 403 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-30.basil",
    });

    const { amount, currency, walletTestMode } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount provided" }, { status: 400 });
    }

    const selectedCurrency = walletTestMode
      ? "usd"
      : currency === "php"
        ? "php"
        : "usd";

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: selectedCurrency,
      payment_method: "pm_card_visa",
      payment_method_types: ["card"],
      confirm: true,
    });

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: `Instant test payment did not succeed. Status: ${paymentIntent.status}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Instant test pay error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}