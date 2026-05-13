# ⚡ SQUAD | Authentic Streetwear E-commerce

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Produ%C3%A7%C3%A3o-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Seguran%C3%A7a-Omni--Security%20Zero--Trust-blue?style=for-the-badge" alt="Segurança">
  <img src="https://img.shields.io/badge/Arquitetura-Serverless-orange?style=for-the-badge" alt="Arquitetura">
  <img src="https://img.shields.io/badge/Performance-Mobile--First-purple?style=for-the-badge" alt="Performance">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white" alt="Sanity">
  <img src="https://img.shields.io/badge/Mercado_Pago-009EE3?style=for-the-badge&logo=mercadopago&logoColor=white" alt="Mercado Pago">
</p>

---

## 🧠 A Arquitetura SQUAD

O **SQUAD-E-commerce** não é apenas um site — é uma infraestrutura de vendas de alta performance projetada para escala, segurança máxima e custo operacional otimizado.

---

### 1. 🛠️ Tecnologias e Ferramentas

#### **Frontend (A "Cara" do Site)**

| Tecnologia | Função |
|---|---|
| ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) **React.js** | Interface reativa e ultraveloz |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) **Vite** | Bundler de altíssima performance para desenvolvimento |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **Tailwind CSS** | Estilização premium e responsividade total |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) **Framer Motion** | Animações fluidas com estética de galeria de luxo |

#### **Headless CMS (O Cérebro de Conteúdo)**

| Tecnologia | Função |
|---|---|
| ![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=flat-square&logo=sanity&logoColor=white) **Sanity.io** | Banco de dados e painel de controle em tempo real. Separação total entre conteúdo e código, permitindo gestão de estoque e pedidos sem deploy |

#### **Backend Serverless (O Motor de Segurança)**

| Tecnologia | Função |
|---|---|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) **Node.js** | Lógica de servidor escalável |
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) **Vercel Functions** | Servidor "On-Demand" — o motor só liga para processar a cobrança, garantindo **custo zero** de manutenção quando não há vendas |

#### **Gateway de Pagamento & Segurança**

