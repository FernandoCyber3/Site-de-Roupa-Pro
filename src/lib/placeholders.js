/**
 * PLACEHOLDER ASSETS
 * Substitua estas URLs pelas URLs reais do Sanity.io quando disponíveis.
 * Padrão: imageUrl ?? PLACEHOLDERS.product
 */

export const LOGO_URL = 'https://media.base44.com/images/public/69f2cedc24b277abad40699b/9d5c17318_squad.jpg';

export const PLACEHOLDERS = {
  // Hero background (streetwear crowd)
  hero: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1600&q=80&auto=format&fit=crop',

  // Product fallback
  product: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80&auto=format&fit=crop',

  // Category thumbnails (keyed by slug)
  categories: {
    camisetas: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80',
    calcas:    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
    moletons:  'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80',
    tenis:     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    acessorios:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    bones:     'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80',
  },
};

/** Helper: returns the first truthy URL or the product placeholder */
export function resolveImage(url) {
  return url || PLACEHOLDERS.product;
}