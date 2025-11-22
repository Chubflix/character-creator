import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/services/ai-service';
import { supabase } from '@/lib/services/supabase';

// POST generate and store embedding
export async function POST(request: NextRequest) {
  try {
    const { characterId, content, userId } = await request.json();

    if (!characterId || !content || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify character belongs to user
    const { data: character, error: characterError } = await supabase
      .from('characters')
      .select('id')
      .eq('id', characterId)
      .eq('user_id', userId)
      .single();

    if (characterError || !character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    // Generate embedding
    const aiService = getAIService();
    const embedding = await aiService.generateEmbedding({ input: content });

    // Store embedding
    const { data: embeddingData, error: embeddingError } = await supabase
      .from('character_embeddings')
      .insert({
        character_id: characterId,
        content,
        embedding: JSON.stringify(embedding),
      })
      .select()
      .single();

    if (embeddingError) {
      throw embeddingError;
    }

    return NextResponse.json({ embedding: embeddingData });
  } catch (error) {
    console.error('Error generating embedding:', error);
    return NextResponse.json(
      { error: 'Failed to generate embedding' },
      { status: 500 }
    );
  }
}

// GET search similar embeddings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const characterId = searchParams.get('characterId');
    const query = searchParams.get('query');
    const userId = searchParams.get('userId');

    if (!characterId || !query || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify character belongs to user
    const { data: character, error: characterError } = await supabase
      .from('characters')
      .select('id')
      .eq('id', characterId)
      .eq('user_id', userId)
      .single();

    if (characterError || !character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    // Generate query embedding
    const aiService = getAIService();
    const queryEmbedding = await aiService.generateEmbedding({ input: query });

    // Search similar embeddings using the RPC function
    const { data: results, error: searchError } = await supabase
      .rpc('search_character_embeddings', {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: 0.7,
        match_count: 5,
        filter_character_id: characterId,
      });

    if (searchError) {
      throw searchError;
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching embeddings:', error);
    return NextResponse.json(
      { error: 'Failed to search embeddings' },
      { status: 500 }
    );
  }
}
