import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Adil Munawar — ML engineer, agricultural remote sensing',
    short_name: 'Adil Munawar',
    description:
      'Machine-learning engineer building crop and field-mapping models from satellite imagery, and full-stack developer. Lahore, remote worldwide.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0f17',
    theme_color: '#0b0f17',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
