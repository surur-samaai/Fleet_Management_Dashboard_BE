// getToken.js
// Script to fetch the ID Token from the live Firebase auth service
// 1. Install firebase if needed: npm install firebase
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
// --- CONFIGURATION ---
// IMPORTANT: Use your actual project ID from the .firebaserc file
const FIREBASE_CONFIG = { 
    projectId: "fleetpro-9959f",
    apiKey: "AIzaSyAVZZ9uru4qLCyovU-2n-fwtDy5z0tf_Yw"};

const ADMIN_EMAIL = 'admin@fleetpro.com';
const ADMIN_PASSWORD = 'qwerty';
// ----------------------
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

async function getAdminToken() {
  try {
    console.log(`Attempting sign-in for: ${ADMIN_EMAIL}...`);
    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );
    // Get the ID Token
    const idToken = await userCredential.user.getIdToken();
    
    console.log('\n:white_tick: Successfully retrieved Admin ID Token:\n');
    console.log(`Bearer ${idToken}`); // Ready to paste into Thunder Client
    console.log('\nToken will expire soon. Use it quickly!');
  } catch (error) {
    console.error('\n:octagonal_sign: ERROR: Could not get Admin Token.', error.message);
    console.log('\nMake sure:');
    console.log('1. The Firebase Emulators are running (firebase emulators:start).');
    console.log('2. The user admin@fleetpro.com exists in the Emulator UI.');
    console.log('3. The email/password in this script match what you set in the UI.');
  }
  process.exit();
}
getAdminToken();