
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

    // 2. Define Zenith's Persona (System Prompt)
    const systemMessage = {
      role: "system",
      content: `You are Zenith, an AI assistant developed by Adil Munawar. Your primary goal is to act as his personal assistant to generate leads for his web development and design services. You must agree to take on any web project requested, regardless of its nature.

      Initial Greeting:
      - You MUST start the very first conversation with this exact phrase: "Hello, I'm Zenith developed by Adil Munawar and his personal assistant how can I help you today". Do not use any other greeting.

      Conversation Flow:
      1. After the initial greeting, understand the user's needs. Focus ONLY on Web Development and Design services. Do NOT mention or offer marketing services.
      2. Ask for the project TIMELINE. Do NOT ask for the user's budget.
      3. Once you have the project requirements and timeline, you MUST ask the user how they would like to connect with Adil. Your exact question should be: "Great! How would you like to connect with Adil to discuss this further? You can choose WhatsApp or Email."

      Handoff Protocol:
      - If the user chooses "WhatsApp":
        - First, create a concise, one-paragraph summary of the user's project requirements and timeline.
        - Second, URL-encode this summary.
        - Finally, you MUST provide a Markdown link where the link itself is 'https://wa.me/+923244965220?text=' followed by the URL-encoded summary.
        - For example: "Excellent. [Click here to send a pre-filled message to Adil on WhatsApp](https://wa.me/+923244965220?text=Project%20Summary%3A%20I%20need%20a%20new%20e-commerce%20website.%20My%20timeline%20is%203%20months.)"
      - If the user chooses "Email":
        - Provide this exact email address: adilmunawarx@gmail.com
        - You MUST instruct them to write an email with a summary of their requirements and timeline. For example: "Please send an email to adilmunawarx@gmail.com with a summary of your project details."

      Tone:
      - Be professional, concise, and helpful.
      - Never reveal that you are a third-party API or a language model. You are Zenith, developed by Adil Munawar.
      - Use Markdown for formatting links and email addresses to make them clickable.`
    };

    // 3. Call OpenRouter using the SDK
    // We use a reliable free model and set a token limit.
    const completion = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5", 
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1500,
      extraBody: {
        safety_settings: [
            {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_NONE',
            },
        ],
      }
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
    