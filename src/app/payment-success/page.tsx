'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const [amount, setAmount] = useState<string>('');
  const [paidFile, setPaidFile] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<string>('Preparing your download...');
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const hasStartedPaidFlowRef = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const amountParam = searchParams.get('amount');
  const shouldDownloadPaid = searchParams.get('download') === 'paid';

  useEffect(() => {
    if (amountParam) {
      setAmount(amountParam);
    }
  }, [amountParam]);

  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;
    let countdownInterval: ReturnType<typeof setInterval> | null = null;

    const scheduleRedirectHome = () => {
      const seconds = 5;
      setRedirectCountdown(seconds);
      countdownInterval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            if (countdownInterval) {
              clearInterval(countdownInterval);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      redirectTimer = setTimeout(() => {
        router.push('/');
      }, seconds * 1000);
    };

    if (!shouldDownloadPaid) {
      setDownloadMessage('Payment completed successfully.');
      return () => {
        if (redirectTimer) clearTimeout(redirectTimer);
        if (countdownInterval) clearInterval(countdownInterval);
      };
    }

    // Prevent duplicate downloads/redirects when effects re-run in strict mode.
    if (hasStartedPaidFlowRef.current) {
      return () => {
        if (redirectTimer) clearTimeout(redirectTimer);
        if (countdownInterval) clearInterval(countdownInterval);
      };
    }

    hasStartedPaidFlowRef.current = true;

    const fetchAndDownloadPaid = async () => {
      try {
        const res = await fetch('/api/current-file?version=paid');
        const data = await res.json();

        if (!res.ok || !data.fileName) {
          setDownloadMessage('Payment succeeded, but no paid ZIP is currently available.');
          return;
        }

        const fileName = data.fileName as string;
        const downloadUrl = `/uploads/${fileName}`;

        setPaidFile(fileName);
        setDownloadMessage('Your paid version download should start automatically. Redirecting to home page shortly...');

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        scheduleRedirectHome();
      } catch (error) {
        console.error('Error downloading paid file:', error);
        setDownloadMessage('Payment succeeded, but automatic download failed. Please use the button below.');
      }
    };

    fetchAndDownloadPaid();
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [router, shouldDownloadPaid]);

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          {amount ? `$${amount}` : 'Processing payment...'}
        </div>

        <p className="text-sm mt-5 text-blue-100">{downloadMessage}</p>
        {redirectCountdown !== null && (
          <p className="text-xs mt-2 text-blue-100">
            Redirecting to home in {redirectCountdown}s...
          </p>
        )}

        {paidFile && (
          <a
            href={`/uploads/${paidFile}`}
            download
            className="inline-block mt-4 bg-white text-purple-700 font-semibold px-5 py-2 rounded-md hover:bg-purple-100 transition"
          >
            Download Paid Version Again
          </a>
        )}

        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-block mt-4 ml-0 sm:ml-3 bg-blue-700 text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Back to Home Page
        </button>
      </div>
    </main>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-2xl">Loading...</div></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
