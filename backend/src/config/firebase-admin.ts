// src/config/firebase-admin.ts (FINAL DEPLOYMENT FIX)

import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import type {
  CollectionReference,
  Firestore,
} from "firebase-admin/firestore";
import { Buffer } from "buffer";

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

export const db: Firestore = admin.apps.length
  ? admin.firestore()
  : ({} as Firestore);

export const usersCollection: CollectionReference = admin.apps.length
  ? db.collection("users")
  : ({} as CollectionReference);

export { admin };
