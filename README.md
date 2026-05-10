# ⚡ SQUAD | Authentic Streetwear E-commerce

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Produ%C3%A7%C3%A3o-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Seguran%C3%A7a-Omni--Security%20Zero--Trust-blue?style=for-the-badge" alt="Segurança">
  <img src="https://img.shields.io/badge/Arquitetura-Serverless-orange?style=for-the-badge" alt="Arquitetura">
</p>

---

## 🧠 A Arquitetura SQUAD
O **SQUAD-E-commerce** não é apenas um site, é uma infraestrutura de vendas de alta performance projetada para escala, segurança máxima e custo operacional otimizado.

### 1. 🛠️ Tecnologias e Ferramentas

#### **Frontend (A "Cara" do Site)**
*   ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) **React.js**: Interface reativa e ultraveloz.
*   ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) **Vite**: Bundler de altíssima performance para desenvolvimento.
*   ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **Tailwind CSS**: Estilização premium e responsividade total.
*   ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) **Framer Motion**: Animações fluidas com estética de galeria de luxo.

#### **Headless CMS (O Cérebro de Conteúdo)**
*   ![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=flat-square&logo=sanity&logoColor=white) **Sanity.io**: Banco de dados e painel de controle em tempo real. Separação total entre conteúdo e código, permitindo gestão de estoque e pedidos sem deploy.

#### **Backend Serverless (O Motor de Segurança)**
*   ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) **Node.js**: Lógica de servidor escalável.
*   ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) **Vercel Functions**: Servidor "On-Demand". O motor só liga para processar a cobrança, garantindo **custo zero** de manutenção quando não há vendas.

#### **Gateway de Pagamento & Segurança**
*   ![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-009EE3?style=flat-square&logo=mercadopago&logoColor=white) **Mercado Pago**: Integração via Payment Brick + SDK Oficial para checkout transparente.
*   ![Zod](https://img.shields.io/badge/Zod-3068B7?style=flat-square&logo=zod&logoColor=white) **Zod**: Blindagem de dados contra injeção de código malicioso.
*   ![Shield](https://img.shields.io/badge/Protocolo-Omni--Security-gold?style=flat-square) **Zero-Trust**: Protocolo de segurança que valida cada transação diretamente no banco de dados.

---

### 2. 🌊 Fluxo de Dados (O Ciclo da Compra)

1.  **Exibição (Vitríne):** O cliente acessa o site. O **React** consome a API do **Sanity** instantaneamente, renderizando produtos e estoques em tempo real.
2.  **Checkout (Tokenização):** O cliente insere os dados. Através do **Mercado Pago Brick**, o cartão é transformado em um *Token Seguro*. O número do cartão **nunca** toca nosso servidor.
3.  **Cofre (Validação Serverless):** O Frontend envia o Token e a lista de produtos para o nosso endpoint seguro em `api/payment.js`.
4.  **Blindagem (Zero-Trust):** Nosso Backend não confia no preço vindo do navegador. Ele consulta o **Sanity** escondido, verifica o **preço real e inalterável**, recalcula o total e só então envia para a aprovação final do Mercado Pago.
5.  **Finalização:** Com o pagamento aprovado, o Backend atualiza o status do pedido no Sanity e libera a tela de sucesso para o cliente.

---

### 🚀 Como Rodar o Projeto

```bash
# Clone o repositório
git clone [https://github.com/FernandoCyber3/Site-de-Roupa-Pro.git]

# Instale as dependências
npm install

# Inicie o modo desenvolvimento
npm run dev
