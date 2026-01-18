# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25,
  "location": {
    "country": "United States",
    "city": "New York"
  },
  "maritalStatus": "NOT_IN_RELATIONSHIP"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt-token"
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current authenticated user.

### User

#### GET /api/user/profile
Get user profile.

#### PUT /api/user/update
Update user profile.

### Content

#### GET /api/content
Get content list (filtered by module, type, category).

**Query Parameters:**
- `module`: PASSION_SINGLES | PASSION_CONNECT | PASSION_COUPLES
- `type`: PDF | AUDIO | VIDEO | ARTICLE | ANNOUNCEMENT | PRAYER_POINT
- `category`: string

#### GET /api/content/:id
Get content by ID.

#### GET /api/content/search
Search content.

**Query Parameters:**
- `q`: search query
- `module`: filter by module

### Courses

#### GET /api/courses
Get all courses.

#### GET /api/courses/:id
Get course by ID.

#### GET /api/courses/:id/progress
Get course progress for current user.

#### PUT /api/courses/:id/progress
Update course progress.

**Request Body:**
```json
{
  "completedContents": ["content-id-1", "content-id-2"],
  "completionPercentage": 50
}
```

### Community

#### GET /api/community/posts
Get community posts.

**Query Parameters:**
- `module`: PASSION_SINGLES | PASSION_COUPLES
- `status`: PENDING | APPROVED | REJECTED (admin only)

#### POST /api/community/posts
Create a new post (requires approval).

**Request Body:**
```json
{
  "content": "Post content",
  "module": "PASSION_SINGLES"
}
```

#### POST /api/community/posts/:id/like
Like/unlike a post.

#### GET /api/community/posts/:id/comments
Get comments for a post.

#### POST /api/community/posts/:id/comments
Create a comment (requires approval).

### Passion Connect

All endpoints require authentication and Passion Connect access (25+, not in relationship).

#### GET /api/connect/profile
Get user's Passion Connect profile.

#### POST /api/connect/profile
Create or update profile.

#### GET /api/connect/discover
Discover profiles based on growth tier.

#### POST /api/connect/swipe
Swipe on a profile.

**Request Body:**
```json
{
  "profileId": "profile-id",
  "action": "like" | "pass"
}
```

#### GET /api/connect/connections
Get user's connections.

### Chat

#### GET /api/chat
Get user's chats.

#### GET /api/chat/:id/messages
Get messages for a chat.

#### POST /api/chat/:id/messages
Send a message.

#### POST /api/chat/:id/invite-admin
Invite admin to chat.

### Payments

#### POST /api/payments/subscription
Create a subscription.

**Request Body:**
```json
{
  "planId": "monthly_premium" | "yearly_premium"
}
```

#### POST /api/payments/purchase
Create a one-time purchase.

**Request Body:**
```json
{
  "itemType": "COURSE" | "BOOK" | "CONTENT",
  "itemId": "item-id",
  "amount": 29.99
}
```

### Admin

All admin endpoints require admin authentication.

#### GET /api/admin/dashboard
Get admin dashboard stats.

#### GET /api/admin/moderation
Get moderation queue.

**Query Parameters:**
- `type`: posts | comments

#### POST /api/admin/moderation/posts/:id/approve
Approve a post.

#### POST /api/admin/moderation/posts/:id/reject
Reject a post.

**Request Body:**
```json
{
  "reason": "Rejection reason"
}
```

#### POST /api/admin/content
Create content.

#### PUT /api/admin/content/:id
Update content.

#### DELETE /api/admin/content/:id
Delete content.

### Partnership

#### GET /api/partnership/donate
Get donation information.

#### POST /api/partnership/volunteer
Submit volunteer form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "roles": ["role1", "role2"],
  "message": "Optional message"
}
```

