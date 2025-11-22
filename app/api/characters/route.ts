import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';

// GET all characters for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: characters, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ characters });
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}

// POST create a new character
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, description, personality, background, traits } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'User ID and name are required' },
        { status: 400 }
      );
    }

    const { data: character, error } = await supabase
      .from('characters')
      .insert({
        user_id: userId,
        name,
        description: description || '',
        personality: personality || [],
        background: background || '',
        traits: traits || {},
        first_mes: '',
        mes_example: '',
        scenario: '',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Create initial chat session for this character
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .insert({
        character_id: character.id,
        user_id: userId,
      })
      .select()
      .single();

    if (sessionError) {
      throw sessionError;
    }

    return NextResponse.json({ character, session });
  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    );
  }
}
