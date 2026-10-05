/**
 * Single source of truth for the app's primary navigation. The Sidebar renders
 * these groups in order; the CommandPalette derives its digit (1–9) shortcuts
 * from the same visible order, so the two can never drift apart again.
 */
import {
  Home,
  MessageSquare,
  Share2,
  Clapperboard,
  Handshake,
  Users,
  ListChecks,
  Sparkles,
  Network,
  Brain,
  Wallet,
  Filter,
  Workflow,
  Map,
  Plug,
  BarChart3,
  LayoutGrid,
  Layers,
  Stethoscope,
  CandlestickChart,
  MessagesSquare,
  Gauge,
  Crosshair,
  Waypoints,
} from 'lucide-react';

export type NavItem = { href: string; label: string; icon: typeof Home };

export type NavShop = {
  id: string;
  label: string;
  items: NavItem[];
};

export const NAV_OPERATE: NavItem[] = [
  { href: '/overview', label: 'Overview', icon: Home },
  { href: '/workflows', label: 'Workflows', icon: Workflow },
  { href: '/funnel', label: 'Funnel', icon: Filter },
  { href: '/adpilot', label: 'AdPilot', icon: Crosshair },
];

export const NAV_AGENTS: NavItem[] = [
  { href: '/agents', label: 'Agents', icon: Users },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/skills', label: 'Skills', icon: Sparkles },
  { href: '/org', label: 'Org Chart', icon: Network },
];

export const NAV_INTELLIGENCE: NavItem[] = [
  { href: '/brain', label: 'Synapse', icon: Brain },
  { href: '/doctor', label: 'Doctor', icon: Stethoscope },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/reference', label: 'Reference Model', icon: LayoutGrid },
];

export const NAV_SYSTEM: NavItem[] = [
  { href: '/integrations', label: 'Connections', icon: Plug },
  { href: '/usage', label: 'Usage', icon: Gauge },
];

export const NAV_LIBRARY: NavItem[] = [{ href: '/personas', label: 'Personas', icon: Layers }];

export const NAV_PLANNING: NavItem[] = [
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/blueprint', label: 'Blueprint', icon: Waypoints },
];

export const NAV_COMMUNICATIONS: NavItem[] = [
  { href: '/comms', label: 'Comms', icon: MessageSquare },
  { href: '/chats', label: 'Chats', icon: MessagesSquare },
];

export const NAV_INFLUENCE: NavItem[] = [
  { href: '/social', label: 'Social', icon: Share2 },
  { href: '/content', label: 'Content', icon: Clapperboard },
  { href: '/brand-deals', label: 'Brand Deals', icon: Handshake },
];

export const NAV_FINANCIALS: NavItem[] = [
  { href: '/finances', label: 'Finances', icon: Wallet },
  { href: '/trading', label: 'Trading', icon: CandlestickChart },
];

export const NAV_SHOPS: NavShop[] = [
  { id: 's1', label: 'S1 Personnel', items: NAV_AGENTS },
  { id: 's2', label: 'S2 Intelligence', items: NAV_INTELLIGENCE },
  { id: 's3', label: 'S3 Operations', items: NAV_OPERATE },
  { id: 's4', label: 'S4 Logistics', items: NAV_SYSTEM },
  { id: 's5', label: 'S5 Planning', items: NAV_PLANNING },
  { id: 's6', label: 'S6 Communications', items: NAV_COMMUNICATIONS },
  { id: 's7', label: 'S7 Influence', items: NAV_INFLUENCE },
  { id: 's8', label: 'S8 Financials', items: NAV_FINANCIALS },
  { id: 's9', label: 'S9 Civil Affairs', items: NAV_LIBRARY },
];

/** Visible top-to-bottom order across all groups. */
export const NAV_ORDER: string[] = NAV_SHOPS.flatMap((shop) => shop.items.map((n) => n.href));

/** Sidebar hierarchy for the current path, with any deeper route segments appended. */
export function navBreadcrumbs(pathname: string): string[] {
  if (pathname === '/') return ['Operator'];

  let match: { shop: NavShop; item: NavItem } | null = null;
  for (const shop of NAV_SHOPS) {
    for (const item of shop.items) {
      const matches = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
      if (matches && (!match || item.href.length > match.item.href.length)) match = { shop, item };
    }
  }

  if (!match) {
    const segments = pathname.split('/').filter(Boolean);
    return segments.length ? segments.map((part) => part.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())) : ['Home'];
  }

  const extraSegments = pathname
    .slice(match.item.href.length)
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
  return [match.shop.label, match.item.label, ...extraSegments];
}

/** Digit keys 1–9 jump to the first nine views in visible order. */
export const DIGIT_VIEWS: string[] = NAV_ORDER.slice(0, 9);
