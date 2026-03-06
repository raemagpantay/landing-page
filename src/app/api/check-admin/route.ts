import { NextRequest, NextResponse } from 'next/server';
import adminAuth from '../firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user from Firebase Admin
    const userRecord = await adminAuth.auth().getUser(uid);
    
    // Check if user has admin custom claim
    const isAdmin = userRecord.customClaims?.admin === true;

    // You can also check by email if needed
    // const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    // const isAdmin = adminEmails.includes(userRecord.email || '');

    return NextResponse.json({ isAdmin });
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check admin status' },
      { status: 500 }
    );
  }
}
