import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PLACEHOLDERS } from '@/lib/placeholders';

const LETTERS = ['S', 'Q', 'U', 'A', 'D'];

// CSS-driven sparks — zero JS overhead após mount
const SPARK_DEFS = [
  { left: '4%',  delay: '0s',    color: '#ff8c00' },
  { left: '16%', delay: '0.7s',  color: '#ffaa00' },
  { left: '28%', delay: '1.3s',  color: '#ff6600' },
  { left: '43%', delay: '0.4s',  color: '#ffcc44' },
  { left: '57%', delay: '1.0s',  color: '#ff8c00' },
  { left: '70%', delay: '0.2s',  color: '#ffaa00' },
  { left: '83%', delay: '0.9s',  color: '#ff6600' },
  { left: '94%', delay: '1.5s',  color: '#ffcc44' },
];

// Detecta se é dispositivo touch (mobile/tablet)
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export default function HeroSection({ config }) {
  const containerRef = useRef(null);
  const [phase, setPhase] = useState('initial'); // initial → sweep → ember
  const [isMobile] = useState(isTouchDevice);

  // Tilt só existe no desktop — no mobile não cria motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), { stiffness: 50, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-8, 8]), { stiffness: 50, damping: 20 });

  // Auto tilt — APENAS no desktop para evitar o bug de giro no mobile
  useEffect(() => {
    if (isMobile) return; // <-- desabilitado completamente no mobile

    let cancelled = false;
    const pts = [
      { x: 120, y: -200 }, { x: -80, y: 250 },
      { x: 60, y: 180 },   { x: -140, y: -120 }, { x: 100, y: -250 },
    ];
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      const { x, y } = pts[i++ % pts.length];
      animate(mouseX, x, { duration: 3, ease: 'easeInOut' });
      animate(mouseY, y, { duration: 3, ease: 'easeInOut', onComplete: tick });
    };
    tick();
    return () => { cancelled = true; };
  }, [isMobile]);

  // Fases da animação Ember Forge
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('sweep'), 300);
    const t2 = setTimeout(() => setPhase('ember'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    if (isMobile) return;
    animate(mouseX, 0, { duration: 1 });
    animate(mouseY, 0, { duration: 1 });
  };

  const subtitle = config?.hero_subtitle || 'Authentic Style';
  const videoUrl = config?.hero_video_url;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      {videoUrl ? (
        <video src={videoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <img src={PLACEHOLDERS.hero} alt="SQUAD" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/*
        No mobile: sem tilt (rotateX/Y fixos em 0), sem perspective
        No desktop: tilt 3D suave
      */}
      <motion.div
        style={isMobile ? {} : { rotateX, rotateY, transformPerspective: 1000 }}
        className="relative z-10 text-center px-5 max-w-5xl mx-auto"
      >
        {/* ═══ SQUAD ═══ */}
        <div className="relative inline-block mb-3">

          {/* CSS sparks — só renderiza na fase ember */}
          {phase === 'ember' && (
            <div className="squad-sparks absolute inset-0 pointer-events-none" aria-hidden="true">
              {SPARK_DEFS.map((s, i) => (
                <div
                  key={i}
                  className="spark"
                  style={{ left: s.left, background: s.color, animationDelay: s.delay }}
                />
              ))}
            </div>
          )}

          {/* Barra de luz varrendo (só na fase sweep) */}
          {phase === 'sweep' && (
            <motion.div
              className="absolute top-0 bottom-0 w-1 z-20 pointer-events-none"
              initial={{ left: '-2%' }}
              animate={{ left: '104%' }}
              transition={{ delay: 0.15, duration: 1.3, ease: 'easeInOut' }}
              style={{
                background: 'linear-gradient(to bottom, transparent, #ffe070, #ff8c00, #ffe070, transparent)',
                boxShadow: '0 0 28px 12px rgba(255,160,0,0.6)',
              }}
            />
          )}

          {/* Letras */}
          <h1 className="font-heading font-black text-7xl md:text-9xl lg:text-[11rem] leading-none tracking-tight flex items-center justify-center">
            {LETTERS.map((letter, i) => {
              if (phase === 'initial') {
                return <span key={i} style={{ color: '#1a0800' }}>{letter}</span>;
              }

              if (phase === 'sweep') {
                return (
                  <motion.span
                    key={i}
                    initial={{ color: '#1a0800' }}
                    animate={{
                      color: ['#1a0800', '#ff8c00', '#fff4e0'],
                      textShadow: [
                        'none',
                        '0 0 50px #ff8c00, 0 0 100px #ff4500, 0 0 160px #ff2200',
                        '0 0 20px #ff8c00, 0 0 40px #ff4500',
                      ],
                    }}
                    transition={{ delay: 0.5 + i * 0.18, duration: 0.85, times: [0, 0.45, 1] }}
                  >
                    {letter}
                  </motion.span>
                );
              }

              // ember: brilho fixo, sem piscar
              return (
                <span
                  key={i}
                  style={{
                    color: '#fff4e0',
                    textShadow: '0 0 18px rgba(255,140,0,0.5), 0 0 35px rgba(255,80,0,0.25)',
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </h1>

          {/* Glow de calor no chão */}
          {phase === 'ember' && (
            <div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,100,0,0.18) 0%, transparent 70%)',
                filter: 'blur(10px)',
              }}
            />
          )}
        </div>

        {/* Authentic Style */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-semibold text-sm md:text-lg lg:text-xl text-terracota tracking-[0.4em] uppercase mb-4"
        >
          {subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="text-sm md:text-base text-offwhite/50 font-body max-w-md mx-auto mb-10"
        >
          {config?.hero_description || 'Para quem vive o estilo autêntico'}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/produtos"
            className="group flex items-center gap-2 bg-terracota hover:bg-[#c26640] text-white font-heading font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(166,84,50,0.4)]"
          >
            Ver Coleção
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/produtos?filter=new"
            className="glass px-8 py-4 rounded-xl text-offwhite font-heading font-bold hover:bg-white/10 transition-all"
          >
            Novidades
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-offwhite/30 font-body tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-terracota/60 to-transparent"
        />
      </motion.div>

      {/* CSS puro para sparks */}
      <style>{`
        @keyframes spark-rise {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translateY(-90px) translateX(var(--spark-dx, 12px)) scale(0.2); opacity: 0; }
        }
        .spark {
          position: absolute;
          bottom: 10px;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          animation: spark-rise 2s ease-out infinite;
          will-change: transform, opacity;
        }
        .spark:nth-child(odd)  { --spark-dx:  18px; }
        .spark:nth-child(even) { --spark-dx: -14px; }
      `}</style>
    </section>
  );
}