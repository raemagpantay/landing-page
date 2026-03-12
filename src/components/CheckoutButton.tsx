'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';

interface CheckoutButtonProps {
  amount: number;
  productName?: string;
  currency?: 'USD' | 'PHP';
}

export default function CheckoutButton({ amount, productName = "Product", currency = "USD" }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
  const [checkingPaidAccess, setCheckingPaidAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkPaidAccess = async (user: User | null) => {
      if (!user) {
        setHasPaidAccess(false);
        return;
      }

      setCheckingPaidAccess(true);
      try {
        const idToken = await user.getIdToken();
        const paidStatusRes = await fetch('/api/paid-status', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!paidStatusRes.ok) {
          setHasPaidAccess(false);
          return;
        }

        const paidStatusData = await paidStatusRes.json();
        setHasPaidAccess(paidStatusData.hasPaid === true);
      } catch {
        setHasPaidAccess(false);
      } finally {
        setCheckingPaidAccess(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkPaidAccess(user);
    });

    return () => unsubscribe();
  }, []);

  const downloadPaidFile = async () => {
    const paidFileResponse = await fetch('/api/current-file?version=paid');
    const paidFileData = await paidFileResponse.json();

    if (!paidFileResponse.ok || !paidFileData.fileName) {
      throw new Error('No paid game file is currently available. Please contact admin.');
    }

    const fileName = paidFileData.fileName as string;
    const link = document.createElement('a');
    link.href = '/api/download?version=paid';
    link.download = fileName;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      const user = auth.currentUser;

      if (!user) {
        router.push('/sign-up');
        return;
      }

      const idToken = await user.getIdToken();
      const paidStatusRes = await fetch('/api/paid-status', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (paidStatusRes.ok) {
        const paidStatusData = await paidStatusRes.json();
        if (paidStatusData.hasPaid === true) {
          await downloadPaidFile();
          return;
        }
      }

      // Redirect to payment page with amount and product name
      const searchParams = new URLSearchParams({
        amount: amount.toString(),
        name: productName,
        currency: currency.toLowerCase(),
        walletTest: "1",
      });
      
      router.push(`/payment?${searchParams.toString()}`);
      
    } catch (error) {
      console.error('Checkout Error:', error);
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const currencySymbol = currency === 'PHP' ? '₱' : '$';

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || checkingPaidAccess}
      className={`${hasPaidAccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50`}
    >
      {loading
        ? 'Loading...'
        : checkingPaidAccess
          ? 'Checking purchase...'
          : hasPaidAccess
            ? 'Owned - Download Paid Version'
            : `Buy Now - ${currencySymbol}${amount}`}
    </button>
  );
}
