'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { supabase } from '@/lib/services/supabase';

interface Character {
  id: string;
  name: string;
  description: string;
  personality: string[];
  background: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export default function CreatePage() {
  const [user, setUser] = useState<any>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [characterName, setCharacterName] = useState('');

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCreateCharacter = async () => {
    if (!user || !characterName.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: characterName,
          description: '',
          personality: [],
          background: '',
          traits: {},
        }),
      });

      const data = await response.json();
      setCharacter(data.character);
      setSessionId(data.session.id);
      setCharacterName('');

      // Add welcome message
      setMessages([
        {
          id: '1',
          role: 'system',
          content: `Character "${data.character.name}" created! Let's develop this character together. Tell me about their personality, background, or any traits you'd like them to have.`,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to create character:', error);
      alert('Failed to create character. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!user || !character || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          characterId: character.id,
          message,
          userId: user.id,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCharacter = async () => {
    if (!user || !character) return;

    try {
      const response = await fetch(
        `/api/characters/${character.id}/export?userId=${user.id}`
      );
      const data = await response.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export character:', error);
      alert('Failed to export character. Please try again.');
    }
  };

  if (!user) {
    return (
      <>
        <Navigation user={user} />
        <div className="main-container">
          <div className="empty-state">
            <h3>Sign in to create characters</h3>
            <p>Please sign in with your Google account to start creating characters.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation user={user} />
      <div className="main-container">
        <div className="chat-container">
          {/* Left Panel - Character Info */}
          <div className="panel" style={{ height: 'fit-content', position: 'sticky', top: '6rem' }}>
            <div className="panel-header">
              <h2>Character Creator</h2>
            </div>

            {!character ? (
              <div>
                <div className="form-group">
                  <label htmlFor="characterName" className="form-label">
                    Character Name
                  </label>
                  <input
                    id="characterName"
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    className="form-input"
                    placeholder="Enter character name..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateCharacter();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleCreateCharacter}
                  disabled={!characterName.trim() || isLoading}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {isLoading ? 'Creating...' : 'Create Character'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {character.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {character.description || 'No description yet'}
                  </p>
                </div>

                {character.personality && character.personality.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                      Personality Traits
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {character.personality.map((trait, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                          }}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleExportCharacter}
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  Export Character
                </button>
              </div>
            )}
          </div>

          {/* Right Panel - Chat */}
          <div className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 8rem)' }}>
            {character ? (
              <ChatWindow
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            ) : (
              <div className="empty-state">
                <h3>No Character Selected</h3>
                <p>Create a new character to start chatting with the AI assistant.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
