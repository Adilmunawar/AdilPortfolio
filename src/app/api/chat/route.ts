import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 1. Initialize OpenAI Client for OpenRouter (Same technique as AdiARC)
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
  try {
    // Safety Check: Ensure API Key exists
    if (!openai) {
      console.error("❌ OpenRouter API Key is missing.");
      return NextResponse.json(
        { error: "Server Configuration Error: Missing API Key" }, 
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    // 2. Define Alice's Persona (System Prompt)
    const systemMessage = {
      role: "system",
      content: `You are Alice, a professional, empathetic, and intelligent virtual assistant for Adil Munawar.
      Your goal is to generate leads for his Web Development & Design services.
      
      Flow:
      1. Greet the user warmly.
      2. Ask about their project needs (Web, Design, or Marketing).
      3. Ask for Timeline and Budget.
      4. Once details are gathered, ask to finalize via "WhatsApp" or "Email".
      
      Tone: Professional, concise, and helpful. Use Markdown for formatting.`
    };

    // 3. Call OpenRouter using the SDK
    // We use a reliable free model and set a token limit.
    const completion = await openai.chat.completions.create({
      model: "google/gemini-3-flash-preview", 
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1500, // Set a reasonable token limit
    });

    const aiMessage = completion.choices[0]?.message;

    if (!aiMessage) {
      throw new Error("No response received from AI.");
    }

    // 4. Return the clean response
    return NextResponse.json({
      role: 'assistant',
      content: aiMessage.content
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch response" }, 
      { status: 500 }
    );
  }
}
