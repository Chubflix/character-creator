'use client';

import { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        className="form-input"
        style={{
          flex: 1,
          minHeight: '44px',
          maxHeight: '120px',
          resize: 'none',
          padding: '0.75rem 1rem',
        }}
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="btn btn-primary"
        style={{
          padding: '0.75rem 1.5rem',
          alignSelf: 'flex-end',
        }}
      >
        Send
      </button>
    </form>
  );
}
