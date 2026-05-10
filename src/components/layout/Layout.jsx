import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFAB from './WhatsAppFAB';
import CartDrawer from './CartDrawer';

export default function Layout() {
  const { data: configs } = useQuery({
    queryKey: ['site-config'],
    queryFn: () => base44.entities.SiteConfig.list(),
  });

  const config = configs?.[0];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <CartDrawer />
      <main>
        <Outlet context={{ config }} />
      </main>
      <Footer config={config} />
      <WhatsAppFAB whatsappNumber={config?.whatsapp_number} />
    </div>
  );
}