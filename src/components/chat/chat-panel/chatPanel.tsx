'use client';
import { useState, useRef, useEffect } from 'react';
import ChatBubble from '../chat-bubble/chatBubble';
import StreamingText from '../streaming-text/streamingText';
import { getSystemPrompt } from '@/lib/ai/getSystemPrompt';
import { getChatErrorMessage } from '@/lib/ai/getChatErrorMessage';
import { MortgageFormValues } from '@/lib/validations/mortgageFormSchema';

const IDLE_TIMEOUT_MS = 20000;
const MAX_MESSAGE_LENGTH = 500;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  error?: string; 
}

interface ChatPanelProps {
  currentStep: number;
  formData: Partial<MortgageFormValues>;
}

function ChatPanel({ currentStep, formData }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  function appendToLastMessage(text: string) {
    setMessagesForCurrentStep((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      updated[updated.length - 1] = { ...last, content: last.content + text };
      return updated;
    });
  }

  function markLastMessageFailed(error: string) {
    setMessagesForCurrentStep((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = { ...updated[updated.length - 1], error };
      return updated;
    });
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function requestReply(question: string) {
    setIsStreaming(true);
    const systemPrompt = getSystemPrompt(currentStep, formData, question);

    const controller = new AbortController();
    let timeoutId = setTimeout(() => controller.abort(), IDLE_TIMEOUT_MS);
    const restartTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => controller.abort(), IDLE_TIMEOUT_MS);
    };

    let gotText = false;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, systemPrompt }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        markLastMessageFailed(getChatErrorMessage(res.status));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        restartTimeout();
        const text = decoder.decode(value, { stream: true });
        if (text) {
          gotText = true;
          appendToLastMessage(text);
        }
      }

      if (!gotText) {
        markLastMessageFailed(getChatErrorMessage('empty'));
      }
    } catch {
      markLastMessageFailed(
        getChatErrorMessage(controller.signal.aborted ? 'timeout' : undefined)
      );
    } finally {
      clearTimeout(timeoutId);
      setIsStreaming(false);
    }
  }

  async function handleSend() {
    const question = input.trim();
    if (!question || isStreaming) return;

    setMessagesForCurrentStep((prev) => [
      ...prev,
      { role: 'user', content: question },
      { role: 'assistant', content: '' },
    ]);
    setInput('');
    await requestReply(question);
  }

  function handleRetry() {
    if (isStreaming) return;
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === 'user');
    if (!lastUserMessage) return;

    setMessagesForCurrentStep((prev) => [
      ...prev.slice(0, -1),
      { role: 'assistant', content: '' },
    ]);
    requestReply(lastUserMessage.content);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-14 w-14 rounded-full bg-brand-600 text-white font-bold shadow-lg"
        aria-label="Open AI assistant"
      >
        AI
      </button>
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96 h-[min(500px,calc(100dvh_-_2rem))] bg-paper border border-neutral-300 rounded-lg shadow-xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 sm:py-3 border-b border-neutral-300">
        <h3 className="font-display text-sm font-semibold text-ink">
          AI Assistant
        </h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close AI assistant"
          className="-mr-3 flex h-11 w-11 items-center justify-center text-neutral-500 hover:text-ink sm:mr-0 sm:h-auto sm:w-auto"
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
                <>
                  <StreamingText
                    text={message.content}
                    isStreaming={isStreaming}
                  />
                  {message.error && (
                    <div role="alert" className="mt-2 text-error-600">
                      <p>{message.error}</p>
                      <button
                        type="button"
                        onClick={handleRetry}
                        disabled={isStreaming}
                        className="mt-1 font-medium underline disabled:opacity-50"
                      >
                        Try again
                      </button>
                    </div>
                  )}
                </>
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
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          disabled={isStreaming}
          className="flex-1 px-3 py-2 text-base sm:text-sm rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isStreaming}
          className="px-3 py-2 min-h-11 sm:min-h-0 bg-brand-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;