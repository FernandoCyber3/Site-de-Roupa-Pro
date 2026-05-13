import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFAB from './WhatsAppFAB';
import CartDrawer from './CartDrawer';
import PWAInstallPrompt from './PWAInstallPrompt';

export default function Layout() {
  const location = useLocation();
  const { data: configs } = useQuery({
    queryKey: ['site-config'],
    queryFn: () => base44.entities.SiteConfig.list(),
  });

  const config = configs?.[0];

  return (
    <div className="min-h-screen bg-background font-body overflow-x-hidden">
      <Navbar config={config} />
      <CartDrawer />
      <PWAInstallPrompt />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet context={{ config }} />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer config={config} />
      <WhatsAppFAB whatsappNumber={config?.whatsapp_number} />
    </div>
  );
}