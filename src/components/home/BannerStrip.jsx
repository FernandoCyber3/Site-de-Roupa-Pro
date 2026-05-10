import { motion } from 'framer-motion';

export default function BannerStrip({ text }) {
  if (!text) return null;

  // Duplicate text for seamless loop
  const items = Array(8).fill(text);

  return (
    <div className="bg-terracota py-2.5 overflow-hidden">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        className="flex gap-12 whitespace-nowrap"
      >
        {items.map((t, i) => (
          <span key={i} className="text-xs font-body font-semibold text-white tracking-[0.2em] uppercase flex items-center gap-4">
            {t}
            <span className="w-1 h-1 rounded-full bg-white/50" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}