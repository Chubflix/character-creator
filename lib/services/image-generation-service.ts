/**
 * Image Generation Service Interface
 *
 * This interface defines the contract for image generation services.
 * Implement this interface to connect to your custom image generation API.
 */

export interface ImageGenerationOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  guidanceScale?: number;
  sampler?: string;
  characterName?: string;
  characterTraits?: string[];
}

export interface ImageGenerationResult {
  success: boolean;
  imageUrl?: string;
  imageData?: string; // Base64 encoded image
  error?: string;
  metadata?: {
    seed?: number;
    prompt?: string;
    processingTime?: number;
  };
}

export abstract class ImageGenerationService {
  protected apiUrl: string;
  protected apiKey: string;

  constructor(apiUrl?: string, apiKey?: string) {
    this.apiUrl = apiUrl || process.env.IMAGE_GENERATION_API_URL || '';
    this.apiKey = apiKey || process.env.IMAGE_GENERATION_API_KEY || '';
  }

  /**
   * Generate an image based on the provided options
   */
  abstract generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult>;

  /**
   * Check if the image generation service is configured and ready
   */
  isConfigured(): boolean {
    return Boolean(this.apiUrl && this.apiKey);
  }

  /**
   * Get the API URL
   */
  getApiUrl(): string {
    return this.apiUrl;
  }
}

/**
 * Default implementation that returns a placeholder
 * Replace this with your actual implementation
 */
export class DefaultImageGenerationService extends ImageGenerationService {
  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Image generation service is not configured. Please set IMAGE_GENERATION_API_URL and IMAGE_GENERATION_API_KEY in your environment variables.',
      };
    }

    // This is a placeholder implementation
    // TODO: Implement actual API call to your image generation service
    console.log('Image generation requested with options:', options);

    return {
      success: false,
      error: 'Image generation service implementation pending. Please implement the generateImage method in your custom service.',
    };
  }
}

// Singleton instance
let imageServiceInstance: ImageGenerationService | null = null;

export function getImageGenerationService(
  customService?: ImageGenerationService
): ImageGenerationService {
  if (customService) {
    imageServiceInstance = customService;
  }

  if (!imageServiceInstance) {
    imageServiceInstance = new DefaultImageGenerationService();
  }

  return imageServiceInstance;
}
