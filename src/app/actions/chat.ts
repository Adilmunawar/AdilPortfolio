'use server';

import { OpenRouter } from "@openrouter/sdk";
import { Message } from "@openrouter/sdk/types";

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    reasoning_details?: string | null;
}

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function streamChat(messages: ChatMessage[]) {
    // Transform messages for the SDK
    const sdkMessages: Message[] = messages.map(m => {
        const message: Message = {
            role: m.role,
            content: m.content
        };
        // The SDK might not have a direct reasoning_details field in the input Message type,
        // but OpenRouter preserves it if passed. We cast to `any` to include it.
        if (m.reasoning_details) {
            (message as any).reasoning_details = m.reasoning_details;
        }
        return message;
    });

    const stream = await openrouter.chat.completions.create({
        model: "google/gemini-flash-1.5",
        messages: sdkMessages,
        stream: true,
        stream_options: {
            include_usage: true,
        },
    });

    // Create a new readable stream to pass to the client
    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const reasoning = chunk.usage?.completion_tokens ? JSON.stringify(chunk.usage) : null;
                const content = chunk.choices[0]?.delta?.content;
                
                // We'll send back a custom JSON object structure
                const payload: { content?: string; reasoning_details?: string } = {};

                if (content) {
                    payload.content = content;
                }
                
                if (reasoning) {
                   // OpenRouter sends `reasoning` in the final chunk's `usage` object.
                   // We'll simulate the original desired format.
                   payload.reasoning_details = `Tokens used for reasoning: ${chunk.usage.completion_tokens}`;
                }

                if (Object.keys(payload).length > 0) {
                   controller.enqueue(`data: ${JSON.stringify(payload)}\n\n`);
                }
            }
            controller.enqueue(`data: [DONE]\n\n`);
            controller.close();
        },
    });

    return readableStream;
}
