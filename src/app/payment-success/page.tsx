'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const [amount, setAmount] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const amountParam = searchParams.get('amount');
    if (amountParam) {
      setAmount(amountParam);
    }
  }, [searchParams]);

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          {amount ? `$${amount}` : 'Processing payment...'}
        </div>
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
