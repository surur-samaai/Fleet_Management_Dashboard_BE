# Firebase Authentication Setup Guide

## Overview
Your FleetPro app now uses Firebase Authentication with role-based access control. Roles are stored in Firestore for security.

## Initial Setup

### 1. Enable Authentication
1. Go to Firebase Console → Authentication
2. Click "Get Started"
3. Enable "Email/Password" sign-in method

### 2. Enable Firestore Database
1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Start in **production mode** (we'll add rules next)

### 3. Set Up Firestore Security Rules
Replace your Firestore rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User roles collection - only admins can write
    match /user_roles/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
                     exists(/databases/$(database)/documents/user_roles/$(request.auth.uid)) &&
                     get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 4. Create Your First Admin User

**Option A: Using Firebase Console**
1. Go to Authentication → Users
2. Click "Add user"
3. Email: `sibabalwelingani17@gmail.com`
4. Password: `Bts.army_7`
5. Click "Add user"
6. Copy the User UID

**Option B: Using the App**
You can register through the app (you'll need to add a signup page first)

### 5. Assign Admin Role in Firestore
1. Go to Firestore Database
2. Create a collection called `user_roles`
3. Add a document with:
   - **Document ID**: [paste the User UID from step 4]
   - **Fields**:
     - `role`: `"admin"` (string)
     - `userId`: [paste the User UID] (string)

Example:
```
Collection: user_roles
Document ID: abc123xyz (the user's UID)
Fields:
  - role: "admin"
  - userId: "abc123xyz"
```

## How It Works

### Authentication Flow
1. User enters email/password on login page
2. Firebase authenticates the credentials
3. App fetches the user's role from `user_roles` collection in Firestore
4. User is redirected to dashboard with appropriate access
5. Protected routes check for authentication and roles

### Role Management
- **Admin**: Full access to all features
- **Driver**: Limited access (you can customize this in `ProtectedRoute.tsx`)

### Adding New Users
To add more users:
1. Create them in Firebase Authentication
2. Add their role in Firestore `user_roles` collection
3. Use their UID as the document ID

## Integration with Node.js Backend

Your app is set up to work with both Firebase and your Node.js API:

1. **Firebase handles authentication** - login/logout
2. **Roles are stored in Firestore** - secure, server-side validation
3. **Your Node.js API can verify Firebase tokens** - use Firebase Admin SDK

### Node.js Integration Example
```javascript
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

// Middleware to verify token
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
```

## Testing Login

1. Make sure your user exists in Firebase Authentication
2. Make sure their role exists in Firestore `user_roles` collection
3. Try logging in with: `sibabalwelingani17@gmail.com` / `Bts.army_7`
4. You should be redirected to the dashboard

## Troubleshooting

**Error: "No account found with this email"**
- User doesn't exist in Firebase Authentication
- Create the user first

**Error: Login works but shows no role**
- Check Firestore `user_roles` collection
- Make sure document ID matches the user's UID
- Make sure the `role` field is set correctly

**Error: "Too many failed attempts"**
- Firebase temporarily blocks the IP after multiple failed logins
- Wait a few minutes or reset in Firebase Console
