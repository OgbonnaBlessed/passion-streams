# PassionStreams - Faith-Based Relationship Platform (PWA)

A production-ready Progressive Web App for intentional relationship growth, faith-based mentorship, and godly matchmaking.

## 🎯 Overview

PassionStreams is a Christian-focused platform offering three core modules:
- **Passion Singles**: Pre-marital growth and preparation
- **Passion Connect**: Guided matchmaking (25+)
- **Passion Couples**: Marriage enhancement and restoration

## 🏗️ Architecture

- **Frontend**: React PWA (TypeScript, Tailwind CSS, Vite)
- **Backend**: Node.js/Express API (TypeScript)
- **Database**: Firebase Firestore / Supabase
- **Auth**: Email/Password, Google, Apple (JWT)
- **Payments**: Stripe
- **Storage**: Firebase Storage / AWS S3
- **Notifications**: Firebase Cloud Messaging

## 📁 Project Structure

```
passion-streams/
├── frontend/          # React PWA application
├── backend/           # Node.js API server
├── shared/            # Shared types and utilities
├── database-schemas/  # Database schema definitions
└── docs/              # Documentation

```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase/Supabase account
- Stripe account

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

## 🔐 Environment Variables

See `.env.example` files in frontend and backend directories for required environment variables.

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./database-schemas/README.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🎨 Brand Colors

- Background: `#050008`
- Primary Blue: `#00b5fd`
- Primary Pink: `#f90371`
- Blue Flare: `#00d9ff`
- Pink Flare: `#fd3bb0`
- White Accent: `#ffffff` (6% opacity)

## 📄 License

Proprietary - All rights reserved

