'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, CircleAlert, Radio, Users } from 'lucide-react';
import { ConductorChat } from '@/components/ConductorChat';
import { NeuralOrb } from '@/components/NeuralOrb';
import type { VoiceActivity } from '@/components/ConductorComposer';

type OperatorContext = {
  operations: { id: string; name: string; shops: string[] }[];
  agents: { active: number; total: number };
  tasks: { open: number; items: { id: string; title: string; status: string; agent: string }[] };
  connectors: { connected: number; total: number; errors: number };
  latestRun: { agent: string; summary: string; ok: boolean; startedAt: string } | null;
};

const EMPTY_ACTIVITY: VoiceActivity = { mode: 'idle', intensity: 0 };

function statusLabel(activity: VoiceActivity): string {
  if (activity.mode === 'listening') return 'Listening for your voice';
  if (activity.mode === 'speaking') return 'Speaking response';
  return 'Ready for your direction';
}

function formatAge(iso: string): string {
  const elapsed = Date.now() - Date.parse(iso);
  if (!Number.isFinite(elapsed) || elapsed < 0) return 'just now';
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
}

export function OperatorHome({ context, boardUrl }: { context: OperatorContext; boardUrl: string | null }) {
  const [activity, setActivity] = useState<VoiceActivity>(EMPTY_ACTIVITY);

  return (
    <div className="grid min-h-[calc(100dvh-12rem)] gap-8 xl:grid-cols-[minmax(0,1fr)_272px]">
      <main className="flex min-h-[690px] min-w-0 flex-col">
        <section className="relative flex min-h-[310px] shrink-0 flex-col items-center justify-center overflow-hidden border-b border-os-border pb-5 pt-2 text-center sm:min-h-[350px]">
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(10, 117, 159, .12), transparent 68%)' }} />
          <div className="relative aspect-square w-[min(78vw,330px)] sm:w-[350px]">
            <NeuralOrb activity={activity} />
          </div>
          <div className="relative z-10 -mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-100/75">
            <span className={`h-1.5 w-1.5 ${activity.mode === 'idle' ? 'bg-os-ok' : 'animate-pulse bg-cyan-200'}`} />
            {statusLabel(activity)}
          </div>
          <p className="relative z-10 mt-2 max-w-lg px-4 font-mono text-[11px] leading-relaxed text-os-dim">
            Speak a direction or type what you want to move forward.
          </p>
        </section>

        <section className="min-h-[350px] flex-1 pt-2" aria-label="Conversation with Operator">
          <ConductorChat bare boardUrl={boardUrl} onVoiceActivity={setActivity} />
        </section>
      </main>

      <aside className="border-t border-os-border pt-5 xl:border-l xl:border-t-0 xl:pl-6" aria-label="Conversation context">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-os-dim">Live context</p>
            <h2 className="mt-1 text-sm font-semibold text-os-text">For this conversation</h2>
          </div>
          <Radio className="h-4 w-4 text-cyan-200" strokeWidth={1.6} />
        </div>

        <section className="border-t border-os-border py-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-os-dim">Operations</h3>
            <span className="font-mono text-[10px] tabular-nums text-os-muted">{context.operations.length} active</span>
          </div>
          {context.operations.length ? (
            <ul className="mt-3 space-y-2">
              {context.operations.map((operation) => (
                <li key={operation.id} className="border-l border-cyan-300/50 pl-2.5">
                  <div className="text-[11px] font-medium text-os-text">{operation.name}</div>
                  <div className="mt-0.5 font-mono text-[8px] leading-relaxed text-os-dim">{operation.shops.join(' · ')}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 font-mono text-[10px] text-os-dim">No active operations loaded.</p>
          )}
        </section>

        <section className="border-t border-os-border py-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-os-dim">Agents</h3>
            <span className="font-mono text-[10px] tabular-nums text-os-muted">{context.agents.active} / {context.agents.total} active</span>
          </div>
          <Link href="/agents" className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] text-cyan-100/70 hover:text-cyan-100">
            Open roster <ArrowUpRight className="h-3 w-3" />
          </Link>
        </section>

        <section className="border-t border-os-border py-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-os-dim">Open work</h3>
            <span className="font-mono text-[10px] tabular-nums text-os-muted">{context.tasks.open}</span>
          </div>
          {context.tasks.items.length ? (
            <ul className="mt-2 divide-y divide-os-hairline">
              {context.tasks.items.map((task) => (
                <li key={task.id} className="py-2">
                  <div className="line-clamp-2 text-[10px] leading-relaxed text-os-text">{task.title}</div>
                  <div className="mt-1 flex items-center justify-between gap-2 font-mono text-[8px] uppercase tracking-[0.1em] text-os-dim">
                    <span>{task.agent}</span><span>{task.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 font-mono text-[10px] text-os-dim">No open agent tasks.</p>
          )}
          <Link href="/tasks" className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] text-cyan-100/70 hover:text-cyan-100">
            Open task board <ArrowUpRight className="h-3 w-3" />
          </Link>
        </section>

        <section className="border-t border-os-border py-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-os-dim">Connections</h3>
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-os-muted">
              {context.connectors.errors ? <CircleAlert className="h-3 w-3 text-os-warn" /> : <Check className="h-3 w-3 text-os-ok" />}
              {context.connectors.connected}/{context.connectors.total} live
            </span>
          </div>
          <Link href="/integrations" className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] text-cyan-100/70 hover:text-cyan-100">
            Connection status <ArrowUpRight className="h-3 w-3" />
          </Link>
        </section>

        <section className="border-t border-os-border py-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-os-dim">Latest run</h3>
            {context.latestRun && <span className="font-mono text-[8px] text-os-dim">{formatAge(context.latestRun.startedAt)}</span>}
          </div>
          {context.latestRun ? (
            <div className="mt-2 flex gap-2">
              <Users className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${context.latestRun.ok ? 'text-os-ok' : 'text-os-warn'}`} />
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-os-text">{context.latestRun.agent}</p>
                <p className="mt-0.5 line-clamp-2 font-mono text-[9px] leading-relaxed text-os-dim">{context.latestRun.summary}</p>
              </div>
            </div>
          ) : (
            <p className="mt-2 font-mono text-[10px] text-os-dim">No agent runs recorded yet.</p>
          )}
        </section>
      </aside>
    </div>
  );
}