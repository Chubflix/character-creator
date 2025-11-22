import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import type { CharacterExport } from '@/lib/types/character';

/**
 * MCP (Model Context Protocol) Server Implementation
 *
 * This endpoint exposes character data through an authenticated MCP server
 * that can be hosted on Vercel and accessed by MCP clients.
 */

// MCP protocol types
interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

// Verify authentication token
async function verifyAuth(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

// MCP method handlers
async function handleListCharacters(userId: string) {
  const { data: characters, error } = await supabase
    .from('characters')
    .select('id, name, description, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list characters: ${error.message}`);
  }

  return { characters };
}

async function handleGetCharacter(userId: string, characterId: string) {
  const { data: character, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .eq('user_id', userId)
    .single();

  if (error || !character) {
    throw new Error('Character not found');
  }

  return { character };
}

async function handleExportCharacter(userId: string, characterId: string) {
  const { data: character, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .eq('user_id', userId)
    .single();

  if (error || !character) {
    throw new Error('Character not found');
  }

  const characterExport: CharacterExport = {
    name: character.name,
    description: character.description || '',
    personality: character.personality?.join(', ') || '',
    first_mes: character.first_mes || '',
    mes_example: character.mes_example || '',
    scenario: character.scenario || '',
    creator_notes: 'Created with Chubflix Character Creator',
    system_prompt: '',
    post_history_instructions: '',
    tags: [],
    creator: 'Chubflix Character Creator',
    character_version: '1.0',
    extensions: character.traits || {},
  };

  return { export: characterExport };
}

async function handleGetChatHistory(userId: string, characterId: string, sessionId?: string) {
  let query = supabase
    .from('chat_messages')
    .select('*, chat_sessions!inner(user_id)')
    .eq('character_id', characterId)
    .eq('chat_sessions.user_id', userId)
    .order('created_at', { ascending: true });

  if (sessionId) {
    query = query.eq('session_id', sessionId);
  }

  const { data: messages, error } = await query;

  if (error) {
    throw new Error(`Failed to get chat history: ${error.message}`);
  }

  return { messages };
}

// Main MCP request handler
async function handleMCPRequest(userId: string, mcpRequest: MCPRequest): Promise<MCPResponse> {
  try {
    let result: any;

    switch (mcpRequest.method) {
      case 'characters/list':
        result = await handleListCharacters(userId);
        break;

      case 'characters/get':
        if (!mcpRequest.params?.characterId) {
          throw new Error('characterId parameter is required');
        }
        result = await handleGetCharacter(userId, mcpRequest.params.characterId);
        break;

      case 'characters/export':
        if (!mcpRequest.params?.characterId) {
          throw new Error('characterId parameter is required');
        }
        result = await handleExportCharacter(userId, mcpRequest.params.characterId);
        break;

      case 'chat/history':
        if (!mcpRequest.params?.characterId) {
          throw new Error('characterId parameter is required');
        }
        result = await handleGetChatHistory(
          userId,
          mcpRequest.params.characterId,
          mcpRequest.params.sessionId
        );
        break;

      default:
        throw new Error(`Unknown method: ${mcpRequest.method}`);
    }

    return {
      jsonrpc: '2.0',
      id: mcpRequest.id,
      result,
    };
  } catch (error: any) {
    return {
      jsonrpc: '2.0',
      id: mcpRequest.id,
      error: {
        code: -32603,
        message: error.message || 'Internal error',
      },
    };
  }
}

// POST endpoint for MCP requests
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);

    if (!userId) {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32001,
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // Parse MCP request
    const mcpRequest: MCPRequest = await request.json();

    // Validate JSON-RPC 2.0 format
    if (mcpRequest.jsonrpc !== '2.0' || !mcpRequest.method) {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: mcpRequest.id || null,
        error: {
          code: -32600,
          message: 'Invalid Request',
        },
      });
    }

    // Handle the request
    const response = await handleMCPRequest(userId, mcpRequest);

    return NextResponse.json(response);
  } catch (error) {
    console.error('MCP server error:', error);
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error',
        },
      },
      { status: 500 }
    );
  }
}

// GET endpoint for MCP server info
export async function GET() {
  return NextResponse.json({
    name: 'Chubflix Character Creator MCP Server',
    version: '1.0.0',
    description: 'MCP server for accessing character sheets and chat history',
    methods: [
      'characters/list',
      'characters/get',
      'characters/export',
      'chat/history',
    ],
    authentication: 'Bearer token (Supabase auth)',
  });
}
