# 🚀 Guia de Integração Stripe - Blaze System

## ✅ Implementação Completa

Esta documentação cobre a integração de pagamentos do Stripe com o Blaze System.

---

## 📋 Checklist de Setup

### **1️⃣ Variáveis de Ambiente**

Complete o arquivo `.env.local`:

```env
# Stripe Keys (get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here

# Stripe Price IDs (create in Stripe Dashboard > Products > Prices)
STRIPE_PRICE_BASIC=price_xxx_basic
STRIPE_PRICE_PRO=price_xxx_pro
STRIPE_PRICE_ELITE=price_xxx_elite

# Webhook Secret (from Stripe Dashboard > Webhooks)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### **2️⃣ Criar Products no Stripe Dashboard**

1. Acesse: [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá em **Products** → **Create Product**
3. Crie 3 produtos:
   - **Básico**: R$ 19,90/mês
   - **Pro**: R$ 39,90/mês
   - **Elite**: R$ 79,90/mês

4. Para cada produto:
   - Nome: ex. "Blaze Basic"
   - Tipo: **Recurring**
   - Preço: Mensal
   - Copie o **Price ID** (price_...)

### **3️⃣ Configurar Webhook**

1. Vá em **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. URL do endpoint:
   ```
   https://your-domain.com/api/stripe/webhook
   ```
4. Selecione os eventos:
   - `checkout.session.completed`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. Copie o **Signing Secret** (whsec_...)

---

## 🏗️ Arquitetura Implementada

```
lib/
├── stripe.ts              ← Cliente Stripe
└── stripe-service.ts      ← Lógica de customer e subscription

models/
└── Subscription.ts        ← Schema MongoDB com todos os campos

app/api/stripe/
├── create-checkout/route.ts    ← Cria sessão de checkout
├── webhook/route.ts            ← Processa eventos Stripe
├── customer-portal/route.ts     ← Acesso ao billing portal
└── ...

app/
├── pricing/page.tsx       ← Página de planos (já implementada)
├── success/page.tsx       ← Confirmação de sucesso
├── cancel/page.tsx        ← Cancelamento
└── ...
```

---

## 🔐 Fluxo de Segurança

1. **Autenticação**: Todos os endpoints validam `getServerSession()`
2. **Validação**: Plano é validado no backend (nunca confiar no frontend)
3. **Customer**: Criado/reutilizado automaticamente via `getOrCreateStripeCustomer()`
4. **Webhook**: Assinado com secret do Stripe (validação de origem)
5. **Idempotência**: Usa `upsert` no MongoDB para evitar duplicação

---

## 📊 Fluxo de Pagamento

```
Usuario Clica "Assinar"
    ↓
POST /api/stripe/create-checkout (userId autenticado)
    ↓
Backend:
  - Valida usuário autenticado
  - Valida plano
  - Obtém ou cria Stripe Customer
  - Cria sessão de checkout
    ↓
Retorna session.url
    ↓
Redireciona para Stripe Checkout
    ↓
Usuario paga / Cancela
    ↓
Stripe envia webhook
    ↓
POST /api/stripe/webhook
    ↓
Backend:
  - Valida assinatura
  - Processa evento
  - Atualiza Subscription no MongoDB
    ↓
