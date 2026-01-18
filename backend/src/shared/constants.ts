/**
 * Shared constants for PassionStreams
 */

export const BRAND_COLORS = {
  background: '#050008',
  primaryBlue: '#00b5fd',
  primaryPink: '#f90371',
  blueFlare: '#00d9ff',
  pinkFlare: '#fd3bb0',
  whiteAccent: '#ffffff',
  whiteAccentOpacity: 'rgba(255, 255, 255, 0.06)',
} as const;

export const AGE_LIMITS = {
  MIN_AGE: 18,
  PASSION_CONNECT_MIN_AGE: 25,
} as const;

export const ADMIN_PASSWORD = 'passionstreamsADMIN';

export const GROWTH_TIER_THRESHOLDS = {
  TIER_1: 0, // 0%
  TIER_2_MIN: 1, // 1%
  TIER_2_MAX: 99, // 99%
  TIER_3: 100, // 100%
} as const;

export const MODULE_ACCESS_RULES = {
  // Marital status -> allowed modules
  NOT_IN_RELATIONSHIP: ['PASSION_SINGLES', 'PASSION_CONNECT'],
  IN_RELATIONSHIP: ['PASSION_SINGLES'],
  MARRIED: ['PASSION_COUPLES'],
} as const;

export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly_premium',
    name: 'Monthly Premium',
    price: 29.99,
    interval: 'month',
  },
  YEARLY: {
    id: 'yearly_premium',
    name: 'Yearly Premium',
    price: 299.99,
    interval: 'year',
  },
} as const;

export const API_ENDPOINTS = {
  // Auth
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_GOOGLE: '/api/auth/google',
  AUTH_APPLE: '/api/auth/apple',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_LOGOUT: '/api/auth/logout',
  
  // User
  USER_PROFILE: '/api/user/profile',
  USER_UPDATE: '/api/user/update',
  
  // Content
  CONTENT_LIST: '/api/content',
  CONTENT_DETAIL: '/api/content/:id',
  CONTENT_SEARCH: '/api/content/search',
  
  // Courses
  COURSES_LIST: '/api/courses',
  COURSE_DETAIL: '/api/courses/:id',
  COURSE_PROGRESS: '/api/courses/:id/progress',
  
  // Community
  COMMUNITY_POSTS: '/api/community/posts',
  COMMUNITY_POST: '/api/community/posts/:id',
  COMMUNITY_POST_CREATE: '/api/community/posts',
  COMMUNITY_POST_LIKE: '/api/community/posts/:id/like',
  COMMUNITY_COMMENT: '/api/community/posts/:id/comments',
  
  // Passion Connect
  CONNECT_PROFILE: '/api/connect/profile',
  CONNECT_DISCOVER: '/api/connect/discover',
  CONNECT_SWIPE: '/api/connect/swipe',
  CONNECT_CONNECTIONS: '/api/connect/connections',
  
  // Chat
  CHAT_LIST: '/api/chat',
  CHAT_MESSAGES: '/api/chat/:id/messages',
  CHAT_SEND: '/api/chat/:id/messages',
  CHAT_ADMIN_INVITE: '/api/chat/:id/invite-admin',
  
  // Payments
  PAYMENT_CREATE_SUBSCRIPTION: '/api/payments/subscription',
  PAYMENT_CREATE_PURCHASE: '/api/payments/purchase',
  PAYMENT_WEBHOOK: '/api/payments/webhook',
  
  // Admin
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_CONTENT: '/api/admin/content',
  ADMIN_MODERATION: '/api/admin/moderation',
  ADMIN_LIVE_STREAM: '/api/admin/live-stream',
  ADMIN_ANALYTICS: '/api/admin/analytics',
  
  // Partnership
  PARTNERSHIP_DONATE: '/api/partnership/donate',
  PARTNERSHIP_VOLUNTEER: '/api/partnership/volunteer',
} as const;

