import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Lock } from 'lucide-react';
import useCartStore from '@/lib/cartStore';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

// Segurança: Inicializa o Mercado Pago usando a Chave Pública (Segura para Frontend)
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'pt-BR' });

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    number: '',
    neighborhood: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pixData, setPixData] = useState(null); // Para guardar o QR Code do PIX

  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // O onSubmit agora é chamado pelo Brick do Mercado Pago
  const onPaymentSubmit = async ({ selectedPaymentMethod, formData }) => {
    if (!items.length) return;
    setLoading(true);

    try {
      // 1. Enviar para a nossa API Serverless Segura
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.productId,
            title: i.title,
            quantity: i.quantity,
          })),
          customer: {
            name: form.name || formData.payer.first_name || 'Cliente',
            email: form.email || formData.payer.email,
          },
          paymentData: formData // Envia o token do cartão, parcelas, etc gerados pelo Brick
        }),
      });

      const paymentResult = await response.json();

      if (!response.ok) throw new Error(paymentResult.error || 'Erro ao processar pagamento');

      // 2. Salvar o pedido no Sanity
      await base44.entities.Order.create({
        items: items.map((i) => ({
          product_id: i.productId,
          title: i.title,
          price: i.price,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          image: i.image,
        })),
        total,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: `${form.address}, ${form.number} - ${form.neighborhood}`,
        payment_method: selectedPaymentMethod,
        payment_id: paymentResult.id?.toString(),
        status: paymentResult.status === 'approved' ? 'paid' : 'pending',
      });

      // 3. Sucesso ou Tela do PIX
      if (paymentResult.qr_code_base64) {
        setPixData(paymentResult);
      } else {
        clearCart();
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro no pagamento",
        description: error.message || "Tente novamente em instantes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (pixData) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md bg-card p-8 rounded-2xl border border-white/10"
        >
          <h1 className="font-heading font-black text-3xl text-offwhite mb-3">Escaneie o QR Code</h1>
          <p className="text-muted-foreground font-body mb-6 text-sm">
            Abra o app do seu banco e escaneie o código abaixo ou copie a chave PIX para finalizar sua compra de <strong className="text-white">R$ {total.toFixed(2).replace('.', ',')}</strong>.
          </p>
          <img 
            src={`data:image/jpeg;base64,${pixData.qr_code_base64}`} 
            alt="QR Code PIX" 
            className="w-48 h-48 mx-auto mb-6 rounded-lg shadow-lg border border-white/20" 
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(pixData.qr_code);
              toast({ title: 'Copiado!', description: 'Chave PIX copiada para a área de transferência.' });
            }}
            className="w-full bg-terracota hover:bg-[#c26640] text-white font-heading font-bold px-8 py-3 rounded-xl transition-colors mb-4"
          >
            Copiar Código PIX
          </button>
          <button
            onClick={() => {
              clearCart();
              setSuccess(true);
              setPixData(null);
            }}
            className="text-muted-foreground text-sm font-body hover:text-white transition-colors"
          >
            Já realizei o pagamento
          </button>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-6">✅</div>
          <h1 className="font-heading font-black text-3xl text-offwhite mb-3">Pedido Realizado!</h1>
          <p className="text-muted-foreground font-body mb-2">
            Obrigado pela sua compra, <strong className="text-offwhite">{form.name || 'Cliente'}</strong>!
          </p>
          <p className="text-sm text-muted-foreground font-body mb-8">
            Acompanhe o status do seu pedido pelo e-mail fornecido.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-terracota hover:bg-[#c26640] text-white font-heading font-bold px-8 py-4 rounded-xl transition-colors"
          >
            Voltar à Loja
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center px-5">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <p className="font-heading font-bold text-xl text-offwhite mb-3">Carrinho vazio</p>
          <Link to="/produtos" className="text-terracota text-sm hover:underline font-body">
            ← Ver produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-5">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/produtos"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-offwhite transition-colors font-body mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continuar comprando
        </Link>

        <h1 className="font-heading font-black text-4xl text-offwhite mb-10">Finalizar Pedido</h1>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Form */}
          {/* Form */}
          <div className="space-y-5">
            <h2 className="font-heading font-bold text-lg text-offwhite">Dados de Entrega</h2>

            {[
              { key: 'name', label: 'Nome completo', type: 'text', required: true },
              { key: 'email', label: 'E-mail', type: 'email', required: true },
              { key: 'phone', label: 'WhatsApp / Telefone', type: 'tel', required: true },
              { key: 'address', label: 'Endereço (Rua)', type: 'text', required: true },
              { key: 'number', label: 'Número', type: 'text', required: true },
              { key: 'neighborhood', label: 'Bairro', type: 'text', required: true },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs text-muted-foreground font-body uppercase tracking-widest mb-2">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  required={f.required}
                  value={form[f.key]}
                  onChange={(e) => handle(f.key, e.target.value)}
                  className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-offwhite font-body text-sm focus:outline-none focus:border-terracota/50 transition-colors"
                />
              </div>
            ))}

            <div className="mt-8 pt-6 border-t border-white/10">
              <h2 className="font-heading font-bold text-lg text-offwhite mb-4">Pagamento Seguro</h2>
              
              {/* O Brick mágico do Mercado Pago! */}
              <div className="rounded-xl overflow-hidden bg-white">
                <Payment
                  initialization={{ amount: total }}
                  customization={{
                    paymentMethods: {
                      pix: 'all',
                      creditCard: 'all',
                      bankTransfer: 'all'
                    },
                  }}
                  onSubmit={onPaymentSubmit}
                  onError={(error) => console.error('Erro no Brick:', error)}
                />
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-offwhite">Resumo do Pedido</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3 p-3 rounded-xl border border-white/8 bg-card">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-sm text-offwhite truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground font-body">{item.size} · {item.color}</p>
                    <p className="text-xs text-terracota font-bold mt-1">
                      {item.quantity}x R$ {item.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-muted-foreground font-body">Total</span>
              <span className="font-heading font-black text-2xl text-offwhite">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-body flex items-center gap-2">
              <Lock className="w-3 h-3 text-terracota" />
              Pagamento 100% seguro
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}