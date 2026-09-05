/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || '.next',
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ['error'] } : false,
  },
  images: {
    formats: ['image/webp'],
    // Optimised images stay cached on the CDN for 30 days instead of 60 s,
    // so repeat visitors (and the optimizer itself) never re-encode them.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }
          // Removed X-Frame-Options to allow framing if you want your site embedded in AI dashboards
        ]
      },
      {
        // Static artwork (badges, certificates, avatars) rarely changes: let
        // browsers keep it for a day and serve stale while revalidating.
        source: '/:dir(Badges|certifications|testimonials|casestudy|blogpic|adil-munawar-uploads)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }
        ]
      }
    ]
  }
};

module.exports = nextConfig;
