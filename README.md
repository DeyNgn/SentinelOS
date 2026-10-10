# Sentinel OS

**A proprietary Agentic Command Harness and Enclave Operating System by Dey Engineering.**

Sentinel OS consolidates multi-agent orchestration, mission planning, communications, and defense-grade enclave operations into a unified command deck. Modeled on military staff section principles (S1–S9) and powered by local-first agent swarms, Sentinel OS runs an entire enterprise as an integrated, deterministic software harness.

This repository contains the **private, proprietary production codebase** engineered for local execution inside WSL2 with GPU acceleration (Ollama / Hermes) or isolated deployment within secure AWS GovCloud / FedRAMP enclaves.

## Command Hierarchy & Operational Framework

Sentinel OS structures autonomous execution using a disciplined four-tier command hierarchy:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          OPERATOR (Human Commander)                         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                        CONDUCTOR (Master Orchestrator)                      │
│                  Task Routing, Agent Dispatch, System Bus                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│             STAFF SECTIONS & OPERATIONAL PILLARS (S1 - S9)                  │
│                                                                             │
│  S1 Personnel │ S2 Intel │ S3 Ops │ S4 Logistics │ S5 Plans │ S6 Comms ...  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                       WORKERS & AGENT EXECUTIONS                            │
│           Deterministic Tools, Model Context Protocol (MCP), LLMs           │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Operator:** The human commander with final decision authority.
2. **Conductor:** The central routing daemon that decomposes operator intent, schedules workflows, and assigns tasks across sections.
3. **Pillars (S-Shops):** Permanent functional divisions (S1 Personnel, S2 Intelligence, S3 Operations, S4 Logistics, S5 Plans, S6 Signal & Comms, S7 Influence, S8 Financials, S9 Civil Affairs).
4. **Workers:** Named autonomous agents, schedulers, and Model Context Protocol (MCP) servers with typed `run()` interfaces and deterministic verification boundaries.

## Operational Route Matrix

| Route | Staff Section | Function & Capability |
| :--- | :--- | :--- |
| `/` | **Command** | Operator Console: pulse row, connector status strip, active agent roster, system health. |
| `/comms` | **S6 Comms** | Unified communications feed: email, messaging, dispatch channels, and dictation streams. |
| `/chats` | **S6 Comms** | Agent interaction hub: direct operator-to-agent console with Conductor routing. |
| `/funnel` | **S7 Influence** | Mission & client acquisition pipeline: neural journey graph and radial status wheel. |
| `/social` | **S7 Influence** | Audience reach and distribution: per-channel engagement, sentiment, and scheduling. |
| `/content` | **S7 Influence** | Operational briefing and content dispatch calendar. |
| `/brand-deals` | **S7 Influence** | Partnership and contract pipeline: deal volume meters, stages, and detail drawer. |
| `/adpilot` | **S7 Influence** | Paid-reach campaign manager and strategic messaging blueprint. |
| `/tasks` | **S3 Ops** | Unified mission Kanban board fed directly by agent outputs and operator directives. |
| `/skills` | **S3 Ops** | Reusable, schedulable agent execution skills and tool routines. |
| `/workflows` | **S3 Ops** | Multi-step agent pipelines with dependency trees and conditional execution. |
| `/brain` | **S2 Intel** | Knowledge core: interactive graph visualization, semantic index, and document vault. |
| `/doctor` | **S2 Intel** | System diagnostics: health verification for knowledge bases, local models, and connectors. |
| `/finances` | **S8 Financials** | Balance ledger: income, capital allocations, burn rate, and expense categorizations. |
| `/trading` | **S8 Financials** | Asset monitor: portfolio tracking, quantitative reasoning, open orders, and guardrails. |
| `/usage` | **S8 Financials** | Compute & token ledger: VRAM consumption, GPU run hours, and model seat costs. |
| `/agents` | **S1 Personnel** | Agent Roster: active agent states, model bindings, permissions, and run logs. |
| `/org` | **S1 Personnel** | Organizational hierarchy: visual command tree mapping Operator, Conductor, and Workers. |
| `/personas` | **S1 Personnel** | Persona templates configuring agent behavioral profiles and execution postures. |
| `/integrations` | **S4 Logistics** | Connector command deck: honest-status telemetry for local and remote integration buses. |
| `/analytics` | **S4 Logistics** | System telemetry: historical performance metrics, request throughput, and latency. |
| `/roadmap` | **S5 Plans** | Strategic roadmaps: multi-phase execution goals and milestone timelines. |
| `/blueprint` | **S5 Plans** | Architecture blueprints and operational standard operating procedures (SOPs). |

## Knowledge & Memory Architecture

Sentinel OS deploys a dual-tier knowledge framework to guarantee deterministic recall and prevent agent hallucination.

