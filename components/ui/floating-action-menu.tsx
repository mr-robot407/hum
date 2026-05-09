'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X } from 'lucide-react';

interface FAMOption {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

interface FloatingActionMenuProps {
  options: FAMOption[];
}

const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({ options }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: 90, right: 28, zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}
          >
            {options.map((opt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                onClick={() => { opt.onClick(); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(20,20,16,0.92)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: '10px 16px',
                  color: opt.color || 'rgba(255,255,255,0.85)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  fontFamily: 'Manrope, sans-serif',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  whiteSpace: 'nowrap',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = opt.color || 'rgba(201,168,76,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              >
                <span style={{ color: opt.color || '#c9a84c' }}>{opt.icon}</span>
                {opt.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 48, height: 48, borderRadius: '50%',
          background: open ? 'rgba(201,168,76,0.2)' : '#c9a84c',
          border: `1px solid ${open ? 'rgba(201,168,76,0.5)' : 'transparent'}`,
          color: open ? '#c9a84c' : '#000',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        <Plus size={20} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
};

export default FloatingActionMenu;
