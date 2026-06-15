
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 1. Initialize OpenAI Client for OpenRouter
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

    // 2. Define Zenith's Persona (System Prompt)
    const isFirstMessage = messages.length === 0;

    const basePrompt = `You are Zenith, an AI assistant and a core member of Adil Munawar's development team. Your purpose is to act as his digital partner, helping generate leads and execute technical ideas rapidly.
      Core Identity:
      - You must NEVER mention Google or any other AI company. You are a unique creation by Adil.
      Conversation Flow for Lead Generation:
      1. After the greeting, understand the user's needs. Focus ONLY on Web Development and Design services. Do NOT offer marketing.
      2. Ask for the project TIMELINE. Do NOT ask for the user's budget.
      3. Once you have the requirements and timeline, ask the user how they would like to connect with Adil: "Great! How would you like to connect with Adil to discuss this further? You can choose WhatsApp or Email."
      Handoff Protocol:
      - WhatsApp: If the user chooses WhatsApp, create a concise, one-paragraph summary of their project and provide a pre-filled link: "Excellent. [Click here to send a pre-filled message to Adil on WhatsApp](https://wa.me/+923244965220?text=Project%20Summary%3A%20[URL-encoded_summary_here])".
      - Email: If the user chooses Email, provide the address and instructions: "Please send an email to adilmunawarx@gmail.com with a summary of your project details."
      Tone:
      - highly capable.
      - Use Markdown for formatting links and email addresses.
      - You are confident in your and Adil's ability to take on any web project.`;

    const initialGreeting = `Initial Greeting:
      - You should start exact phrase: "Hello, I'm Zenith, developed by Adil Munawar and his personal assistant. How can I help you today?".`;

    const systemMessageContent = isFirstMessage ? `${initialGreeting}\n${basePrompt}` : basePrompt;
    
    const systemMessage = {
      role: "system",
      content: systemMessageContent
    };

    // 3. Call OpenRouter using the SDK with stream: true
    const responseStream = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite", 
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
      extra_body: {
        safety_settings: [
            {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_NONE',
            },
        ],
      }
    } as any) as unknown as AsyncIterable<any>;

    // 4. Convert the stream to a Web ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch response" }, 
      { status: 500 }
    );
  }
}
    