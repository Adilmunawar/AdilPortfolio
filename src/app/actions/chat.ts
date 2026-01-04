'use server';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    reasoning_details?: string | null;
}

async function* chunksToLines(chunksAsync: ReadableStream<Uint8Array>) {
    const reader = chunksAsync.getReader();
    const decoder = new TextDecoder("utf-8");
    let unfinished = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (unfinished) yield unfinished;
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      const lines = (unfinished + chunk).split("\n");
      unfinished = lines.pop() || "";
      for (const line of lines) {
        yield line;
      }
    }
}

async function* linesToMessages(linesAsync: AsyncGenerator<string>) {
    for await (const line of linesAsync) {
        if (line.startsWith("data: ")) {
            const data = line.substring(6);
            if (data.trim() === '[DONE]') {
                return;
            }
            try {
                const parsed = JSON.parse(data);
                yield parsed;
            } catch (error) {
                console.error("Failed to parse JSON line:", line);
            }
        }
    }
}

async function* processStream(stream: ReadableStream<Uint8Array>) {
    const lines = chunksToLines(stream);
    const messages = linesToMessages(lines);

    for await (const msg of messages) {
        if (msg.choices && msg.choices.length > 0) {
            const choice = msg.choices[0];
            if (choice.delta?.content) {
                yield { content: choice.delta.content };
            }
            if (choice.delta?.reasoning_details) {
                yield { reasoning_details: choice.delta.reasoning_details };
            }
        }
    }
}


export async function streamChat(messages: Message[]) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "google/gemini-flash-1.5",
            "messages": messages.map(m => ({ role: m.role, content: m.content, reasoning_details: m.reasoning_details })),
            "reasoning": {"enabled": true},
            "stream": true
        })
    });

    if (!response.body) {
        throw new Error("Response body is null");
    }

    return processStream(response.body);
}
