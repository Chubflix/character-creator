# Vector Memory System

## Overview
The vector memory system uses Supabase's pgvector extension to store and retrieve character embeddings, preventing trait bleeding between characters.

## Database Schema
- **character_embeddings**: Stores vector embeddings with 1536 dimensions
- Uses HNSW index for efficient similarity search
- Linked to characters table with CASCADE delete

## Key Features
- Semantic search using cosine similarity
- Character-specific memory isolation
- Configurable similarity threshold (default: 0.7)
- Top-K retrieval (default: 5 matches)

## Search Function
The `search_character_embeddings` function enables:
- Query embedding matching
- Character-specific filtering
- Similarity threshold filtering
- Result limiting

## Usage
Generate embeddings via `/api/embeddings` endpoint:
```typescript
POST /api/embeddings
{
  "characterId": "uuid",
  "content": "Character trait description",
  "userId": "uuid"
}
```

Search embeddings:
```typescript
GET /api/embeddings?characterId=uuid&query=text&userId=uuid
```

## Benefits
- Maintains character consistency across sessions
- Prevents trait contamination between characters
- Enables semantic understanding of character context
- Supports multi-session conversations
