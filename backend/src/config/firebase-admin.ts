// src/config/firebase-admin.ts (FINAL DEPLOYMENT FIX)

import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { Buffer } from "buffer"; // Import Buffer for decoding
// import * as path from 'path'; // Removed path dependency

const base64Credentials = process.env.FIREBASE_CREDENTIALS_BASE64;

if (!admin.apps.length) {
  if (!base64Credentials) {
    console.warn(
      "FIREBASE_CREDENTIALS_BASE64 not set. Firebase Admin disabled; auth-protected routes will fail until configured."
    );
  } else {
    try {
      const credentialsJsonString = Buffer.from(
        base64Credentials,
        "base64"
      ).toString("utf-8");

      const serviceAccount = JSON.parse(credentialsJsonString) as ServiceAccount;

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
      console.warn(
        "Could not initialize Firebase Admin SDK. Backend is running in limited mode."
      );
      console.warn(
        "Reason:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}

// FIX: Export 'db' here.
// Safely export mock if admin failed
export const db = admin.apps.length ? admin.firestore() : ({} as FirebaseFirestore.Firestore);

// Firestore user profile collection reference
export const usersCollection = admin.apps.length ? db.collection("users") : ({} as FirebaseFirestore.CollectionReference);

// Re-export admin for field values, etc.
export { admin };
