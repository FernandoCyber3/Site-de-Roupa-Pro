import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PLACEHOLDERS } from '@/lib/placeholders';

export default function HeroSection({ config }) {
  const containerRef = useRef(null);

  // Mouse tilt for 3D text effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-8, 8]), springConfig);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const title = config?.hero_title || 'Authentic Style';
  const subtitle = config?.hero_subtitle || 'Para quem vive o estilo autêntico';
  const videoUrl = config?.hero_video_url;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background media */}
      {videoUrl ? (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        /* PLACEHOLDER — substitua hero_video_url ou hero_image no SiteConfig pelo asset do Sanity */
        <img
          src={PLACEHOLDERS.hero}
          alt="SQUAD Authentic Style"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* 3D Tilt text */}
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="relative z-10 text-center px-5 max-w-4xl mx-auto"
      >
        {/* SQUAD badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-terracota animate-pulse" />
          <span className="text-xs text-terracota font-body tracking-[0.25em] uppercase font-semibold">
            SQUAD
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-black text-5xl md:text-7xl lg:text-8xl text-offwhite leading-none tracking-tight mb-4"
        >
          {title}
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="text-base md:text-lg text-offwhite/60 font-body max-w-md mx-auto mb-10"
        >
          {subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-offwhite/30 font-body tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-terracota/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}