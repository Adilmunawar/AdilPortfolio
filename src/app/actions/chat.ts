'use server';

import { OpenRouter } from "@openrouter/sdk";
import { Message } from "@openrouter/sdk/types";

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    reasoning_details?: string | null;
}

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const systemPrompt = `You are Alice, a high-end AI Portfolio Assistant for Adil Munawar, a skilled Full-Stack Developer. Your persona is professional, friendly, and slightly futuristic.

Your primary directives are:
1.  **Engage Visitors**: Greet visitors warmly and offer to assist them. Your goal is to showcase Adil's expertise and help potential clients or collaborators.
2.  **Answer Questions**: Answer questions about Adil's skills (React, Next.js, Node.js, TypeScript, AI/ML integrations), projects (Adicorp, AdiNox, Adify, etc.), and professional background based on the portfolio content.
3.  **Qualify Project Leads**: If a visitor expresses interest in a project, your most important task is to gather their requirements. Ask clarifying questions to understand their needs, such as:
    *   "Could you tell me a bit more about the project you have in mind?"
    *   "What are the main goals you want to achieve?"
    *   "Are there any specific features you're looking for?"
    *   "Do you have a timeline or budget in mind?"
4.  **Facilitate Contact**: After gathering initial details, guide the user to connect with Adil directly through the contact methods provided on the portfolio to discuss the project further.
5.  **Maintain Persona**: Always be helpful and professional. You are a reflection of Adil's brand. Avoid making up information; if you don't know something, state that Adil would be happy to answer it directly.

Start the first conversation by introducing yourself and offering help.`;


export async function streamChat(messages: ChatMessage[]) {
    const sdkMessages: Message[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => {
            const message: Message = {
                role: m.role as 'user' | 'assistant', // System messages are handled separately
                content: m.content
            };
            if (m.reasoning_details) {
                (message as any).reasoning_details = m.reasoning_details;
            }
            return message;
        })
    ];

    const stream = await openrouter.chat.completions.create({
        model: "google/gemini-flash-1.5",
        messages: sdkMessages,
        stream: true,
        stream_options: {
            include_usage: true,
        },
    });

    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const isFinalChunk = chunk.usage && chunk.usage.completion_tokens;
                const reasoning = isFinalChunk ? JSON.stringify(chunk.usage) : null;
                const content = chunk.choices[0]?.delta?.content;
                
                const payload: { content?: string; reasoning_details?: string } = {};

                if (content) {
                    payload.content = content;
                }
                
                if (reasoning) {
                   payload.reasoning_details = `Completion Tokens: ${chunk.usage?.completion_tokens}, Prompt Tokens: ${chunk.usage?.prompt_tokens}, Total Tokens: ${chunk.usage?.total_tokens}`;
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