| Tecnologia | Função |
|---|---|
| ![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-009EE3?style=flat-square&logo=mercadopago&logoColor=white) **Mercado Pago** | Integração via Payment Brick + SDK Oficial para checkout transparente |
| ![Zod](https://img.shields.io/badge/Zod-3068B7?style=flat-square&logo=zod&logoColor=white) **Zod** | Blindagem de dados contra injeção de código malicioso |
| ![Shield](https://img.shields.io/badge/Protocolo-Omni--Security-gold?style=flat-square) **Zero-Trust** | Protocolo de segurança que valida cada transação diretamente no banco de dados |

---

### 2. 🌊 Fluxo de Dados (O Ciclo da Compra)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CICLO DA COMPRA                              │
│                                                                     │
│  1. VITRÍNE ──► React consome API Sanity ──► Estoque em tempo real  │
│       │                                                             │
│  2. CHECKOUT ──► MP Brick tokeniza o cartão ──► Token Seguro        │
│       │          (número do cartão NUNCA toca o servidor)           │
│       │                                                             │
│  3. COFRE ──► Token + produtos ──► endpoint api/payment.js          │
│       │                                                             │
│  4. BLINDAGEM ──► Backend consulta Sanity ──► Verifica preço real   │
│       │           Recalcula total ──► Zero-Trust ativo              │
│       │                                                             │
│  5. FINALIZAÇÃO ──► Pagamento aprovado ──► Status atualizado        │
│                      no Sanity ──► Tela de sucesso                  │
└─────────────────────────────────────────────────────────────────────┘
```

> **Princípio Zero-Trust:** O backend não confia em **nenhum** dado vindo do navegador. Cada transação é validada diretamente na fonte de verdade — o Sanity.

---

## 🚀 Engenharia Avançada & Diferenciais Técnicos

O **SQUAD-E-commerce** foi projetado com foco em performance extrema, segurança resiliente e experiência mobile de alto nível.

---

### 📱 1. Arquitetura de Performance "Mobile-First"

#### ⚡ Otimização de GPU (Ember Forge Engine)

O Hero do site **não é uma imagem estática tradicional**. Utilizamos aceleração por hardware (GPU Rendering) para efeitos visuais avançados sem bloquear a thread principal do navegador.

| Benefício | Resultado |
|---|---|
| 🖥️ GPU Rendering | Renderização fluida a **60fps** constantes |
| 🔋 Hardware Acceleration | Baixo consumo de bateria em mobile |
| 🎯 Reflow/Repaint | Eliminação de renderizações desnecessárias |
| 📱 Compatibilidade | Performance estável em dispositivos intermediários |

> Demonstra domínio real de pipeline de renderização e otimização mobile.

---

#### 🎥 Lazy-Loading Inteligente de Vídeos

Os vídeos do catálogo não carregam automaticamente. Sistema baseado em:

- **Intersection Observer API** — detecção nativa de visibilidade
- **Carregamento sob demanda** por interação do usuário
- **Estratégia de prioridade de rede** — adapta ao tipo de conexão

| Métrica | Impacto |
|---|---|
| 📶 Dados móveis | Economia real em conexões 3G/4G |
| 📊 Google PageSpeed | Melhor pontuação garantida |
| 🖼️ LCP & CLS | Redução dos principais Core Web Vitals |
| ⚡ Perceived Performance | Carregamento percebido mais rápido |

---

### 🛡️ 2. Engenharia de Pagamento Resiliente

#### 🔐 Blindagem de Dados (Anti-Bug Layer)

Antes de qualquer requisição atingir o gateway, o payload passa por múltiplas camadas de validação:

```
Navegador ──► Validação Zod ──► Revalidação de Preço (Sanity)
     ──► Validação de CPF ──► Recálculo Server-Side ──► Gateway
```

O que elimina na prática:
- ❌ Manipulação de preço via DevTools
- ❌ Erros de "transação inválida"
- ❌ Inconsistências de carrinho
- ❌ Payloads malformados ou injetados

> Arquitetura baseada em modelo **Zero-Trust real** — não apenas declarado, mas implementado.

---

#### 💳 Checkout de Alta Conversão

Implementações estratégicas que aumentam a taxa de conversão:

| Feature | Benefício |
|---|---|
| 🎭 Input masks (CPF, cartão) | Reduz erros de digitação |
| ⏳ Spinners de tokenização | Feedback de segurança em tempo real |
| 🔒 Indicadores visuais de segurança | Aumento de confiança do usuário |
| ⚡ Fluxo otimizado para Pix | Conversão instantânea |

**Resultado direto:** Redução de abandono de carrinho, aumento de confiança e experiência comparável a grandes players do mercado.

---

### 🧠 3. Gestão de Conteúdo via Headless CMS

#### 🏆 Domínio Total do Inventário (Sanity.io)

O operador controla em tempo real, **sem alterar uma linha de código**:

```
┌──────────────────────────────────────────┐
│           PAINEL SANITY                  │
│                                          │
│  ✔ Produtos (nome, descrição, fotos)     │
│  ✔ Estoque (quantidade por variante)     │
│  ✔ Preços (a fonte de verdade da app)    │
│  ✔ Status de Pedidos (pós-pagamento)     │
└──────────────────────────────────────────┘
```

Arquitetura desacoplada (Separation of Concerns):

```
Frontend (React) ──────── independente
Backend (Vercel Fn) ───── independente
Banco (Sanity) ─────────── independente
```

#### ☁️ Sincronização Cloud Estruturada

- ✔ Atualização instantânea sem necessidade de deploy
- ✔ Estrutura de schemas preparada para escala
- ✔ Conteúdo centralizado e auditável
- ✔ Organização semântica de dados

---

### 🚀 4. UX Pro Max & Gestos Nativos

#### 👆 Experiência de App Nativo

| Recurso | Tecnologia |
|---|---|
| Swipe gestures na galeria | Evento nativo de touch |
| Scroll inteligente | CSS scroll-snap + JS |
| Transições entre rotas | Framer Motion AnimatePresence |
| Sensação de app nativo | Microinterações calibradas |

#### ✨ Hierarquia Visual Moderna

- ✔ Bordas e sombras com valor percebido elevado
- ✔ Espaçamento estratégico baseado em escala tipográfica
- ✔ Micro-animações com Framer Motion calibradas para conversão
- ✔ A estética é parte da **engenharia de conversão**

---

## 🎯 Nível Técnico Demonstrado

Este projeto demonstra domínio aplicado em:

```
✅ Arquitetura Serverless        ✅ Segurança Zero-Trust
✅ Performance Mobile-First      ✅ Engenharia de Checkout
✅ Headless CMS Escalável        ✅ UX de Alta Conversão
✅ GPU Rendering Otimizado       ✅ Integração Robusta com Gateway
✅ Lazy-Loading Inteligente      ✅ Validação Multi-Camada (Zod)
```

---

## 🚀 Como Rodar o Projeto

```bash
# Clone o repositório
git clone https://github.com/FernandoCyber3/Site-de-Roupa-Pro.git

# Instale as dependências
npm install

# Inicie o modo desenvolvimento
npm run dev
```

---

<p align="center">
  <strong>💡 O SQUAD não é apenas um e-commerce.</strong><br>
  <em>É uma infraestrutura digital de vendas orientada a performance.</em>
</p>
