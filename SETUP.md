# Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - Name: `chubflix-character-creator`
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Click "Create new project" and wait for it to initialize

## Step 2: Run Database Migration

1. In your Supabase project dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the migration

This will create:
- `characters` table
- `chat_sessions` table
- `chat_messages` table
- `character_embeddings` table with pgvector support
- All necessary indexes and RLS policies

## Step 3: Enable Google OAuth

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Find "Google" and click to expand
3. Toggle "Enable Sign in with Google"
4. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select existing)
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret
5. Paste Client ID and Client Secret into Supabase
6. Add authorized redirect URLs in Supabase:
   - `http://localhost:3000/auth/callback` (for local development)
   - Your production URL when deployed
7. Click "Save"

## Step 4: Configure Environment Variables

1. In Supabase dashboard, go to "Settings" → "API"
2. Copy these values to your `.env` file:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

3. Add your OpenAI API key:
   - Get it from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Add to `.env` as `OPENAI_API_KEY`

Your `.env` should look like:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-...
AI_PROVIDER=openai
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Start Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### "Could not find the table 'public.characters' in the schema cache"

This means the migration hasn't been run. Go back to Step 2 and run the migration in the Supabase SQL Editor.

### "Invalid supabaseUrl"

Make sure your `NEXT_PUBLIC_SUPABASE_URL` in `.env` is correct and includes `https://`.

### "Failed to sign in"

1. Check that Google OAuth is enabled in Supabase
2. Verify the redirect URLs are correct
3. Make sure your Google OAuth credentials are correct

### "Failed to generate AI completion"

Check that your `OPENAI_API_KEY` is valid and has credits available.
