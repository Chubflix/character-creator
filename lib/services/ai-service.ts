import OpenAI from 'openai';
import type {
  AIProvider,
  AIMessage,
  AICompletionOptions,
  AIEmbeddingOptions,
  AIServiceConfig,
} from '@/lib/types/ai';

export class AIService {
  private provider: AIProvider;
  private client: OpenAI;
  private config: AIServiceConfig;

  constructor(config?: Partial<AIServiceConfig>) {
    this.provider = (config?.provider || process.env.AI_PROVIDER || 'openai') as AIProvider;
    this.config = {
      provider: this.provider,
      apiKey: config?.apiKey || this.getApiKey(),
      baseURL: config?.baseURL || this.getBaseURL(),
      defaultModel: config?.defaultModel || this.getDefaultModel(),
      embeddingModel: config?.embeddingModel || this.getEmbeddingModel(),
    };

    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseURL,
    });
  }

  private getApiKey(): string {
    switch (this.provider) {
      case 'openai':
        return process.env.OPENAI_API_KEY || '';
      case 'openrouter':
        return process.env.OPENROUTER_API_KEY || '';
      case 'ollama':
        return 'ollama'; // Ollama doesn't require an API key
      default:
        return '';
    }
  }

  private getBaseURL(): string | undefined {
    switch (this.provider) {
      case 'openrouter':
        return 'https://openrouter.ai/api/v1';
      case 'ollama':
        return 'http://localhost:11434/v1';
      default:
        return undefined; // OpenAI uses default
    }
  }

  private getDefaultModel(): string {
    switch (this.provider) {
      case 'openai':
        return 'gpt-4-turbo-preview';
      case 'openrouter':
        return 'anthropic/claude-3-opus';
      case 'ollama':
        return 'llama2';
      default:
        return 'gpt-4-turbo-preview';
    }
  }

  private getEmbeddingModel(): string {
    switch (this.provider) {
      case 'openai':
        return 'text-embedding-3-small';
      case 'openrouter':
        return 'openai/text-embedding-3-small';
      case 'ollama':
        return 'nomic-embed-text';
      default:
        return 'text-embedding-3-small';
    }
  }

  async generateCompletion(options: AICompletionOptions): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || this.config.defaultModel || 'gpt-4-turbo-preview',
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating completion:', error);
      throw new Error('Failed to generate AI completion');
    }
  }

  async generateEmbedding(options: AIEmbeddingOptions): Promise<number[]> {
    try {
      const input = Array.isArray(options.input) ? options.input[0] : options.input;

      const response = await this.client.embeddings.create({
        model: options.model || this.config.embeddingModel || 'text-embedding-3-small',
        input,
      });

      return response.data[0]?.embedding || [];
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async generateEmbeddings(options: AIEmbeddingOptions): Promise<number[][]> {
    try {
      const inputs = Array.isArray(options.input) ? options.input : [options.input];

      const response = await this.client.embeddings.create({
        model: options.model || this.config.embeddingModel || 'text-embedding-3-small',
        input: inputs,
      });

      return response.data.map(item => item.embedding);
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw new Error('Failed to generate embeddings');
    }
  }

  getProvider(): AIProvider {
    return this.provider;
  }

  getConfig(): AIServiceConfig {
    return this.config;
  }
}

// Singleton instance
let aiServiceInstance: AIService | null = null;

export function getAIService(config?: Partial<AIServiceConfig>): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(config);
  }
  return aiServiceInstance;
}
