## 1. Overview

This application now uses **MongoDB as the single source of truth for user accounts and authentication**.

* **MongoDB** stores all users, credentials, profiles, roles, and permissions.
* **Firebase is NOT used as a database or auth provider**.
* **Firebase is used ONLY as an identity provider for Google Sign-In**, to verify the Google user and obtain a trusted email.

After a successful Google sign-in:

1. Firebase verifies the Google account.
2. The backend receives the verified email.
3. MongoDB is checked:

   * If the user exists → they are logged in.
   * If the user does not exist → a new MongoDB user is created.
4. A JWT token is issued by the backend.

---

## 2. What Was Changed

### Before (Firebase-centric)

* Firebase Authentication handled:

  * Email/password login
  * Google Sign-In
* Firestore stored all user data
* Firebase Storage stored uploaded files

### Now (MongoDB-centric)

* **MongoDB handles ALL authentication and user persistence**:

  * Email/password sign-up & login
  * User profiles, roles, permissions
  * Application-specific user data
* **Firebase is ONLY used for Google Sign-In verification**

  * No Firestore
  * No Firebase Auth user management
  * No Firebase Storage
* **Cloudinary replaces Firebase Storage** for file uploads

This ensures:

* Full ownership of user data
* Consistent authentication logic
* Easier migrations and scaling

---

# MongoDB & Cloudinary Migration Guide

## Purpose of This Document

This document explains **what was changed**, **why it was changed**, and **how to replicate it from scratch**, for the migration from **Firebase Firestore & Firebase Storage** to **MongoDB (Atlas) & Cloudinary**.

It is written for an app owner who:

* Has **never used MongoDB or Cloudinary before**
* Wants to understand the new architecture
* May need to recreate or maintain the setup independently

> **Important:** Firebase Authentication is **still in use**. Only the **database** and **file storage** layers were replaced.

---

## High-Level Summary of Changes

### Before

* **Authentication:** Firebase Auth
* **Database:** Firebase Firestore
* **File Storage:** Firebase Storage

### After

* **Authentication:** Firebase Auth (unchanged)
* **Database:** MongoDB Atlas (via Mongoose)
* **File Storage:** Cloudinary

### Why This Change Was Made

1. **Scalability & Flexibility**

   * MongoDB provides more flexible data modeling for complex relationships (chat, connections, swipes, subscriptions).

2. **Backend Control**

   * All data logic now lives fully in the backend (Express + MongoDB), instead of relying heavily on Firestore rules.

3. **Better Media Handling**

   * Cloudinary offers image/video optimization, transformations, CDN delivery, and easier media management than Firebase Storage.

4. **Industry-Standard Stack**

   * MongoDB + Cloudinary is a common production stack, easier to maintain long-term with backend developers.

---

## New Architecture Overview

```
Frontend (Web / Mobile)
   |
   |  Firebase Auth (login, signup, Google sign-in)
   v
Backend (Node.js + Express)
   |
   |-- MongoDB (all app data)
   |-- Cloudinary (images, media files)
   |-- Stripe (payments)
```

---

## Part 1: MongoDB Atlas Setup (Database)

### What Is MongoDB?

MongoDB is a **NoSQL database** that stores data as JSON-like documents instead of tables.

* A **Database** contains collections
* A **Collection** contains documents
* A **Document** is similar to a Firestore document or JSON object

---

### Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Start Free**
3. Sign up using Google or email

---

### Step 2: Create a Cluster

1. Click **Build a Database**
2. Choose **Shared (Free Tier)**
3. Cloud Provider: AWS (recommended)
4. Region: Choose closest to your users
5. Name the cluster (e.g. `passion-streams-cluster`)
6. Click **Create**

---

### Step 3: Create Database User

1. Go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password Authentication**
4. Username: choose any name
5. Password: generate and save securely
6. Privileges: **Read and write to any database**

---

