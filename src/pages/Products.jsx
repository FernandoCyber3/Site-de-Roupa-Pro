import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { useLocation } from 'react-router-dom';

const SIZES = ['P', 'M', 'G', 'GG'];
const SORT_OPTIONS = [
  { label: 'Mais Recentes', value: '-created_date' },
  { label: 'Menor Preço', value: 'price' },
  { label: 'Maior Preço', value: '-price' },
];

export default function Products() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialCategory = urlParams.get('category') || '';
  const initialFilter = urlParams.get('filter') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSize, setActiveSize] = useState('');
  const [sort, setSort] = useState('-created_date');
  const [showPromo, setShowPromo] = useState(initialFilter === 'sale');
  const [filterOpen, setFilterOpen] = useState(false);

  // Sync state when URL params change (e.g. clicking links in Navbar while already on /produtos)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    const category = params.get('category');

    if (filter === 'sale') {
      setShowPromo(true);
      setActiveCategory('');
    } else if (filter === 'new') {
      setSort('-created_date');
      setShowPromo(false);
      setActiveCategory('');
    } else if (category) {
      setActiveCategory(category);
      setShowPromo(false);
    } else if (!filter && !category) {
      setShowPromo(false);
      setActiveCategory('');
    }
  }, [location.search]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-all'],
    queryFn: () => base44.entities.Product.list('-created_date', 100),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order', 20),
  });

  // O(n) filter pass
  const filtered = useMemo(() => {
    let result = [...products].filter((p) => p.status !== 'draft');
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (showPromo) result = result.filter((p) => p.promo_price && p.promo_price < p.price);
    if (activeSize)
      result = result.filter((p) => p.variants?.some((v) => v.size === activeSize && v.stock > 0));

    // Sort
    result.sort((a, b) => {
      if (sort === 'price') return Number(a.price) - Number(b.price);
      if (sort === '-price') return Number(b.price) - Number(a.price);
      return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
    });

    return result;
  }, [products, activeCategory, showPromo, activeSize, sort]);

  const allCategories = useMemo(() => {
    if (categories.length) return categories.map((c) => ({ name: c.name, slug: c.slug || c.name }));
    // Derive from products if no categories entity
    const names = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return names.map((n) => ({ name: n, slug: n }));
  }, [categories, products]);

  // Ordem correta para tamanhos em letras
  const LETTER_ORDER = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'G1', 'G2', 'G3'];

  // Dynamic sizes based on available products and category
  const sizeGroups = useMemo(() => {
    // Pegar todos os tamanhos dos produtos filtrados pela categoria atual (mas sem o filtro de tamanho aplicado)
    const categoryProducts = activeCategory
      ? products.filter(p => p.category === activeCategory)
      : products;

    const allSizes = [...new Set(categoryProducts.flatMap(p => p.variants?.map(v => v.size) || []))].filter(Boolean);

    const letters = allSizes
      .filter(s => isNaN(parseInt(s)))
      .sort((a, b) => {
        const indexA = LETTER_ORDER.indexOf(a.toUpperCase());
        const indexB = LETTER_ORDER.indexOf(b.toUpperCase());
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        return a.localeCompare(b);
      });

    const numbers = allSizes
      .filter(s => !isNaN(parseInt(s)))
      .sort((a, b) => parseInt(a) - parseInt(b));

    return { letters, numbers };
  }, [products, activeCategory]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-xs text-terracota font-body tracking-[0.25em] uppercase font-semibold mb-2">
            Todas as Peças
          </p>
          <h1 className="font-heading font-black text-4xl md:text-5xl text-offwhite">Catálogo</h1>
        </motion.div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Category pills */}
          <button
            onClick={() => setActiveCategory('')}
            className={`px-4 py-1.5 rounded-full text-sm font-body border transition-all ${!activeCategory
                ? 'bg-terracota border-terracota text-white'
                : 'border-white/15 text-muted-foreground hover:border-terracota/50 hover:text-offwhite'
              }`}
          >
            Todos
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                setActiveCategory(activeCategory === cat.slug ? '' : cat.slug);
                setShowPromo(false); // Clear outlet when selecting a specific category
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-body border transition-all ${activeCategory === cat.slug
                  ? 'bg-terracota border-terracota text-white'
                  : 'border-white/15 text-muted-foreground hover:border-terracota/50 hover:text-offwhite'
                }`}
            >
              {cat.name}
            </button>
          ))}

          {/* Promo toggle */}
          <button
            onClick={() => {
              setShowPromo(!showPromo);
              if (!showPromo) setActiveCategory(''); // Clear category when entering outlet
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-body border transition-all ${showPromo
                ? 'bg-terracota border-terracota text-white'
                : 'border-white/15 text-muted-foreground hover:border-terracota/50 hover:text-offwhite'
              }`}
          >
            Outlet
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Letters Group */}
              {sizeGroups.letters.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setActiveSize(activeSize === sz ? '' : sz)}
                  className={`w-10 h-10 flex items-center justify-center text-[13px] font-heading font-bold rounded-xl border transition-all duration-300 ${activeSize === sz
                      ? 'bg-offwhite border-offwhite text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                      : 'border-white/10 text-muted-foreground hover:border-white/30 hover:text-offwhite'
                    }`}
                >
                  {sz}
                </button>
              ))}

              {/* Minimalist Separator */}
              {sizeGroups.letters.length > 0 && sizeGroups.numbers.length > 0 && (
                <div className="w-[1px] h-6 bg-white/10 mx-2" />
              )}

              {/* Numbers Group */}
              {sizeGroups.numbers.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setActiveSize(activeSize === sz ? '' : sz)}
                  className={`w-10 h-10 flex items-center justify-center text-[13px] font-heading font-bold rounded-xl border transition-all duration-300 ${activeSize === sz
                      ? 'bg-offwhite border-offwhite text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                      : 'border-white/10 text-muted-foreground hover:border-white/30 hover:text-offwhite'
                    }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-card border border-white/10 text-sm text-muted-foreground rounded-lg px-3 py-2 font-body focus:outline-none focus:border-terracota/50"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-muted-foreground font-body mb-6">
          {isLoading ? 'Carregando...' : `${filtered.length} produto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">👕</p>
            <p className="font-heading font-bold text-xl text-offwhite mb-2">Nenhum produto encontrado</p>
            <p className="text-muted-foreground font-body text-sm">Tente remover alguns filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}