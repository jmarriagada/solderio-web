import { getApps, getApp, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

export function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "solderio-web";
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  try {
    if (clientEmail && privateKey) {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
      });
    } else {
      return initializeApp({
        projectId,
      });
    }
  } catch (err) {
    console.warn("Could not initialize Firebase Admin App:", err);
    return null;
  }
}

export function getAdminDb(): Firestore | null {
  try {
    const app = getAdminApp();
    if (app) {
      return getFirestore(app);
    }
  } catch (err) {
    console.warn("Could not get Admin Firestore instance:", err);
  }
  return null;
}

export function getAdminAuth(): Auth | null {
  try {
    const app = getAdminApp();
    if (app) {
      return getAuth(app);
    }
  } catch (err) {
    console.warn("Could not get Admin Auth instance:", err);
  }
  return null;
}
