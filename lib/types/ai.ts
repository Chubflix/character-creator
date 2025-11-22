export type AIProvider = 'openai' | 'openrouter' | 'ollama';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionOptions {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AIEmbeddingOptions {
  input: string | string[];
  model?: string;
}

export interface AIServiceConfig {
  provider: AIProvider;
  apiKey?: string;
  baseURL?: string;
  defaultModel?: string;
  embeddingModel?: string;
}
