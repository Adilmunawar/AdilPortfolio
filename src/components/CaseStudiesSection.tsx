
"use client";

import React, { useState, MouseEvent, useEffect, useRef } from 'react';
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
    image: "/casestudy/adigaze.jpg",
    techStack: ["React (Vite)", "Supabase (Deno)", "Gemini 1.5 Pro", "pgvector"],
    challenge: "Process thousands of resumes with AI without hitting API rate limits or server timeouts, a complex high-concurrency challenge.",
    solution: "Architected a distributed round-robin worker pool to parallelize AI requests across multiple API keys, boosting throughput by 500%.",
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
    image: "/casestudy/agent.jpg",
    techStack: ["System Design", "AI", "Swarm Logic", "pgvector", "Resilience"],
    challenge: "Typical AI development treats models as passive tools. The challenge is to architect an active, autonomous system that can make decisions, use tools, and self-heal.",
    solution: "A five-pillar blueprint for building agentic systems, focusing on structured cognition, parallel worker swarms, self-healing reflexes, vector memory, and a security-first immune system.",
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
  {
    id: 3,
    title: "The Supabase Sovereign",
    excerpt: "Architecting resilient, self-healing backends at enterprise scale by leveraging Supabase's integrated ecosystem.",
    image: "/casestudy/supabase.jpg",
    techStack: ["Supabase", "Postgres", "System Design", "Resilience", "Edge Functions"],
    challenge: "Traditional databases crash under the intense, spiky connection loads from modern serverless functions, creating a 'serverless friction' bottleneck.",
    solution: "An integrated architecture using Supavisor for connection pooling, advanced Postgres indexing, and asynchronous webhooks to build a resilient, self-healing backend that can serve 10,000+ users.",
    content: `
# **The Supabase Sovereign: Architecting Resilient, Self-Healing Backends at Enterprise Scale**

## **1. The Core Philosophy: Why Supabase Over Raw Postgres?**

In my experience leading projects for **Nexsus Orbits** and university management, the problem isn't storing data—it's the **orchestration** of that data. Traditional relational databases (RDBMS) suffer from "Serverless Friction": the inability to handle the erratic connection spikes of modern web frameworks.

Supabase solves this not by being a "Firebase Clone," but by being an **integrated ecosystem built on the shoulders of giants**. It leverages **Postgres** for reliability, **GoTrue** for identity, and **Realtime** (based on Elixir) for broadcasting.

---

## **2. Solving the Connection Bottleneck: Supavisor & Connection Pooling**

### **The Problem: The 'Max Connections' Wall**

Each Postgres connection consumes ~10MB of RAM. In a serverless environment like **Vercel** or **Netlify**, functions scale horizontally. If 1,000 users hit your site, 1,000 functions try to open 1,000 connections. A standard 2GB RAM DB will crash instantly.

### **The Solution: Transaction vs. Session Mode**

I implemented **Supavisor**, a high-performance proxy. By switching from direct connection (Port 5432) to the **Pooler (Port 6543)**, I moved from a 1:1 connection ratio to a many-to-one ratio.

* **Session Mode:** Maintains a persistent connection for the duration of the client session.
* **Transaction Mode:** The connection is released back to the pool as soon as the SQL query finishes. This allows 100 actual DB connections to serve 10,000 concurrent users.

\`\`\`sql
-- Monitoring connection distribution to prevent starvation
SELECT 
    state, 
    count(*) 
FROM pg_stat_activity 
WHERE datname = 'postgres' 
GROUP BY state;

\`\`\`

---

## **3. Advanced Indexing & Database Hygiene**

### **Avoiding Sequential Scans**

As tables like \`employee_logs\` in **AdiCorp** grow, query latency increases linearly. To maintain sub-100ms response times, I utilize **BRIN (Block Range Indexes)** for time-series data and **GIN (Generalized Inverted Index)** for JSONB search.

### **Low-Row Optimization & Partial Indexes**

Don't index what you don't use. For the **PLRA Land Records** project, we only query "Active" mutations frequently. A partial index keeps the index tree small and fast.

\`\`\`sql
CREATE INDEX idx_active_mutation_land 
ON mutations (land_id, owner_name) 
WHERE status = 'active' AND deleted_at IS NULL;

\`\`\`

### **Automated Reindexing & Vacuuming**

Postgres uses MVCC (Multi-Version Concurrency Control). When you update a row, it doesn't overwrite; it creates a new version and marks the old one as "dead" (a Tuple).

* **The Problem:** Bloat makes the database sluggish.
* **The Fix:** I configured **Autovacuum** settings specifically for high-write tables to ensure "Dead Tuples" are reclaimed before they consume disk space.

---

## **4. The Edge Runtime: Logic Beyond the Database**

### **Edge Functions vs. Database Functions**

I follow the "Thin DB, Fat Edge" philosophy. Complex business logic (like salary calculations based on attendance) should not live in SQL functions (plpgsql) because they consume DB CPU. Instead, I use **Supabase Edge Functions (Deno)**.

### **Edge Secrets & Security Vault**

Security is paramount in my **ShadowGuard** projects. I utilize the **Supabase Vault** to store API keys for Daraz or Instagram integrations. This ensures that even if an attacker gains SQL access, they cannot see the decrypted keys without the specific vault permission.

### **Edge Function Implementation (Fast Approach)**

\`\`\`typescript
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  const { employee_id, days_present, wage_rate } = await req.json()
  const salary = days_present * wage_rate

  const { error } = await supabaseAdmin
    .from('salaries')
    .upsert({ id: employee_id, amount: salary, updated_at: new Date() })

  return new Response(JSON.stringify({ salary, success: !error }), { status: error ? 400 : 200 })
})

\`\`\`

---

## **5. Real-Time Observability & The "Observatory"**

Supabase provides an **Observatory** (Logflare integration) that allows for real-time monitoring of every request.

### **Tracking API Endpoints & Outer Pings**

To ensure the **AdiSat** AQI web app remains online, I built an automated "Outer Ping" system.

1. **Cron Trigger:** Fires every 5 minutes.
2. **Edge Function:** Performs a health check on the API.
3. **Real-Time Log:** If the latency exceeds 500ms, a webhook fires a notification to my WhatsApp.

### **SQL for Performance Auditing**

\`\`\`sql
-- Identifying "Hungry" queries that consume the most CPU time
SELECT 
    query, 
    calls, 
    total_exec_time, 
    rows, 
    100.0 * total_exec_time / sum(total_exec_time) OVER () AS cpu_percent
FROM pg_stat_statements 
ORDER BY total_exec_time DESC 
LIMIT 10;

\`\`\`

---

## **6. Advanced Webhooks & Asynchronous Processing**

### **The pg_net Extension**

Traditional Postgres triggers are synchronous—the user waits for the trigger to finish. This is a bottleneck.
I use the \`pg_net\` extension to fire **Asynchronous Webhooks**. When a new lead is added to **AdiGaze**, the DB fires an HTTP request to an external AI agent and immediately returns "Success" to the user.

\`\`\`sql
select
  net.http_post(
    url:='https://api.artifact.com/v1/process-lead',
    body:=jsonb_build_object('lead_id', new.id, 'source', 'web_form')
  );

\`\`\`

---

## **7. Managing Free Plan Limitations (The Professional Strategy)**

As a developer who manages multiple client projects, I know how to optimize for the **Supabase Free Tier**:

1. **Database Size (500MB):** I implement automated "Log Rotations" where old logs are moved to cold storage (Supabase Storage) as CSVs to keep the DB size under the limit.
2. **Egress (2GB):** I utilize **Edge Caching** and **Next.js Image Optimization** to ensure data transfer remains low.
3. **Pausing:** For dormant projects, I use a GitHub Action that performs a simple \`SELECT 1\` query every 6 days to prevent the project from being paused.

---

## **8. The Results: Why This Matters for Your Business**

By leveraging this "Sovereign" architecture:

* **Zero-Downtime Migration:** I can upgrade database schemas without interrupting university management services.
* **Predictable Scaling:** We know exactly when to upgrade from the Free Plan to Pro based on the "Observatory" metrics.
* **Security First:** Every row is protected by **RLS (Row Level Security)**, ensuring that an employee in **AdiCorp** can only see their own salary, while the Admin sees the global stats.

---
---

## 9. Storage Ecosystem: High-Speed Assets & Image Transformers

In 2026, serving raw images is an anti-pattern. **Supabase Storage** isn't just a bucket; it’s a globally distributed media engine.

### **Global CDN & Cache Control**

Every asset uploaded to Supabase is cached across 280+ edge nodes. For **AdiCorp** or your design brand **Artifact**, I utilize **Smart CDN** revalidation.

* **Public Buckets:** Optimized for high cache-hit rates (ideal for portfolio artwork).
* **Private Buckets:** Assets are protected via RLS, where a signed URL is required for access.

### **On-the-Fly Image Transformation**

Instead of storing five sizes of the same image, I use the built-in Resizing Proxy. This reduces bandwidth egress significantly.

\`\`\`typescript
const { data } = supabase.storage
  .from('portfolio-assets')
  .getPublicUrl('hero-render.png', {
    transform: { width: 800, height: 600, quality: 80 }
  })

\`\`\`

---

## 10. Security Hardening: PKCE Auth & MFA

Standard "Implicit" Auth flows are vulnerable to certain interception attacks. For **AdiNox (Authenticator)**, I implemented the **PKCE (Proof Key for Code Exchange)** flow.

### **The PKCE Flow Advantage**

In PKCE, the client generates a \`code_verifier\` and sends a \`code_challenge\` to Supabase. When the user is redirected back, the client exchanges the code for a session. This ensures the session can only be established on the same device that initiated the login.

### **Multi-Factor Authentication (MFA)**

To meet enterprise compliance (FINRA/GDPR), I integrate **App-based MFA (TOTP)**. Using Supabase Auth, I can enforce "AAL2" (Authenticator Assurance Level 2) via RLS.

\`\`\`sql
-- Restricting a sensitive table to only MFA-verified users
create policy "Secure access for MFA users only"
on sensitive_data
as restrictive
to authenticated
using (auth.jwt()->>'aal' = 'aal2');

\`\`\`

---

## 11. Realtime Engine Architecture: Broadcast vs. Presence

The Supabase Realtime engine is built on **Elixir/Phoenix**, capable of handling millions of concurrent WebSockets. I categorize its usage into three distinct pillars:

### **The Three Pillars of Realtime**

1. **Postgres Changes:** Low-latency streaming of Write-Ahead Logs (WAL). Best for syncing UI state with DB.
2. **Broadcast:** A "fire-and-forget" ephemeral messaging system (e.g., "User is typing..." in **Aditron**). It bypasses the database entirely for speed.
3. **Presence:** A CRDT-based (Conflict-free Replicated Data Type) state tracker. It manages "Who is online" without race conditions.

\`\`\`typescript
const channel = supabase.channel('room-1')

channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState()
    console.log('Online users:', state)
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({ online_at: new Date().toISOString() })
    }
  })

\`\`\`

---

## 12. Enterprise Workflow: CLI & Migrations

For university management systems, "Direct-to-Dashboard" changes are dangerous. I utilize the **Supabase CLI** for a Local-First development workflow.

### **Environment Branching**

* **Local:** Docker-based Supabase stack for rapid vibe-coding.
* **Staging:** Identical schema for QA and testing land-record mutations.
* **Production:** The live **Artifact** environment.

### **The Migration Lifecycle**

I use \`supabase db diff\` to generate version-controlled SQL files. This allows me to roll back schema changes in seconds if a deployment fails.

\`\`\`bash
supabase db diff -f add_attendance_table
supabase migration up

\`\`\`

---

## 13. PostgREST: The Auto-API Engine

Supabase exposes your Postgres schema through **PostgREST**, a thin C-layer that converts HTTP requests directly into SQL.

### **Avoiding the "Fat Middle"**

Traditional backends (Express/FastAPI) act as a middleman that adds latency. PostgREST allows the frontend to query the DB directly with zero overhead, while RLS handles the security.

### **Custom RPC (Remote Procedure Calls)**

For complex calculations (like calculating total daily wages across 500+ employees), I wrap the logic in a Postgres Function and expose it as an API endpoint.

\`\`\`sql
create or replace function calculate_daily_payout(target_date date)
returns table (employee_id uuid, total_wage numeric)
language plpgsql
as $$
begin
  return query
  select e.id, (e.daily_rate * count(a.id))
  from employees e
  join attendance a on e.id = a.employee_id
  where a.date = target_date
  group by e.id;
end;
$$;

\`\`\`

---

## 14. Conclusion: Maintaining the "Sovereign" Database

To prevent bottlenecks as the project ages, I monitor the **Index Usage Statistics**. If a table has 0 sequential scans but high index scans, the database is healthy. If the sequential scans rise, I implement a **Concurrent Reindexing** strategy to clear table bloat without locking the system.

By mastering this stack, I ensure that my clients' data isn't just "stored"—it's architected for high-velocity growth, extreme security, and global scale.

---

### **Final Verdict**

Supabase is not just a database; it is a **Developer Velocity Engine**. By mastering the underlying Postgres configuration, optimizing for the connection pooler, and moving logic to the Edge, I build applications that aren't just "functional"—they are **Artifacts of engineering excellence.**
`
  },
];

