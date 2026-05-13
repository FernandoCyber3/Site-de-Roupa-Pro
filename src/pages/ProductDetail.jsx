import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import useCartStore from '@/lib/cartStore';
import GlowCard from '@/components/ui/GlowCard';
import ProductCard from '@/components/products/ProductCard';
import { resolveImage } from '@/lib/placeholders';
import { useToast } from '@/components/ui/use-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImg, setCurrentImg] = useState(0);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const results = await base44.entities.Product.filter({ id });
      return results[0];
    },
    enabled: !!id,
  });

  const { data: relatedRaw = [] } = useQuery({
    queryKey: ['products-related', product?.category],
    queryFn: () => base44.entities.Product.filter({ category: product?.category }),
    enabled: !!product?.category,
  });

  const related = relatedRaw.filter((p) => p.id !== id && p.status !== 'draft').slice(0, 4);

  const handleAddToCart = () => {
    if (!product) return;
    const size = selectedSize || sizes[0] || 'M';
    const color = selectedColor || colors[0] || '';
    
    // Encontrar a imagem correta para esta variante
    const variant = product.variants?.find(v => v.color === color && v.size === size) 
                   || product.variants?.find(v => v.color === color);
    const variantImage = variant?.image || images[currentImg] || product.images?.[0];

    addItem(product, size, color, variantImage);
    setAdded(true);
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.title} - Tam: ${size}`,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  // Unique colors available
  const colors = useMemo(() => {
    return [...new Set(product?.variants?.map((v) => v.color).filter(Boolean) || [])];
  }, [product]);

  // Unique sizes filtered by selected color
  const sizes = useMemo(() => {
    const relevantVariants = selectedColor 
      ? product?.variants?.filter(v => v.color === selectedColor)
      : product?.variants;
    
    return [...new Set(relevantVariants?.map((v) => v.size) || [])];
  }, [product, selectedColor]);
  
  // Combine gallery images with variant-specific images
  const images = useMemo(() => {
    const gallery = product?.images || [];
    const variantImages = product?.variants
      ?.map(v => v.image)
      .filter(Boolean) || [];
    // Remove duplicates
    return [...new Set([...gallery, ...variantImages])];
  }, [product]);

  // Handle image change and sync color
  const handleImageChange = (index) => {
    setCurrentImg(index);
    const targetImageUrl = images[index];
    
    // Find if this image belongs to a specific color
    const variantWithThisImage = product?.variants?.find(v => 
      v.colorImages?.includes(targetImageUrl)
    );

    if (variantWithThisImage?.color && variantWithThisImage.color !== selectedColor) {
      // Find available sizes for this color to update state correctly
      const availableSizes = product?.variants
        ?.filter(v => v.color === variantWithThisImage.color)
        .map(v => v.size) || [];
      
      setSelectedColor(variantWithThisImage.color);
      if (selectedSize && !availableSizes.includes(selectedSize)) {
        setSelectedSize('');
      }
    }
  };

  // Auto-switch image when color is selected
  const handleColorChange = (color) => {
    setSelectedColor(color);
    
    // Find available sizes for this new color
    const availableSizes = product?.variants
      ?.filter(v => v.color === color)
      .map(v => v.size) || [];
    
    // If current selected size is not in the new list, reset it
    if (selectedSize && !availableSizes.includes(selectedSize)) {
      setSelectedSize('');
    }

    if (product?.variants) {
      const variant = product.variants.find(v => v.color === color && v.image);
      if (variant?.image) {
        const imgIndex = images.indexOf(variant.image);
        if (imgIndex !== -1) setCurrentImg(imgIndex);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 px-5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] rounded-2xl bg-card animate-pulse" />
          <div className="space-y-4 pt-8">
            {[40, 60, 30, 80, 40].map((w, i) => (
              <div key={i} className={`h-5 w-${w} rounded bg-card animate-pulse`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-heading font-bold text-xl text-offwhite">Produto não encontrado</p>
          <Link to="/produtos" className="text-terracota text-sm mt-4 inline-block hover:underline">
            ← Voltar para coleções
          </Link>
        </div>
      </div>
    );
  }

  const price = product.promo_price || product.price;
  const hasPromo = product.promo_price && product.promo_price < product.price;

  return (
    <div className="min-h-screen pt-32 pb-20 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Link
          to="/produtos"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-offwhite transition-colors font-body mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para coleções
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            {/* Main image */}
            <div 
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-card touch-pan-y"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                window.swipeStartX = touch.clientX;
              }}
              onTouchEnd={(e) => {
                const touch = e.changedTouches[0];
                const deltaX = touch.clientX - (window.swipeStartX || 0);
                if (Math.abs(deltaX) > 50) { // Threshold for swipe
                  if (deltaX > 0) {
                    handleImageChange(Math.max(0, currentImg - 1));
                  } else {
                    handleImageChange(Math.min(images.length - 1, currentImg + 1));
                  }
                }
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImg}
                  src={resolveImage(images[currentImg])}
                  alt={product.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Prev/Next */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageChange(Math.max(0, currentImg - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 glass rounded-lg hover:bg-white/15 transition-colors"
                    disabled={currentImg === 0}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleImageChange(Math.min(images.length - 1, currentImg + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 glass rounded-lg hover:bg-white/15 transition-colors"
                    disabled={currentImg === images.length - 1}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={`${i}-${img}`}
                    onClick={() => handleImageChange(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === currentImg ? 'border-terracota' : 'border-transparent opacity-50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs text-terracota font-body tracking-[0.25em] uppercase font-semibold mb-3">
              {product.category}
            </p>
            <h1 className="font-heading font-black text-3xl md:text-4xl text-offwhite mb-4 leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-heading font-black text-3xl text-offwhite">
                R$ {(price || 0).toFixed(2).replace('.', ',')}
              </span>
              {hasPromo && (
                <span className="text-lg text-muted-foreground line-through font-body">
                  R$ {(product?.price || 0).toFixed(2).replace('.', ',')}
                </span>
              )}
              {hasPromo && (
                <span className="bg-terracota text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  -{Math.round((((product?.price || 0) - (product?.promo_price || 0)) / (product?.price || 1)) * 100)}%
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body mb-3">
                  Cor: <span className="text-offwhite">{selectedColor || colors[0]}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((c, i) => (
                    <button
                      key={`${i}-${c}`}
                      onClick={() => handleColorChange(c)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-body border transition-all ${
                        (selectedColor || colors[0]) === c
                          ? 'border-terracota bg-terracota/10 text-terracota'
                          : 'border-white/15 text-muted-foreground hover:border-white/30'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body mb-3">
                  Tamanho
                </p>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((sz, i) => {
                    const isSelected = (selectedSize || sizes[0]) === sz;
                    return (
                      <button
                        key={`${i}-${sz}`}
                        onClick={() => {
                          setSelectedSize(sz);
                          // Se esse tamanho não estiver disponível na cor atual, muda para uma cor que tenha
                          const currentVariant = product.variants?.find(v => v.size === sz && v.color === (selectedColor || colors[0]));
                          if (!currentVariant) {
                            const availableColor = product.variants?.find(v => v.size === sz)?.color;
                            if (availableColor) handleColorChange(availableColor);
                          }
                        }}
                        className={`w-12 h-12 rounded-xl text-sm font-heading font-bold border transition-all ${
                          isSelected
                            ? 'border-terracota bg-terracota text-white'
                            : 'border-white/15 text-muted-foreground hover:border-terracota/50'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-3 py-4 rounded-xl font-heading font-bold text-base transition-all duration-300 ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-terracota hover:bg-[#c26640] text-white hover:shadow-[0_0_30px_rgba(166,84,50,0.4)]'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {added ? '✓ Adicionado!' : 'Adicionar ao Carrinho'}
            </motion.button>

            {/* Trust signals */}
            <div className="flex gap-6 mt-6 pt-6 border-t border-white/8">
              {['🚀 Frete Grátis acima de R$299', '↩ Troca em 30 dias', '🔒 Compra Segura'].map((t) => (
                <span key={t} className="text-xs text-muted-foreground font-body">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-black text-2xl text-offwhite">Você também pode gostar</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}