# Chubflix Character Creator - Project Overview

I want a character creator, that uses AI to create characters sheets for tavern ai and ChubAi.
The endresult is a character sheet that can be used in the game as a json file.

## Architecture
I want a next.js v16 application that has a chat bot (chat window) that can create characters.
It knows about the game rules and the ChubAI, as well as my own set of rules regarding multiple roleplay types.
It knows about each character's personality traits and their backgrounds.
The character's traits are not bleeding into one another.

## Library and Platform Requirements
Ease of use, easy to deploy, easy to maintain.
It should be a web app that runs on a server or serverless.
The app should be written in Typescript.
Each platform or service should be free.
The image generation happens through my own API and is not part of the scope of this project.

I want the data to be stored in a database that's best understood by an AI agent, like a vector database if that's better suited.
I need to be able to export the data to a json file.
I want to be able to have multiple conversations with the bot, regarding the same character over time, with the bot remembering the character's traits and backgrounds.

I need authentication for only myself using my google account. Use supabase for the google auth integration.

## MCP Server
I want the application to expose the characters through an authenticated MCP server that's hosted on vercel.
The MCP server should be able to export the character sheets as json files.
The MCP server should be able to handle multiple conversations with the bot, regarding the same character over time.

## Services
| Component           | Service/Library         | Purpose                                  | Notes                                  | Free Tier         |
|---------------------|------------------------|------------------------------------------|----------------------------------------|-------------------|
| Frontend            | Next.js v16            | Web app framework with TypeScript        | Easy deployment on Vercel              | Yes               |
| Deployment          | Vercel                 | Hosting, plus serverless functions       | Seamless integration with Next.js     | Yes               |
| Vector Database     | Supabase + pgvector    | Vector storage and relational database   | All-in-one backend, supports vector search via pgvector | Yes               |
| AI Integration      | OpenAI or OpenRouter   | Embedding generation and AI model access | Generate embeddings for vector search | Limited free usage |
| Chat UI             | react-chat-ui (optional) | Chat interface components                | Customizable chat window UI            | Yes               |
| Image Generation API| Your own API           | Character image creation                 | Out of scope for current project      | N/A               |

# Chubflix Character Creator - AI Notes
- Don't over document the app, only update the README.md with the most important information and document each new feature in a separate file in features/ for future reference.
- Use the OpenAI API for embedding generation, I might want to use Ollama in the future, so build a service wrapper that can change the AI provider easily.
- Write a Image Generation Service Interface, that I can implement myself later to generate character images.
- Use yarn as the package manager.
- Use the `create-next-app` CLI to initialize the project.
- Use tailwindcss for styling.
- Use nvm to manage node versions.
- Look at /Volumes/MMD01/AI/chubflix/avatar-builder for what this style should look like.

# Chubflix Character Creator - Implementation Rundown

## 1. Project Setup
- Initialize a Next.js v16 project with TypeScript.
- Setup version control (Git) and connect to GitHub or preferred repository.
- Configure environment variables for API keys (Supabase, OpenAI).

## 2. Frontend Development
- Build chat UI component using React or optional libraries like `react-chat-ui`.
- Create pages and components for:
    - Character creation chat interface.
    - Character profile view and JSON export.
    - User login/auth (optional using Supabase Auth).

## 3. Backend/API Development (Next.js API Routes)
- Integrate Supabase client using `@supabase/supabase-js`.
- Implement API routes to:
    - Handle chat messages from frontend.
    - Call embedding generation API (OpenAI/OpenRouter) to convert text to vectors.
    - Store and retrieve vectors and character data in Supabase (using pgvector for vectors).
    - Manage multi-session chat history linked to character profiles.
    - Handle JSON export of character sheets compatible with TavernAI/ChubAI.

## 4. Database Schema Design (Supabase with pgvector)
- Tables:
    - `characters`: Stores character metadata, traits, background (JSON).
    - `chat_sessions`: Session info for multiple conversations per character.
    - `chat_messages`: Messages linked to sessions and characters.
    - `character_embeddings`: Store embedding vectors using pgvector for traits and chat context.
- Use indexes and vector similarity operators for efficient retrieval.

## 5. AI Integration
- Use OpenAI API or OpenRouter to:
    - Generate chat responses based on character traits and game rules.
    - Create and update character embeddings after each interaction to maintain memory.
- Incorporate your custom rules and knowledge about TavernAI and ChubAI in prompt engineering.

## 6. Export Functionality
- Implement endpoint or client function to:
    - Aggregate character data and traits.
    - Format data as JSON matching TavernAI/ChubAI character sheet specifications.
    - Provide downloadable JSON file in the UI.

## 7. Deployment
- Deploy the Next.js app to Vercel.
- Set up environment variables securely on Vercel.
- Monitor usage and performance for API calls and database queries.

## 8. Maintenance and Extending
- Add authentication and user management if multi-user support is needed.
- Enhance chat bot with more advanced memory or expanded game rule handling.
- Optimize vector indexing and queries based on usage patterns.
- Integrate with your image generation API for full character visual creation.
