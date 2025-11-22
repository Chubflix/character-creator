interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        style={{
          maxWidth: '80%',
          borderRadius: '8px',
          padding: '1rem',
          backgroundColor: isUser ? 'var(--accent)' : role === 'system' ? 'var(--bg-hover)' : 'var(--bg-card)',
          border: isUser ? 'none' : '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', color: isUser ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
          {role === 'user' ? 'You' : role === 'system' ? 'System' : 'Assistant'}
        </div>
        <div style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{content}</div>
        {timestamp && (
          <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.5rem' }}>
            {new Date(timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
