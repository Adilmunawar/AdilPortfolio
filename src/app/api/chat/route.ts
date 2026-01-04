
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key is not configured on the server." }, { status: 500 });
    }

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

    const payload = {
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [systemMessage, ...messages],
      reasoning: { enabled: true }
    };

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
      // Throw an error that includes the status and body from OpenRouter's response
      throw new Error(`OpenRouter API Error: ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message;

    return NextResponse.json({
      role: 'assistant',
      content: aiMessage.content,
      reasoning_details: aiMessage.reasoning_details || null 
    });

  } catch (error: unknown) {
    console.error("API Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred on the server.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
