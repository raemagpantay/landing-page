import * as admin from 'firebase-admin';

function ensureAdminInitialized() {
  if (admin.apps.length) {
    return;
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not set in environment variables');
  }
  if (!clientEmail) {
    throw new Error('FIREBASE_CLIENT_EMAIL is not set in environment variables');
  }
  if (!privateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY is not set in environment variables');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const adminAuth = {
  auth() {
    ensureAdminInitialized();
    return admin.auth();
  },
};

export default adminAuth;