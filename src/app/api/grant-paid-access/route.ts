import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import adminAuth from '../firebase-admin';

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice('Bearer '.length).trim();
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 });
    }

    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const { paymentIntentId } = await request.json();
    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      return NextResponse.json({ error: 'paymentIntentId is required' }, { status: 400 });
    }

    const decoded = await adminAuth.auth().verifyIdToken(token);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
    });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: `Payment is not completed. Current status: ${paymentIntent.status}` },
        { status: 400 }
      );
    }

    const userRecord = await adminAuth.auth().getUser(decoded.uid);
    const existingClaims = userRecord.customClaims || {};

    await adminAuth.auth().setCustomUserClaims(decoded.uid, {
      ...existingClaims,
      paid: true,
    });

    return NextResponse.json({ success: true, hasPaid: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to grant paid access';
    console.error('Error granting paid access:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}