// src/firebase.ts
import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
if (!fs.existsSync(keyPath)) {
  throw new Error(`Firebase service account key not found at ${keyPath}`);
}

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const auth = admin.auth();
export const db = admin.firestore();
export const bucket = admin.storage().bucket();