### Step 4: Allow Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere (0.0.0.0/0)**

   * This is acceptable for now; can be restricted later

---

### Step 5: Get Connection String

1. Go to **Database → Connect**
2. Choose **Connect your application**
3. Driver: Node.js
4. Copy the connection string

Example:

```
mongodb+srv://<username>:<password>@cluster.mongodb.net/passion_streams
```

Replace `<username>` and `<password>` with your database user credentials.

---

### Step 6: Backend Environment Variable

Add to backend `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/passion_streams
```

---

### Step 7: How MongoDB Is Used in the Code

The backend uses **Mongoose**, a library that:

* Defines schemas (structure of data)
* Validates data
* Communicates with MongoDB

Each major feature has its own schema, for example:

* Users
* Content
* Courses
* Purchases
* Subscriptions
* Chats
* Passion Connect profiles
* Comments
* Community Posts
* Connection
* Course Progress
* Volunteers
* Swipe
* Upload

These schemas replace all Firestore collections.

---

## Part 2: Cloudinary Setup (File Storage)

### What Is Cloudinary?

Cloudinary is a **cloud-based media service** used for:

* Image uploads
* Video uploads
* Automatic resizing and optimization
* CDN delivery

It replaces **Firebase Storage** completely.

---

### Step 1: Create Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **Sign Up For Free**
3. Verify your email

---

### Step 2: Get Cloudinary Credentials

After login, go to the **Dashboard**.

You will see:

* Cloud Name
* API Key
* API Secret

---

### Step 3: Backend Environment Variables

Add these to backend `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### Step 4: How File Uploads Work Now

1. Frontend sends file to backend
2. Backend uploads file to Cloudinary
3. Cloudinary returns:

   * Secure URL
   * Public ID
4. Backend saves file info in MongoDB

The file itself is **never stored on your server**.

---

### Stored Upload Metadata

Each upload stores:

* File URL
* Public ID
* Folder name
* File size
* MIME type
* User who uploaded it

This replaces Firebase Storage references.

---

## Part 3: What Stayed the Same (Firebase Auth)

Firebase Authentication is still responsible for:

* Google sign-in
* Apple sign-in
* Token generation

### Flow

1. User logs in via Firebase
2. Frontend receives Firebase ID token
3. Token is sent to backend
4. Backend verifies token
5. Backend fetches user data from MongoDB

---

## Part 4: Data Mapping (Old vs New)

| Feature  | Before (Firestore) | After (MongoDB)                |
| -------- | ------------------ | ------------------------------ |
| Users    | `users` collection | `users` collection             |
| Content  | `content`          | `content`                      |
| Courses  | `courses`          | `courses`                      |
| Progress | `courseProgress`   | embedded / separate collection |
| Chats    | `chats/messages`   | `chats/messages`               |
| Uploads  | Firebase Storage   | Cloudinary                     |

---

## Part 5: Replicating This Setup From Scratch

1. Create Firebase project (Auth only)
2. Create MongoDB Atlas cluster
3. Add MongoDB connection string to backend
4. Create Cloudinary account
5. Add Cloudinary credentials to backend
6. Deploy backend (Render/Railway)
7. Test:

   * Signup & login
   * Data creation
   * File uploads
   * Payments

---

## Verification Checklist

* [ ] MongoDB cluster connected
* [ ] Users are saved in MongoDB
* [ ] Content loads correctly
* [ ] Images upload to Cloudinary
* [ ] URLs are returned and stored
* [ ] Firebase Auth still works

---

## Common Questions

### Do I need Firestore anymore?

No. Firestore and Firebase Storage are no longer used.

### Is MongoDB secure?

Yes. Access is controlled via credentials and network rules.

### Can this scale?

Yes. MongoDB Atlas and Cloudinary both scale automatically.

---

## Final Notes

This migration gives full backend ownership, better scalability, and professional-grade infrastructure.

If future developers join the project, this setup will be familiar and maintainable.

---

**End of Document**
