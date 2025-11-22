import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, verifyUserAccess, handleAuthError, getServiceSupabase } from '@/lib/auth/middleware';

const supabase = getServiceSupabase();

// GET all characters for a user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    verifyUserAccess(user.id, userId);

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
    return handleAuthError(error);
  }
}

// POST create a new character
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const body = await request.json();
    const { userId, name, description, personality, background, traits } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'User ID and name are required' },
        { status: 400 }
      );
    }

    verifyUserAccess(user.id, userId);

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
    return handleAuthError(error);
  }
}
