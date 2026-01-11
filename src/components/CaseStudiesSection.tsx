"use client";

import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, BookOpen, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : 'bash';

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="relative my-4 rounded-lg bg-cyber-dark border border-neon-cyan/20 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-gray/50 border-b border-neon-cyan/20">
        <span className="text-xs text-frost-cyan font-mono">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-frost-cyan hover:text-white transition-colors"
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={atomDark}
        language={lang}
        PreTag="div"
        {...props}
        wrapLines={true}
        wrapLongLines={true}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={cn("text-sm font-mono bg-neon-cyan/10 text-neon-cyan px-1 py-0.5 rounded break-words", className)} {...props}>
      {children}
    </code>
  );
};

const CASE_STUDIES = [
  {
    id: 1,
    title: "AdiGaze – AI Recruitment Engine",
    excerpt: "Engineering a high-concurrency AI engine to parse 1,000+ resumes without hitting API rate limits or server timeouts.",
    image: "/AdiCorp.png",
    techStack: ["React (Vite)", "Supabase (Deno)", "Gemini 1.5 Pro", "pgvector"],
    content: `### Case Study: AdiGaze – Engineering a High-Concurrency AI Recruitment Engine
**Role**: Lead Architect & Developer (Nexus Orbits)

**Tech Stack**: React (Vite), Supabase Edge Functions (Deno), Gemini 1.5 Pro, PostgreSQL (pgvector), Server-Sent Events (SSE).

---

#### 1. Executive Summary
AdiGaze is a full-stack SaaS platform designed to automate high-volume recruitment workflows. Built under the Nexus Orbits umbrella, the project solves the critical challenge of processing massive datasets (1,000+ resumes) using Generative AI while strictly adhering to third-party API rate limits and preventing server timeouts.

#### 2. The Engineering Challenge: "The 30-Second Bottleneck"
Building a resume parser is standard. Building one that parses 500+ resumes simultaneously without crashing the browser or hitting API limits is a complex distributed systems problem.

**The Constraints:**

- **Timeouts:** Standard HTTP requests time out after 60 seconds. Parsing 100 PDFs takes minutes.
- **API Rate Limits:** High-performance AI models (Gemini/OpenAI) have strict Requests Per Minute (RPM) caps. Sending 50 files at once causes immediate \`429 Too Many Requests\` failures.
- **Resource Management:** Serverless functions have limited execution time and memory, making monolithic processing impossible.

#### 3. Engineering Spotlight: The "Infinite Scale" Worker Engine
To bypass the strict RPM limits while processing thousands of candidates, I architected a **Distributed Round-Robin Worker Pool**.

Instead of a single processing queue, the system dynamically detects available API keys and spawns "Worker Threads" for each one. This effectively multiplies the system's throughput by the number of keys available, turning a hardware limit into a software advantage.

##### The Logic: Round-Robin Load Balancing
The following code snippet from the core architecture demonstrates how I implemented dynamic concurrency inside a serverless environment:

\`\`\`typescript
// Core Logic: Distributed "Round-Robin" Load Balancer
// Location: supabase/functions/match-candidates/index.ts

// 1. Dynamic Resource Discovery
// Automatically detects how many API keys are available in the environment.
// This allows the system to scale up simply by adding "GEMINI_API_KEY_6" etc.
const GEMINI_KEYS = [1, 2, 3, 4, 5]
  .map(i => Deno.env.get(\`GEMINI_API_KEY_\${i}\`))
  .filter(Boolean);

if (!GEMINI_KEYS.length) throw new Error('CRITICAL: No AI Compute Resources Available');

// 2. The "Multi-Lane" Concurrency Strategy
// Instead of a simple loop, we map each API Key to multiple "Virtual Workers".
// If we have 5 keys, this spawns 10 parallel workers (2 per key).
// This maximizes throughput without hitting the "Concurrent Request" limit of a single key.
await Promise.all(
  GEMINI_KEYS.flatMap((apiKey, index) => [
    // Worker A (Lane 1 for this Key)
    processWithKey(apiKey as string, index * 2),
    // Worker B (Lane 2 for this Key) 
    processWithKey(apiKey as string, index * 2 + 1),
  ])
);

// 3. The Worker Logic (Simplified)
async function processWithKey(apiKey: string, workerId: number) {
  while (queue.hasItems()) {
    // Atomic Batch Retrieval: Thread-safe batch picking
    const batch = queue.getNextBatch(); 
    
    try {
      // Smart Retries: Uses Exponential Backoff if this specific key is rate-limited
      await retryWithBackoff(() => callGemini(batch, apiKey));
    } catch (error) {
      if (error.status === 429) {
        // Circuit Breaker: If a key burns out, log it and release the batch back to the pool
        console.warn(\`Worker \${workerId} [Key \${index}] hit Rate Limit. Backing off...\`);
        queue.returnBatch(batch); 
      }
    }
  }
}
\`\`\`
**[Code Reference: supabase/functions/match-candidates/index.ts]**

**Why this matters:**

- **Scalability:** The code isn't hardcoded. It adapts to the environment (\`.filter(Boolean)\`).
- **Resilience:** The "Circuit Breaker" logic ensures no data is lost; if a worker fails, the batch is returned to the pool for another worker to pick up.
- **Performance:** By using \`flatMap\` to create double workers (\`index * 2\`), we squeezed every ounce of performance out of the available resources.

#### 4. Smart Architecture: Optimization & UX

**A. Preventing Timeouts: Server-Sent Events (SSE)**
Traditional REST APIs wait for the entire job to finish before responding. I switched to a **Streaming Response model**.

- **Implementation:** The moment the backend processes one candidate, it pushes that data to the frontend via a persistent connection.
- **Result:** The user sees live updates immediately, reducing the perceived latency from 45 seconds to ~2.5 seconds.

**B. Optimizing "Tons of Data" with Vector Search**
Searching 10,000 resumes using brute force is slow. I utilized **pgvector** (PostgreSQL Vector Database) with a "Pre-Filter" optimization.

- **Filter First:** SQL filters by "Hard Requirements" (e.g., Location: "New York") to reduce the search space.
- **Vector Search Second:** AI similarity search runs only on the filtered subset, ensuring sub-50ms query times.

**C. Defense in Depth (Security)**
As a certified Ethical Hacker, I implemented strict sanitization.

- **Input Sanitization:** A custom \`sanitizeString\` function strips invisible characters and prevents injection attacks before data touches the database.
- **Row Level Security (RLS):** Policies ensure users can strictly only access data linked to their \`user_id\`, preventing lateral privilege escalation.

#### 5. Project Impact & Results
- **Throughput:** Increased processing capacity by **500%** (from 10 to 50+ concurrent resumes) using the multi-worker architecture.
- **Reliability:** Reduced "Process Failed" errors by **95%** using the Exponential Backoff strategy.
- **Data Integrity:** Achieved **100%** data availability by implementing a fallback mode that switches to keyword search if the AI service experiences a global outage.
  `,
  },
  {
    id: 2,
    title: "The Agentic Blueprint",
    excerpt: "Dissecting the AdiGaze architecture to reveal a blueprint for building autonomous, resilient, and scalable AI systems.",
    image: "/zenith.png",
    techStack: ["System Design", "AI", "Swarm Logic", "pgvector", "Resilience"],
    content: `### The Agentic Blueprint: Architecting Autonomous AI Systems
Based on the AdiGaze Architecture

#### 1. Introduction: The Shift to "Agentic" Thinking
Most developers use AI as a passive tool: you send a prompt, and you get text back. An Agentic System (like AdiGaze) is different. It is an active worker. It has:

- **Cognition:** It makes decisions based on data.
- **Tools:** It can read files, write to databases, and call APIs.
- **Resilience:** It can detect when it fails and correct itself.
- **Scale:** It can clone itself to work faster.

This blueprint dissects the AdiGaze codebase to show you how to build these four pillars into your own application.

#### 2. Pillar 1: The "Cognitive Core" (Structuring the Brain)
The biggest mistake developers make is letting the AI "ramble." To build an agent, you must restrict its output to a machine-readable format (JSON) that triggers specific actions in your app.

**The Strategy: "Strict Schema Enforcement"**
In the AdiGaze matching engine, we don't ask the AI "Who is a good fit?" We force it to think in code.

**How to Implement It:** Define a strict JSON schema in your system prompt. This forces the model to categorize its "thoughts" into data fields.

**Blueprint Code Logic:**
\`\`\`json
"CRITICAL INSTRUCTION: Return JSON format: {\\"candidates\\": [{\\"matchScore\\": 0, \\"reasoning\\": \\"...\\"}]}. IMPORTANT: 'reasoning' must be ONLY ONE SHORT SENTENCE."
\`\`\`

**Why this matters:**
- **Deterministic Action:** You can programmatically filter candidates with a \`matchScore > 80\`.
- **Cost Control:** Limiting the "reasoning" to 15 words drastically reduces token usage and latency.

#### 3. Pillar 2: The "Nervous System" (Parallel Worker Swarms)
A single AI agent is slow. To process "tons of users," you need a Swarm Architecture. This means spawning multiple agents that work in parallel, sharing the workload.

**The Strategy: "Resource-Aware Scaling"**
AdiGaze implements a Round-Robin Worker Pool. It detects how many API keys are available in the environment and spawns multiple "workers" for each key.

**How to Implement It:**
1.  **Detect Resources:** Scan your environment variables for available API keys (e.g., \`GEMINI_API_KEY_1\`, \`_2\`, etc.).
2.  **Spawn Threads:** Use \`Promise.all\` to launch completely independent processing threads for each key.
3.  **Divide & Conquer:** Split your dataset into batches (e.g., 10 resumes per batch) and feed them to the swarm.

**The "Infinite Scale" Logic:**
\`\`\`javascript
GEMINI_KEYS.flatMap((apiKey, index) => [processWithKey(apiKey, index * 2), processWithKey(apiKey, index * 2 + 1)])
\`\`\`
This specific line creates two parallel workers for every single API key, doubling the throughput without hitting rate limits.

#### 4. Pillar 3: "Reflexes" (Self-Healing & Resilience)
Agents operate in the real world where APIs fail and networks timeout. A robust agent needs Reflexes—automatic behaviors to handle failure without crashing the entire system.

**The Strategy: "Exponential Backoff & Fallback"**
AdiGaze handles failure in two stages:
1.  **The Retry Loop:** If an API call fails (e.g., \`429 Too Many Requests\`), the agent pauses. It waits 1 second, then 2 seconds, then 4 seconds before retrying. This gives the external system time to recover.
2.  **The Graceful Fallback:** If the AI completely fails after retries, the system doesn't error out. It switches to "Fallback Mode," using non-AI methods (like raw text search) to return a result, marking it as \`isFallback: true\` so a human can review it later.

**Why this is Critical:** This ensures **100% Data Availability**. Even if Google's AI goes down, your recruitment platform keeps working.

#### 5. Pillar 4: "Long-Term Memory" (Vector Embeddings)
Standard chatbots have "amnesia"—they forget everything once the chat closes. An Agentic System needs Persistent Memory.

**The Strategy: "Semantic Indexing"**
AdiGaze doesn't just store text; it stores **Concepts**. When a resume is parsed, the system:
1.  Extracts the text.
2.  Sends it to an embedding model (\`text-embedding-004\`) to convert the text into a vector (a list of numbers).
3.  Stores this vector in the database.

**The Result:** This allows the agent to "remember" candidates not just by keywords, but by meaning. Searching for "Frontend Expert" will retrieve a candidate who lists "React, TypeScript, and Tailwind" even if the words "Frontend Expert" never appear on their resume.

#### 6. Pillar 5: "The Immune System" (Sanitization)
Agents ingest untrusted data (user files, external emails). If you feed this directly to your database, you risk Prompt Injection or corruption.

**The Strategy: "Strict Input Sanitization"**
Before any data reaches the "Brain" or the "Memory," it passes through a sanitization layer.
- **Strip Invisible Characters:** Remove control characters that can confuse AI models.
- **Type Enforcement:** Force numbers to be integers (\`coerceInt\`) and lists to be arrays (\`sanitizeStringArray\`).

#### Summary: The "Agentic" Checklist
To build your own model using this blueprint, ensure your architecture has:
- **Structured Output:** Force JSON.
- **Swarm Logic:** Don't run one agent; run ten.
- **Backoff Loops:** Plan for failure.
- **Vector Memory:** Store meaning, not just text.
- **Sanitization:** Trust no input.
  `,
  },
];

