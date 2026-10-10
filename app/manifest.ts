import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Section OS',
    short_name: 'Section OS',
    description: 'Section OS operations command center and Operator voice console.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#05080b',
    theme_color: '#05080b',
    categories: ['productivity', 'utilities'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Operator', short_name: 'Operator', url: '/', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }] },
      { name: 'Overview', short_name: 'Overview', url: '/overview', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }] },
    ],
  };
}