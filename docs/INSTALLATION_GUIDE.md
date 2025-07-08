# 📋 Guia de Instalação - CRM Pro Dashboard

## 🎯 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Instalação Básica](#instalação-básica)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
5. [Configuração das Integrações](#configuração-das-integrações)
6. [Instalação com Docker](#instalação-com-docker)
7. [Verificação da Instalação](#verificação-da-instalação)
8. [Solução de Problemas](#solução-de-problemas)

---

## 🛠️ Pré-requisitos

### Requisitos do Sistema

| Componente | Versão Mínima | Recomendado |
|------------|---------------|-------------|
| Node.js | 18.17.0 | 20.0.0+ |
| npm | 9.6.7 | 10.0.0+ |
| PostgreSQL | 13.0 | 15.0+ |
| Redis | 6.2 | 7.0+ |
| Docker | 20.10.0 | 24.0+ |
| Docker Compose | 2.0.0 | 2.20+ |

### Verificação de Pré-requisitos

```bash
# Verificar Node.js e npm
node --version
npm --version

# Verificar Git
git --version

# Verificar Docker (opcional)
docker --version
docker-compose --version
```

### Instalação de Dependências

#### Ubuntu/Debian
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Instalar Redis
sudo apt install redis-server -y

# Instalar Docker
sudo apt install docker.io docker-compose -y
```

#### CentOS/RHEL
```bash
# Instalar Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Instalar PostgreSQL
sudo yum install -y postgresql postgresql-server postgresql-contrib

# Instalar Redis
sudo yum install -y redis

# Instalar Docker
sudo yum install -y docker docker-compose
```

#### macOS
```bash
# Instalar Homebrew (se não instalado)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar dependências
brew install node postgresql redis docker docker-compose
```

#### Windows
```powershell
# Instalar Chocolatey (se não instalado)
Set-ExecutionPolicy Bypass -Scope Process -Force
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Instalar dependências
choco install nodejs postgresql redis docker-desktop -y
```

---

## 🚀 Instalação Básica

### 1. Clonar o Repositório

```bash
# Via HTTPS
git clone https://github.com/seu-usuario/crm-pro-dashboard.git

# Via SSH
git clone git@github.com:seu-usuario/crm-pro-dashboard.git

# Navegar para o diretório
cd crm-pro-dashboard
```

### 2. Instalar Dependências

```bash
# Instalar dependências do projeto
npm install

# Ou usando yarn
yarn install

# Ou usando pnpm
pnpm install
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar arquivo .env
nano .env  # ou seu editor preferido
```

---

## ⚙️ Configuração do Ambiente

### Arquivo .env Completo

```env
# =============================================================================
# CONFIGURAÇÃO PRINCIPAL
# =============================================================================

# Ambiente
NODE_ENV=development
APP_NAME=CRM Pro Dashboard
APP_VERSION=1.0.0
PORT=3000
HOST=0.0.0.0

# URLs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# =============================================================================
# BANCO DE DADOS
# =============================================================================

# PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/crm_pro_db
POSTGRES_DB=crm_pro_db
POSTGRES_USER=username
POSTGRES_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# =============================================================================
# AUTENTICAÇÃO E SEGURANÇA
# =============================================================================

# JWT
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=24h

# Criptografia
ENCRYPTION_KEY=your-encryption-key-here

# MFA
MFA_ISSUER=CRM Pro Dashboard
MFA_ALGORITHM=sha1
MFA_DIGITS=6
MFA_PERIOD=30

# =============================================================================
# INTEGRAÇÕES EXTERNAS
# =============================================================================

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Gmail
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret

# Shopify
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret

# =============================================================================
# CONFIGURAÇÕES OPCIONAIS
# =============================================================================

# Logging
LOG_LEVEL=debug
LOG_FORMAT=combined

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

### Gerando Chaves Secretas

```bash
# Gerar chave NextAuth
openssl rand -base64 32

# Gerar chave JWT
openssl rand -base64 64

# Gerar chave de criptografia
openssl rand -base64 32

# Alternativa com Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🗄️ Configuração do Banco de Dados

### 1. PostgreSQL

#### Instalação e Configuração

```bash
# Iniciar serviço PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar usuário e banco
sudo -u postgres psql
```

```sql
-- Criar usuário
CREATE USER crm_pro_user WITH PASSWORD 'sua_senha_aqui';

-- Criar banco de dados
CREATE DATABASE crm_pro_db OWNER crm_pro_user;

-- Conceder permissões
GRANT ALL PRIVILEGES ON DATABASE crm_pro_db TO crm_pro_user;

-- Sair do psql
\q
```

#### Configuração com Docker

```bash
# Executar PostgreSQL via Docker
docker run --name crm-postgres \
  -e POSTGRES_DB=crm_pro_db \
  -e POSTGRES_USER=crm_pro_user \
  -e POSTGRES_PASSWORD=sua_senha_aqui \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:15
```

### 2. Redis

#### Instalação e Configuração

```bash
# Iniciar serviço Redis
sudo systemctl start redis
sudo systemctl enable redis

# Testar conexão
redis-cli ping
```

#### Configuração com Docker

```bash
# Executar Redis via Docker
docker run --name crm-redis \
  -p 6379:6379 \
  -v redis_data:/data \
  -d redis:7-alpine redis-server --appendonly yes
```

### 3. Migração do Banco

```bash
# Executar migrações
npx prisma migrate dev

# Gerar cliente Prisma
npx prisma generate

# Seed inicial (opcional)
npm run seed
```

---

## 🔗 Configuração das Integrações

### 1. Gmail Integration

#### Pré-requisitos
- Conta Google Developer Console
- Projeto configurado no Google Cloud Platform

#### Configuração
```bash
# 1. Acessar Google Cloud Console
# 2. Criar projeto ou selecionar existente
# 3. Habilitar Gmail API
# 4. Criar credenciais OAuth 2.0
# 5. Configurar URLs de redirecionamento
```

#### Variáveis de Ambiente
```env
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REDIRECT_URI=http://localhost:3000/api/auth/gmail/callback
```

### 2. Shopify Integration

#### Pré-requisitos
- Conta Shopify Partner
- Aplicação Shopify criada

#### Configuração
```env
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
SHOPIFY_SCOPES=read_products,write_products,read_orders,write_orders
```

### 3. Stripe Integration

#### Pré-requisitos
- Conta Stripe
- Chaves API configuradas

#### Configuração
```env
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### 4. OpenAI Integration

#### Pré-requisitos
- Conta OpenAI
- API Key ativa

#### Configuração
```env
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2048
```

---

## 🐳 Instalação com Docker

### 1. Usando Docker Compose

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/crm-pro-dashboard.git
cd crm-pro-dashboard

# Configurar .env
cp .env.example .env
# Editar .env conforme necessário

# Iniciar todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 2. Docker Compose Simples

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: crm_pro_db
      POSTGRES_USER: crm_pro_user
      POSTGRES_PASSWORD: sua_senha_aqui
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  postgres_data:
  redis_data:
```

---

## ✅ Verificação da Instalação

### 1. Verificar Aplicação

```bash
# Iniciar aplicação
npm run dev

# Verificar se está rodando
curl http://localhost:3000

# Verificar API
curl http://localhost:3000/api/health
```

### 2. Verificar Banco de Dados

```bash
# Testar conexão PostgreSQL
npx prisma studio

# Testar conexão Redis
redis-cli ping
```

### 3. Verificar Integrações

```bash
# Testar OpenAI
curl -X POST http://localhost:3000/api/ai/test

# Testar Gmail
curl -X GET http://localhost:3000/api/gmail/auth-url

# Testar Stripe
curl -X POST http://localhost:3000/api/stripe/test
```

### 4. Verificar Docker (se aplicável)

```bash
# Verificar containers
docker ps

# Verificar logs
docker-compose logs

# Verificar saúde dos serviços
docker-compose ps
```

---

## 🔧 Solução de Problemas

### Problemas Comuns

#### 1. Erro de Dependências
```bash
# Limpar cache npm
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 2. Erro de Conexão com Banco
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar conexão
psql -h localhost -U crm_pro_user -d crm_pro_db
```

#### 3. Erro de Porta Ocupada
```bash
# Verificar portas em uso
netstat -tlnp | grep :3000

# Matar processo na porta 3000
kill -9 $(lsof -ti:3000)
```

#### 4. Erro de Permissões
```bash
# Corrigir permissões
sudo chown -R $USER:$USER .
chmod -R 755 .
```

### Logs e Debug

```bash
# Verificar logs da aplicação
tail -f logs/app.log

# Verificar logs do banco
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Verificar logs do Redis
sudo tail -f /var/log/redis/redis-server.log
```

### Comandos Úteis

```bash
# Verificar status dos serviços
sudo systemctl status postgresql redis

# Reiniciar serviços
sudo systemctl restart postgresql redis

# Verificar versões
node --version
npm --version
psql --version
redis-cli --version
```

---

## 📚 Próximos Passos

1. 📖 Ler a [Documentação da API](./API_REFERENCE.md)
2. 🎨 Configurar [Design System](./DESIGN_SYSTEM.md)
3. 🔐 Implementar [Configurações de Segurança](./SECURITY.md)
4. 🚀 Preparar [Deploy em Produção](./DEPLOYMENT.md)

---

## 🆘 Suporte

- 📧 Email: suporte@crmprodb.com
- 💬 Discord: [CRM Pro Community](https://discord.gg/crmprodb)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/crm-pro-dashboard/issues)

---

**✨ Parabéns! Sua instalação do CRM Pro Dashboard está concluída!**
