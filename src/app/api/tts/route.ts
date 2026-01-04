
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://adilmunawar.vercel.app";

const openai = OPENROUTER_API_KEY ? new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": SITE_URL,
    "X-Title": "Adil Munawar Portfolio",
  }
}) : null;

export async function POST(req: Request) {
  if (!openai) {
    return NextResponse.json(
      { error: "Server Configuration Error: Missing API Key" },
      { status: 500 }
    );
  }

  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const speech = await openai.audio.speech.create({
        model: "elevenlabs/eleven-multilingual-v2",
        voice: "rachel",
        input: text,
    });

    const audioBuffer = await speech.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    const audioDataUrl = `data:audio/mpeg;base64,${audioBase64}`;

    return NextResponse.json({ audioDataUrl });

  } catch (error: any) {
    console.error("TTS API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate speech" },
      { status: 500 }
    );
  }
}
