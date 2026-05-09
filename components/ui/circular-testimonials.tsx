'use client';
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  dark?: boolean;
}

function calculateGap(width: number) {
  const minWidth = 1024, maxWidth = 1456, minGap = 60, maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials: React.FC<CircularTestimonialsProps> = ({
  testimonials, autoplay = true, dark = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(600);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<any>(null);
  const count = testimonials.length;
  const active = testimonials[activeIndex];

  useEffect(() => {
    const handleResize = () => {
      if (imageContainerRef.current) setContainerWidth(imageContainerRef.current.offsetWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    autoplayRef.current = setInterval(() => setActiveIndex(p => (p + 1) % count), 5000);
    return () => clearInterval(autoplayRef.current);
  }, [autoplay, count]);

  const next = useCallback(() => { setActiveIndex(p => (p + 1) % count); clearInterval(autoplayRef.current); }, [count]);
  const prev = useCallback(() => { setActiveIndex(p => (p - 1 + count) % count); clearInterval(autoplayRef.current); }, [count]);

  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + count) % count === index;
    const isRight = (activeIndex + 1) % count === index;
    if (isActive) return { zIndex: 3, opacity: 1, pointerEvents: 'auto', transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)', transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' };
    if (isLeft) return { zIndex: 2, opacity: 1, pointerEvents: 'auto', transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`, transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' };
    if (isRight) return { zIndex: 2, opacity: 1, pointerEvents: 'auto', transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`, transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' };
    return { zIndex: 1, opacity: 0, pointerEvents: 'none', transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' };
  }

  const textColor = dark ? '#f5f0e8' : '#000000';
  const subColor = dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const quoteColor = dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)';

  return (
    <div style={{ width: '100%', maxWidth: '56rem', padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        {/* Images */}
        <div ref={imageContainerRef} style={{ position: 'relative', width: '100%', height: '22rem', perspective: '1000px' }}>
          {testimonials.map((t, i) => (
            <img key={t.src} src={t.src} alt={t.name} onClick={() => setActiveIndex(i)}
              style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', cursor: 'pointer', ...getImageStyle(i) }} />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 32, height: 2, background: '#c9a84c' }} />
            <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>
              {active.designation}
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: quoteColor, fontFamily: 'Manrope, sans-serif' }}>
              {active.quote.split(' ').map((word, i) => (
                <motion.span key={i} initial={{ filter: 'blur(8px)', opacity: 0, y: 4 }} animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.02 * i }} style={{ display: 'inline-block' }}>
                  {word}&nbsp;
                </motion.span>
              ))}
            </p>
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: textColor }}>{active.name}</div>
            </div>
            {/* Arrows */}
            <div style={{ display: 'flex', gap: 12, marginTop: '1rem' }}>
              <button onClick={prev} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', color: textColor }}
                onMouseEnter={e => (e.currentTarget.style.background = '#c9a84c')} onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
                <ArrowLeft size={16} />
              </button>
              <button onClick={next} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', color: textColor }}
                onMouseEnter={e => (e.currentTarget.style.background = '#c9a84c')} onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
