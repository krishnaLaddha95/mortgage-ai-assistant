import { GoogleGenAI } from '@google/genai';

type ChatBody = { message?: unknown; systemPrompt?: unknown };

const MAX_MESSAGE_LENGTH = 500;
const MAX_PROMPT_LENGTH = 8000;
const START_TIMEOUT_MS = 8000;

// Model names can be changed with env vars, so a retired model doesn't need a code change
const MODELS = [
  process.env.GEMINI_MODEL ?? 'gemini-3.6-flash',
  process.env.GEMINI_FALLBACK_MODEL ?? 'gemini-3.5-flash-lite',
];

const FALLBACK_STATUSES = [404, 429, 500, 503];

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

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

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { retryOptions: { attempts: 1 } },
  });

  let lastError: unknown;

  for (const model of MODELS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), START_TIMEOUT_MS);

    try {
      const stream = await ai.models.generateContentStream({
        model,
        contents: message,
        config: { systemInstruction: systemPrompt, abortSignal: controller.signal },
      });
      clearTimeout(timer);

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(streamController) {
          try {
            for await (const chunk of stream) {
              const text = chunk.text;
              if (text) streamController.enqueue(encoder.encode(text));
            }
            streamController.close();
          } catch (err) {
            streamController.error(err);
          }
        },
      });

      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      console.error(`Chat model ${model} failed:`, err);

      const status = (err as { status?: number })?.status;
      const timedOut = controller.signal.aborted;
      if (!timedOut && status !== undefined && !FALLBACK_STATUSES.includes(status)) {
        break;
      }
    }
  }

  const upstreamStatus = (lastError as { status?: number })?.status;
  const status = upstreamStatus === 429 || upstreamStatus === 503 ? upstreamStatus : 502;
  return Response.json({ error: 'AI request failed' }, { status });
}