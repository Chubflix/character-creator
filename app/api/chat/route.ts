import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, verifyUserAccess, handleAuthError, getServiceSupabase } from '@/lib/auth/middleware';
import OpenAI from 'openai';
import {getAIService} from "@/lib/services/ai-service";
import {AIMessage} from "@/lib/types/ai";

const supabase = getServiceSupabase();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { sessionId, characterId, message, userId } = await request.json();

    if (!sessionId || !characterId || !message || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    verifyUserAccess(user.id, userId);

    // Get character details
    const { data: character, error: characterError } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .eq('user_id', userId)
      .single();

    if (characterError || !character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    // Get recent chat history
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(20);

    if (messagesError) {
      throw messagesError;
    }

    // Save user message
    const { error: saveUserMessageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        character_id: characterId,
        role: 'user',
        content: message,
      });

    if (saveUserMessageError) {
      throw saveUserMessageError;
    }

    // Build AI messages with character context
    const systemPrompt = `You are helping to create a character named ${character.name}.
Character Description: ${character.description || 'Not yet defined'}
Personality Traits: ${character.personality?.join(', ') || 'Not yet defined'}
Background: ${character.background || 'Not yet defined'}

Your role is to help the user develop this character by asking insightful questions and providing suggestions.
Focus on building a rich, consistent character suitable for TavernAI and ChubAI.`;

    const aiMessages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...(messages || []).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Generate AI response
    const aiService = getAIService();
    const response = await aiService.generateCompletion({
      messages: aiMessages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Save assistant message
    const { error: saveAssistantMessageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        character_id: characterId,
        role: 'assistant',
        content: response,
      });

    if (saveAssistantMessageError) {
      throw saveAssistantMessageError;
    }

    // Update session timestamp
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    return NextResponse.json({ response });
  } catch (error) {
    return handleAuthError(error);
  }
}
