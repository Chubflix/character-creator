# AI Service Abstraction

## Overview
The AI service provides an abstraction layer for AI providers, allowing easy switching between OpenAI, OpenRouter, and Ollama.

## Location
`lib/services/ai-service.ts`

## Supported Providers
- **OpenAI**: Default provider using GPT-4 Turbo
- **OpenRouter**: Alternative provider with access to various models
- **Ollama**: Local AI models (for future use)

## Configuration
Set the `AI_PROVIDER` environment variable to switch providers:
```env
AI_PROVIDER=openai  # or openrouter, ollama
```

## Key Features
- Unified interface for chat completions
- Embedding generation for vector storage
- Automatic provider-specific configuration
- Singleton pattern for efficient resource usage

## Usage Example
```typescript
import { getAIService } from '@/lib/services/ai-service';

const aiService = getAIService();
const response = await aiService.generateCompletion({
  messages: [{ role: 'user', content: 'Hello!' }],
  temperature: 0.7,
});
```

## Models Used
- **OpenAI Chat**: gpt-4-turbo-preview
- **OpenAI Embeddings**: text-embedding-3-small (1536 dimensions)
- **OpenRouter Chat**: anthropic/claude-3-opus
- **Ollama Chat**: llama2
