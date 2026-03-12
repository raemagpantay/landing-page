'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const [amount, setAmount] = useState<string>('');
  const [paidFile, setPaidFile] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<string>('Preparing your download...');
  const searchParams = useSearchParams();

  useEffect(() => {
    const amountParam = searchParams.get('amount');
    const shouldDownloadPaid = searchParams.get('download') === 'paid';

    if (amountParam) {
      setAmount(amountParam);
    }

    if (!shouldDownloadPaid) {
      setDownloadMessage('Payment completed successfully.');
      return;
    }

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
        setDownloadMessage('Your paid version download should start automatically.');

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading paid file:', error);
        setDownloadMessage('Payment succeeded, but automatic download failed. Please use the button below.');
      }
    };

    fetchAndDownloadPaid();
  }, [searchParams]);

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          {amount ? `$${amount}` : 'Processing payment...'}
        </div>

        <p className="text-sm mt-5 text-blue-100">{downloadMessage}</p>

        {paidFile && (
          <a
            href={`/uploads/${paidFile}`}
            download
            className="inline-block mt-4 bg-white text-purple-700 font-semibold px-5 py-2 rounded-md hover:bg-purple-100 transition"
          >
            Download Paid Version Again
          </a>
        )}
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
