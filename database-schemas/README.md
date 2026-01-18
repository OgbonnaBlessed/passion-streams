# Database Schemas

This directory contains database schema definitions for PassionStreams.

### Collections

#### users
```typescript
{
  id: string;
  email: string;
  fullName: string;
  age: number;
  location: { country: string; city: string };
  maritalStatus: 'NOT_IN_RELATIONSHIP' | 'IN_RELATIONSHIP' | 'MARRIED';
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
  password: string; // hashed
  growthPercentage?: number; // 0-100
  growthTier?: 'TIER_1' | 'TIER_2' | 'TIER_3';
  subscriptionStatus?: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'EXPIRED';
  subscriptionEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### content
```typescript
{
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'AUDIO' | 'VIDEO' | 'ARTICLE' | 'ANNOUNCEMENT' | 'PRAYER_POINT';
  url: string;
  thumbnailUrl?: string;
  duration?: number; // seconds
  category?: string;
  tags: string[];
  isPremium: boolean;
  moduleAccess: ('PASSION_SINGLES' | 'PASSION_CONNECT' | 'PASSION_COUPLES')[];
  createdBy: string; // admin userId
  createdAt: Date;
  updatedAt: Date;
}
```

#### courses
```typescript
{
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  tier: 'FREE' | 'PREMIUM';
  price?: number;
  contents: string[]; // content IDs
  requiredForConnect?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### courseProgress
```typescript
{
  id: string;
  userId: string;
  courseId: string;
  completionPercentage: number; // 0-100
  completedContents: string[];
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
}
```

#### communityPosts
```typescript
{
  id: string;
  userId: string;
  module: 'PASSION_SINGLES' | 'PASSION_COUPLES';
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  likes: string[]; // user IDs
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // admin userId
  rejectionReason?: string;
}
```

#### comments
```typescript
{
  id: string;
  postId: string;
  userId: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}
```

#### passionConnectProfiles
```typescript
{
  id: string;
  userId: string;
  bio: string;
  photos: string[];
  interests: string[];
  whatYouSeek: string;
  testimonial?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### connections
```typescript
{
  id: string;
  user1Id: string;
  user2Id: string;
  status: 'PENDING' | 'CONNECTED' | 'BLOCKED';
  createdAt: Date;
  connectedAt?: Date;
}
```

#### chats
```typescript
{
  id: string;
  userId: string;
  adminId?: string;
  type: 'USER_ADMIN' | 'CONNECT_CHAT' | 'COUNSELING';
  module?: 'PASSION_SINGLES' | 'PASSION_CONNECT' | 'PASSION_COUPLES';
  participants: string[];
  lastMessage?: object;
  lastActivityAt: Date;
  createdAt: Date;
  isAdminActive?: boolean;
  adminExitsAt?: Date;
}
```

#### subscriptions
```typescript
{
  id: string;
  userId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'EXPIRED';
  plan: 'MONTHLY' | 'YEARLY';
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### purchases
```typescript
{
  id: string;
  userId: string;
  itemType: 'COURSE' | 'BOOK' | 'CONTENT';
  itemId: string;
  amount: number;
  stripePaymentIntentId: string;
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED';
  createdAt: Date;
}
```

#### volunteers
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  message?: string;
  status: 'PENDING' | 'CONTACTED' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
}
```

## Indexes Required

Create Firestore indexes for:
- `communityPosts`: `module`, `status`, `createdAt`
- `comments`: `postId`, `status`, `createdAt`
- `courseProgress`: `userId`, `courseId`
- `passionConnectProfiles`: `userId`, `isActive`
- `connections`: `user1Id`, `status`
- `connections`: `user2Id`, `status`
- `chats`: `participants` (array-contains), `lastActivityAt`

