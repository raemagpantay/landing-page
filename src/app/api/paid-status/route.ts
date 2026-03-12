import { NextRequest, NextResponse } from 'next/server';
import adminAuth from '../firebase-admin';

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice('Bearer '.length).trim();
}

export async function GET(request: NextRequest) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const decoded = await adminAuth.auth().verifyIdToken(token);
    const userRecord = await adminAuth.auth().getUser(decoded.uid);
    const hasPaid = userRecord.customClaims?.paid === true;

    return NextResponse.json({ hasPaid, uid: decoded.uid });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to check paid status';
    console.error('Error checking paid status:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}