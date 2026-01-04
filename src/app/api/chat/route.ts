
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    // --- 🔍 DEBUG LOGS (Check your VS Code Terminal) ---
    console.log("------------------------------------------------");
    console.log("Incoming Request to /api/chat");
    if (!apiKey) {
      console.error("❌ CRITICAL ERROR: API Key is undefined in process.env");
    } else {
      console.log(`✅ API Key Loaded. Length: ${apiKey.length}`);
      console.log(`🔑 Key starts with: ${apiKey.substring(0, 10)}...`); // Safe log
    }
    // -----------------------------------------------------

    if (!apiKey) {
      return NextResponse.json({ error: "Server Error: API Key missing configuration." }, { status: 500 });
    }

    const systemMessage = {
      role: "system",
      content: `You are Alice, a professional virtual assistant for Adil Munawar.
      Your goal is to generate leads for his Web Development & Design services.
      
      Flow:
      1. Greet the user warmly.
      2. Ask about their project needs.
      3. Ask for Timeline and Budget.
      4. Ask to finalize via "WhatsApp" or "Email".
      
      Tone: Professional, concise, and helpful. Use Markdown.`
    };

    // ✅ Using the NVIDIA model you confirmed works on ReqBin
    const payload = {
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [systemMessage, ...messages],
      reasoning: { enabled: true } // Keeping this since it worked in your test
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
      console.error(`❌ OpenRouter API Error (${response.status}):`, errorBody);
      throw new Error(`OpenRouter API Error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
        throw new Error("OpenRouter returned no content.");
    }

    const aiMessage = data.choices[0].message;

    return NextResponse.json({
      role: 'assistant',
      content: aiMessage.content,
      reasoning_details: aiMessage.reasoning_details || null 
    });

  } catch (error: any) {
    console.error("❌ API Route Handler Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