```
       RAW SOURCES (Markdown, APIs, Signals)
                        │
                        ▼
┌───────────────────────────────────────────────┐
│        SYNAPSE (Knowledge Repository)         │
│   • Markdown-first Source of Truth            │
│   • Hybrid Retrieval (Vector + Keyword RRF)   │
│   • Local Grep Fallback (Zero-Downtime)       │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│   OPTIMAL ENGINE (Governed Memory Runtime)    │
│                                               │
│    Source ──► Signal ──► Claim ──► Fact ──►   │
│                                   Memory      │
│   • Promotion-gated validation pipeline       │
│   • Tenant / Org / Workspace / Node topology  │
└───────────────────────────────────────────────┘
```

### 1. Synapse (The Knowledge Base)

Plain **Markdown files are the source of truth**. They are chunked and embedded into a vector store, enabling hybrid retrieval through **Reciprocal-Rank Fusion (RRF)** combining keyword and semantic embeddings. If the vector backend is unreachable, retrieval falls back to high-speed local grep over the raw markdown files: fewer smarts, zero downtime.

### 2. Optimal Engine (The Governed Memory Runtime)

Where Synapse stores documents, **Optimal Engine governs what the OS actually accepts as truth**. It serves as the system of record for memory, organized as a **Tenant, Organization, Workspace, Node** topology, with a disciplined truth lifecycle:

$$
\text{Source} \longrightarrow \text{Signal} \longrightarrow \text{Claim} \overset{\text{Review}}{\longrightarrow} \text{Fact} \longrightarrow \text{Memory}
$$

Raw sources produce signals; signals become claims; claims are reviewed and promoted into verified facts; facts distill into durable memories that agents draw on. Agents may write sources, signals, and pending claims, but **facts are promotion-gated**: nothing becomes permanent memory without passing verification or operator review.

Together: **Synapse is the library; Optimal Engine is the librarian and the system of record.** Agents query both before executing tasks.

## System Architecture: Deterministic & Enclave Ready

Sentinel OS separates UI visualization, business logic, and AI execution into clean, auditable tiers:

* **Repository Layer (`lib/data.ts`, `lib/db.ts`):** Single-instance SQLite database operating in Write-Ahead Logging (WAL) mode. Every route reads through typed data access objects; raw SQL queries never bleed into interface components.
* **Schema Enforcement (`lib/schemas.ts`):** Strict Zod validation schemas guard all database inputs and outputs, ensuring data integrity across process boundaries.
* **Honest Connectors (`lib/connectors/*`):** Integration drivers report accurate, real-time connectivity (`connected`, `not_configured`, or `error`) with no spoofed statuses.
* **Runtime Agent Dispatcher (`lib/agents/*`):** Every registered agent implements a typed execution harness with persistent execution logs and structured tool interfaces.

## Local AI Inference Setup (Hermes 3 / Ollama)

Sentinel OS defaults to local GPU inference via **Ollama** running inside WSL2, keeping all prompt processing and intelligence retrieval strictly within your machine.

### 1. Pull the Model

```bash
ollama pull hermes3:3b
```

### 2. Configure Ollama for 64k Context

Edit the systemd service configuration:

```bash
sudo systemctl edit ollama
```

Add the environment settings:

```ini
[Service]
Environment="OLLAMA_CONTEXT_LENGTH=64000"
Environment="OLLAMA_KEEP_ALIVE=24h"
```

Reload systemd and restart Ollama:

```bash
sudo systemctl daemon-reload && sudo systemctl restart ollama
```

## Quick Start (WSL2 / Local Runtime)

**Prerequisites:** Node.js 22+ and an active Ollama instance.

```bash
# 1. Install dependencies
npm install

# 2. Configure local environment variables
cp .env.example .env.local

# 3. Start development server
npm run dev    # Access UI at http://localhost:3000 or http://localhost:4100
```

### Build & Maintenance Utilities

```bash
npm run build && npm start   # Production build and server launch
npm test                     # Execute Vitest test suite
npm run typecheck            # Run TypeScript type validation
npm run seed                 # Re-seed the local SQLite database
```

## Security & Enclave Isolation

* **Local Sovereignty:** All LLM inference, embedding calculations, and database reads run locally inside WSL2. No Controlled Unclassified Information (CUI) or proprietary assets leave the local boundary.
* **GovCloud Readiness:** For hosted enclave configurations, external webhooks and egress streams route through the **S9 Civil Affairs Sanitizer**, scrubbing hostnames, internal IPs, and sensitive parameters prior to transmission.

## Proprietary Notice

**Confidential & Proprietary.** Copyright © Dey Engineering. All Rights Reserved.

Unauthorized distribution, copying, or deployment of this software is strictly prohibited.