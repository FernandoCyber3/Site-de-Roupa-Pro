import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';

/**
 * VideoPanel — um painel de vídeo individual.
 * Estratégia de performance:
 *  - `preload="none"` — só carrega quando entra na viewport
 *  - IntersectionObserver via `whileInView` do Framer Motion
 *  - Vídeo começa mudo; usuário pode ativar o som
 */
function VideoPanel({ url, label, delay = 0 }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl overflow-hidden aspect-[9/16] md:aspect-[3/4] bg-card cursor-pointer group"
      onClick={handlePlay}
    >
      {/* Vídeo — preload=none para não pesar na carga inicial */}
      <video
        ref={videoRef}
        src={url}
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Botão play central — some quando playing */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
          >
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </motion.div>
        </div>
      )}

      {/* Legenda + controle de som */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between pointer-events-none">
        {label && (
          <p className="font-heading font-bold text-white text-base md:text-lg leading-tight max-w-[75%]">
            {label}
          </p>
        )}
        {/* Botão mute — pointer-events-auto para funcionar dentro do overlay */}
        <button
          onClick={toggleMute}
          className="pointer-events-auto p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Borda brilhante no hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 group-hover:ring-terracota/30 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
}

/**
 * VideoShowcase — seção de dois painéis de vídeo lado a lado.
 * Os vídeos são gerenciados pelo cliente via Sanity Studio (siteConfig).
 * Se não houver URL configurada, a seção não é renderizada (sem placeholder feio).
 */
export default function VideoShowcase({ config }) {
  const video1 = config?.feature_video_1;
  const video2 = config?.feature_video_2;
  const label1 = config?.feature_video_label_1 || 'Nova Coleção';
  const label2 = config?.feature_video_label_2 || 'Streetwear Exclusivo';

  // Só renderiza se pelo menos um vídeo estiver configurado
  if (!video1 && !video2) return null;

  return (
    <section className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-xs text-terracota font-body tracking-[0.25em] uppercase font-semibold mb-2">
            Em movimento
          </p>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-offwhite">
            Veja em Ação
          </h2>
        </motion.div>

        {/* Painéis de vídeo */}
        <div className={`grid gap-4 ${video1 && video2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-lg'}`}>
          {video1 && <VideoPanel url={video1} label={label1} delay={0} />}
          {video2 && <VideoPanel url={video2} label={label2} delay={0.12} />}
        </div>

        {/* Nota de gestão */}
        <p className="text-center text-xs text-white/20 font-body mt-6">
          Gerencie os vídeos em: Sanity Studio → Configurações do Site → Vídeo Destaque 1 / 2
        </p>
      </div>
    </section>
  );
}
