import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — rola a página para o topo toda vez que a rota muda.
 * Regra global: qualquer botão, produto ou link leva sempre ao topo da nova página.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll instantâneo para não dar impressão de "pular"
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // sem UI, apenas efeito colateral
}
