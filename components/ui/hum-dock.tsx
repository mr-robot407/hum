'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  badge?: number;
}

interface HUMDockProps {
  items: DockItem[];
  className?: string;
}

const HUMDock: React.FC<HUMDockProps> = ({ items, className = '' }) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [scales, setScales] = useState<number[]>(items.map(() => 1));
  const [positions, setPositions] = useState<number[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const scalesRef = useRef<number[]>(items.map(() => 1));
  const positionsRef = useRef<number[]>([]);
  const mouseXRef = useRef<number | null>(null);

  const BASE = 52;
  const MAX_SCALE = 1.65;
  const SPACING = 6;
  const EFFECT_WIDTH = 200;

  const getTargetScales = useCallback((mx: number | null) => {
    return items.map((_, i) => {
      if (mx === null) return 1;
      const center = i * (BASE + SPACING) + BASE / 2;
      const dist = Math.abs(mx - center);
      if (dist > EFFECT_WIDTH / 2) return 1;
      const theta = (1 - dist / (EFFECT_WIDTH / 2)) * Math.PI;
      return 1 + (MAX_SCALE - 1) * ((1 - Math.cos(theta)) / 2);
    });
  }, [items]);

  const getPositions = useCallback((sc: number[]) => {
    let x = 0;
    return sc.map(s => {
      const w = BASE * s;
      const c = x + w / 2;
      x += w + SPACING;
      return c;
    });
  }, []);

  useEffect(() => {
    const init = items.map(() => 1);
    const pos = getPositions(init);
    scalesRef.current = init;
    positionsRef.current = pos;
    setScales(init);
    setPositions(pos);
  }, [items, getPositions]);

  useEffect(() => {
    const animate = () => {
      const target = getTargetScales(mouseXRef.current);
      const targetPos = getPositions(target);
      const lf = mouseXRef.current !== null ? 0.18 : 0.1;
      let changed = false;

      const newScales = scalesRef.current.map((s, i) => {
        const next = s + (target[i] - s) * lf;
        if (Math.abs(next - target[i]) > 0.001) changed = true;
        return next;
      });
      const newPos = positionsRef.current.map((p, i) => {
        const next = p + (targetPos[i] - p) * lf;
        return next;
      });

      scalesRef.current = newScales;
      positionsRef.current = newPos;
      setScales([...newScales]);
      setPositions([...newPos]);

      if (changed || mouseXRef.current !== null) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [getTargetScales, getPositions]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left - 10;
    mouseXRef.current = mx;
    setMouseX(mx);
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseXRef.current = null;
    setMouseX(null);
  }, []);

  const contentWidth = positions.length > 0
    ? Math.max(...positions.map((p, i) => p + (BASE * scales[i]) / 2))
    : items.length * (BASE + SPACING);

  return (
    <div
      style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}
    >
      <div
        ref={dockRef}
        className={className}
        style={{
          width: `${contentWidth + 20}px`,
          background: 'rgba(20,20,16,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          padding: '10px 10px 8px',
          cursor: 'default',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ position: 'relative', height: `${BASE}px`, width: '100%' }}>
          {items.map((item, i) => {
            const scale = scales[i] || 1;
            const pos = positions[i] || 0;
            const size = BASE * scale;
            const isActive = item.active;

            return (
              <div
                key={item.id}
                title={item.label}
                onClick={item.onClick}
                style={{
                  position: 'absolute',
                  left: `${pos - size / 2}px`,
                  bottom: 0,
                  width: `${size}px`,
                  height: `${size}px`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: `${size * 0.22}px`,
                  background: isActive ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                  border: isActive ? '1px solid rgba(201,168,76,0.4)' : '1px solid transparent',
                  transition: 'background 0.2s, border 0.2s',
                  zIndex: Math.round(scale * 10),
                  color: isActive ? '#c9a84c' : 'rgba(255,255,255,0.7)',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
              >
                <div style={{ fontSize: size * 0.38, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                {/* Active dot */}
                {isActive && (
                  <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#c9a84c', boxShadow: '0 0 6px #c9a84c' }} />
                )}
                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <div style={{ position: 'absolute', top: -4, right: -4, background: '#e05c5c', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '2px solid #0a0a0f' }}>
                    {item.badge}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Tooltip labels */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {items.map(item => (
            <span key={item.id} style={{ fontSize: 9, color: item.active ? '#c9a84c' : 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', flex: 1, textAlign: 'center' }}>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HUMDock;
