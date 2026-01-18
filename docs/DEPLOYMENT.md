# Deployment Guide

## Prerequisites

- Node.js 18+
- Firebase/Supabase account
- Stripe account
- Domain name (optional)

## Environment Setup

### Frontend (.env)
```env
VITE_API_URL=https://api.yourdomain.com
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your_secure_secret_key
JWT_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password, Google, Apple)
3. Create Firestore database
4. Set up Storage bucket
5. Create Firebase Admin service account
6. Set up Firebase Cloud Messaging

## Database Setup

1. Create Firestore collections (see database-schemas/README.md)
2. Create required indexes
3. Set up security rules (only allow authenticated users)

## Stripe Setup

1. Create Stripe account
2. Get API keys (test and production)
3. Set up webhooks:
   - Endpoint: `https://api.yourdomain.com/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Create products and prices for subscriptions

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

#### Backend (Railway/Render)
1. Push code to GitHub
2. Create new service
3. Set environment variables
4. Deploy

### Option 2: Firebase Hosting (Frontend) + Cloud Functions (Backend)

#### Frontend
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

#### Backend (Cloud Functions)
1. Convert Express app to Cloud Functions
2. Deploy functions

### Option 3: Docker

#### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env
```

## CI/CD

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

## Post-Deployment

1. Verify all environment variables are set
2. Test authentication flow
3. Test payment integration
4. Set up monitoring (Sentry, LogRocket, etc.)
5. Configure domain SSL certificates
6. Set up backups for database
7. Configure rate limiting
8. Set up error tracking

## Security Checklist

- [ ] JWT secret is strong and unique
- [ ] All environment variables are secure
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (if using SQL)
- [ ] XSS protection
- [ ] HTTPS only
- [ ] Security headers (Helmet)
- [ ] Firebase security rules configured
- [ ] Stripe webhook signature verification

## Monitoring

- Set up error tracking (Sentry)
- Set up analytics (Google Analytics, Mixpanel)
- Monitor API performance
- Monitor database performance
- Set up alerts for critical errors
- Monitor payment transactions