Redireciona para /success ou /cancel
```

---

## 🛠️ Endpoints da API

### **POST /api/stripe/create-checkout**

Cria uma sessão de checkout.

**Requer**: Usuário autenticado

**Request**:
```json
{
  "plan": "pro"
}
```

**Response**:
```json
{
  "url": "https://checkout.stripe.com/pay/cs_live_..."
}
```

**Erros**:
- `401`: Não autenticado
- `400`: Plano inválido
- `500`: Erro interno

---

### **GET /api/stripe/customer-portal**

Abre o portal de gerenciamento de assinatura.

**Requer**: Usuário autenticado

**Response**:
```json
{
  "url": "https://billing.stripe.com/..."
}
```

**Erros**:
- `401`: Não autenticado
- `404`: Nenhuma assinatura encontrada
- `500`: Erro interno

---

### **POST /api/stripe/webhook**

Recebe e processa eventos do Stripe.

**Eventos processados**:
- `checkout.session.completed`: Ativa assinatura
- `invoice.payment_failed`: Marca como `past_due`
- `customer.subscription.deleted`: Marca como `canceled`
- `customer.subscription.updated`: Atualiza status e datas

---

## 📱 Funções de Serviço

### `getOrCreateStripeCustomer(userId, userEmail)`

Obtém ou cria um customer Stripe.

```typescript
const customerId = await getOrCreateStripeCustomer(
  "user-id-123",
  "user@example.com"
);
```

---

### `saveSubscription(data)`

Salva/atualiza subscription no MongoDB.

```typescript
await saveSubscription({
  userId: "user-id-123",
  stripeCustomerId: "cus_xxx",
  stripeSubscriptionId: "sub_xxx",
  plan: "pro",
  status: "active",
  currentPeriodStart: new Date(),
  currentPeriodEnd: new Date(),
});
```

---

### `getUserSubscription(userId)`

Busca a subscription do usuário.

```typescript
const subscription = await getUserSubscription("user-id-123");
console.log(subscription.plan); // "pro"
console.log(subscription.status); // "active"
```

---

## 💾 Schema de Dados (MongoDB)

```typescript
{
  userId: String,                    // Discord ID (único)
  stripeCustomerId: String,          // Stripe Customer ID (único)
  stripeSubscriptionId: String,      // Subscrição Stripe (único)
  plan: "basic" | "pro" | "elite",   // Plano ativo
  status: "active" | "past_due" | "canceled" | "incomplete" | "unpaid",
  currentPeriodStart: Date,          // Quando começou/começará
  currentPeriodEnd: Date,            // Quando termina
  cancelAtPeriodEnd: Boolean,        // Cancela ao final do período?
  createdAt: Date,
  updatedAt: Date,
}
```

---

## 🧪 Teste Local

### **1. Usar Stripe Test Keys**

No `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### **2. Cards de Teste**

Stripe oferece cards para teste:

| Cenário | Card | CVC | Data |
|---------|------|-----|------|
| Sucesso | `4242 4242 4242 4242` | Qualquer | Futura |
| Recusado | `4000 0000 0000 0002` | Qualquer | Futura |
| 3D Secure | `4000 0025 0000 3155` | Qualquer | Futura |

### **3. Webhook Local**

Use [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o signing secret e coloque em `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_test_xxx
```

---

## 🚀 Deploy (Produção)

### **1. Variáveis de Produção**

Use chaves `sk_live_` e `pk_live_` no `.env.production.local`

### **2. Webhook Produção**

Configure o webhook no Stripe Dashboard para:
```
https://seu-dominio.com/api/stripe/webhook
```

### **3. URL de Retorno**

Atualize `NEXT_PUBLIC_APP_URL` no `.env.production.local`

### **4. HTTPS Obrigatório**

Stripe requer HTTPS em produção.

---

## ⚠️ Troubleshooting

### **Erro: "Webhook inválido"**
- Certifique-se que `STRIPE_WEBHOOK_SECRET` está correto
- Verifique se a assinatura SK é a única ativa no Stripe Dashboard

### **Subscription não aparece no banco**
- Verifique os logs do webhook
- Confirme que `MONGO_URL` está funcional
- Teste manualmente: `POST /api/stripe/webhook` com evento de teste

### **Checkout redireciona para erro**
- Verifique se `STRIPE_PRICE_BASIC/PRO/ELITE` existem no Stripe
- Confirme que o usuário está autenticado
- Veja os logs de erro no console

### **Customer não é reutilizado**
- Certifique-se que `userId` é único e consistente
- Verifique índice único em MongoDB: `db.subscriptions.getIndexes()`

---

## 📚 Recursos Úteis

- [Stripe API Docs](https://stripe.com/docs/api)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Customer Portal](https://stripe.com/docs/billing/customer-portal)

---

## ✨ Próximos Passos

- [ ] Configurar ofertas/descontos no Stripe
- [ ] Implementar retry automático de pagamentos
- [ ] Adicionar dashboard de usage/limite
- [ ] Implementar downgrade automático
- [ ] Adicionar cancelamento automático

---

**Implementado por**: Claude Code
**Data**: 2026-04-09
**Stack**: Next.js 16 + TypeScript + MongoDB + Stripe
