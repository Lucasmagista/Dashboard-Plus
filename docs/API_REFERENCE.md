# 🔧 API Reference - CRM Pro Dashboard

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Endpoints Base](#endpoints-base)
4. [API de Usuários](#api-de-usuários)
5. [API de Integrações](#api-de-integrações)
6. [API de IA](#api-de-ia)
7. [API de Analytics](#api-de-analytics)
8. [Webhooks](#webhooks)
9. [Rate Limiting](#rate-limiting)
10. [Códigos de Error](#códigos-de-error)

---

## 🎯 Visão Geral

A API do CRM Pro Dashboard é RESTful e utiliza JSON para comunicação. Todas as requisições devem incluir autenticação via JWT token.

### Base URL

```
https://api.crmprodb.com/v1
```

### Formato de Resposta

```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso",
  "timestamp": "2025-01-07T12:00:00Z",
  "version": "1.0.0"
}
```

### Headers Obrigatórios

```http
Content-Type: application/json
Authorization: Bearer <jwt_token>
X-API-Version: 1.0
```

---

## 🔐 Autenticação

### Login

**POST** `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "João Silva",
      "role": "admin"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh_token_here",
      "expiresIn": 86400
    }
  }
}
```

### Refresh Token

**POST** `/auth/refresh`

```json
{
  "refreshToken": "refresh_token_here"
}
```

### Logout

**POST** `/auth/logout`

```json
{
  "refreshToken": "refresh_token_here"
}
```

### MFA Verification

**POST** `/auth/mfa/verify`

```json
{
  "token": "123456",
  "userId": "user_123"
}
```

---

## 🔗 Endpoints Base

### Health Check

**GET** `/health`

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": "connected",
    "redis": "connected",
    "uptime": 3600,
    "version": "1.0.0"
  }
}
```

### Metrics

**GET** `/metrics`

```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 340,
    "totalIntegrations": 15,
    "activeIntegrations": 12,
    "apiCalls": 45000,
    "responseTime": 120
  }
}
```

---

## 👥 API de Usuários

### Listar Usuários

**GET** `/users?page=1&limit=20&search=joão`

**Parâmetros de Query:**
- `page` (number): Número da página
- `limit` (number): Itens por página
- `search` (string): Termo de busca
- `role` (string): Filtrar por role
- `status` (string): Filtrar por status

**Resposta:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "email": "joao@example.com",
        "name": "João Silva",
        "role": "admin",
        "status": "active",
        "lastLogin": "2025-01-07T10:00:00Z",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Criar Usuário

**POST** `/users`

```json
{
  "email": "novo@example.com",
  "name": "Novo Usuário",
  "password": "senha123",
  "role": "user",
  "permissions": ["read:dashboard", "write:contacts"]
}
```

### Obter Usuário

**GET** `/users/:id`

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "joao@example.com",
    "name": "João Silva",
    "role": "admin",
    "permissions": ["*"],
    "profile": {
      "avatar": "https://example.com/avatar.jpg",
      "phone": "+55 11 99999-9999",
      "timezone": "America/Sao_Paulo"
    },
    "integrations": [
      {
        "type": "gmail",
        "connected": true,
        "lastSync": "2025-01-07T10:00:00Z"
      }
    ]
  }
}
```

### Atualizar Usuário

**PUT** `/users/:id`

```json
{
  "name": "João Silva Santos",
  "role": "manager",
  "profile": {
    "phone": "+55 11 88888-8888"
  }
}
```

### Deletar Usuário

**DELETE** `/users/:id`

```json
{
  "success": true,
  "message": "Usuário deletado com sucesso"
}
```

---

## 🔗 API de Integrações

### Listar Integrações

**GET** `/integrations`

```json
{
  "success": true,
  "data": [
    {
      "id": "integration_gmail_123",
      "type": "gmail",
      "name": "Gmail Integration",
      "status": "connected",
      "lastSync": "2025-01-07T10:00:00Z",
      "config": {
        "email": "user@gmail.com",
        "scopes": ["read", "write"]
      },
      "stats": {
        "emailsSynced": 1250,
        "contactsSynced": 300
      }
    }
  ]
}
```

### Gmail Integration

#### Obter URL de Autorização

**GET** `/integrations/gmail/auth-url`

```json
{
  "success": true,
  "data": {
    "authUrl": "https://accounts.google.com/oauth/authorize?..."
  }
}
```

#### Conectar Gmail

**POST** `/integrations/gmail/connect`

```json
{
  "code": "auth_code_from_google",
  "state": "random_state_string"
}
```

#### Sincronizar Emails

**POST** `/integrations/gmail/sync`

```json
{
  "syncType": "incremental", // ou "full"
  "dateFrom": "2025-01-01T00:00:00Z",
  "dateTo": "2025-01-07T23:59:59Z"
}
```

#### Listar Emails

**GET** `/integrations/gmail/emails?page=1&limit=50`

```json
{
  "success": true,
  "data": {
    "emails": [
      {
        "id": "email_123",
        "messageId": "gmail_message_id",
        "subject": "Assunto do Email",
        "from": "sender@example.com",
        "to": ["recipient@example.com"],
        "body": "Conteúdo do email...",
        "date": "2025-01-07T10:00:00Z",
        "read": false,
        "labels": ["INBOX", "IMPORTANT"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250,
      "pages": 25
    }
  }
}
```

### Shopify Integration

#### Conectar Shopify

**POST** `/integrations/shopify/connect`

```json
{
  "shopUrl": "minhaloja.myshopify.com",
  "accessToken": "shopify_access_token"
}
```

#### Sincronizar Produtos

**POST** `/integrations/shopify/sync/products`

#### Listar Produtos

**GET** `/integrations/shopify/products?page=1&limit=20`

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "product_123",
        "shopifyId": "12345678",
        "title": "Produto Exemplo",
        "handle": "produto-exemplo",
        "vendor": "Minha Marca",
        "price": "99.99",
        "comparePrice": "129.99",
        "inventory": 50,
        "images": ["https://example.com/image.jpg"],
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-07T10:00:00Z"
      }
    ]
  }
}
```

### Stripe Integration

#### Conectar Stripe

**POST** `/integrations/stripe/connect`

```json
{
  "publicKey": "pk_test_...",
  "secretKey": "sk_test_...",
  "webhookSecret": "whsec_..."
}
```

#### Listar Pagamentos

**GET** `/integrations/stripe/payments?page=1&limit=20`

```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "payment_123",
        "stripeId": "pi_1234567890",
        "amount": 9999,
        "currency": "brl",
        "status": "succeeded",
        "customer": {
          "id": "customer_123",
          "email": "customer@example.com"
        },
        "createdAt": "2025-01-07T10:00:00Z"
      }
    ]
  }
}
```

---

## 🤖 API de IA

### ChatGPT Integration

#### Enviar Mensagem

**POST** `/ai/chat`

```json
{
  "message": "Como posso melhorar minhas vendas?",
  "context": {
    "userId": "user_123",
    "conversationId": "conv_456"
  },
  "model": "gpt-4",
  "maxTokens": 2048
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "response": "Para melhorar suas vendas, recomendo...",
    "tokens": {
      "prompt": 15,
      "completion": 120,
      "total": 135
    },
    "model": "gpt-4",
    "conversationId": "conv_456"
  }
}
```

#### Análise de Sentimentos

**POST** `/ai/sentiment`

```json
{
  "text": "Estou muito satisfeito com o produto!",
  "language": "pt-BR"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "sentiment": "positive",
    "confidence": 0.95,
    "scores": {
      "positive": 0.95,
      "neutral": 0.04,
      "negative": 0.01
    }
  }
}
```

### Machine Learning

#### Treinar Modelo

**POST** `/ai/ml/train`

```json
{
  "modelType": "classification",
  "dataset": "sales_data",
  "features": ["age", "income", "location"],
  "target": "purchase_probability"
}
```

#### Fazer Predição

**POST** `/ai/ml/predict`

```json
{
  "modelId": "model_123",
  "features": {
    "age": 35,
    "income": 75000,
    "location": "São Paulo"
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "prediction": 0.85,
    "confidence": 0.92,
    "features": {
      "age": 35,
      "income": 75000,
      "location": "São Paulo"
    }
  }
}
```

---

## 📊 API de Analytics

### Dashboard Metrics

**GET** `/analytics/dashboard?period=7d`

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": 125000,
      "totalOrders": 450,
      "totalCustomers": 230,
      "conversionRate": 3.2
    },
    "trends": {
      "revenue": [
        {"date": "2025-01-01", "value": 15000},
        {"date": "2025-01-02", "value": 18000}
      ],
      "orders": [
        {"date": "2025-01-01", "value": 65},
        {"date": "2025-01-02", "value": 72}
      ]
    },
    "topProducts": [
      {
        "id": "product_123",
        "name": "Produto A",
        "sales": 85,
        "revenue": 8500
      }
    ]
  }
}
```

