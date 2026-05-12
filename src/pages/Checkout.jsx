import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Lock } from 'lucide-react';
import useCartStore from '@/lib/cartStore';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

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
  const [pixData, setPixData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onPaymentSubmit = async ({ selectedPaymentMethod, formData }) => {
    if (!items.length) return;
    setLoading(true);

    try {
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
            name: form.name || formData?.payer?.first_name || 'Cliente',
            email: form.email || formData?.payer?.email,
          },
          paymentData: {
            ...formData,
            payment_method_id: selectedPaymentMethod === 'pix' ? 'pix' : (formData?.payment_method_id || selectedPaymentMethod),
          },
        }),
      });

      const paymentResult = await response.json();

      if (!response.ok) throw new Error(paymentResult.error || 'Erro ao processar pagamento');

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

      if (paymentResult.qr_code_base64) {
        setPixData(paymentResult);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // sobe pra ver o QR Code
      } else {
        clearCart();
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // sobe pra ver confirmação
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro no pagamento',
        description: error.message || 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPixSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-6 rounded-2xl border border-white/10 text-center"
    >
      <h2 className="font-heading font-black text-2xl text-offwhite mb-4">Pagamento via PIX</h2>
      <p className="text-muted-foreground font-body mb-6 text-sm">
        Escaneie o QR Code abaixo no app do seu banco. O valor total é{' '}
        <strong className="text-white">R$ {total.toFixed(2).replace('.', ',')}</strong>.
      </p>

      <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-xl border border-white/20">
        <img
          src={`data:image/jpeg;base64,${pixData.qr_code_base64}`}
          alt="QR Code PIX"
          className="w-48 h-48"
        />
      </div>

      <div className="space-y-4">
        <button
          onClick={() => {
            navigator.clipboard.writeText(pixData.qr_code);
            toast({ title: 'Copiado!', description: 'Chave PIX copiada para a área de transferência.' });
          }}
          className="w-full bg-terracota hover:bg-[#c26640] text-white font-heading font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Copiar Código PIX
        </button>

        <button
          onClick={() => {
            clearCart();
            setSuccess(true);
            setPixData(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full bg-white/5 hover:bg-white/10 text-offwhite font-heading font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Já realizei o pagamento
        </button>

        <button
          onClick={() => setPixData(null)}
          className="text-muted-foreground text-xs font-body hover:text-white transition-colors"
        >
          Alterar forma de pagamento
        </button>
      </div>
    </motion.div>
  );

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
              <h2 className="font-heading font-bold text-lg text-offwhite mb-6">Forma de Pagamento</h2>

              {pixData ? (
                renderPixSection()
              ) : (
                <div className="space-y-6">
                  {/* Seleção de método */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === 'credit_card'
                          ? 'border-terracota bg-terracota/10'
                          : 'border-white/10 bg-card hover:border-white/20'
                      }`}
                    >
                      <span className="text-xl">💳</span>
                      <span className="font-heading font-bold text-xs text-offwhite uppercase tracking-wider">Cartão</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === 'pix'
                          ? 'border-terracota bg-terracota/10'
                          : 'border-white/10 bg-card hover:border-white/20'
                      }`}
                    >
                      <span className="text-xl">💎</span>
                      <span className="font-heading font-bold text-xs text-offwhite uppercase tracking-wider">Pix</span>
                    </button>
                  </div>

                  {/* Cartão — usa o Brick do Mercado Pago */}
                  {paymentMethod === 'credit_card' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl overflow-hidden bg-white"
                    >
                      <Payment
                        key={form.email}
                        initialization={{
                          amount: total,
                          payer: {
                            email: form.email || 'contato@base44.com',
                          },
                        }}
                        customization={{
                          paymentMethods: {
                            creditCard: 'all',
                          },
                        }}
                        onSubmit={onPaymentSubmit}
                      />
                    </motion.div>
                  )}

                  {/* Pix — botão direto, sem formulário extra */}
                  {paymentMethod === 'pix' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {!form.email || !form.name ? (
                        <p className="text-xs text-terracota font-body text-center bg-terracota/5 p-3 rounded-lg border border-terracota/20">
                          ⚠️ Preencha seu Nome e E-mail acima para liberar o Pix.
                        </p>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground font-body text-center">
                            Clique abaixo para gerar seu QR Code Pix exclusivo.
                          </p>
                          <button
                            onClick={() =>
                              onPaymentSubmit({
                                selectedPaymentMethod: 'pix',
                                formData: {
                                  payment_method_id: 'pix',
                                  payer: {
                                    email: form.email,
                                    first_name: form.name.split(' ')[0],
                                  },
                                },
                              })
                            }
                            disabled={loading}
                            className="w-full bg-terracota hover:bg-[#c26640] disabled:opacity-50 text-white font-heading font-black text-lg py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(166,84,50,0.3)]"
                          >
                            {loading ? 'GERANDO...' : 'FINALIZAR COM PIX'}
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
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