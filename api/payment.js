import { MercadoPagoConfig, Payment } from 'mercadopago';
import { z } from 'zod';
import { createClient } from '@sanity/client';

// Segurança: Isole as credenciais em Variáveis de Ambiente
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'SUA_CHAVE_DE_TESTE_AQUI',
  options: { timeout: 5000 }
});

// Inicializar Sanity Client para buscar preços REAIS (Blindagem contra adulteração no Frontend)
const sanityClient = createClient({
  projectId: 'p0fj0d8j',
  dataset: 'production',
  useCdn: false, // Em pagamentos, queremos os dados mais atualizados, sem cache!
  apiVersion: '2024-05-03',
  token: process.env.SANITY_API_TOKEN || '',
});

// Segurança: Data Integrity (Zod) - Validar o que vem do Frontend
const checkoutSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    cpf: z.string().optional(),
  }),
  paymentData: z.any()
});

export default async function handler(req, res) {
  // CORS & Security Headers básico para Vercel Functions
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Validar Payload do Cliente
    const body = checkoutSchema.parse(req.body);

    // 2. Buscar os produtos no Sanity usando os IDs e pegar o PREÇO REAL.
    // Isso garante que o usuário não inspecionou a rede e enviou preço = R$ 0,00.
    const ids = body.items.map(i => i.id);
    const query = `*[_type == "product" && _id in $ids]{_id, price, promo_price}`;
    const realProducts = await sanityClient.fetch(query, { ids });

    // Validar preço de cada item
    const validatedItems = body.items.map(item => {
      const realProduct = realProducts.find(p => p._id === item.id);
      if (!realProduct) throw new Error(`Produto não encontrado: ${item.title}`);

      // Garantir que o preço seja um número válido
      const priceToUse = Number(realProduct.promo_price || realProduct.price || 0);

      if (isNaN(priceToUse) || priceToUse <= 0) {
        throw new Error(`O produto ${item.title} está com preço inválido.`);
      }

      return {
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: priceToUse,
        currency_id: 'BRL',
      }
    });

    // 3. Processar o Pagamento no Mercado Pago
    const payment = new Payment(client);
    const paymentData = body.paymentData;

    // Garantir que os dados do pagador estão completos (Prevenindo o "Invalid param(s) [pix]")
    // O PIX no Mercado Pago requer identificação (CPF)
    let payer = paymentData.payer || {};

    // Fallbacks inteligentes usando os dados do formulário do cliente se o Brick não enviou algo
    payer = {
      ...payer,
      email: payer.email || body.customer.email,
      first_name: payer.first_name || body.customer.name.split(' ')[0],
      last_name: payer.last_name || body.customer.name.split(' ').slice(1).join(' '),
    };

    // Mercado Pago exige CPF para PIX
    if (paymentData.payment_method_id === 'pix') {
      payer.identification = {
        type: 'CPF',
        number: body.customer.cpf?.replace(/\D/g, '') || payer.identification?.number?.replace(/\D/g, '')
      };

      if (!payer.identification.number) {
        throw new Error('O CPF é obrigatório para pagamentos via PIX.');
      }
    }

    const transactionAmount = Number(validatedItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0).toFixed(2));

    console.log('Final Transaction Amount:', transactionAmount);
    console.log('Payment Method:', paymentData.payment_method_id);

    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      throw new Error('O valor total da compra é inválido.');
    }

    const response = await payment.create({
      body: {
        transaction_amount: transactionAmount,
        description: 'Pedido SQUAD',
        payment_method_id: paymentData.payment_method_id,
        payer: payer,
        token: paymentData.token, 
        installments: Number(paymentData.installments) || 1,
        issuer_id: paymentData.issuer_id,
      }
    });

    // 4. Retornar o resultado do pagamento para o Frontend (inclui o QR Code do PIX se for PIX)
    return res.status(200).json({
      id: response.id,
      status: response.status,
      detail: response.status_detail,
      qr_code: response.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64
    });

  } catch (error) {
    // Error Handling: Não expor stack trace completo pro usuário
    console.error('Payment API Error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }

    return res.status(500).json({ error: error.message || 'Internal server error while processing payment' });
  }
}
