"use client";

import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  console.warn("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function PaymentContent() {
  const [amount, setAmount] = useState<number>(0);
  const [productName, setProductName] = useState<string>("");
  const [currency, setCurrency] = useState<"usd" | "php">("usd");
  const [walletTestMode, setWalletTestMode] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const amountParam = searchParams.get('amount');
    const nameParam = searchParams.get('name');
    const currencyParam = searchParams.get('currency');
    const walletTestParam = searchParams.get('walletTest');
    
    if (amountParam) {
      setAmount(parseFloat(amountParam));
    }
    if (nameParam) {
      setProductName(nameParam);
    }
    if (currencyParam === 'php' || currencyParam === 'usd') {
      setCurrency(currencyParam);
    }
    setWalletTestMode(walletTestParam === '1');
  }, [searchParams]);

  const currencySymbol = currency === 'php' ? 'P' : '$';

  // Check if Stripe is available
  if (!stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Payment System Unavailable</h1>
          <p className="mb-4">Payment processing is currently unavailable. Please try again later.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!amount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Payment Request</h1>
          <p className="mb-4">No amount specified for payment.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-8">
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-blue-100 mb-3">
          Secure Checkout
        </p>
        <h1 className="text-4xl font-extrabold mb-2">Complete Your Purchase</h1>
        <h2 className="text-2xl mb-4">
          {productName && `${productName} - `}
          <span className="font-bold">{currencySymbol}{amount}</span>
        </h2>
        <p className="text-sm text-blue-100 max-w-2xl mx-auto">
          This page supports instant wallet checkout when available, plus standard card/payment options.
        </p>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency,
        }}
      >
        <CheckoutPage amount={amount} currency={currency} walletTestMode={walletTestMode} />
      </Elements>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-2xl">Loading payment...</div></div>}>
      <PaymentContent />
    </Suspense>
  );
}

// Add this to make the page dynamic
export const dynamic = 'force-dynamic';
