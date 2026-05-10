import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import useCartStore from '@/lib/cartStore';
import { LOGO_URL } from '@/lib/placeholders';

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const itemCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const location = useLocation();

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setVisible(current < 50 || current < lastScrollY.current);
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleLinkClick = (e, to) => {
    if (to === '/') {
      if (location.pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (to === '/#categorias') {
      if (location.pathname === '/') {
        e.preventDefault();
        document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' });
        // Update URL hash without jumping
        window.history.pushState(null, '', '/#categorias');
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const links = [
    { label: 'Início', to: '/' },
    { label: 'Categorias', to: '/#categorias' },
    { label: 'Catálogo', to: '/produtos' },
    { label: 'Novidades', to: '/produtos?filter=new' },
    { label: 'Outlet', to: '/produtos?filter=sale' },
  ];

  return (
    <motion.header
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Glassmorphism bar */}
      <div className="glass-heavy mx-3 mt-[37px] rounded-2xl px-5 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">

          {/* Logo — swap LOGO_URL for Sanity asset URL when available */}
          <Link to="/" onClick={(e) => handleLinkClick(e, '/')} className="flex items-center gap-2 group">
            <motion.div
              key={location.pathname === '/' ? 'home' : 'other'}
              initial={location.pathname === '/' ? { opacity: 0, scale: 0.8 } : false}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
            >
              <img
                src={LOGO_URL}
                alt="SQUAD Authentic Style"
                className="h-14 md:h-16 w-auto object-contain transition-all"
              />
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={(e) => handleLinkClick(e, l.to)}
                className="text-sm font-body font-medium text-foreground/70 hover:text-offwhite transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-terracota group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-offwhite" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-terracota text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="w-5 h-5 text-offwhite" /> : <Menu className="w-5 h-5 text-offwhite" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="glass-heavy mx-3 mt-2 rounded-2xl px-5 py-4 flex flex-col gap-4"
          >
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={(e) => handleLinkClick(e, l.to)}
                className="font-body text-base font-medium text-foreground/80 hover:text-offwhite py-1"
              >
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}