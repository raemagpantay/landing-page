"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  ExpressCheckoutElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import type { StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useRouter } from "next/navigation";

const CheckoutPage = ({ amount, currency, walletTestMode = false }: { amount: number; currency: "usd" | "php"; walletTestMode?: boolean }) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [instantTestPayLoading, setInstantTestPayLoading] = useState(false);
  const [walletReady, setWalletReady] = useState(false);
  const currencySymbol = currency === 'php' ? 'P' : '$';

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount), currency, walletTestMode }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Unable to initialize payment.");
        }
        setClientSecret(data.clientSecret);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unable to initialize payment.";
        setErrorMessage(message);
      });
  }, [amount, currency, walletTestMode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?amount=${amount}&download=paid`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }

    setLoading(false);
  };

  const handleExpressCheckoutConfirm = async (
    _event: StripeExpressCheckoutElementConfirmEvent
  ) => {
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?amount=${amount}&download=paid`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

  };

  const handleInstantTestPay = async () => {
    setInstantTestPayLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await fetch("/api/test-instant-pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: convertToSubcurrency(amount),
          currency,
          walletTestMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Instant test payment failed.");
      }

      const paymentIntentId = data?.paymentIntentId;
      const paymentIntentQuery = paymentIntentId ? `&payment_intent=${paymentIntentId}` : "";
      router.push(`/payment-success?amount=${amount}&download=paid${paymentIntentQuery}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Instant test payment failed.";
      setErrorMessage(message);
    } finally {
      setInstantTestPayLoading(false);
    }
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-lg text-left text-gray-900">
      <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <p className="text-sm font-semibold text-emerald-800">Instant Pay</p>
        <p className="text-xs text-emerald-700 mt-1">
          If available on this device/browser, Google Pay appears below for one-tap checkout.
        </p>
      </div>

      {clientSecret && (
        <div className="mb-4 rounded-md border border-gray-200 p-3">
          <ExpressCheckoutElement
            options={{
              paymentMethods: {
                applePay: "always",
                googlePay: "always",
              },
            }}
            onConfirm={handleExpressCheckoutConfirm}
            onReady={() => setWalletReady(true)}
          />
          {!walletReady && (
            <p className="mt-2 text-xs text-gray-500">
              Wallet buttons only show when the browser supports them and an eligible wallet is configured.
            </p>
          )}
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Other payment methods</p>
        {clientSecret && (
          <PaymentElement
            options={{
              layout: "tabs",
              paymentMethodOrder: ["google_pay", "apple_pay", "link", "card"],
            }}
          />
        )}
      </div>

      {walletTestMode && (
        <p className="text-xs text-blue-700 mt-1">
          Wallet test mode is enabled to maximize Google Pay visibility during testing.
        </p>
      )}

      {errorMessage && <div className="text-red-600 text-sm mt-2">{errorMessage}</div>}

      <button
        type="button"
        onClick={handleInstantTestPay}
        disabled={instantTestPayLoading || loading}
        className="text-white w-full p-4 bg-emerald-600 mt-2 rounded-md font-bold hover:bg-emerald-500 disabled:opacity-50 disabled:animate-pulse"
      >
        {instantTestPayLoading ? "Running instant test payment..." : `Instant Test Card Pay ${currencySymbol}${amount}`}
      </button>

      <button
        disabled={!stripe || loading}
        className="text-white w-full p-4 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay ${currencySymbol}${amount}` : "Processing payment..."}
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Secure checkout powered by Stripe.
      </p>
    </form>
  );
};

export default CheckoutPage;
