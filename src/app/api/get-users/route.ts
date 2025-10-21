import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin (only if not already initialized)
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

export async function GET() {
  try {
    // Check if Firebase Admin is properly configured
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Firebase Admin configuration is missing' },
        { status: 500 }
      );
    }

    const auth = getAuth();
    
    // List all users (with pagination if needed)
    const listUsersResult = await auth.listUsers(1000); // Limit to 1000 users
    
    const users = listUsersResult.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email || 'No email',
      displayName: userRecord.displayName || null,
      createdAt: userRecord.metadata.creationTime,
      lastLoginAt: userRecord.metadata.lastSignInTime || null,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      providerId: userRecord.providerData[0]?.providerId || 'email',
    }));

    // Sort users by creation date (newest first)
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      users,
      totalUsers: users.length,
      hasMoreUsers: listUsersResult.pageToken ? true : false,
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to fetch users: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unknown error occurred while fetching users' },
      { status: 500 }
    );
  }
}