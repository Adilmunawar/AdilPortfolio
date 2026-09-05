import type { MetadataRoute } from 'next';

const SITE = 'https://adilmunawar.vercel.app';

// Crawlers used by AI search and assistants. They are welcome on every page;
// only the chat API route is off-limits to everyone.
const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'cohere-ai',
  'Amazonbot',
  'DuckAssistBot',
  'meta-externalagent',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: '/api/' },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
