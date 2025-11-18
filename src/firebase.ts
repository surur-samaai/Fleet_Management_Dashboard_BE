// src/firebase.ts
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import admin from 'firebase-admin';
=======

import * as admin from 'firebase-admin';
import service_account from '../fleetpro-9959f-firebase-adminsdk-fbsvc-6a2f8490d3.json'
>>>>>>> Stashed changes
=======

import * as admin from 'firebase-admin';
import service_account from '../fleetpro-9959f-firebase-adminsdk-fbsvc-6a2f8490d3.json'
>>>>>>> Stashed changes
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
  databaseURL: `https://fleetpro-9959f.firebaseio.com`,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  projectId: 'fleetpro-9959f',
});

export const auth = admin.auth();
export const db = admin.firestore();
export const bucket = admin.storage().bucket();