### Relatórios Personalizados

**POST** `/analytics/reports`

```json
{
  "name": "Relatório de Vendas",
  "type": "sales",
  "filters": {
    "dateFrom": "2025-01-01",
    "dateTo": "2025-01-31",
    "products": ["product_123", "product_456"]
  },
  "groupBy": "date",
  "metrics": ["revenue", "orders", "customers"]
}
```

### Exportar Dados

**GET** `/analytics/export?format=csv&report=sales&period=30d`

---

## 🔄 Webhooks

### Registrar Webhook

**POST** `/webhooks`

```json
{
  "url": "https://myapp.com/webhooks/crm",
  "events": ["user.created", "order.completed", "payment.succeeded"],
  "secret": "webhook_secret_123"
}
```

### Eventos Disponíveis

| Evento | Descrição |
|--------|-----------|
| `user.created` | Novo usuário criado |
| `user.updated` | Usuário atualizado |
| `user.deleted` | Usuário deletado |
| `order.created` | Novo pedido criado |
| `order.updated` | Pedido atualizado |
| `order.completed` | Pedido finalizado |
| `payment.succeeded` | Pagamento aprovado |
| `payment.failed` | Pagamento falhou |
| `integration.connected` | Nova integração conectada |
| `integration.disconnected` | Integração desconectada |

