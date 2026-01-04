'use client';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, apiKey } = await req.json();

    if (!apiKey) {
      throw new Error("OpenRouter API key is missing.");
    }

    // 1. Define the System Persona
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

    // 2. Prepare the payload for OpenRouter
    const payload = {
      model: "google/gemini-flash-1.5", 
      messages: [systemMessage, ...messages],
      reasoning: { enabled: true }
    };

    // 3. Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://adilmunawar.vercel.app",
        "X-Title": "Adil Munawar Portfolio",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenRouter API Error: ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message;

    // 4. Return the content AND the reasoning details
    return NextResponse.json({
      role: 'assistant',
      content: aiMessage.content,
      reasoning_details: aiMessage.reasoning_details || null 
    });

  } catch (error: unknown) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
