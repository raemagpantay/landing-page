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

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-30.basil",
    });

    const { amount, currency, walletTestMode } = await request.json();
    const selectedCurrency = walletTestMode
      ? "usd"
      : currency === "php"
        ? "php"
        : "usd";

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount provided" },
        { status: 400 }
      );
    }

    // Let Stripe dynamically choose all compatible payment methods
    // (including wallets like Google Pay when available in browser/context).
    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: selectedCurrency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      currency: selectedCurrency,
      walletTestMode: Boolean(walletTestMode),
    });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