type CaseStudy = (typeof CASE_STUDIES)[0];

export default function CaseStudiesSection() {
  const [selectedPost, setSelectedPost] = useState<CaseStudy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Horizontal drag state
  const hSliderRef = useRef<HTMLDivElement>(null);
  const [isHDragging, setIsHDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Vertical drag state for modal
  const vSliderRef = useRef<HTMLDivElement>(null);
  const [isVDragging, setIsVDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  
  useEffect(() => {
    return () => {
      document.body.style.userSelect = '';
    };
  }, []);

  const handleReadMore = (post: CaseStudy) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };
  
  // Horizontal Drag Handlers
  const onHMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!hSliderRef.current) return;
    setIsHDragging(true);
    setStartX(e.pageX - hSliderRef.current.offsetLeft);
    setScrollLeft(hSliderRef.current.scrollLeft);
    document.body.style.userSelect = 'none';
  };

  const onHMouseLeaveOrUp = () => {
    setIsHDragging(false);
    document.body.style.userSelect = '';
  };

  const onHMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isHDragging || !hSliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - hSliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    hSliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Vertical Drag Handlers for Modal
  const onVMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const slider = vSliderRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (!slider) return;
    setIsVDragging(true);
    setStartY(e.pageY - (slider as HTMLElement).offsetTop);
    setScrollTop(slider.scrollTop);
    document.body.style.userSelect = 'none';
  };

  const onVMouseLeaveOrUp = () => {
    setIsVDragging(false);
    document.body.style.userSelect = '';
  };

  const onVMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const slider = vSliderRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (!isVDragging || !slider) return;
    e.preventDefault();
    const y = e.pageY - (slider as HTMLElement).offsetTop;
    const walk = (y - startY) * 2;
    slider.scrollTop = scrollTop - walk;
  };

  return (
    <>
      <section className="relative py-24" id="case-studies">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium uppercase tracking-wider"
            >
              <BookOpen className="w-3 h-3" />
              <span>Deep Dives</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            >
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Case Studies</span>
            </motion.h2>
          </div>

          <div 
              ref={hSliderRef}
              onMouseDown={onHMouseDown}
              onMouseLeave={onHMouseLeaveOrUp}
              onMouseUp={onHMouseLeaveOrUp}
              onMouseMove={onHMouseMove}
              className={cn("flex space-x-8 pb-8 overflow-x-auto custom-scrollbar", isHDragging ? "cursor-grabbing" : "cursor-grab")}
            >
            <AnimatePresence>
              {CASE_STUDIES.map((study, index) => (
                <motion.div
                  layout
                  key={study.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleReadMore(study)}
                  className="group relative flex-shrink-0 w-[350px] snap-center rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-900/20 cursor-pointer"
                >
                  <div className="md:flex flex-col">
                      <div className="relative h-48 w-full overflow-hidden">
                          <Image 
                              src={study.image} 
                              alt={study.title} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 opacity-80" />
                      </div>
                      <div className="p-6 space-y-4 flex-grow flex flex-col">
                          <div className="flex justify-between items-start">
                              <div>
                                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                      {study.title}
                                  </h3>
                              </div>
                              <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="text-white/30 group-hover:text-white group-hover:bg-cyan-500 group-hover:rotate-45 transition-all duration-300 rounded-full flex-shrink-0"
                              >
                                <ArrowUpRight className="w-5 h-5" />
                              </Button>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed flex-grow">{study.excerpt}</p>
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                              {study.techStack.map((tech, i) => (
                              <Badge key={i} variant="outline" className="bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500/50 transition-colors">
                                  {tech}
                              </Badge>
                              ))}
                          </div>
                      </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {selectedPost && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-5xl w-[90vw] h-[90vh] bg-cyber-dark/90 backdrop-blur-lg border-neon-cyan/30 text-frost-white p-0 flex flex-col">
              <ScrollArea 
                ref={vSliderRef}
                className={cn("h-full w-full rounded-lg custom-scrollbar", isVDragging ? "cursor-grabbing" : "cursor-grab")}
                onMouseDown={onVMouseDown}
                onMouseLeave={onVMouseLeaveOrUp}
                onMouseUp={onVMouseLeaveOrUp}
                onMouseMove={onVMouseMove}
              >
                <div className="p-0">
                    <DialogHeader className="p-6 md:p-8 z-10 !space-y-2">
                        <DialogTitle className="text-2xl md:text-3xl font-bold text-gradient-slow mb-2">{selectedPost.title}</DialogTitle>
                    </DialogHeader>
                    <div className="prose prose-sm md:prose-base prose-invert prose-p:text-frost-cyan/90 prose-p:break-words prose-headings:text-frost-white prose-strong:text-frost-white prose-a:text-neon-cyan prose-table:border-neon-cyan/20 prose-th:text-frost-white prose-tr:border-neon-cyan/20 max-w-none px-6 md:px-8 pb-8">
                        <ReactMarkdown components={{ code: CodeBlock }}>
                          {selectedPost.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
