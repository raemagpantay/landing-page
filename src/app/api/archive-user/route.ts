import { NextRequest, NextResponse } from 'next/server';
import adminAuth from '../firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { uid, disabled } = await req.json();

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (typeof disabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Disabled status must be a boolean' },
        { status: 400 }
      );
    }

    // Update the user's disabled status in Firebase Admin
    await adminAuth.auth().updateUser(uid, {
      disabled: disabled,
    });

    console.log(`User ${uid} ${disabled ? 'disabled' : 'enabled'} successfully`);

    return NextResponse.json({
      success: true,
      message: `User ${disabled ? 'disabled' : 'enabled'} successfully`,
      uid,
      disabled,
    });
  } catch (error: any) {
    console.error('Error archiving user:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to archive user' },
      { status: 500 }
    );
  }
}