### Formato do Webhook

```json
{
  "id": "webhook_123",
  "event": "order.completed",
  "data": {
    "orderId": "order_456",
    "customerId": "customer_789",
    "amount": 99.99,
    "currency": "BRL"
  },
  "timestamp": "2025-01-07T12:00:00Z",
  "signature": "sha256=..."
}
```

---

## ⚡ Rate Limiting

### Limites por Endpoint

| Endpoint | Limite | Janela |
|----------|--------|---------|
| `/auth/*` | 10 req/min | 60 segundos |
| `/users/*` | 100 req/min | 60 segundos |
| `/integrations/*` | 50 req/min | 60 segundos |
| `/ai/*` | 20 req/min | 60 segundos |
| `/analytics/*` | 200 req/min | 60 segundos |

### Headers de Rate Limit

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641556800
```

### Resposta de Rate Limit Excedido

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 30 seconds.",
    "retryAfter": 30
  }
}
```

---

## ❌ Códigos de Error

### Códigos HTTP

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado |
| 400 | Requisição inválida |
| 401 | Não autorizado |
| 403 | Proibido |
| 404 | Não encontrado |
| 422 | Entidade não processável |
| 429 | Rate limit excedido |
| 500 | Erro interno do servidor |

### Formato de Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados de entrada inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email é obrigatório"
      }
    ],
    "timestamp": "2025-01-07T12:00:00Z"
  }
}
```

### Códigos de Error Customizados

| Código | Descrição |
|--------|-----------|
| `INVALID_CREDENTIALS` | Credenciais inválidas |
| `TOKEN_EXPIRED` | Token expirado |
| `INTEGRATION_ERROR` | Erro de integração |
| `VALIDATION_ERROR` | Erro de validação |
| `PERMISSION_DENIED` | Permissão negada |
| `RESOURCE_NOT_FOUND` | Recurso não encontrado |
| `DUPLICATE_RESOURCE` | Recurso duplicado |
| `EXTERNAL_API_ERROR` | Erro na API externa |

---

## 📚 SDKs e Bibliotecas

### JavaScript/TypeScript

```bash
npm install @crmprodb/sdk
```

```javascript
import { CRMProClient } from '@crmprodb/sdk';

const client = new CRMProClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.crmprodb.com/v1'
});

// Usar o cliente
const users = await client.users.list();
const integrations = await client.integrations.gmail.sync();
```

### Python

```bash
pip install crmprodb-python
```

```python
from crmprodb import CRMProClient

client = CRMProClient(
    api_key='your-api-key',
    base_url='https://api.crmprodb.com/v1'
)

# Usar o cliente
users = client.users.list()
result = client.integrations.gmail.sync()
```

---

## 🔍 Exemplos de Uso

### Workflow Completo

```javascript
// 1. Autenticar
const auth = await client.auth.login({
  email: 'user@example.com',
  password: 'senha123'
});

// 2. Configurar headers
client.setToken(auth.tokens.accessToken);

// 3. Conectar Gmail
const gmailAuth = await client.integrations.gmail.getAuthUrl();
// Usuário autoriza e retorna código
await client.integrations.gmail.connect({ code: 'auth_code' });

// 4. Sincronizar emails
await client.integrations.gmail.sync({
  syncType: 'incremental'
});

// 5. Buscar emails
const emails = await client.integrations.gmail.emails.list({
  page: 1,
  limit: 50
});

// 6. Análise com IA
const sentiment = await client.ai.sentiment({
  text: emails.data.emails[0].body,
  language: 'pt-BR'
});
```

---

## 🆘 Suporte

- 📧 Email: api-support@crmprodb.com
- 📚 Documentação: [docs.crmprodb.com](https://docs.crmprodb.com)
- 💬 Discord: [CRM Pro Developers](https://discord.gg/crmprodb-dev)

---

**🚀 Versão: 1.0.0 | Última atualização: 07/01/2025**
