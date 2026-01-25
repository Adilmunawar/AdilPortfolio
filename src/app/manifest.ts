
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Adil Munawar - AI Architect',
    short_name: 'Adil Munawar',
    description: 'Portfolio of Adil Munawar, Project Lead at Nexsus Orbits.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030014',
    theme_color: '#030014',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/zenith.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/zenith.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
