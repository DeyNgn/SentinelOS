import { neuralAppIcon } from '@/lib/pwa-icon';

export const runtime = 'edge';

export function GET() {
  return neuralAppIcon(192);
}