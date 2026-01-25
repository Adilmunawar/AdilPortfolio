
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/', // Allow everyone
        disallow: ['/private/', '/api/auth/'], // Only protect auth routes
      },
      {
        userAgent: ['GPTBot', 'Google-Extended', 'CCBot', 'ClaudeBot', 'FacebookBot'],
        allow: '/', // Explicitly welcome AI Crawlers
      }
    ],
    sitemap: 'https://adilmunawar.vercel.app/sitemap.xml',
  }
}
