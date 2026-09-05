import type { MetadataRoute } from 'next';

const SITE = 'https://adilmunawar.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    // Machine-readable profiles regenerated on every build by scripts/build-llms.mjs.
    { url: `${SITE}/llms.txt`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/llms-full.txt`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE}/ai-profile.json`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];
}
