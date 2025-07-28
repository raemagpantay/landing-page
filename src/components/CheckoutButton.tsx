'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
  amount: number;
  productName?: string;
}

export default function CheckoutButton({ amount, productName = "Product" }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      // Redirect to payment page with amount and product name
      const searchParams = new URLSearchParams({
        amount: amount.toString(),
        name: productName,
      });
      
      router.push(`/payment?${searchParams.toString()}`);
      
    } catch (error) {
      console.error('Checkout Error:', error);
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
    >
      {loading ? 'Loading...' : `Buy Now - $${amount}`}
    </button>
  );
}
