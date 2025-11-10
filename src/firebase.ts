// src/firebase.ts

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const keyFileName = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

// 1. Check if the environment variable is set at all.
if (!keyFileName) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY_PATH environment variable is not set in .env.");
}

// 2. Now that we've checked, TypeScript knows keyFileName is a string.
// Construct the absolute path: go up one directory (..) from 'src' 
// to the project root, and then look for the file name.
const keyPath = path.join(__dirname, '..', keyFileName); 

if (!fs.existsSync(keyPath)) {
    throw new Error(`Firebase service account key not found at ${keyPath}. 
    Please ensure the file is in the project root and the path is correct in .env.`);
}

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const auth = admin.auth();
export const db = admin.firestore();
export const bucket = admin.storage().bucket();