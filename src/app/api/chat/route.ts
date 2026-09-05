import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildSystemPrompt, ZENITH_GREETING } from '@/lib/zenith-knowledge';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://adilmunawar.vercel.app';
const MODEL = 'google/gemini-2.5-flash-lite';

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const openai = OPENROUTER_API_KEY
  ? new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: OPENROUTER_API_KEY,
      defaultHeaders: { 'HTTP-Referer': SITE_URL, 'X-Title': 'Adil Munawar Portfolio' },
    })
  : null;

const SYSTEM_PROMPT = buildSystemPrompt();

type ChatMessage = { role: 'user' | 'assistant'; content: string };

// Best-effort in-memory limiter (per serverless instance).
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    hits.forEach((times, key) => {
      if (times.every(t => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    });
  }
  return false;
}

function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== 'object') return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw)) return null;
  const out: ChatMessage[] = [];
  for (const item of raw.slice(-MAX_MESSAGES)) {
    if (!item || typeof item !== 'object') return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== 'user' && role !== 'assistant') return null;
    if (typeof content !== 'string' || content.length > MAX_CONTENT_LENGTH) return null;
    out.push({ role, content });
  }
  return out;
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function textStream(source: AsyncIterable<string>) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const text of source) {
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

async function* greetingChunks() {
  for (const word of ZENITH_GREETING.split(/(?<=\s)/)) {
    yield word;
    await new Promise(r => setTimeout(r, 18));
  }
}

async function* completionChunks(stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>) {
  for await (const chunk of stream) {
    yield chunk.choices[0]?.delta?.content ?? '';
  }
}

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (origin && host) {
    let originHost = '';
    try { originHost = new URL(origin).host; } catch {}
    if (originHost !== host) return Response.json({ error: 'forbidden' }, { status: 403 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('invalid_body', 400);
  }

  const messages = parseMessages(body);
  if (!messages) return jsonError('invalid_body', 400);

  if (!openai) return jsonError('assistant_offline', 503);

  if (messages.length === 0) return textStream(greetingChunks());

  if (messages[messages.length - 1].role !== 'user') return jsonError('invalid_body', 400);

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
  if (isRateLimited(ip)) return jsonError('rate_limited', 429);

  try {
    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.4,
      max_tokens: 500,
      stream: true,
    });
    return textStream(completionChunks(stream));
  } catch (error) {
    console.error('Zenith upstream error:', error);
    return jsonError('upstream', 502);
  }
}
