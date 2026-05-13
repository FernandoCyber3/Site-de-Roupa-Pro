import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import useCartStore from '@/lib/cartStore';
import GlowCard from '@/components/ui/GlowCard';
import { resolveImage } from '@/lib/placeholders';
import { useToast } from '@/components/ui/use-toast';

// Magnetic button hook — cursor pulls button toward pointer
function useMagnetic(strength = 0.3) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  return { ref, offset, handleMouseMove, handleMouseLeave };
}

export default function ProductCard({ product, index = 0 }) {
  const [hovering, setHovering] = useState(false);
  const [touched, setTouched] = useState(false); // mobile tap state
  const [videoError, setVideoError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const magnetic = useMagnetic(0.25);
  const { toast } = useToast();

  const showVideo = (hovering || touched) && product.video_url && !videoError;

  const price = product.promo_price || product.price;
  const hasPromo = product.promo_price && product.promo_price < product.price;
  const defaultSize = product.variants?.[0]?.size || 'M';
  const defaultColor = product.variants?.[0]?.color || '';
  // resolveImage falls back to PLACEHOLDERS.product until Sanity URL is provided
  const image = resolveImage(product.images?.[0]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, defaultSize, defaultColor);
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.title} - Tam: ${defaultSize}`,
    });
  };

  return (
    // Stagger entrance via Intersection Observer (whileInView)
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlowCard className="overflow-hidden group h-full flex flex-col">
        <Link to={`/produto/${product.id}`} className="flex-1 flex flex-col">
          {/* Image / Video area */}
          <div
            className="relative aspect-[3/4] overflow-hidden bg-muted"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onTouchStart={() => setTouched((v) => !v)}
          >
            {/* Main image */}
            <motion.img
              src={image}
              alt={product.title}
              loading="lazy"
              animate={{ opacity: showVideo ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Video — autoplay on hover (desktop) or tap (mobile) */}
            {product.video_url && showVideo && (
              <motion.video
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.video_url}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onError={() => setVideoError(true)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Mobile tap hint — só aparece quando há vídeo e em touch */}
            {product.video_url && touched && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-body">
                toque para pausar
              </div>
            )}

            {/* Promo badge */}
            {hasPromo && (
              <div className="absolute top-3 left-3 bg-terracota text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide uppercase">
                Promo
              </div>
            )}

            {/* Wishlist */}
            <button className="absolute top-3 right-3 p-1.5 rounded-lg glass opacity-0 group-hover:opacity-100 transition-opacity hover:text-terracota">
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-[10px] text-terracota font-body uppercase tracking-widest mb-1 truncate">{product.category}</p>
            <h3 className="font-heading font-semibold text-offwhite text-sm leading-tight mb-2 truncate">
              {product.title}
            </h3>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base text-offwhite">
                  R$ {price?.toFixed(2).replace('.', ',')}
                </span>
                {hasPromo && (
                  <span className="text-xs text-muted-foreground line-through">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* Magnetic Add to Cart button */}
        <div className="px-4 pb-4">
          <motion.button
            ref={magnetic.ref}
            onMouseMove={magnetic.handleMouseMove}
            onMouseLeave={magnetic.handleMouseLeave}
            onClick={handleAddToCart}
            animate={{ x: magnetic.offset.x, y: magnetic.offset.y }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-terracota border border-white/10 hover:border-terracota text-offwhite font-heading font-semibold text-sm py-3 rounded-xl transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
            Add ao Carrinho
          </motion.button>
        </div>
      </GlowCard>
    </motion.div>
  );
}