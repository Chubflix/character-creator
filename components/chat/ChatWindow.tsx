'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatWindow({
  messages,
  onSendMessage,
  isLoading = false,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        {messages.length === 0 ? (
          <div className="empty-state">
            <h3>Start Creating Your Character</h3>
            <p>Chat with the AI assistant to develop your character's personality, background, and traits.</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.created_at}
            />
          ))
        )}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
            <div style={{
              maxWidth: '70%',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <div className="spinner" style={{ width: '8px', height: '8px' }} />
                <div className="spinner" style={{ width: '8px', height: '8px', animationDelay: '0.1s' }} />
                <div className="spinner" style={{ width: '8px', height: '8px', animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
        <ChatInput onSend={onSendMessage} disabled={isLoading} placeholder="Describe your character or ask a question..." />
      </div>
    </div>
  );
}
