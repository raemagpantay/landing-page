import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK only if it hasn't been initialized
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  // Validate required environment variables
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not set in environment variables');
  }

  if (!clientEmail) {
    throw new Error('FIREBASE_CLIENT_EMAIL is not set in environment variables');
  }

  if (!privateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY is not set in environment variables');
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
      }),
    });

    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    throw error;
  }
}

const adminAuth = admin;

export default adminAuth;