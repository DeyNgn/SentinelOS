import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import manifest from '@/app/manifest';
import { GET as getIcon192 } from '@/app/icon-192.png/route';

const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

describe('Section OS install shell', () => {
  test('manifest declares a standalone app with install-sized neural icons', () => {
    const app = manifest();
    expect(app.name).toBe('Section OS');
    expect(app.start_url).toBe('/');
    expect(app.display).toBe('standalone');
    expect(app.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }),
      expect.objectContaining({ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }),
    ]));
    expect(app.shortcuts?.map((shortcut) => shortcut.url)).toEqual(['/', '/overview']);
  });

  test('offline worker provides a shell fallback and never caches API responses', () => {
    const worker = read('public/sw.js');
    expect(worker).toContain("cache.add(OFFLINE_URL)");
    expect(worker).toContain("caches.match(OFFLINE_URL)");
    expect(worker).toContain("url.pathname.startsWith('/api/')");
  });

  test('the install icon route returns a real PNG image', async () => {
    const response = getIcon192();
    expect(response.headers.get('content-type')).toContain('image/png');
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect(Array.from(bytes.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  });
});