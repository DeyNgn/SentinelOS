import fs from 'node:fs';
import path from 'node:path';

export type OperationManifest = {
  id: string;
  name: string;
  active: boolean;
  shops: string[];
  requiredTools: string[];
  agentSwarms: string[];
  path: string;
};

function parseScalar(raw: string): string | boolean | string[] {
  const value = raw.trim();
  if (!value) return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(',')
      .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }
  return value;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'operation';
}

export function loadOperationManifests(baseDir = path.join(process.cwd(), 'operations')): OperationManifest[] {
  if (!fs.existsSync(baseDir)) return [];

  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  const manifests: OperationManifest[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const manifestPath = path.join(baseDir, entry.name, 'manifest.yaml');
    if (!fs.existsSync(manifestPath)) continue;

    const raw = fs.readFileSync(manifestPath, 'utf8');
    const data: Record<string, unknown> = {};
    let currentKey: string | null = null;
    let currentList: string[] | null = null;

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
      if (listMatch) {
        if (!currentKey) continue;
        const arr = Array.isArray(data[currentKey]) ? [...(data[currentKey] as string[])] : [];
        arr.push(String(parseScalar(listMatch[1])));
        data[currentKey] = arr;
        currentList = arr;
        continue;
      }

      const keyMatch = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (!keyMatch) continue;

      const [, key, value] = keyMatch;
      currentKey = key;
      currentList = null;

      if (value === '') {
        data[key] = [];
        continue;
      }

      data[key] = parseScalar(value);
    }

    const id = String((data.id as string | undefined) ?? slugify(String(data.name ?? entry.name)));
    const name = String(data.name ?? id);
    const active = Boolean(data.active === true || data.active === 'true');
    const shops = Array.isArray(data.shops) ? (data.shops as string[]).map(String) : [];
    const requiredTools = Array.isArray(data.required_tools)
      ? (data.required_tools as string[]).map(String)
      : Array.isArray(data.requiredTools)
        ? (data.requiredTools as string[]).map(String)
        : [];
    const agentSwarms = Array.isArray(data.agent_swarms)
      ? (data.agent_swarms as string[]).map(String)
      : Array.isArray(data.agentSwarms)
        ? (data.agentSwarms as string[]).map(String)
        : [];

    manifests.push({
      id,
      name,
      active,
      shops,
      requiredTools,
      agentSwarms,
      path: manifestPath,
    });
  }

  return manifests;
}
