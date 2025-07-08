# ⚡ Quick Start - CRM Pro Dashboard

<div align="center">

![Quick Start](https://img.shields.io/badge/Quick%20Start-5%20minutos-success?style=for-the-badge&logo=rocket)

**Configure e execute o CRM Pro Dashboard em menos de 5 minutos**

</div>

---

## 🎯 Pré-requisitos Mínimos

Antes de começar, certifique-se de ter instalado:

- **Node.js** ≥ 18.0.0 ([Download](https://nodejs.org/))
- **npm** ou **yarn** ou **pnpm**
- **Git** ([Download](https://git-scm.com/))
- **Docker** (opcional, recomendado) ([Download](https://docker.com/))

---

## 🚀 Instalação Rápida

### Método 1: Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/crm-pro-dashboard.git
cd crm-pro-dashboard

# 2. Execute com Docker
docker-compose up -d

# 3. Acesse o dashboard
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# n8n: http://localhost:5678
```

### Método 2: Instalação Local

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/crm-pro-dashboard.git
cd crm-pro-dashboard

# 2. Instale as dependências
npm install
# ou
yarn install
# ou
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações

# 4. Execute o projeto
npm run dev
# ou
yarn dev
# ou
pnpm dev

# 5. Acesse http://localhost:3000
```

---

## ⚙️ Configuração Básica

### 1. Variáveis de Ambiente

Edite o arquivo `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crm_dashboard"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# API Keys
OPENAI_API_KEY="sk-..."
GMAIL_CLIENT_ID="your-gmail-client-id"
GMAIL_CLIENT_SECRET="your-gmail-client-secret"

# Integrations
STRIPE_SECRET_KEY="sk_test_..."
HUBSPOT_API_KEY="your-hubspot-key"
```

### 2. Banco de Dados

```bash
# Executar migrações
npx prisma migrate dev

# Gerar cliente Prisma
npx prisma generate

# (Opcional) Popular com dados de exemplo
npm run seed
```

---

## 🔧 Primeiros Passos

### 1. Acessar o Dashboard

1. Abra http://localhost:3000
2. Faça o cadastro inicial (primeiro usuário será admin)
3. Complete o onboarding

### 2. Configurar Integrações Básicas

#### Gmail API
1. Vá para **Configurações** → **Integrações**
2. Clique em **Gmail** → **Conectar**
3. Autorize o acesso
4. Configure sincronização automática

#### Stripe (Pagamentos)
1. **Configurações** → **Pagamentos**
2. Adicione suas chaves Stripe
3. Configure webhooks: `https://seu-dominio.com/api/webhooks/stripe`

### 3. Criar Primeiro Pipeline CRM

1. **CRM** → **Pipelines**
2. Clique em **Novo Pipeline**
3. Configure estágios:
   - Lead
   - Qualificado
   - Proposta
   - Fechado
4. Salve e comece a usar

---

## 📊 Dashboards Principais

### Acesso Rápido

| Dashboard | URL | Descrição |
|-----------|-----|-----------|
| **Principal** | `/` | Visão geral e métricas |
| **CRM** | `/crm` | Gestão de clientes e leads |
| **Analytics** | `/analytics` | Relatórios e análises |
| **Integrações** | `/integrations` | Configurar APIs |
| **Configurações** | `/settings` | Configurações gerais |

### Widgets Principais

- 📈 **Vendas do Mês**: Receita e metas
- 👥 **Leads**: Novos leads e conversões
- 📧 **E-mails**: Campanhas e engajamento
- 🎯 **Funil**: Pipeline de vendas
- 📱 **WhatsApp**: Mensagens e automação

---

## 🤖 Configurar Automação (n8n)

### Acesso ao n8n

1. Acesse http://localhost:5678
2. Configure conta inicial
3. Importe templates prontos:

```bash
# Importar workflows prontos
cd n8n
npm run import-templates
```

### Workflows Essenciais

1. **Lead Capture**: Formulário → CRM
2. **Email Marketing**: Campanhas automáticas
3. **WhatsApp**: Respostas automáticas
4. **Sync Dados**: Integração entre sistemas

---

## 🔍 Verificar Instalação

### Testes Rápidos

```bash
# Verificar status dos serviços
npm run health-check

# Testar conexões de API
npm run test-integrations

# Verificar banco de dados
npx prisma studio
```

### Checklist de Funcionamento

- [ ] Dashboard principal carrega
- [ ] Login/cadastro funcionando
- [ ] Conexão com banco de dados
- [ ] APIs externas configuradas
- [ ] n8n acessível (se Docker)
- [ ] Notificações funcionando

---

## 🆘 Problemas Comuns

### Erro de Porta Ocupada

```bash
# Verificar processos na porta 3000
lsof -i :3000

# Matar processo se necessário
kill -9 <PID>
```

### Erro de Banco de Dados

```bash
# Resetar banco (CUIDADO: apaga dados)
npx prisma migrate reset

# Ou apenas aplicar migrações
npx prisma migrate deploy
```

### Erro de Dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Ou com yarn
rm -rf node_modules yarn.lock
yarn install
```

---

## 📚 Próximos Passos

### Documentação Completa

1. **[Guia de Instalação](./INSTALLATION_GUIDE.md)** - Setup completo
2. **[API Reference](./API_REFERENCE.md)** - Documentação da API
3. **[Integrações](./INTEGRATIONS.md)** - Configurar serviços externos
4. **[Docker Guide](./DOCKER_GUIDE.md)** - Deploy com Docker

### Configurações Avançadas

1. **[Segurança](./SECURITY.md)** - Hardening e melhores práticas
2. **[Analytics](./ANALYTICS.md)** - Métricas e relatórios
3. **[Deployment](./DEPLOYMENT.md)** - Deploy em produção
4. **[Troubleshooting](./TROUBLESHOOTING.md)** - Resolução de problemas

---

## 💬 Suporte

### Problemas?

1. **Consulte**: [Troubleshooting](./TROUBLESHOOTING.md)
2. **Abra Issue**: [GitHub Issues](https://github.com/projeto/issues)
3. **Documentação**: [Índice Completo](./INDEX.md)
4. **Comunidade**: [Discord/Slack]

### Contribuir

1. **Melhorias**: [Contributing Guide](./CONTRIBUTING.md)
2. **Bugs**: [Report Template]
3. **Features**: [Feature Request]

---

<div align="center">

**🎉 Parabéns! Seu CRM Pro Dashboard está funcionando!**

[🔧 Configurações Avançadas](./INSTALLATION_GUIDE.md) • [📖 Documentação Completa](./INDEX.md) • [🤝 Contribuir](./CONTRIBUTING.md)

</div>
