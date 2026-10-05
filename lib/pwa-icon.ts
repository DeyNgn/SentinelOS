import { createElement as h } from 'react';
import { ImageResponse } from 'next/og';

const LATITUDES = [-1.08, -0.72, -0.36, 0, 0.36, 0.72, 1.08];
const LONGITUDES = 28;

export function neuralAppIcon(size: number): ImageResponse {
  const center = 256;
  const radius = 174;
  const points = LATITUDES.flatMap((latitude, row) =>
    Array.from({ length: LONGITUDES }, (_, column) => {
      const longitude = (column / LONGITUDES) * Math.PI * 2;
      const cosLatitude = Math.cos(latitude);
      return {
        row,
        column,
        x: center + Math.cos(longitude) * cosLatitude * radius,
        y: center + Math.sin(latitude) * radius,
        z: Math.sin(longitude) * cosLatitude,
      };
    }),
  );
  const at = (row: number, column: number) => points[row * LONGITUDES + ((column % LONGITUDES) + LONGITUDES) % LONGITUDES];
  const lines = points.flatMap((point) => {
    const neighbors = [at(point.row, point.column + 1), ...(point.row < LATITUDES.length - 1 ? [at(point.row + 1, point.column)] : [])];
    return neighbors
      .filter((neighbor) => point.z + neighbor.z > -0.68)
      .map((neighbor, index) => h('line', {
        key: `line-${point.row}-${point.column}-${index}`,
        x1: point.x,
        y1: point.y,
        x2: neighbor.x,
        y2: neighbor.y,
        stroke: (point.row * 7 + point.column) % 13 === 0 ? '#ffc77e' : '#62e5ff',
        strokeOpacity: Math.max(0.13, 0.36 + (point.z + neighbor.z) * 0.22),
        strokeWidth: 2.1,
      }));
  });
  const dots = points
    .filter((point) => point.z > -0.62)
    .map((point, index) => h('circle', {
      key: `node-${index}`,
      cx: point.x,
      cy: point.y,
      r: point.column % 7 === 0 ? 4.2 : 2.8,
      fill: (point.row * 7 + point.column) % 13 === 0 ? '#ffd493' : '#a2f4ff',
      opacity: 0.56 + Math.max(0, point.z) * 0.42,
    }));

  const artwork = h('svg', { viewBox: '0 0 512 512', width: 512, height: 512 },
    h('circle', { cx: center, cy: center, r: 225, fill: '#05080b' }),
    h('circle', { cx: center, cy: center, r: 187, fill: 'none', stroke: '#3bbfdf', strokeOpacity: 0.2, strokeWidth: 2 }),
    h('ellipse', { cx: center, cy: center, rx: radius, ry: 74, fill: 'none', stroke: '#ffc77e', strokeOpacity: 0.4, strokeWidth: 2, transform: `rotate(-31 ${center} ${center})` }),
    h('ellipse', { cx: center, cy: center, rx: 70, ry: radius, fill: 'none', stroke: '#62e5ff', strokeOpacity: 0.45, strokeWidth: 2, transform: `rotate(32 ${center} ${center})` }),
    ...lines,
    ...dots,
    h('circle', { cx: center, cy: center, r: 8, fill: '#fff0cc' }),
  );

  return new ImageResponse(
    h('div', {
      style: {
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 48%, #0c2633 0%, #05080b 64%)',
      },
    }, artwork),
    { width: size, height: size },
  );
}