import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import useCartStore from '@/lib/cartStore';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getTotal } = useCartStore();

  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-heavy flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-terracota" />
                <h2 className="font-heading font-bold text-lg text-offwhite">Meu Carrinho</h2>
              </div>
              <button onClick={closeCart} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 gap-4 text-center"
                  >
                    <ShoppingBag className="w-12 h-12 text-white/10" />
                    <p className="text-muted-foreground font-body">Seu carrinho está vazio</p>
                    <button onClick={closeCart} className="text-sm text-terracota underline font-body">
                      Continuar comprando
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="flex gap-4 p-3 rounded-xl border border-white/8 bg-white/3"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-sm text-offwhite truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground font-body mt-0.5">
                          {item.size} · {item.color}
                        </p>
                        <p className="text-sm font-bold text-terracota mt-1">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </p>
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-body w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.key)}
                        className="p-1.5 self-start rounded-lg hover:bg-white/10 text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-muted-foreground">Total</span>
                  <span className="font-heading font-bold text-xl text-offwhite">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center bg-terracota hover:bg-[#c26640] text-white font-heading font-bold py-4 rounded-xl transition-colors tracking-wide"
                >
                  Finalizar Pedido
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center text-sm text-muted-foreground hover:text-offwhite transition-colors font-body"
                >
                  Continuar comprando
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}