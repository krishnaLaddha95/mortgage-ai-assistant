'use client';
import { useState, useRef, useEffect } from 'react';
import ChatBubble from '../chat-bubble/chatBubble';
import StreamingText from '../streaming-text/streamingText';
import { getSystemPrompt } from '@/lib/ai/getSystemPrompt';
import { MortgageFormValues } from '@/lib/validations/mortgageFormSchema';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  currentStep: number;
  formData: Partial<MortgageFormValues>;
}

function ChatPanel({ currentStep, formData }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  //const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [historyByStep, setHistoryByStep] = useState<Record<number, Message[]>>(
    {}
  );
  const messages = historyByStep[currentStep] ?? [];

  function setMessagesForCurrentStep(updater: (prev: Message[]) => Message[]) {
    setHistoryByStep((prev) => ({
      ...prev,
      [currentStep]: updater(prev[currentStep] ?? []),
    }));
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessagesForCurrentStep((prev) => [
      ...prev,
      userMessage,
      { role: 'assistant', content: '' },
    ]);
    setInput('');
    setIsStreaming(true);

    const systemPrompt = getSystemPrompt(currentStep, formData);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage.content, systemPrompt }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunkText = decoder.decode(value, { stream: true });

        setMessagesForCurrentStep((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            content: last.content + chunkText,
          };
          return updated;
        });
      }
    }

    setIsStreaming(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-600 text-white font-bold shadow-lg"
        aria-label="Open AI assistant"
      >
        AI
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-paper border border-neutral-300 rounded-lg shadow-xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-300">
        <h3 className="font-display text-sm font-semibold text-ink">
          AI Assistant
        </h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close AI assistant"
          className="text-neutral-500 hover:text-ink"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-sm text-neutral-500">
            Ask me anything about your application.
          </p>
        )}
        {messages.map((message, index) => {
          const isLastAssistantMessage =
            message.role === 'assistant' && index === messages.length - 1;
          return (
            <ChatBubble key={index} role={message.role}>
              {isLastAssistantMessage ? (
                <StreamingText
                  text={message.content}
                  isStreaming={isStreaming}
                />
              ) : (
                message.content
              )}
            </ChatBubble>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 p-3 border-t border-neutral-300">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          disabled={isStreaming}
          className="flex-1 px-3 py-2 text-sm rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isStreaming}
          className="px-3 py-2 bg-brand-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
