import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * GlowCard — Cursor-tracking border glow (Desktop only).
 * Uses CSS custom properties for glow position. O(1) per mouse event.
 */
export default function GlowCard({ children, className = '' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => setPos((p) => ({ ...p, opacity: 0 }));

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-white/8 bg-card ${className}`}
    >
      {/* Glow spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-xl"
        animate={{ opacity: pos.opacity }}
        transition={{ duration: 0.15 }}
        style={{
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(166,84,50,0.12), transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}