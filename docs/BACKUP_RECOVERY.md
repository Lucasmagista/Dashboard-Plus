# 🛡️ Backup & Recovery - CRM Pro Dashboard

<div align="center">

![Backup](https://img.shields.io/badge/Backup-Automated-green?style=for-the-badge&logo=shield)
![Recovery](https://img.shields.io/badge/Recovery-Tested-blue?style=for-the-badge&logo=database)

**Estratégias de backup e recuperação para garantir a continuidade do negócio**

</div>

---

## 🎯 Visão Geral

Este guia aborda as estratégias de backup, recuperação e continuidade de negócio para o CRM Pro Dashboard, garantindo que seus dados críticos estejam sempre protegidos e recuperáveis.

---

## 📋 Estratégia de Backup

### 🗄️ Componentes para Backup

| Componente | Tipo | Frequência | Retenção | Prioridade |
|------------|------|------------|----------|------------|
| **PostgreSQL** | Database | A cada 6h | 30 dias | 🔴 Crítica |
| **Redis** | Cache/Sessions | Diário | 7 dias | 🟡 Média |
| **Uploads/Media** | Files | Diário | 90 dias | 🟠 Alta |
| **Configurações** | Config | Semanal | 30 dias | 🟡 Média |
| **Logs** | Logs | Diário | 14 dias | 🟢 Baixa |
| **n8n Workflows** | Config | Diário | 30 dias | 🟠 Alta |

### 📊 Tipos de Backup

#### 1. Backup Completo (Full)
- **Frequência**: Semanal (domingos 02:00)
- **Conteúdo**: Todos os dados e configurações
- **Tempo**: ~2-4 horas
- **Armazenamento**: 3 locais diferentes

#### 2. Backup Incremental
- **Frequência**: A cada 6 horas
- **Conteúdo**: Apenas alterações desde último backup
- **Tempo**: ~15-30 minutos
- **Armazenamento**: Local + Cloud

#### 3. Backup de Transação (Point-in-Time)
- **Frequência**: Contínuo (WAL)
- **Conteúdo**: Log de transações
- **Tempo**: Tempo real
- **Retenção**: 24 horas

---

## 🐳 Backup com Docker

### Configuração do Docker Compose

```yaml
version: '3.8'

services:
  backup-manager:
    image: postgres:15-alpine
    environment:
      PGPASSWORD: ${DB_PASSWORD}
    volumes:
      - ./backups:/backups
      - ./scripts:/scripts
    depends_on:
      - postgres
    command: |
      sh -c "
        echo '0 */6 * * * /scripts/backup-incremental.sh' >> /etc/crontabs/root
        echo '0 2 * * 0 /scripts/backup-full.sh' >> /etc/crontabs/root
        crond -f
      "

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgresql.conf:/etc/postgresql/postgresql.conf
    command: postgres -c config_file=/etc/postgresql/postgresql.conf

volumes:
  postgres_data:
```

### Scripts de Backup

#### Backup Completo (`backup-full.sh`)

```bash
#!/bin/bash

# Configurações
BACKUP_DIR="/backups"
DB_NAME="${DB_NAME:-crm_dashboard}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-postgres}"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Criar diretório se não existir
mkdir -p "$BACKUP_DIR/full"

# Backup do PostgreSQL
echo "Iniciando backup completo do PostgreSQL..."
pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
  --verbose --clean --if-exists --create \
  --format=custom \
  --file="$BACKUP_DIR/full/postgres_full_$DATE.backup"

# Verificar se backup foi criado
if [ $? -eq 0 ]; then
    echo "✅ Backup PostgreSQL criado com sucesso"
    
    # Compactar backup
    gzip "$BACKUP_DIR/full/postgres_full_$DATE.backup"
    echo "✅ Backup compactado"
else
    echo "❌ Erro no backup PostgreSQL"
    exit 1
fi

# Backup do Redis
echo "Iniciando backup do Redis..."
redis-cli --rdb "$BACKUP_DIR/full/redis_full_$DATE.rdb"

# Backup de arquivos (uploads, configurações)
echo "Iniciando backup de arquivos..."
tar -czf "$BACKUP_DIR/full/files_full_$DATE.tar.gz" \
  /app/uploads \
  /app/.env.local \
  /app/n8n/data

# Cleanup - remover backups antigos
echo "Removendo backups antigos..."
find "$BACKUP_DIR/full" -name "*.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR/full" -name "*.rdb" -mtime +$RETENTION_DAYS -delete

# Upload para cloud (opcional)
if [ ! -z "$AWS_S3_BUCKET" ]; then
    echo "Enviando para S3..."
    aws s3 sync "$BACKUP_DIR/full" "s3://$AWS_S3_BUCKET/backups/full/"
fi

echo "✅ Backup completo finalizado: $DATE"
```

#### Backup Incremental (`backup-incremental.sh`)

```bash
#!/bin/bash

# Configurações
BACKUP_DIR="/backups"
DB_NAME="${DB_NAME:-crm_dashboard}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-postgres}"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_HOURS=168  # 7 dias

# Criar diretório se não existir
mkdir -p "$BACKUP_DIR/incremental"

# Backup incremental usando WAL
echo "Iniciando backup incremental..."
pg_basebackup -h "$DB_HOST" -U "$DB_USER" -D "$BACKUP_DIR/incremental/base_$DATE" \
  --format=tar --gzip --progress --verbose \
  --wal-method=stream

if [ $? -eq 0 ]; then
    echo "✅ Backup incremental criado com sucesso"
else
    echo "❌ Erro no backup incremental"
    exit 1
fi

# Backup de dados alterados (últimas 6 horas)
echo "Backup de dados modificados recentemente..."
pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
  --table=logs --table=user_sessions \
  --where="updated_at >= NOW() - INTERVAL '6 hours'" \
  --format=custom \
  --file="$BACKUP_DIR/incremental/recent_data_$DATE.backup"

# Cleanup
find "$BACKUP_DIR/incremental" -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup incremental finalizado: $DATE"
```

---

## 🔄 Procedimentos de Recovery

### 1. Recovery Completo

#### Cenário: Perda total do banco

```bash
#!/bin/bash
# recovery-full.sh

BACKUP_FILE="$1"
DB_NAME="${DB_NAME:-crm_dashboard}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-postgres}"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

echo "🔄 Iniciando recovery completo..."

# 1. Parar aplicação
docker-compose stop app n8n

# 2. Parar PostgreSQL temporariamente
docker-compose stop postgres

# 3. Remover dados antigos (CUIDADO!)
docker volume rm crm-dashboard_postgres_data

# 4. Recriar volume
docker volume create crm-dashboard_postgres_data

# 5. Iniciar PostgreSQL
docker-compose up -d postgres

# 6. Aguardar PostgreSQL estar pronto
until docker-compose exec postgres pg_isready -U postgres; do
    echo "Aguardando PostgreSQL..."
    sleep 2
done

# 7. Restaurar backup
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | pg_restore -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" --verbose --clean --if-exists
else
    pg_restore -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" --verbose --clean --if-exists "$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
    echo "✅ Recovery do banco concluído"
else
    echo "❌ Erro no recovery do banco"
    exit 1
fi

# 8. Verificar integridade
echo "🔍 Verificando integridade dos dados..."
docker-compose exec postgres psql -U postgres -d "$DB_NAME" -c "
    SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes
    FROM pg_stat_user_tables 
    ORDER BY n_tup_ins DESC 
    LIMIT 10;
"

# 9. Reiniciar aplicação
docker-compose up -d app n8n

echo "✅ Recovery completo finalizado"
```

### 2. Point-in-Time Recovery

```bash
#!/bin/bash
# recovery-point-in-time.sh

TARGET_TIME="$1"  # Format: 2024-01-15 14:30:00

if [ -z "$TARGET_TIME" ]; then
    echo "Usage: $0 'YYYY-MM-DD HH:MM:SS'"
    exit 1
fi

echo "🔄 Iniciando Point-in-Time Recovery para: $TARGET_TIME"

# 1. Parar aplicação
docker-compose stop app

# 2. Criar backup de segurança atual
pg_dump -h postgres -U postgres crm_dashboard > "/backups/before_pitr_$(date +%Y%m%d_%H%M%S).sql"

# 3. Configurar recovery
cat > /tmp/recovery.conf << EOF
restore_command = 'cp /var/lib/postgresql/archive/%f %p'
recovery_target_time = '$TARGET_TIME'
recovery_target_action = 'promote'
EOF

# 4. Copiar configuração
docker cp /tmp/recovery.conf postgres:/var/lib/postgresql/data/

# 5. Reiniciar PostgreSQL em modo recovery
docker-compose restart postgres

# 6. Aguardar recovery
echo "Aguardando conclusão do recovery..."
sleep 30

# 7. Verificar status
docker-compose exec postgres psql -U postgres -c "SELECT pg_is_in_recovery();"

echo "✅ Point-in-Time Recovery concluído"
```

### 3. Recovery de Arquivos

```bash
#!/bin/bash
# recovery-files.sh

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <files_backup.tar.gz>"
    exit 1
fi

echo "🔄 Restaurando arquivos..."

# 1. Extrair backup
tar -xzf "$BACKUP_FILE" -C /tmp/

# 2. Restaurar uploads
cp -r /tmp/app/uploads/* /app/uploads/

# 3. Restaurar configurações (com cuidado)
echo "⚠️  Deseja restaurar configurações? (y/N)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    cp /tmp/app/.env.local /app/.env.local.restored
    echo "✅ Configurações salvas como .env.local.restored"
fi

# 4. Restaurar dados do n8n
cp -r /tmp/app/n8n/data/* /app/n8n/data/

echo "✅ Recovery de arquivos concluído"
```

---

## 🏥 Monitoramento e Alertas

### Scripts de Monitoramento

#### Verificação de Backup (`check-backup.sh`)

```bash
#!/bin/bash

BACKUP_DIR="/backups"
EMAIL_ALERT="admin@empresa.com"
SLACK_WEBHOOK="$SLACK_WEBHOOK_URL"

# Verificar último backup
LAST_BACKUP=$(find "$BACKUP_DIR" -name "*.gz" -mtime -1 | wc -l)

if [ "$LAST_BACKUP" -eq 0 ]; then
    MESSAGE="❌ ALERTA: Nenhum backup foi criado nas últimas 24 horas!"
    
    # Enviar email
    echo "$MESSAGE" | mail -s "Backup Alert - CRM Dashboard" "$EMAIL_ALERT"
    
    # Enviar para Slack
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"$MESSAGE\"}" \
        "$SLACK_WEBHOOK"
    
    exit 1
else
    echo "✅ Backup verificado: $LAST_BACKUP arquivo(s) encontrado(s)"
fi

# Verificar integridade do último backup
LATEST_BACKUP=$(find "$BACKUP_DIR" -name "*.backup.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2)

if [ ! -z "$LATEST_BACKUP" ]; then
    # Teste básico de integridade
    gunzip -t "$LATEST_BACKUP"
    if [ $? -eq 0 ]; then
        echo "✅ Integridade do backup verificada"
    else
        echo "❌ ERRO: Backup corrompido - $LATEST_BACKUP"
        exit 1
    fi
fi
```

### Dashboard de Backup

```sql
-- Query para monitorar status de backups
CREATE VIEW backup_status AS
SELECT 
    'PostgreSQL' as component,
    MAX(created_at) as last_backup,
    COUNT(*) as total_backups,
    CASE 
        WHEN MAX(created_at) > NOW() - INTERVAL '6 hours' THEN 'OK'
        WHEN MAX(created_at) > NOW() - INTERVAL '24 hours' THEN 'WARNING'
        ELSE 'CRITICAL'
    END as status
FROM backup_log
WHERE component = 'postgres'

UNION ALL

SELECT 
    'Files' as component,
    MAX(created_at) as last_backup,
    COUNT(*) as total_backups,
    CASE 
        WHEN MAX(created_at) > NOW() - INTERVAL '24 hours' THEN 'OK'
        WHEN MAX(created_at) > NOW() - INTERVAL '48 hours' THEN 'WARNING'
        ELSE 'CRITICAL'
    END as status
FROM backup_log
WHERE component = 'files';
```

---

## 🧪 Testes de Recovery

### Plano de Testes Mensais

#### 1. Teste de Backup Automático

```bash
# Executar mensalmente
./scripts/test-backup-recovery.sh
```

#### 2. Teste de Recovery Completo

```bash
#!/bin/bash
# test-backup-recovery.sh

echo "🧪 Iniciando teste de recovery..."

# 1. Criar ambiente de teste
docker-compose -f docker-compose.test.yml up -d

# 2. Restaurar último backup
LATEST_BACKUP=$(find /backups -name "*.backup.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2)
./scripts/recovery-full.sh "$LATEST_BACKUP"

# 3. Executar testes de integridade
npm run test:database
npm run test:api

# 4. Limpar ambiente de teste
docker-compose -f docker-compose.test.yml down -v

echo "✅ Teste de recovery concluído"
```

### Checklist de Teste Semanal

- [ ] Verificar execução automática de backups
- [ ] Testar integridade dos arquivos de backup
- [ ] Validar rotação de backups antigos
- [ ] Confirmar upload para cloud storage
- [ ] Testar restore de um backup recente
- [ ] Verificar logs de erro
- [ ] Confirmar alertas funcionando

---

## 📊 Métricas e Relatórios

### KPIs de Backup

| Métrica | Meta | Atual | Status |
|---------|------|-------|--------|
| **RTO** (Recovery Time) | < 1 hora | 45 min | ✅ |
| **RPO** (Recovery Point) | < 6 horas | 4 horas | ✅ |
| **Disponibilidade** | 99.9% | 99.95% | ✅ |
| **Tamanho Backup** | < 10GB | 8.2GB | ✅ |
| **Tempo Backup** | < 30 min | 22 min | ✅ |

### Relatório Mensal

```sql
-- Relatório de backups do último mês
SELECT 
    DATE(created_at) as backup_date,
    component,
    COUNT(*) as backups_count,
    AVG(size_mb) as avg_size_mb,
    AVG(duration_minutes) as avg_duration_min,
    SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
FROM backup_log 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), component
ORDER BY backup_date DESC, component;
```

---

## 🚨 Plano de Contingência

### Cenários de Disaster Recovery

#### Cenário 1: Corrupção de Dados

**Sintomas:**
- Erros de consulta no banco
- Dados inconsistentes
- Aplicação travando

**Ação:**
1. Isolar problema
2. Point-in-time recovery
3. Validar integridade
4. Monitorar por 24h

#### Cenário 2: Perda do Servidor

**Sintomas:**
- Servidor inacessível
- Hardware falhou
- Datacenter indisponível

**Ação:**
1. Ativar servidor backup
2. Restore completo
3. Redirecionamento DNS
4. Comunicar usuários

#### Cenário 3: Ataque Ransomware

**Sintomas:**
- Arquivos criptografados
- Sistema comprometido
- Demanda de resgate

**Ação:**
1. Isolar sistemas
2. Não pagar resgate
3. Restore de backup limpo
4. Investigação forense
5. Hardening de segurança

---

## 📞 Contatos de Emergência

### Equipe de Resposta

| Função | Nome | Telefone | Email |
|--------|------|----------|-------|
| **Lead DevOps** | João Silva | +55 11 99999-1111 | joao@empresa.com |
| **DBA** | Maria Santos | +55 11 99999-2222 | maria@empresa.com |
| **Security** | Pedro Lima | +55 11 99999-3333 | pedro@empresa.com |
| **CEO** | Ana Costa | +55 11 99999-4444 | ana@empresa.com |

### Fornecedores

| Serviço | Contato | SLA |
|---------|---------|-----|
| **AWS Support** | Enterprise | 15 min |
| **PostgreSQL** | Consultant | 2 horas |
| **Docker** | Business | 4 horas |

---

<div align="center">

**🛡️ Backup é seguro, Recovery é certeza!**

[🔧 Troubleshooting](./TROUBLESHOOTING.md) • [📊 Monitoring](./MONITORING.md) • [🔐 Security](./SECURITY.md)

</div>
