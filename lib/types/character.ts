export interface Character {
  id: string;
  user_id: string;
  name: string;
  description: string;
  personality: string[];
  background: string;
  traits: Record<string, any>;
  first_mes: string;
  mes_example: string;
  scenario: string;
  created_at: string;
  updated_at: string;
}

export interface CharacterExport {
  name: string;
  description: string;
  personality: string;
  first_mes: string;
  mes_example: string;
  scenario: string;
  creator_notes?: string;
  system_prompt?: string;
  post_history_instructions?: string;
  tags?: string[];
  creator?: string;
  character_version?: string;
  extensions?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  character_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  character_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface CharacterEmbedding {
  id: string;
  character_id: string;
  content: string;
  embedding: number[];
  created_at: string;
}
