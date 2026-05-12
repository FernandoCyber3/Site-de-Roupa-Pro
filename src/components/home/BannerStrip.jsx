export default function BannerStrip({ text }) {
  if (!text) return null;

  // Duplicamos o texto para o loop ser contínuo e sem saltos
  const items = Array(10).fill(text);

  return (
    <div className="bg-terracota py-2.5 overflow-hidden">
      <div className="banner-track flex gap-12 whitespace-nowrap">
        {items.map((t, i) => (
          <span
            key={i}
            className="text-xs font-body font-semibold text-white tracking-[0.2em] uppercase flex items-center gap-4 flex-shrink-0"
          >
            {t}
            <span className="w-1 h-1 rounded-full bg-white/50" />
          </span>
        ))}
      </div>

      {/* CSS puro — GPU acelerado, zero JS por frame */}
      <style>{`
        @keyframes banner-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .banner-track {
          animation: banner-scroll 30s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}