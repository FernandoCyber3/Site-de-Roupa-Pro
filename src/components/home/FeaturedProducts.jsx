import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

export default function FeaturedProducts({ products = [] }) {
  const featured = products.filter((p) => p.featured && p.status === 'active').slice(0, 8);
  const display = featured.length > 0 ? featured : products.filter((p) => p.status !== 'draft').slice(0, 8);

  if (!display.length) return null;

  return (
    <section className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs text-terracota font-body tracking-[0.25em] uppercase font-semibold mb-2">
              Destaques
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-offwhite">
              Mais Vendidos
            </h2>
          </div>
          <Link
            to="/produtos"
            className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-terracota transition-colors font-body group"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {display.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            to="/produtos"
            className="flex items-center gap-2 text-sm text-terracota border border-terracota/40 px-6 py-3 rounded-xl font-body hover:bg-terracota/10 transition-colors"
          >
            Ver todos os produtos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}