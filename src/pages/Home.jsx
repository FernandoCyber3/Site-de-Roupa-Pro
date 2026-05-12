import { useOutletContext, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import HeroSection from '@/components/home/HeroSection';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import VideoShowcase from '@/components/home/VideoShowcase';
import BannerStrip from '@/components/home/BannerStrip';
import { motion } from 'framer-motion';

export default function Home() {
  const context = /** @type {any} */ (useOutletContext());
  const config = context?.config;
  
  // Preparado para o Sanity: só vai mostrar a faixa quando vier do banco
  const bannerText = config?.banner_text;

  const { data: products = [] } = useQuery({
    queryKey: ['products-home'],
    queryFn: () => base44.entities.Product.list('-created_date', 20),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order', 20),
  });

  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#categorias') {
      setTimeout(() => {
        const el = document.getElementById('categorias');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // Wait for content to render slightly
    }
  }, [location.hash, categories.length]);

  return (
    <div>
      {/* Hero */}

      {/* Hero */}
      <HeroSection config={config} />

      {/* Categories carousel */}
      <div id="categorias" className="scroll-mt-32">
        <CategoryCarousel categories={categories} />
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-5">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Featured products */}
      <FeaturedProducts products={products} />

      {/* Video Showcase — só aparece quando URLs estiverem configuradas no Sanity */}
      <VideoShowcase config={config} />

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-5">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Brand value strip */}
      <section className="py-20 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Frete Grátis', desc: 'Em compras acima de R$ 299', icon: '🚀' },
              { title: 'Qualidade Premium', desc: 'Tecidos exclusivos e duráveis', icon: '✦' },
              { title: 'Troca Fácil', desc: 'Até 30 dias sem questionamentos', icon: '↩' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-xl border border-white/8 bg-card"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-heading font-bold text-offwhite mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}