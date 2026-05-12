import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      console.log('PWA: beforeinstallprompt disparado!');
      // Previne o mini-infobar padrão do Chrome
      e.preventDefault();
      // Guarda o evento para ser disparado depois
      setDeferredPrompt(e);
      
      // Verifica se o usuário já fechou o prompt nesta sessão
      const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      console.log('PWA: Prompt já foi fechado nesta sessão?', isDismissed);
      
      if (!isDismissed) {
        // Mostra o nosso prompt customizado após um delay (8 segundos conforme pedido)
        console.log('PWA: Agendando exibição do prompt para 8s...');
        setTimeout(() => {
          console.log('PWA: Mostrando prompt agora!');
          setShowPrompt(true);
        }, 8000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Mostra o prompt nativo
    deferredPrompt.prompt();
    
    // Espera pela escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Limpa o evento guardado
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-5 right-5 z-[100] md:left-auto md:right-8 md:bottom-8 md:w-80"
        >
          <div className="glass-heavy p-5 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-terracota/20 blur-3xl rounded-full group-hover:bg-terracota/30 transition-colors" />
            
            <button 
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-offwhite transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-terracota flex items-center justify-center flex-shrink-0 shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-bold text-offwhite text-sm mb-1">
                  Instalar SQUAD
                </h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed mb-4">
                  Adicione o atalho à sua tela de início para uma experiência mais rápida.
                </p>
                <button
                  onClick={handleInstall}
                  className="w-full py-2 bg-white text-black rounded-lg font-heading font-bold text-xs hover:bg-offwhite transition-all transform active:scale-95"
                >
                  Instalar Agora
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
