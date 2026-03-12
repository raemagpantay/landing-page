import * as admin from 'firebase-admin';

function resolveStorageBucket(projectId?: string) {
  return (
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    (projectId ? `${projectId}.appspot.com` : undefined)
  );
}

function ensureAdminInitialized() {
  if (admin.apps.length) {
    return;
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const storageBucket = resolveStorageBucket(projectId);

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
    storageBucket,
  });
}

const adminAuth = {
  auth() {
    ensureAdminInitialized();
    return admin.auth();
  },
  storage() {
    ensureAdminInitialized();
    return admin.storage();
  },
};

export default adminAuth;