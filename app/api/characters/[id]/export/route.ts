import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import type { CharacterExport } from '@/lib/types/character';

// GET export character as JSON
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: character, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    // Format for TavernAI/ChubAI
    const characterExport: CharacterExport = {
      name: character.name,
      description: character.description || '',
      personality: character.personality?.join(', ') || '',
      first_mes: character.first_mes || '',
      mes_example: character.mes_example || '',
      scenario: character.scenario || '',
      creator_notes: `Created with Chubflix Character Creator`,
      system_prompt: '',
      post_history_instructions: '',
      tags: [],
      creator: 'Chubflix Character Creator',
      character_version: '1.0',
      extensions: character.traits || {},
    };

    return NextResponse.json(characterExport, {
      headers: {
        'Content-Disposition': `attachment; filename="${character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting character:', error);
    return NextResponse.json(
      { error: 'Failed to export character' },
      { status: 500 }
    );
  }
}
