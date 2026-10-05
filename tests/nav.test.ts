import { describe, expect, test } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { NAV_SHOPS, NAV_ORDER, DIGIT_VIEWS, navBreadcrumbs } from '@/lib/nav';

describe('shared nav config', () => {
  test('every route appears once in the visible S-Shop hierarchy', () => {
    const hrefs = NAV_SHOPS.flatMap((shop) => shop.items.map((item) => item.href));
    expect(NAV_ORDER).toEqual(hrefs);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  test('S6 communication and S7 influence routes do not overlap', () => {
    const s6 = NAV_SHOPS.find((shop) => shop.id === 's6')!;
    const s7 = NAV_SHOPS.find((shop) => shop.id === 's7')!;
    expect(s6.items.map((item) => item.href)).toEqual(['/comms', '/chats']);
    expect(s7.items.map((item) => item.href)).toEqual(['/social', '/content', '/brand-deals']);
  });

  test('S9 has no duplicate entries from Logistics or Intelligence', () => {
    const s9 = NAV_SHOPS.find((shop) => shop.id === 's9')!;
    expect(s9.items.map((item) => item.href)).toEqual(['/personas']);
  });

  test('each sidebar breadcrumb uses the owning shop, item label, and nested route', () => {
    expect(navBreadcrumbs('/comms')).toEqual(['S6 Communications', 'Comms']);
    expect(navBreadcrumbs('/agents/commander')).toEqual(['S1 Personnel', 'Agents', 'Commander']);
    expect(navBreadcrumbs('/')).toEqual(['S3 Operations', 'Home']);
  });

  test('digit shortcuts (1–9) map to the first 9 views in visible order', () => {
    expect(DIGIT_VIEWS).toEqual(NAV_ORDER.slice(0, 9));
    expect(DIGIT_VIEWS).toHaveLength(9);
  });

  test('every digit target is a real page route', () => {
    for (const href of DIGIT_VIEWS) {
      const rel = href === '/' ? 'app/page.tsx' : `app/${href.replace(/^\//, '')}/page.tsx`;
      expect(existsSync(path.join(process.cwd(), rel)), `${href} should have a page.tsx`).toBe(true);
    }
  });

  test('all shop routes remain in the shared nav order', () => {
    for (const href of ['/social', '/content', '/finances']) {
      expect(NAV_ORDER, `${href} must be in the visible navigation`).toContain(href);
    }
  });

  test('CommandPalette consumes the shared DIGIT_VIEWS (no private stale copy)', () => {
    const src = readFileSync(path.join(process.cwd(), 'components', 'CommandPalette.tsx'), 'utf8');
    expect(src).toMatch(/from '@\/lib\/nav'/);
    expect(src).not.toMatch(/const DIGIT_VIEWS\s*=/); // must import, not redefine
  });
});
