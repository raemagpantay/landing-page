'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface OrderDetails {
  amount: number;
  currency: string;
  payment_status: string;
}

function ReturnContent() {
  const [status, setStatus] = useState('loading')
  const [customerEmail, setCustomerEmail] = useState('')
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed')
      return
    }

    async function fetchCheckoutSession() {
      try {
        const response = await fetch(`/api/checkout-status?session_id=${sessionId}`)
        if (!response.ok) throw new Error('Failed to fetch session')
        
        const data = await response.json()
        
        setStatus(data.status)
        setCustomerEmail(data.customer_email)
        setOrderDetails(data.order_details)
      } catch (error) {
        console.error('Error fetching checkout session:', error)
        setStatus('failed')
      }
    }

    fetchCheckoutSession()
  }, [sessionId])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (status === 'failed' || status === 'open') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Payment Incomplete</h1>
          <p className="text-gray-600 mb-6">Your payment was not completed successfully.</p>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-4">Your payment was successful.</p>
        {customerEmail && (
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a confirmation to <span className="font-medium">{customerEmail}</span>
          </p>
        )}
        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Order Details:</h3>
            <p className="text-sm text-gray-600">
              Amount: {orderDetails.currency?.toUpperCase()} {(orderDetails.amount / 100)?.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              Status: {orderDetails.payment_status}
            </p>
          </div>
        )}
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function ReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-2xl">Loading...</div></div>}>
      <ReturnContent />
    </Suspense>
  )
}