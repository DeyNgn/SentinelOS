'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OsMark } from '@/components/OsMark';
import { CONDUCTOR_OPEN_EVENT } from '@/components/ConductorPanel';
import { navBreadcrumbs } from '@/lib/nav';

const OPERATION_OPTIONS = [
  'All Operations',
  'KOG Community',
  'DIB CMMC',
  'Pen Test / Red Team',
];

export function openPalette() {
  window.dispatchEvent(new CustomEvent('dey:palette'));
}

export function Topbar() {
  const pathname = usePathname();
  const breadcrumbs = navBreadcrumbs(pathname);
  const [operation, setOperation] = useState('All Operations');

  return (
    <div className="sticky top-0 z-30 flex h-[52px] shrink-0 items-center gap-3.5 border-b border-os-border bg-os-bg2/70 px-6 backdrop-blur">
      <div className="flex min-w-0 flex-1 items-center gap-[7px] overflow-hidden whitespace-nowrap font-mono text-[11px] tracking-[0.04em] text-os-dim">
        <span className="shrink-0">section-os</span>
        {breadcrumbs.map((crumb, index) => (
          <span key={`${crumb}-${index}`} className="flex min-w-0 items-center gap-[7px]">
            <span className="shrink-0 opacity-45">/</span>
            <span className={index === breadcrumbs.length - 1 ? 'truncate text-os-text' : 'shrink-0'}>{crumb}</span>
          </span>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <label className="flex items-center gap-2 rounded-ctl border border-os-border bg-os-surface px-2.5 py-1.5 text-[10px] uppercase tracking-[0.14em] text-os-dim">
          <span>Op</span>
          <select
            aria-label="Operation selector"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="appearance-none bg-transparent pr-5 font-mono text-[10px] uppercase tracking-[0.14em] text-os-text outline-none"
          >
            {OPERATION_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-os-bg2 text-os-text">
                {opt}
              </option>
            ))}
          </select>
        </label>

        <ThemeToggle />
        <button
          onClick={openPalette}
          title="Command palette (⌘K)"
          data-lens="c"
          className="pressable is-dark grid h-[30px] w-[30px] place-items-center rounded-ctl border border-os-border bg-os-surface text-os-muted hover:text-os-text"
        >
          <Search className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent(CONDUCTOR_OPEN_EVENT))}
          title="Ask Operator about this screen"
          aria-label="Open the Operator agent panel"
          data-lens="c"
          className="pressable is-dark grid h-[30px] w-[30px] place-items-center rounded-ctl border border-os-border bg-os-surface text-os-muted hover:text-os-accent"
        >
          <Bot className="h-3.5 w-3.5" />
        </button>
        <OsMark size={26} className="ml-1 shrink-0" />
      </div>
    </div>
  );
}