type CaseStudy = (typeof CASE_STUDIES)[0];

export default function CaseStudiesSection() {
  const [selectedPost, setSelectedPost] = useState<CaseStudy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

          <div className="grid grid-cols-1 gap-12">
            <AnimatePresence>
              {CASE_STUDIES.map((study, index) => (
                <motion.div
                  layout
                  key={study.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  onClick={() => handleReadMore(study)}
                  className="group relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-900/20 cursor-pointer"
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }} 
                    className="md:flex"
                  >
                    <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                        <Image 
                            src={study.image} 
                            alt={study.title} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                        />
                         <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10 opacity-80" />
                    </div>
                    <div className="md:w-2/3 p-6 flex flex-col">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                    {study.title}
                                </h3>
                                <p className="text-sm text-gray-300 leading-relaxed mt-2">{study.excerpt}</p>
                            </div>
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-white/30 group-hover:text-white group-hover:bg-cyan-500 group-hover:rotate-45 transition-all duration-300 rounded-full flex-shrink-0"
                            >
                              <ArrowUpRight className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                           <div className="flex gap-3">
                               <div className="min-w-[4px] bg-red-500/50 rounded-full" />
                               <div>
                                   <p className="text-xs text-white/40 uppercase font-semibold">The Challenge</p>
                                   <p className="text-sm text-gray-300 leading-relaxed">{study.challenge}</p>
                               </div>
                           </div>
                           <div className="flex gap-3">
                               <div className="min-w-[4px] bg-cyan-500/50 rounded-full" />
                               <div>
                                   <p className="text-xs text-white/40 uppercase font-semibold">The Solution</p>
                                   <p className="text-sm text-gray-300 leading-relaxed">{study.solution}</p>
                               </div>
                           </div>
                        </div>
                    </div>
                  </motion.div>
                  <div className="flex flex-wrap gap-2 p-4 border-t border-white/10 bg-black/20">
                      {study.techStack.map((tech, i) => (
                      <Badge key={i} variant="outline" className="bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500/50 transition-colors">
                          {tech}
                      </Badge>
                      ))}
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
