import { GoogleGenAI } from '@google/genai';

type ChatBody = { message?: unknown; systemPrompt?: unknown };

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const MAX_MESSAGE_LENGTH = 500;
  const MAX_PROMPT_LENGTH = 8000;
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return Response.json({ error: 'Server is not configured' }, { status: 500 });
  }

  let body: ChatBody | null;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { message, systemPrompt }: ChatBody = body ?? {};

  if (
    typeof message !== 'string' ||
    message.trim() === '' ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return Response.json({ error: 'Invalid message' }, { status: 400 });
  }
  if (typeof systemPrompt !== 'string' || systemPrompt.length > MAX_PROMPT_LENGTH) {
    return Response.json({ error: 'Invalid prompt' }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const stream = await ai.models.generateContentStream({
      model: 'gemini-3.6-flash',
      contents: message,
      config: { systemInstruction: systemPrompt },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    // the full error stays in the server logs, the browser only gets a status
    console.error('Chat route failed:', err);
    const upstreamStatus = (err as { status?: number })?.status;
    const status = upstreamStatus === 429 ? 429 : 502;
    return Response.json({ error: 'AI request failed' }, { status });
  }
}