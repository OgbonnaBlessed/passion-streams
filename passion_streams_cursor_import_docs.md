# PASSIONSTREAMS – CURSOR AI IMPORT DOCUMENTS

This document is the **single source of truth** for building the PassionStreams Progressive Web App (PWA). Cursor AI must treat this document as authoritative over assumptions.

---

## 1. PRODUCT REQUIREMENTS DOCUMENT (PRD)

### App Name
PassionStreams

### Platform
Progressive Web App (PWA)

### Target Audience
Christian users aged **18 and above** seeking intentional relationship growth, matchmaking, and marriage restoration.

### Core Pillars
- Faith-based, Bible-aligned content
- Intentional relationship preparation
- Accountability and mentorship
- Strong admin moderation
- Premium yet welcoming experience

---

## 2. USER ELIGIBILITY & ACCESS RULES (HARD CONSTRAINTS)

### Age Rules
- Users **under 18** are completely blocked from access
- Passion Connect requires **25+**

### Required Signup Fields
- Full Name
- Email
- Password
- Age
- Location (Country, City)
- Marital Status

### Marital Status Routing
| Status | Allowed Modules |
|------|----------------|
| Married | Passion Couples ONLY |
| In a Relationship | Passion Singles ONLY |
| Not in a Relationship | Passion Singles + Passion Connect |

Routing is automatic and enforced at backend and frontend level.

---

## 3. MODULE DEFINITIONS

### A. PASSION SINGLE
**Purpose:** Pre-marital growth and preparation

#### Features
- Training Library (PDF + Audio)
- Courses (Free + Premium)
- Progress Tracking
- Community Wall (Moderated)
- Chat with Admin
- Subscriptions & One-time purchases

#### Community Rules
- Users may submit posts
- ALL posts require admin approval
- No direct messaging between members
- Admin can post articles, videos, audios, announcements

---

### B. PASSION CONNECT (MATCHMAKING)
**Purpose:** Guided godly matchmaking

#### Eligibility
- Age 25+
- Must complete Passion Single courses

#### Growth Tier System
- Tier 1: 0% completion – limited visibility
- Tier 2: 1–99% – partial access
- Tier 3: 100% – full access

Growth rating is visible on profiles.

#### Features
- Profile creation
- Discovery (swipe or list)
- One-on-one chat after connection
- Invite admin into chat (auto exit after session)

---

### C. PASSION COUPLES
**Purpose:** Marriage enhancement and restoration

#### Features
- Marriage content library
- Courses and counseling
- Community wall (moderated)
- Private admin counseling sessions
- Admin chat

Same community rules as Passion Singles.

---

## 4. COMMUNITY SYSTEM (GLOBAL RULES)

This community system is **NOT** a dating feature.

### Rules
- Separate communities for Singles and Couples
- No member-to-member private chat
- Posts and comments require admin approval
- Admin controls announcements and live sessions

Admin can go live to:
- Singles only
- Couples only
- Both

---

## 5. ADMIN DASHBOARD RULES

### Access
- URL: /admin
- Password protected
- Password: passionstreamsADMIN

### Capabilities
- Content management (PDF, Audio, Video, Blogs)
- Course sales (recorded video & PDF)
- Community moderation
- Live streaming
- Broadcast notifications
- User management
- Analytics

---

## 6. MONETIZATION RULES

- Monthly subscriptions
- One-time purchases
- Stripe integration
- Donations via partnership page

---

## 7. BRANDING RULES

### Colors (STRICT)
- Background: #050008
- Blue: #00b5fd
- Pink: #f90371
- Blue Flare: #00d9ff
- Pink Flare: #fd3bb0
- White accents only (6% opacity)

### UI
- Dark mode first
- Modern, premium, faith-aligned
- Highly responsive

---

## 8. TECH STACK (MANDATORY)

### Frontend
- React (PWA)
- TypeScript
- Tailwind CSS

### Backend
- Node.js (Serverless)
- Firebase or Supabase

### Auth
- Email/Password
- Google
- Apple

### Storage
- Cloud storage (S3/Firebase)

### Notifications
- Firebase Cloud Messaging

### Streaming & Calls
- AWS IVS / Mux
- WebRTC / Twilio / Agora

---

## 9. NON-FUNCTIONAL REQUIREMENTS

- High performance
- Secure (encryption in transit & at rest)
- Scalable architecture
- Offline support for content
- Accessibility compliance

---

## 10. FINAL DIRECTIVE TO CURSOR AI

Build this as a **production-grade Progressive Web App**, not a prototype. This document overrides assumptions. Follow best practices, clean architecture, and strict rule enforcement.
