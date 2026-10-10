'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, PanelLeft } from 'lucide-react';
import { OsMark } from '@/components/OsMark';
import { usePathname } from 'next/navigation';
import { NAV_SHOPS, type NavItem } from '@/lib/nav';

const COLLAPSED_W = 56;
const MIN_W = 190;
const MAX_W = 420;
const DEFAULT_W = 232;

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
}

export function Sidebar() {
  const pathname = usePathname();
  const [live, setLive] = useState<{ up: number; total: number } | null>(null);
  const [host, setHost] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedShop, setExpandedShop] = useState<string | null>(null);
  const [width, setWidth] = useState(DEFAULT_W);
  const [tip, setTip] = useState<{ label: string; x: number; y: number } | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const savedW = Number(localStorage.getItem('sectionos.sidebar.w'));
    if (Number.isFinite(savedW) && savedW >= MIN_W && savedW <= MAX_W) setWidth(savedW);
    setCollapsed(localStorage.getItem('sectionos.sidebar.collapsed') === '1');
  }, []);

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  useEffect(() => {
    const match = NAV_SHOPS.find((shop) => shop.items.some((item) => isActivePath(pathname, item.href)));
    setExpandedShop(match ? match.id : null);
  }, [pathname]);

  useEffect(() => {
    const w = collapsed ? COLLAPSED_W : width;
    document.documentElement.style.setProperty('--sidebar-w', `${w}px`);
  }, [collapsed, width]);

  useEffect(() => {
    localStorage.setItem('sectionos.sidebar.collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (collapsed) return;
      e.preventDefault();
      dragging.current = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const next = Math.min(MAX_W, Math.max(MIN_W, ev.clientX));
        setWidth(next);
      };
      const onUp = () => {
        dragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        setWidth((w) => {
          localStorage.setItem('sectionos.sidebar.w', String(w));
          return w;
        });
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [collapsed],
  );

  useEffect(() => {
    let cancelled = false;
    fetch('/api/connections')
      .then((res) => res.json())
      .then((body: { connections?: { state: string }[] }) => {
        if (cancelled || !Array.isArray(body.connections)) return;
        setLive({
          up: body.connections.filter((c) => c.state === 'connected').length,
          total: body.connections.length,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const renderNavItem = (item: NavItem) => {
    const active = isActivePath(pathname, item.href);
    const Icon = item.icon;
    const label = item.label;
    return (
      <Link
        key={item.href}
        href={item.href}
        data-lens="r"
        onMouseEnter={(e) => {
          if (!collapsed) return;
          const left = e.currentTarget.getBoundingClientRect().left;
          const top = e.currentTarget.getBoundingClientRect().top;
          const width = e.currentTarget.getBoundingClientRect().width;
          const height = e.currentTarget.getBoundingClientRect().height;
          setTip({ label, x: left + width / 2, y: top + height / 2 });
        }}
        onMouseLeave={() => {
          if (!collapsed) setTip(null);
        }}
        className={`pressable is-dark group relative flex items-center rounded-ctl border text-[12.75px] font-medium transition-colors hover:translate-x-[2px] ${
          active
            ? 'border-[var(--accent-line)] bg-[var(--accent-soft)] text-os-accent'
            : 'border-transparent text-os-muted hover:text-os-text'
        } ${collapsed ? 'justify-center px-0 py-[8px]' : 'gap-2.5 px-2.5 py-[7px]'}`}
      >
        <Icon className="h-[14px] w-[14px] shrink-0 opacity-85" strokeWidth={1.7} />
        {collapsed ? null : label}
      </Link>
    );
  };

  return (
    <aside
      className="fixed inset-y-0 left-0 z-20 flex flex-col border-r border-os-border bg-os-bg2"
      style={{ width: collapsed ? COLLAPSED_W : width }}
    >
      <div
        className={`flex pb-[18px] pt-5 ${
          collapsed ? 'flex-col items-center gap-2 px-0' : 'items-center justify-between px-[18px]'
        }`}
      >
        {collapsed ? (
          <OsMark size={30} className="shrink-0" />
        ) : (
          <div className="flex items-center gap-[11px]">
            <OsMark size={34} className="shrink-0" />
            <div>
              <div className="text-[13px] font-bold tracking-[0.14em]">SECTION OS</div>
              <div className="mt-[3px] whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] text-os-dim">
                S-Shop mode
              </div>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          data-lens="c"
          className="pressable is-dark flex h-7 w-7 shrink-0 items-center justify-center rounded-ctl border border-transparent text-os-dim hover:border-os-border hover:text-os-text"
        >
          <PanelLeft className="h-[15px] w-[15px]" strokeWidth={1.7} />
        </button>
      </div>

      <Link
        href="/"
        title="Open Operator chat"
        aria-label="Operator chat"
        aria-current={pathname === '/' ? 'page' : undefined}
        className={`mx-2 mb-3 flex shrink-0 items-center rounded-ctl border border-cyan-300/25 bg-cyan-950/30 text-cyan-100 transition-colors hover:border-cyan-200/60 hover:bg-cyan-950/60 ${
          collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'
        } ${pathname === '/' ? 'border-cyan-200/70 bg-cyan-900/50' : ''}`}
      >
        <MessageSquare className="h-4 w-4 shrink-0 text-cyan-200" strokeWidth={1.7} />
        {!collapsed && (
          <span className="min-w-0">
            <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em]">Operator</span>
            <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.14em] text-cyan-100/60">Chat · voice</span>
          </span>
        )}
      </Link>

      <div
        className="relative flex-1 overflow-y-auto px-2.5 pb-2"
        onMouseDown={onDragStart}
        role="presentation"
      >
        {tip && (
          <div
            className="fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-ctl border border-os-border bg-os-bg px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-os-text shadow-none"
            style={{ left: tip.x + 18, top: tip.y + 8 }}
          >
            {tip.label}
          </div>
        )}
        <div className="space-y-1.5">
          {NAV_SHOPS.map((shop) => {
            const isExpanded = !collapsed && expandedShop === shop.id;
            const isActive = shop.items.some((item) => isActivePath(pathname, item.href));

            return (
              <div key={shop.id} className="rounded-ctl border border-transparent bg-transparent">
                <button
                  type="button"
                  onClick={() => setExpandedShop((current) => (current === shop.id ? null : shop.id))}
                  className={`pressable is-dark flex w-full items-center justify-between rounded-ctl border px-2.5 py-[10px] text-left font-mono transition-colors ${
                    isActive
                      ? 'border-[var(--accent-line)] bg-[var(--accent-soft)] text-os-accent'
                      : 'border-transparent bg-transparent text-os-muted hover:border-os-border hover:text-os-text'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  aria-expanded={isExpanded}
                >
                  <span className="uppercase tracking-[0.18em] text-[9px]">
                    {collapsed ? shop.id.toUpperCase() : shop.label}
                  </span>
                  {!collapsed && (
                    <span className="font-sans text-[10px] text-os-dim">{isExpanded ? '−' : '+'}</span>
                  )}
                </button>

                {!collapsed && isExpanded && (
                  <div className="mt-1.5 space-y-1 pl-2">{shop.items.map(renderNavItem)}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`flex flex-col gap-2 border-t border-os-border py-3.5 ${
          collapsed ? 'items-center px-0' : 'px-[18px]'
        }`}
      >
        <div className="flex items-center gap-2 whitespace-nowrap font-mono text-[10px] text-os-muted">
          <span className="dot ok pulse" />
          {!collapsed && <>{live ? `${live.up}/${live.total}` : '—/—'} systems live</>}
        </div>
        {!collapsed && (
          <div className="break-words font-mono text-[10px] leading-relaxed text-os-dim">
            {host ?? '…'} · sqlite · real agents
          </div>
        )}
      </div>

      {!collapsed && (
        <div
          onMouseDown={onDragStart}
          onDoubleClick={() => setWidth(DEFAULT_W)}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          title="Drag to resize · double-click to reset"
          className="absolute inset-y-0 -right-1 z-30 w-2 cursor-col-resize hover:bg-[var(--accent-soft)]"
        />
      )}
    </aside>
  );
}
