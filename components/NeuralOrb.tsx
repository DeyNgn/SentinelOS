'use client';

import { useEffect, useRef } from 'react';
import type { VoiceActivity } from '@/components/ConductorComposer';

type Point = { x: number; y: number; z: number; tint: number };

function spherePoints(count: number): Point[] {
  const points: Point[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const angle = golden * i;
    points.push({
      x: Math.cos(angle) * radius,
      y,
      z: Math.sin(angle) * radius,
      tint: Math.sin(i * 12.9898) > 0.68 ? 1 : 0,
    });
  }
  return points;
}

function sphereEdges(points: Point[]): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i];
      const b = points[j];
      const distance = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
      if (distance < 0.115) edges.push([i, j]);
    }
  }
  return edges;
}

export function NeuralOrb({ activity, className = '' }: { activity: VoiceActivity; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activityRef = useRef(activity);
  activityRef.current = activity;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const points = spherePoints(190);
    const edges = sphereEdges(points);
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const draw = (time: number) => {
      const state = activityRef.current;
      const active = state.mode !== 'idle';
      const pace = reducedMotion ? 0.00012 : active ? 0.00068 : 0.0002;
      const phase = time * pace;
      const response = active ? Math.max(0.2, Math.min(1, state.intensity)) : 0;
      const beat = active ? 0.05 + response * 0.075 + Math.sin(time * 0.008) * 0.025 : Math.sin(time * 0.0014) * 0.014;
      const radius = Math.min(width, height) * 0.43 * (1 + beat);
      const centerX = width / 2;
      const centerY = height / 2;
      const cosine = Math.cos(phase);
      const sine = Math.sin(phase);
      const tilt = Math.sin(phase * 0.71) * 0.14;
      const projected = points.map((point) => {
        const x = point.x * cosine + point.z * sine;
        const rotatedZ = -point.x * sine + point.z * cosine;
        const y = point.y * Math.cos(tilt) - rotatedZ * Math.sin(tilt);
        const z = point.y * Math.sin(tilt) + rotatedZ * Math.cos(tilt);
        const perspective = 1.55 / (2.65 - z);
        return {
          x: centerX + x * radius * perspective,
          y: centerY + y * radius * perspective,
          z,
          tint: point.tint,
        };
      });

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      const halo = context.createRadialGradient(centerX, centerY, radius * 0.06, centerX, centerY, radius * 1.16);
      halo.addColorStop(0, `rgba(31, 194, 255, ${0.1 + response * 0.09})`);
      halo.addColorStop(0.58, `rgba(10, 124, 202, ${0.045 + response * 0.04})`);
      halo.addColorStop(1, 'rgba(4, 10, 18, 0)');
      context.fillStyle = halo;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.16, 0, Math.PI * 2);
      context.fill();

      for (let i = 0; i < edges.length; i++) {
        const [from, to] = edges[i];
        const a = projected[from];
        const b = projected[to];
        const depth = (a.z + b.z + 2) / 4;
        const traveling = active ? Math.max(0, Math.sin(time * 0.006 + i * 0.19)) * response : 0;
        const alpha = 0.12 + depth * 0.27 + traveling * 0.42;
        const gold = points[from].tint === 1 || points[to].tint === 1;
        context.strokeStyle = gold
          ? `rgba(255, 199, 128, ${alpha * 0.82})`
          : `rgba(91, 222, 255, ${alpha})`;
        context.lineWidth = 0.55 + depth * 0.55 + traveling * 0.7;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }

      for (let i = 0; i < projected.length; i++) {
        const point = projected[i];
        const depth = (point.z + 1) / 2;
        const shimmer = active ? (0.35 + 0.65 * Math.abs(Math.sin(time * 0.007 + i * 0.27))) * response : 0;
        const size = 0.8 + depth * 1.5 + shimmer * 1.25;
        context.fillStyle = point.tint
          ? `rgba(255, 215, 158, ${0.42 + depth * 0.42 + shimmer * 0.18})`
          : `rgba(143, 238, 255, ${0.38 + depth * 0.52 + shimmer * 0.22})`;
        context.shadowBlur = 3 + shimmer * 11;
        context.shadowColor = point.tint ? '#ffc77e' : '#54dfff';
        context.beginPath();
        context.arc(point.x, point.y, size, 0, Math.PI * 2);
        context.fill();
      }

      context.shadowBlur = 0;
      context.globalCompositeOperation = 'source-over';
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const label = activity.mode === 'listening' ? 'listening' : activity.mode === 'speaking' ? 'speaking' : 'idle';

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Operator neural node ${label}`}
      className={`h-full w-full ${className}`}
    />
  );
}