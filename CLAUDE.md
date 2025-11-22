# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chubflix Character Creator is a Next.js v16 application for creating character sheets for TavernAI and ChubAI through an AI-powered chat interface. The system generates character profiles with personality traits and backgrounds that can be exported as JSON files.

## Core Architecture

### Technology Stack
- **Frontend**: Next.js v16 with TypeScript
- **Deployment**: Vercel (serverless)
- **Database**: Supabase with pgvector extension for vector storage
- **AI Integration**: OpenAI or OpenRouter (with abstraction layer for future provider changes)
- **Chat Interface**: React-based chat UI

### Key Architectural Principles

1. **AI Provider Abstraction**: Build a service wrapper around the AI integration to allow easy switching between OpenAI, OpenRouter, and future providers like Ollama. This wrapper should handle both embedding generation and chat completion.

2. **Vector Memory System**: Use Supabase's pgvector to store character embeddings, enabling the bot to maintain character context across multiple conversation sessions without traits bleeding between characters.

3. **Image Generation Interface**: Implement a service interface for image generation that can be connected to the user's custom API later. Do not implement the actual generation logic.

### Database Schema

The Supabase database should include:
- `characters`: Character metadata, traits, background (JSON format)
- `chat_sessions`: Multi-session conversation management per character
- `chat_messages`: Individual messages linked to sessions and characters
- `character_embeddings`: Vector embeddings using pgvector for semantic search and memory

### API Structure (Next.js API Routes)

Create API routes for:
- Chat message handling and response generation
- Embedding generation and vector storage
- Character data CRUD operations
- JSON export in TavernAI/ChubAI format
- Chat session management

### Export Format

Character sheets must be exported as JSON compatible with both TavernAI and ChubAI specifications. Ensure character traits, backgrounds, and personality data are properly formatted for these platforms.

## Documentation Standards

- **Minimal documentation**: Only update README.md with essential information
- **Feature documentation**: Document each new feature in separate files in `features/` directory for future reference
- **No generic best practices**: Avoid documenting obvious development practices

## Environment Configuration

Required environment variables:
- Supabase credentials (URL, API key)
- OpenAI/OpenRouter API keys
- Any custom API endpoints for image generation (when implemented)

Configure these securely in Vercel for deployment.
