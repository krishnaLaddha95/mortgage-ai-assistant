import { ReactNode } from 'react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  children: ReactNode;
}

function ChatBubble({ role, children }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[85%] rounded-lg px-3 py-2 text-sm
          ${isUser ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-ink'}
        `}
      >
        {children}
      </div>
    </div>
  );
}

export default ChatBubble;
