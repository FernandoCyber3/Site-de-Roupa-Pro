import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PLACEHOLDERS } from '@/lib/placeholders';

// DEFAULT_CATEGORIES — used only when no Category records exist in the DB.
// Each `image` field will be replaced by the Sanity URL when available.
const DEFAULT_CATEGORIES = [
  { name: 'Camisetas', slug: 'camisetas', image: PLACEHOLDERS.categories.camisetas },
  { name: 'Calças',    slug: 'calcas',    image: PLACEHOLDERS.categories.calcas },
  { name: 'Moletons',  slug: 'moletons',  image: PLACEHOLDERS.categories.moletons },
  { name: 'Tênis',     slug: 'tenis',     image: PLACEHOLDERS.categories.tenis },
  { name: 'Acessórios',slug: 'acessorios',image: PLACEHOLDERS.categories.acessorios },
  { name: 'Bonés',     slug: 'bones',     image: PLACEHOLDERS.categories.bones },
];

export default function CategoryCarousel({ categories }) {
  const scrollRef = useRef(null);
  const items = categories?.length ? categories : DEFAULT_CATEGORIES;

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs text-terracota font-body tracking-[0.25em] uppercase font-semibold mb-2">
              Explorar
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-offwhite">Categorias</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="p-2 rounded-xl border border-white/10 hover:border-terracota/40 text-muted-foreground hover:text-terracota transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="p-2 rounded-xl border border-white/10 hover:border-terracota/40 text-muted-foreground hover:text-terracota transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((cat, i) => (
            <motion.div
              key={cat.id || cat.slug || cat.name}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0"
            >
              <Link
                to={`/produtos?category=${cat.slug || cat.name}`}
                className="group flex flex-col items-center gap-3"
              >
                {/* Spherical category with gradient border */}
                <div className="relative w-24 h-24 md:w-28 md:h-28">
                  {/* Animated gradient ring */}
                  <div
                    className="absolute inset-0 rounded-full p-[2px]"
                    style={{
                      background: 'linear-gradient(135deg, #A65432, #F2E9D0, #A65432)',
                      animation: 'spin 4s linear infinite',
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-background" />
                  </div>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-[2px] rounded-full object-cover w-[calc(100%-4px)] h-[calc(100%-4px)] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-sm font-body font-medium text-muted-foreground group-hover:text-offwhite transition-colors text-center">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </section>
  );
}