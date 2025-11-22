# Google Authentication

## Overview
The application uses Supabase Auth with Google OAuth for user authentication.

## Setup Requirements
1. Configure Google OAuth in Supabase dashboard
2. Add authorized redirect URIs
3. Set environment variables

## Components
- `lib/services/auth.ts`: Authentication service functions
- `components/auth/AuthButton.tsx`: Sign in/out UI component
- `app/auth/callback/route.ts`: OAuth callback handler

## User Flow
1. User clicks "Sign in with Google"
2. Redirects to Google OAuth consent screen
3. Google redirects to `/auth/callback` with code
4. Code is exchanged for Supabase session
5. User is redirected to home page

## Protected Routes
All character and chat operations require authentication via Row Level Security (RLS) policies.

## Session Management
- Sessions are managed by Supabase
- Auto-refresh enabled by default
- Client-side session persistence

## Functions
- `signInWithGoogle()`: Initiate Google OAuth flow
- `signOut()`: Clear user session
- `getCurrentUser()`: Get authenticated user
- `getSession()`: Get current session
