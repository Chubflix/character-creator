# API Security Documentation

## Authentication Overview

All API endpoints in the Character Creator application are now secured with Supabase authentication. Users must be signed in to access any API functionality.

## How Authentication Works

### Client-Side
1. User signs in via email/password or OAuth (Google)
2. Supabase creates a session and stores an access token
3. The frontend retrieves this token when making API requests
4. Token is sent in the `Authorization` header as `Bearer <token>`

### Server-Side
1. API routes extract the token from the `Authorization` header
2. Token is verified using the Supabase service role client
3. If valid, the user's ID is extracted from the token
4. User ID is verified to match the requested resource
5. If authentication fails, a 401 or 403 error is returned

## Secured Endpoints

### `/api/characters` (POST)
- Creates a new character
- Verifies user owns the character being created
- Returns 401 if not authenticated
- Returns 403 if userId doesn't match authenticated user

### `/api/characters` (GET)
- Lists characters for a user
- Verifies user can only see their own characters
- Returns 401 if not authenticated

### `/api/chat` (POST)
- Sends chat messages for character development
- Verifies user owns the character and session
- Returns 401 if not authenticated
- Returns 403 if userId doesn't match authenticated user

### `/api/mcp` (POST)
- MCP server for external AI access
- Requires Bearer token authentication
- Only exposes data for the authenticated user

## Security Best Practices Implemented

✅ **Server-side token verification** - Tokens are validated on the server using Supabase Auth
✅ **Service role key usage** - API routes use the service role key to bypass RLS (for authorized operations)
✅ **User ID validation** - All requests verify the userId matches the authenticated user
✅ **HTTPS only in production** - Always use HTTPS to protect tokens in transit
✅ **Short-lived tokens** - Tokens expire after 1 hour by default
✅ **No token storage in localStorage** - Supabase handles secure token storage

## Environment Variables

### Required for Production
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # KEEP SECRET!

# AI Provider
OPENAI_API_KEY=your-openai-key  # KEEP SECRET!
# OR
OPENROUTER_API_KEY=your-openrouter-key  # KEEP SECRET!
AI_PROVIDER=openai  # or 'openrouter'

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Security Notes
- ⚠️ **Never commit** `SUPABASE_SERVICE_ROLE_KEY` to git
- ⚠️ **Never commit** API keys to git
- ✅ **Use environment variables** for all secrets
- ✅ **Set these in Vercel** for production deployment

## Local Development Security

For local development, Row Level Security (RLS) has been disabled to simplify testing. This is acceptable because:

1. The database is only accessible locally
2. No production data is at risk
3. Authentication is still enforced at the API level

### Re-enabling RLS for Production

When deploying to production with real user data, re-enable RLS:

```sql
-- Re-enable RLS
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_embeddings ENABLE ROW LEVEL SECURITY;

-- Add RLS policies (adjust for your auth setup)
CREATE POLICY "Users can manage their own characters"
  ON characters FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions"
  ON chat_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Repeat for other tables...
```

## Token Refresh

Tokens expire after 1 hour. The frontend should handle token refresh automatically via Supabase, but if a user gets a 401 error:

1. They will be prompted to sign in again
2. A new session will be created
3. They can continue using the app

## Rate Limiting

Consider adding rate limiting in production to prevent abuse:

- Use Vercel's edge config for rate limiting
- Or use a service like Upstash Redis
- Limit API calls per user per hour

## Additional Security Measures for Production

### Recommended
1. **CORS configuration** - Restrict API access to your frontend domain
2. **Input validation** - Add zod or similar for request validation
3. **SQL injection prevention** - Supabase client handles this automatically
4. **XSS prevention** - Next.js handles this automatically
5. **CSRF protection** - Vercel handles this for API routes

### Optional
1. **2FA** - Enable in Supabase Auth settings
2. **Email verification** - Require users to verify their email
3. **Password complexity** - Already configured (minimum 6 characters)
4. **Session timeout** - Configure in Supabase dashboard

## Audit Log

Consider implementing audit logging for:
- Character creation/deletion
- Export operations
- Failed authentication attempts

## Reporting Security Issues

If you discover a security vulnerability, please do not create a public issue. Instead:
1. Email the maintainer directly
2. Include detailed steps to reproduce
3. Allow 90 days for a fix before public disclosure
