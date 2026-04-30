// src/config/firebase.ts
// Firebase Admin SDK initialization for Cloud Firestore.

import * as admin from "firebase-admin";
import { Buffer } from "buffer";

if (!admin.apps.length) {
  const base64Credentials = process.env.FIREBASE_CREDENTIALS_BASE64;

  if (!base64Credentials) {
    throw new Error(
      "FIREBASE_CREDENTIALS_BASE64 environment variable is not set. " +
        "Set it to a base64-encoded service account JSON."
    );
  }

  const serviceAccount = JSON.parse(
    Buffer.from(base64Credentials, "base64").toString("utf-8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("Firebase connected");
}

export const db = admin.firestore();

export const usersCollection = db.collection("users");
export const storiesCollection = db.collection("stories");
export const matchesCollection = db.collection("matches");
export const conversationsCollection = db.collection("conversations");
export const messagesCollection = db.collection("messages");

export { admin };
