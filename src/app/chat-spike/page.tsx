'use client';
import { useState } from 'react';

export default function ChatSpikePage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  async function handleSend() {
    setResponse('');
    setIsStreaming(true);

    const res = await fetch('/api/chat-spike', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setResponse((prev) => prev + decoder.decode(value, { stream: true }));
      }
    }

    setIsStreaming(false);
  }

  return (
    <div style={{ padding: 32 }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ border: '1px solid black', padding: 8, width: 400 }}
      />
      <button
        onClick={handleSend}
        disabled={isStreaming}
        style={{ marginLeft: 8 }}
      >
        Send
      </button>
      <p style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}>{response}</p>
    </div>
  );
}
