import { Link, useLocation } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import useCartStore from '@/lib/cartStore';

// Custom WhatsApp Icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.541 4.191 1.57 6.017L0 24l6.105-1.602a11.832 11.832 0 005.937 1.587h.005c6.637 0 12.032-5.396 12.035-12.03.001-3.217-1.248-6.242-3.522-8.514z" />
  </svg>
);

// Threads SVG icon (not in lucide)
const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.52.85-6.373 2.495-8.423C5.844 1.34 8.597.157 12.18.133h.006c2.87.02 5.244.792 7.053 2.293 1.747 1.449 2.855 3.51 3.291 6.12l-2.373.367c-.35-2.03-1.184-3.62-2.48-4.726C16.42 3.1 14.5 2.53 12.188 2.514c-2.852.02-5.04.921-6.503 2.683C4.26 6.877 3.5 9.252 3.5 12.068c0 2.815.76 5.19 2.185 6.87 1.463 1.762 3.651 2.663 6.503 2.684 1.963-.013 3.5-.456 4.703-1.36 1.41-1.058 2.15-2.699 2.15-4.74 0-.572-.052-1.107-.154-1.598-.365.136-.761.236-1.177.3-.977.154-1.974.107-2.89-.133-.925-.244-1.707-.703-2.254-1.33-.648-.742-.97-1.725-.956-2.934.015-1.24.41-2.27 1.17-3.06.713-.739 1.707-1.176 2.836-1.245 1.109-.068 2.112.241 2.913.897.823.672 1.365 1.67 1.613 2.974l.002.012c.232 1.237.151 2.532-.233 3.74a8.177 8.177 0 0 1-.476 1.143c.265.72.4 1.49.4 2.3 0 2.616-.979 4.733-2.828 6.118C17.08 23.42 14.875 24 12.186 24zm1.96-13.434c-.425.026-.813.2-1.09.487-.308.319-.468.767-.477 1.326-.01.743.175 1.29.566 1.725.374.416.93.677 1.648.775.735.1 1.46.06 2.092-.117a5.7 5.7 0 0 0 .9-.328c-.193-.927-.57-1.635-1.12-2.1-.513-.433-1.19-.807-2.52-.768z" />
  </svg>
);

export default function Footer({ config }) {
  const toggleCart = useCartStore((s) => s.toggleCart);
  const location = useLocation();

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
        window.history.pushState(null, '', '/#categorias');
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const socials = [
    { 
      icon: <Instagram className="w-5 h-5" />, 
      href: config?.instagram_url, 
      label: 'Instagram',
      color: 'hover:text-pink-500'
    },
    { 
      icon: <Facebook className="w-5 h-5" />, 
      href: config?.facebook_url, 
      label: 'Facebook',
      color: 'hover:text-blue-500'
    },
    { 
      icon: <ThreadsIcon />, 
      href: config?.threads_url, 
      label: 'Threads',
      color: 'hover:text-white'
    },
    {
      icon: <WhatsAppIcon />,
      href: config?.whatsapp_number ? `https://wa.me/${config.whatsapp_number}` : null,
      label: 'WhatsApp',
      color: 'hover:text-green-500'
    },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-5 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-heading font-black text-2xl text-offwhite tracking-widest uppercase">SQUAD</p>
            <p className="text-xs text-terracota tracking-[0.3em] uppercase font-body mt-0.5">Authentic Style</p>
          </div>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-xs">
            Para quem vive o estilo autêntico. Peças exclusivas, identidade única.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracota font-body mb-2">Navegação</p>
          {[
            { label: 'Categorias', to: '/#categorias' },
            { label: 'Catálogo', to: '/produtos' },
            { label: 'Novidades', to: '/produtos?filter=new' },
            { label: 'Outlet', to: '/produtos?filter=sale' },
            { label: 'Meu Carrinho', action: toggleCart },
          ].map((l) => (
            l.to ? (
              <Link key={l.label} to={l.to} onClick={(e) => handleLinkClick(e, l.to)} className="text-sm text-muted-foreground hover:text-offwhite transition-colors font-body w-fit">
                {l.label}
              </Link>
            ) : (
              <button key={l.label} onClick={l.action} className="text-sm text-muted-foreground hover:text-offwhite transition-colors font-body text-left w-fit">
                {l.label}
              </button>
            )
          ))}
        </div>

        {/* Socials */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracota font-body mb-2">Redes Sociais</p>
          <div className="flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={`p-2.5 rounded-xl border border-white/10 text-muted-foreground transition-all ${s.color} hover:border-current/40 hover:bg-white/5`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 px-5 py-5 text-center">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} SQUAD Authentic Style. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}