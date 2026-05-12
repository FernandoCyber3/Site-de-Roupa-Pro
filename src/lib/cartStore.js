import { create } from 'zustand';

// Cart store using a Map-like approach for O(1) lookups by cartKey
// cartKey = `${productId}_${size}_${color}` for unique variant identification
const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  // O(1) amortized add — find by composite key, increment or push
  addItem: (product, size, color, image) => {
    set((state) => {
      const key = `${product.id}_${size}_${color}`;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            key,
            productId: product.id,
            title: product.title,
            price: product.promo_price || product.price,
            image: image || product.images?.[0] || '',
            size,
            color,
            quantity: 1,
          },
        ],
      };
    });
  },

  removeItem: (key) => {
    set((state) => ({
      items: state.items.filter((i) => i.key !== key),
    }));
  },

  updateQuantity: (key, quantity) => {
    if (quantity <= 0) {
      get().removeItem(key);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.key === key ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  // O(n) total — single pass reduction
  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

export default useCartStore;