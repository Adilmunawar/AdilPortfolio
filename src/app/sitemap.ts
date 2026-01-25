
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://adilmunawar.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily', // Tell bots to check back often
      priority: 1,
    },
    {
      url: 'https://adilmunawar.vercel.app/llms.txt', // Index the AI file
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  ]
}
