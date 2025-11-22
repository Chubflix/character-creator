# Image Generation Service Interface

## Overview
An abstract interface for connecting custom image generation APIs.

## Location
`lib/services/image-generation-service.ts`

## Implementation Status
Interface defined, implementation pending.

## Usage
Extend the `ImageGenerationService` abstract class:

```typescript
import { ImageGenerationService, ImageGenerationOptions, ImageGenerationResult } from '@/lib/services/image-generation-service';

export class CustomImageService extends ImageGenerationService {
  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    // Your implementation here
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    return {
      success: true,
      imageUrl: data.url,
      metadata: {
        seed: data.seed,
        prompt: options.prompt,
      },
    };
  }
}
```

## Configuration
Set environment variables:
```env
IMAGE_GENERATION_API_URL=https://your-api.com/generate
IMAGE_GENERATION_API_KEY=your-api-key
```

## Options Interface
- `prompt`: Main generation prompt
- `negativePrompt`: Optional negative prompt
- `width`, `height`: Image dimensions
- `steps`: Generation steps
- `seed`: Random seed for reproducibility
- `guidanceScale`: How closely to follow the prompt
- `sampler`: Sampling algorithm
- `characterName`, `characterTraits`: Character-specific context
