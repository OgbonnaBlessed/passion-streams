# Firebase Setup Guide

## Prerequisites

- Google account
- Firebase account (free tier is sufficient)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `passion-streams` (or your preferred name)
4. Disable Google Analytics (optional) or enable it
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click, enable, save
   - **Google**: Click, enable, add support email, save
   - **Apple**: Click, enable, configure (requires Apple Developer account)

## Step 3: Create Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click "Create database"
3. Choose **Production mode** (you'll set security rules later)
4. Select a location closest to your users
5. Click "Enable"

### Security Rules

Update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Content collection (public read, admin write)
    match /content/{contentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }

    // Courses collection
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }

    // Course progress (users can read/write their own)
    match /courseProgress/{progressId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Community posts (read approved, write own)
    match /communityPosts/{postId} {
      allow read: if request.auth != null &&
        (resource.data.status == 'APPROVED' ||
         resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN');
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN');
    }

    // Comments
    match /comments/{commentId} {
      allow read: if request.auth != null &&
        (resource.data.status == 'APPROVED' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN');
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }

    // Chats (users can only access their own chats)
    match /chats/{chatId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;

      // Messages subcollection
      match /messages/{messageId} {
        allow read, write: if request.auth != null &&
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
      }
    }

    // Passion Connect profiles
    match /passionConnectProfiles/{profileId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Connections
    match /connections/{connectionId} {
      allow read, write: if request.auth != null &&
        (resource.data.user1Id == request.auth.uid ||
         resource.data.user2Id == request.auth.uid);
    }

    // Subscriptions
    match /subscriptions/{subscriptionId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Purchases
    match /purchases/{purchaseId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Volunteers (admin read)
    match /volunteers/{volunteerId} {
      allow read: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
      allow create: if request.auth != null;
    }
  }
}
```

## Step 4: Set Up Storage

1. Go to **Storage** in Firebase Console
2. Click "Get started"
3. Start in **Production mode**
4. Select same location as Firestore
5. Click "Done"

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /content/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 5: Get Web App Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click **Web icon** (`</>`)
4. Register app with nickname: "PassionStreams Web"
5. Copy the Firebase configuration object

Add these values to your `.env` files:

**Frontend (.env):**

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 6: Create Service Account (Backend)

1. Go to **Project Settings** > **Service accounts**
2. Click "Generate new private key"
3. Save the JSON file securely
4. Copy values to backend `.env`:

**Backend (.env):**

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your key...\n-----END PRIVATE KEY-----\n"
```

**Important:** When copying the private key, replace `\n` with actual newlines, or keep as-is in quotes.

## Step 7: Set Up Cloud Messaging (Optional)

1. Go to **Cloud Messaging** in Firebase Console
2. Enable Cloud Messaging API
3. Copy Server key (for backend notifications)
4. Copy Web Push certificates (for frontend)

## Step 8: Create Firestore Indexes

Go to **Firestore** > **Indexes** and create composite indexes for:

1. `communityPosts`:

   - Fields: `module` (Ascending), `status` (Ascending), `createdAt` (Descending)

2. `comments`:

   - Fields: `postId` (Ascending), `status` (Ascending), `createdAt` (Ascending)

3. `courseProgress`:

   - Fields: `userId` (Ascending), `courseId` (Ascending)

4. `chats`:
   - Fields: `participants` (Array), `lastActivityAt` (Descending)

## Step 9: Test Setup

1. Create a test user via Authentication
2. Verify Firestore writes work
3. Test file upload to Storage
4. Verify security rules are working

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**: Check security rules
2. **CORS errors**: Verify frontend URL in Firebase settings
3. **Service account not working**: Ensure private key is properly formatted with newlines
4. **Storage upload fails**: Check storage security rules and bucket permissions

## Next Steps

- Set up Stripe for payments
- Configure domain and custom domain (if needed)
- Enable Cloud Functions (if using serverless features)
- Set up monitoring and analytics
