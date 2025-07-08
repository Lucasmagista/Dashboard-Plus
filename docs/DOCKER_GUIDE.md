# 🐳 Guia Completo Docker - Dashboard CRM Pro

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Estrutura dos Arquivos Docker](#estrutura-dos-arquivos-docker)
4. [Configuração do Ambiente (.env)](#configuração-do-ambiente-env)
5. [Docker Compose Simples](#docker-compose-simples)
6. [Docker Compose Microservices](#docker-compose-microservices)
7. [Comandos Docker Essenciais](#comandos-docker-essenciais)
8. [Monitoramento e Logs](#monitoramento-e-logs)
9. [Troubleshooting](#troubleshooting)
10. [Produção](#produção)

---

## 🎯 Visão Geral

O projeto utiliza Docker para containerizar os serviços de infraestrutura necessários para o funcionamento do dashboard. Temos duas configurações principais:

- **docker-compose.simple.yml**: Infraestrutura básica (PostgreSQL, Redis, Nginx, Prometheus, Grafana)
- **docker-compose.microservices.yml**: Arquitetura completa com microserviços personalizados

## 🛠️ Pré-requisitos

### Docker Desktop
- **Windows**: [Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/install/)
- **macOS**: [Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install/)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/)

### Versões Mínimas
- Docker: 20.10.0+
- Docker Compose: 2.0.0+
- RAM: 4GB disponível
- Espaço em disco: 10GB

### Verificação
```bash
# Verificar versões
docker --version
docker-compose --version

# Verificar se Docker está rodando
docker info
```

---

## 📁 Estrutura dos Arquivos Docker

```
dashboarrd-main/
├── 🐳 docker-compose.simple.yml      # Infraestrutura básica
├── 🐳 docker-compose.microservices.yml # Arquitetura completa
├── 📁 nginx/
│   └── nginx.conf                    # Configuração do Nginx
├── 📁 monitoring/
│   └── prometheus.yml                # Configuração do Prometheus
├── 📄 .env.example                   # Exemplo de variáveis
├── 📄 .env                          # Variáveis de ambiente
└── 📄 Dockerfile                    # (Futuro) Dockerfile da aplicação
```

---

## ⚙️ Configuração do Ambiente (.env)

### 🔴 CRÍTICO: Configurar .env Antes de Iniciar

O arquivo `.env` contém todas as variáveis de ambiente necessárias. **NUNCA** inicie os containers sem configurar adequadamente este arquivo.

### Processo de Configuração

1. **Copiar o arquivo exemplo**:
```bash
cp .env.example .env
```

2. **Configurar seções obrigatórias**:

#### 🔵 Seção Database (OBRIGATÓRIA)
```env
# Database Configuration
DATABASE_URL=postgresql://dashboard:dashboard123@postgres:5432/dashboard
POSTGRES_DB=dashboard
POSTGRES_USER=dashboard
POSTGRES_PASSWORD=ALTERAR_SENHA_AQUI  # ⚠️ OBRIGATÓRIO alterar
```

#### 🔵 Seção Redis (OBRIGATÓRIA)
```env
# Redis Cache Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=ALTERAR_SENHA_AQUI  # ⚠️ OBRIGATÓRIO alterar
REDIS_DB=0
```

#### 🔵 Seção Grafana (OBRIGATÓRIA)
```env
# Grafana
GRAFANA_URL=http://grafana:3000
GRAFANA_USER=admin
GRAFANA_PASSWORD=ALTERAR_SENHA_AQUI  # ⚠️ OBRIGATÓRIO alterar
```

#### 🔵 Seção Segurança (OBRIGATÓRIA)
```env
# Authentication & Security
NEXTAUTH_SECRET=GERAR_CHAVE_SECRETA_AQUI  # ⚠️ OBRIGATÓRIO - use: openssl rand -base64 32
JWT_SECRET=GERAR_CHAVE_SECRETA_AQUI      # ⚠️ OBRIGATÓRIO - use: openssl rand -base64 32
ENCRYPTION_KEY=GERAR_CHAVE_SECRETA_AQUI  # ⚠️ OBRIGATÓRIO - use: openssl rand -base64 32
```

### 🔐 Gerando Chaves Seguras

```bash
# Gerar chaves secretas (Linux/Mac/WSL)
openssl rand -base64 32

# Gerar chaves secretas (Windows PowerShell)
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Gerar chaves secretas (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 🔧 Configurações Opcionais (Integrações)

#### Gmail/Outlook
```env
# Gmail Integration
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REDIRECT_URI=https://dashboard.local/auth/gmail/callback
```

#### Shopify/WooCommerce
```env
# Shopify Integration
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
SHOPIFY_WEBHOOK_SECRET=your-shopify-webhook-secret
```

#### OpenAI/ChatGPT
```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2048
```

---

## 🚀 Docker Compose Simples

### Serviços Incluídos
- **PostgreSQL**: Banco de dados principal
- **Redis**: Cache e sessões
- **Nginx**: Proxy reverso e load balancer
- **Prometheus**: Coleta de métricas
- **Grafana**: Dashboards e visualizações

### Comandos Básicos

```bash
# Iniciar todos os serviços
docker-compose -f docker-compose.simple.yml up -d

# Verificar status
docker-compose -f docker-compose.simple.yml ps

# Ver logs
docker-compose -f docker-compose.simple.yml logs -f

# Parar serviços
docker-compose -f docker-compose.simple.yml down

# Parar e remover volumes (⚠️ APAGA DADOS)
docker-compose -f docker-compose.simple.yml down -v
```

### Portas Expostas
- **PostgreSQL**: 5432
- **Redis**: 6379
- **Nginx**: 80, 443
- **Prometheus**: 9090
- **Grafana**: 3001 (mapeada para 3000 interno)

### URLs de Acesso
- **Grafana**: http://localhost:3001
- **Prometheus**: http://localhost:9090
- **Nginx Status**: http://localhost/nginx_status

---

## 🏗️ Docker Compose Microservices

### Serviços Incluídos
- Todos os serviços do Simple +
- **API Gateway**: Gerenciamento de rotas
- **Auth Service**: Autenticação e autorização
- **User Service**: Gerenciamento de usuários
- **Integration Service**: Integrações externas
- **Notification Service**: Notificações
- **Analytics Service**: Análise de dados

### ⚠️ Pré-requisitos Adicionais

```bash
# Criar estrutura de microserviços (se não existir)
mkdir -p services/{auth,user,integration,notification,analytics}

# Cada serviço precisa de um Dockerfile
touch services/auth/Dockerfile
touch services/user/Dockerfile
touch services/integration/Dockerfile
touch services/notification/Dockerfile
touch services/analytics/Dockerfile
```

### Comandos Microservices

```bash
# Iniciar arquitetura completa
docker-compose -f docker-compose.microservices.yml up -d

# Verificar status
docker-compose -f docker-compose.microservices.yml ps

# Escalar serviços específicos
docker-compose -f docker-compose.microservices.yml up -d --scale user-service=3

# Logs de serviço específico
docker-compose -f docker-compose.microservices.yml logs -f user-service

# Parar arquitetura
docker-compose -f docker-compose.microservices.yml down
```

---

## 📋 Comandos Docker Essenciais

### Gestão de Containers
```bash
# Listar containers rodando
docker ps

# Listar todos os containers
docker ps -a

# Entrar em container
docker exec -it <container_name> bash

# Ver logs de container
docker logs -f <container_name>

# Remover container
docker rm <container_name>

# Remover container forçadamente
docker rm -f <container_name>
```

### Gestão de Imagens
```bash
# Listar imagens
docker images

# Remover imagem
docker rmi <image_name>

# Limpar imagens não utilizadas
docker image prune

# Limpar tudo não utilizado
docker system prune -a
```

### Gestão de Volumes
```bash
# Listar volumes
docker volume ls

# Criar volume
docker volume create <volume_name>

# Remover volume
docker volume rm <volume_name>

# Limpar volumes não utilizados
docker volume prune
```

### Gestão de Redes
```bash
# Listar redes
docker network ls

# Criar rede
docker network create <network_name>

# Inspecionar rede
docker network inspect <network_name>

# Remover rede
docker network rm <network_name>
```

---

## 📊 Monitoramento e Logs

### Prometheus
```bash
# Acessar métricas
curl http://localhost:9090/metrics

# Verificar configuração
docker exec -it dashboard-prometheus cat /etc/prometheus/prometheus.yml

# Recarregar configuração
docker exec -it dashboard-prometheus killall -HUP prometheus
```

### Grafana
```bash
# Credenciais padrão
# Usuário: admin
# Senha: definida em GRAFANA_PASSWORD no .env

# Importar dashboard
# 1. Acesse http://localhost:3001
# 2. Vá em "+" > "Import"
# 3. Use ID: 1860 (Node Exporter Full)
```

### Logs Centralizados
```bash
# Todos os logs
docker-compose -f docker-compose.simple.yml logs -f

# Logs específicos
docker-compose -f docker-compose.simple.yml logs -f postgres
docker-compose -f docker-compose.simple.yml logs -f redis
docker-compose -f docker-compose.simple.yml logs -f nginx

# Logs com timestamp
docker-compose -f docker-compose.simple.yml logs -f -t

# Últimas N linhas
docker-compose -f docker-compose.simple.yml logs --tail=100
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. **Containers não iniciam**
```bash
# Verificar logs
docker-compose -f docker-compose.simple.yml logs

# Verificar arquivos .env
cat .env | grep -E "(DATABASE|REDIS|GRAFANA).*="

# Verificar portas ocupadas
netstat -tulpn | grep -E "(5432|6379|3001|9090)"
```

#### 2. **Erro de permissão**
```bash
# Linux/Mac - corrigir permissões
sudo chown -R $USER:$USER .
sudo chmod -R 755 .

# Windows - executar como administrador
```

#### 3. **Banco de dados não conecta**
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Testar conexão
docker exec -it dashboard-postgres psql -U dashboard -d dashboard

# Verificar logs do banco
docker logs dashboard-postgres
```

#### 4. **Redis não conecta**
```bash
# Verificar se Redis está rodando
docker ps | grep redis

# Testar conexão
docker exec -it dashboard-redis redis-cli ping

# Verificar logs do Redis
docker logs dashboard-redis
```

#### 5. **Grafana não carrega**
```bash
# Verificar se Grafana está rodando
docker ps | grep grafana

# Verificar se porta 3001 está livre
netstat -tulpn | grep 3001

# Acessar logs do Grafana
docker logs dashboard-grafana
```

### Comandos de Diagnóstico

```bash
# Verificar saúde dos containers
docker-compose -f docker-compose.simple.yml ps

# Verificar uso de recursos
docker stats

# Verificar configurações de rede
docker network inspect dashboarrd-main_dashboard_network

# Verificar volumes
docker volume inspect dashboarrd-main_postgres_data
docker volume inspect dashboarrd-main_redis_data
```

### Reset Completo

```bash
# ⚠️ CUIDADO: Apaga todos os dados
docker-compose -f docker-compose.simple.yml down -v
docker system prune -a --volumes
docker network prune
docker volume prune
```

---

## 🚀 Produção

### Configurações de Produção

#### 1. **Arquivo .env.production**
```env
# NUNCA usar senhas padrão em produção
POSTGRES_PASSWORD=<senha_super_segura>
REDIS_PASSWORD=<senha_super_segura>
GRAFANA_PASSWORD=<senha_super_segura>

# URLs de produção
NEXTAUTH_URL=https://dashboard.suaempresa.com
GRAFANA_URL=https://grafana.suaempresa.com

# SSL/TLS
HTTPS_ENABLED=true
SSL_CERT_PATH=/app/certs/ssl.crt
SSL_KEY_PATH=/app/certs/ssl.key
```

#### 2. **Docker Compose Produção**
```yaml
# docker-compose.production.yml
version: '3.8'

services:
  postgres:
    restart: always
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password
    secrets:
      - postgres_password
    
  redis:
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    
  nginx:
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /path/to/ssl:/etc/nginx/ssl:ro

secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
```

#### 3. **Backups Automáticos**
```bash
# Script de backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)

# Backup PostgreSQL
docker exec dashboard-postgres pg_dump -U dashboard dashboard > backup_${DATE}.sql

# Backup Redis
docker exec dashboard-redis redis-cli --rdb backup_redis_${DATE}.rdb

# Backup volumes
docker run --rm -v dashboarrd-main_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_data_${DATE}.tar.gz /data
```

#### 4. **Monitoramento Avançado**
```yaml
# Adicionar ao docker-compose.production.yml
  node-exporter:
    image: prom/node-exporter
    ports:
      - "9100:9100"
    
  alertmanager:
    image: prom/alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
```

### Checklist de Produção

- [ ] Senhas alteradas e seguras
- [ ] SSL/TLS configurado
- [ ] Backups automáticos
- [ ] Monitoramento configurado
- [ ] Logs centralizados
- [ ] Firewall configurado
- [ ] Volumes persistentes
- [ ] Restart policies definidas
- [ ] Secrets management
- [ ] Health checks configurados

---

## 📚 Referências e Links Úteis

### Documentação Oficial
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)
- [Prometheus Docker Image](https://hub.docker.com/r/prom/prometheus)
- [Grafana Docker Image](https://hub.docker.com/r/grafana/grafana)

### Ferramentas Úteis
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Portainer](https://www.portainer.io/) - Interface web para Docker
- [Watchtower](https://containrrr.dev/watchtower/) - Auto-update containers
- [Traefik](https://traefik.io/) - Reverse proxy alternativo

### Dashboards Grafana Recomendados
- **ID: 1860** - Node Exporter Full
- **ID: 763** - Redis Dashboard
- **ID: 9628** - PostgreSQL Database
- **ID: 12159** - Nginx Dashboard

---

## 🆘 Suporte

### Comandos de Ajuda
```bash
# Ajuda do Docker
docker --help
docker-compose --help

# Ajuda de comandos específicos
docker run --help
docker exec --help
```

### Logs de Debug
```bash
# Habilitar debug mode
export COMPOSE_LOG_LEVEL=DEBUG

# Executar com verbose
docker-compose -f docker-compose.simple.yml --verbose up -d
```

### Contatos
- **Documentação**: Este arquivo
- **Issues**: Criar issue no repositório
- **Logs**: Sempre incluir logs completos em relatórios de bugs

---

## 📄 Changelog

### v1.0.0 - 2025-01-07
- ✅ Configuração inicial Docker Compose
- ✅ Infraestrutura básica (PostgreSQL, Redis, Nginx)
- ✅ Monitoramento (Prometheus, Grafana)
- ✅ Documentação completa
- ✅ Troubleshooting detalhado

---

**🎉 Parabéns! Você agora tem um guia completo para usar Docker no seu projeto Dashboard CRM Pro!**

> **💡 Dica**: Sempre teste as configurações em ambiente de desenvolvimento antes de aplicar em produção.
