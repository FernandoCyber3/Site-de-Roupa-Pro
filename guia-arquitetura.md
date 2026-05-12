# 🚀 GUIA DE ARQUITETURA E-COMMERCE: PADRÃO SQUAD

Este documento contém o "padrão ouro" de arquitetura, segurança e integrações desenvolvido para o projeto de e-commerce SQUAD (anteriormente BASE44). 
Utilize este guia para replicar a mesma infraestrutura profissional em futuros projetos de roupas ou lojas virtuais.

---

## 1. Stack Tecnológica (O Motor)
- **Frontend:** React + Vite
- **Backend (API):** Vercel Serverless Functions (`/api`)
- **Banco de Dados/CMS:** Sanity.io (Headless CMS)
- **Gateway de Pagamento:** Mercado Pago (Payment Bricks SDK)
- **Segurança & Validação:** Zod (Validação de schemas)

---

## 2. Variáveis de Ambiente Necessárias (`.env`)
Todo novo projeto precisará ter o arquivo `.env` na raiz contendo:
```env
VITE_MP_PUBLIC_KEY=sua_chave_publica_do_mercado_pago
MP_ACCESS_TOKEN=seu_access_token_secreto_do_mercado_pago
VITE_SANITY_PROJECT_ID=seu_id_do_projeto_sanity
VITE_SANITY_DATASET=production
SANITY_API_TOKEN=seu_token_secreto_com_permissao_de_editor
```
*Aviso:* Na hora de colocar o site no ar (deploy), você **DEVE** cadastrar as variáveis secretas (`MP_ACCESS_TOKEN` e `SANITY_API_TOKEN`) manualmente no painel da Vercel (Project Settings > Environment Variables), pois o arquivo `.env` nunca sobe para a nuvem.

---

## 3. Protocolo Blindagem OMNI-SECURITY
A premissa fundamental da nossa arquitetura é a **Desconfiança Zero (Zero-Trust)**:
1. **O Frontend é "burro":** O site (React) NUNCA envia o preço final para o Mercado Pago. O site envia apenas as IDs dos produtos.
2. **O Backend é autoridade:** A nossa Serverless Function (`/api/payment.js`) recebe a ID do produto, vai até o **Sanity CMS**, pega o preço real atualizado e ela mesma monta a cobrança. Isso impede que hackers modifiquem o preço do produto pelo navegador (Inspecionar Elemento).
3. **Validação Estrita:** Usamos o `Zod` na API para garantir que o cliente mandou nome, email, CPF e todos os dados de envio corretamente antes de aceitar criar o pedido.

---

## 4. Estrutura de Pagamento (Mercado Pago Bricks)

### Frontend (`src/pages/Checkout.jsx`)
- Usamos o pacote `@mercadopago/sdk-react`.
- Renderizamos o `<Payment />` brick.
- Quando o pagamento gera um PIX, o Mercado Pago internamente chama o método de `bank_transfer`. O código Frontend deve estar preparado para renderizar o QR Code e o Copia e Cola caso `payment_method_id` seja igual a `pix` ou `bank_transfer`.

### Backend (`/api/payment.js`)
- Este arquivo OBRIGATORIAMENTE deve ficar na **raiz do projeto** dentro da pasta `/api`, no mesmo nível que o `package.json`, para a Vercel reconhecê-lo como uma Serverless Function.
- **Dica de PIX:** O objeto do pagador precisa ter um email genérico e CPF de fallback caso falte no payload, para não dar erro `[BRICKS] Invalid param(s) [pix]`.

---

## 5. Fluxo de Criação de Pedido
1. Usuário preenche o checkout (com campos robustos: Rua, Bairro, Número obrigatórios).
2. O Mercado Pago Brick gera o Token de Pagamento e passa para a nossa Função Backend.
3. O Backend valida os preços no Sanity e processa a cobrança no Mercado Pago via pacote Node `mercadopago`.
4. Em caso de Sucesso ou Pendente (PIX), o Backend usa o cliente do Sanity (`base44Client.js` ou equivalente usando o `SANITY_API_TOKEN`) para gravar o pedido no CMS.
5. O Frontend recebe o OK (e o código PIX se for o caso) e exibe a tela de sucesso.

---

## 6. Comandos Chaves
Para rodar este ambiente de forma correta no seu computador e permitir que o Frontend se comunique com o Backend de Pagamento localmente, você DEVE rodar:

```powershell
npx vercel dev
```
*(Nunca usar apenas `npm run dev` se for testar pagamento, pois o Vite sozinho não roda a pasta `/api`).*

---
*Fim do Documento - Criado e validado em Maio de 2026. Use a IA para ler este documento em novos projetos e reproduzir tudo perfeitamente!*
