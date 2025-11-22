# Chubflix Character Creator

AI-powered character sheet creator for TavernAI and ChubAI, built with Next.js v16 and deployed on Vercel.

## Features

- **Chubflix Styling**: Dark Netflix-like theme with red accent (#e50914)
- **AI Chat Interface**: Create characters through conversational AI
- **Vector Memory**: Character traits stored with pgvector for consistency
- **Multi-Session Support**: Continue character development across sessions
- **Google Authentication**: Secure single-user authentication via Supabase
- **Character Export**: Download as TavernAI/ChubAI compatible JSON
- **MCP Server**: Expose characters through authenticated API
- **Provider Abstraction**: Easily switch between OpenAI, OpenRouter, Ollama

## Quick Start

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase and OpenAI credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `AI_PROVIDER`: Set to `openai`, `openrouter`, or `ollama`

3. **Set up Supabase database**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the migration in `supabase/migrations/001_initial_schema.sql`
   - Enable Google OAuth in Supabase dashboard (Authentication → Providers)
   - Add `http://localhost:3000/auth/callback` to redirect URLs

4. **Run development server**
   ```bash
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   yarn build
   ```

## Features

- **AI Chat Interface**: Create characters through conversational AI
- **Vector Memory**: Character traits stored with pgvector for consistency
- **Multi-Session Support**: Continue character development across sessions
- **Google Authentication**: Secure single-user authentication via Supabase
- **Character Export**: Download as TavernAI/ChubAI compatible JSON
- **MCP Server**: Expose characters through authenticated API
- **Provider Abstraction**: Easily switch between OpenAI, OpenRouter, Ollama

## Tech Stack

- **Frontend**: Next.js v16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI**: OpenAI/OpenRouter with abstraction layer
- **Deployment**: Vercel
- **Authentication**: Supabase Auth (Google OAuth)

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── chat/         # Chat endpoints
│   │   ├── characters/   # Character CRUD
│   │   ├── embeddings/   # Vector operations
│   │   └── mcp/          # MCP server
│   ├── auth/             # Auth callbacks
│   └── page.tsx          # Main page
├── components/
│   ├── auth/             # Auth components
│   └── chat/             # Chat UI components
├── lib/
│   ├── services/         # Core services
│   │   ├── ai-service.ts           # AI provider abstraction
│   │   ├── image-generation-service.ts  # Image gen interface
│   │   ├── supabase.ts             # Supabase client
│   │   └── auth.ts                 # Auth helpers
│   └── types/            # TypeScript types
├── supabase/
│   └── migrations/       # Database migrations
└── features/             # Feature documentation
```

## Environment Variables

See `.env.example` for required variables:
- Supabase URL and keys
- OpenAI/OpenRouter API keys
- AI provider selection
- Custom image generation API (optional)

## Documentation

Feature-specific documentation in `features/`:
- AI Service Abstraction
- Vector Memory System
- MCP Server
- Authentication
- Image Generation Interface

## Deployment

Deploy to Vercel:
```bash
vercel
```

Configure environment variables in Vercel dashboard.

## License

MIT
