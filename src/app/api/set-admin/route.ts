import { NextRequest, NextResponse } from 'next/server';
import adminAuth from '../firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email, isAdmin } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get user by email
    const userRecord = await adminAuth.auth().getUserByEmail(email);
    
    // Set custom claims
    await adminAuth.auth().setCustomUserClaims(userRecord.uid, {
      admin: isAdmin === true
    });

    return NextResponse.json({ 
      success: true, 
      message: `Admin status ${isAdmin ? 'granted' : 'revoked'} for ${email}`,
      uid: userRecord.uid
    });
  } catch (error: any) {
    console.error('Error setting admin status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set admin status' },
      { status: 500 }
    );
  }
}
