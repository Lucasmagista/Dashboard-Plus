"use client"

import { useState } from "react"
import { 
  ArrowLeft,
  Database,
  Zap,
  Activity,
  BarChart3,
  Settings,
  Clock,
  User,
  Star,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Server,
  HardDrive,
  Network,
  Code,
  Copy,
  Monitor,
  Search,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function DatabaseOptimizationGuide() {
  const [copiedCode, setCopiedCode] = useState("")

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(""), 2000)
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/docs/guides" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Guias
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Otimização de Performance</h1>
            <p className="text-muted-foreground">Técnicas para otimizar a performance do sistema com grandes volumes de dados</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            35 min de leitura
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            System Admin
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            4.4 (89 avaliações)
          </div>
          <Badge variant="destructive">Avançado</Badge>
          <Badge variant="outline">Técnico</Badge>
        </div>
      </div>

      {/* Alert de Performance */}
      <Alert className="mb-8 border-orange-200 dark:border-orange-800">
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>Performance é Crucial!</AlertTitle>
        <AlertDescription>
          Com o crescimento dos dados, a otimização se torna essencial para manter a experiência do usuário fluida.
        </AlertDescription>
      </Alert>

      {/* Métricas de Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Métricas de Performance Atuais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">2.3s</div>
              <div className="text-sm text-muted-foreground">Tempo de resposta médio</div>
              <Progress value={85} className="mt-2" />
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">156K</div>
              <div className="text-sm text-muted-foreground">Queries por minuto</div>
              <Progress value={70} className="mt-2" />
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <div className="text-sm text-muted-foreground">Taxa de cache hit</div>
              <Progress value={94} className="mt-2" />
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">12GB</div>
              <div className="text-sm text-muted-foreground">Uso de memória</div>
              <Progress value={60} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="indexing" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="indexing">Indexação</TabsTrigger>
          <TabsTrigger value="caching">Cache</TabsTrigger>
          <TabsTrigger value="queries">Queries</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>

        <TabsContent value="indexing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Estratégias de Indexação
              </CardTitle>
              <CardDescription>
                Como criar e otimizar índices para melhor performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Tipos de Índices</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Índice Simples</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Para colunas frequentemente consultadas
                    </p>
                    <div className="bg-background p-3 rounded border font-mono text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span>SQL</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(`CREATE INDEX idx_email ON users(email);`, "simple-index")}
                        >
                          {copiedCode === "simple-index" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <pre className="text-muted-foreground">CREATE INDEX idx_email ON users(email);</pre>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Índice Composto</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Para consultas com múltiplas colunas
                    </p>
                    <div className="bg-background p-3 rounded border font-mono text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span>SQL</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(`CREATE INDEX idx_status_date ON contacts(status, created_at);`, "composite-index")}
                        >
                          {copiedCode === "composite-index" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <pre className="text-muted-foreground">CREATE INDEX idx_status_date ON contacts(status, created_at);</pre>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Análise de Performance de Índices</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Use estas queries para analisar a eficiência dos seus índices:
                  </p>
                  <div className="bg-background p-3 rounded border font-mono text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span>Análise de Uso de Índices</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`-- Verificar índices não utilizados
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE idx_scan = 0
ORDER BY schemaname, tablename;

-- Verificar tamanho dos índices
SELECT 
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes 
ORDER BY pg_relation_size(indexrelid) DESC;`, "index-analysis")}
                      >
                        {copiedCode === "index-analysis" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <pre className="text-muted-foreground whitespace-pre-wrap">{`-- Verificar índices não utilizados
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE idx_scan = 0
ORDER BY schemaname, tablename;

-- Verificar tamanho dos índices
SELECT 
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes 
ORDER BY pg_relation_size(indexrelid) DESC;`}</pre>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Cuidado com Over-Indexing</AlertTitle>
                <AlertDescription>
                  Muitos índices podem degradar a performance de INSERTs e UPDATEs. Monitore regularmente o uso dos índices.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caching" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Estratégias de Cache
              </CardTitle>
              <CardDescription>
                Implementando diferentes níveis de cache para máxima performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Níveis de Cache</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Cache de Aplicação</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Redis/Memcached para dados frequentes
                    </p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Sessões de usuário</li>
                      <li>• Resultados de consultas</li>
                      <li>• Configurações do sistema</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Cache de Banco</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Buffer pool e query cache
                    </p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Páginas de dados em memória</li>
                      <li>• Planos de execução</li>
                      <li>• Metadados de tabelas</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium text-purple-600 dark:text-purple-400 mb-2">Cache de CDN</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Assets estáticos e APIs
                    </p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Imagens e documentos</li>
                      <li>• Respostas de API</li>
                      <li>• Arquivos CSS/JS</li>
                    </ul>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Implementação de Cache Redis</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Exemplo de implementação de cache para consultas de contatos:
                  </p>
                  <div className="bg-background p-3 rounded border font-mono text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span>Node.js + Redis</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`const redis = require('redis');
const client = redis.createClient();

async function getContacts(userId, filters = {}) {
  const cacheKey = \`contacts:\${userId}:\${JSON.stringify(filters)}\`;
  
  // Tentar cache primeiro
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Se não houver cache, consultar banco
  const contacts = await db.query('SELECT * FROM contacts WHERE user_id = ?', [userId]);
  
  // Armazenar no cache por 5 minutos
  await client.setex(cacheKey, 300, JSON.stringify(contacts));
  
  return contacts;
}

// Invalidar cache quando dados mudarem
async function updateContact(contactId, data) {
  await db.query('UPDATE contacts SET ? WHERE id = ?', [data, contactId]);
  
  // Invalidar cache relacionado
  const keys = await client.keys(\`contacts:\${data.user_id}:*\`);
  if (keys.length > 0) {
    await client.del(keys);
  }
}`, "redis-cache")}
                      >
                        {copiedCode === "redis-cache" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <pre className="text-muted-foreground whitespace-pre-wrap">{`const redis = require('redis');
const client = redis.createClient();

async function getContacts(userId, filters = {}) {
  const cacheKey = \`contacts:\${userId}:\${JSON.stringify(filters)}\`;
  
  // Tentar cache primeiro
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Se não houver cache, consultar banco
  const contacts = await db.query('SELECT * FROM contacts WHERE user_id = ?', [userId]);
  
  // Armazenar no cache por 5 minutos
  await client.setex(cacheKey, 300, JSON.stringify(contacts));
  
  return contacts;
}

// Invalidar cache quando dados mudarem
async function updateContact(contactId, data) {
  await db.query('UPDATE contacts SET ? WHERE id = ?', [data, contactId]);
  
  // Invalidar cache relacionado
  const keys = await client.keys(\`contacts:\${data.user_id}:*\`);
  if (keys.length > 0) {
    await client.del(keys);
  }
}`}</pre>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Estratégias de Invalidação</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h5 className="font-medium mb-2">TTL (Time To Live)</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Cache expira automaticamente após tempo definido
                    </p>
                    <div className="text-xs space-y-1">
                      <div>• Configurações: 1 hora</div>
                      <div>• Consultas de relatórios: 15 minutos</div>
                      <div>• Dados de usuário: 5 minutos</div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Invalidação Manual</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Cache removido quando dados são alterados
                    </p>
                    <div className="text-xs space-y-1">
                      <div>• Após CREATE/UPDATE/DELETE</div>
                      <div>• Usando tags para agrupamento</div>
                      <div>• Invalidação em cascata</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Otimização de Queries
              </CardTitle>
              <CardDescription>
                Técnicas para escrever queries mais eficientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Queries Problemáticas Comuns</h4>
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-950/10 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h5 className="font-medium text-red-600 dark:text-red-400 mb-2">❌ N+1 Problem</h5>
                    <div className="bg-background p-3 rounded border font-mono text-xs mb-2">
                      <pre className="text-muted-foreground">{`// Ruim: Executa N+1 queries
const users = await User.findAll();
for (const user of users) {
  user.contacts = await Contact.findAll({ where: { userId: user.id } });
}`}</pre>
                    </div>
                    <div className="bg-background p-3 rounded border font-mono text-xs">
                      <pre className="text-green-600">{`// Bom: Uma query com JOIN
const users = await User.findAll({
  include: [{ model: Contact }]
});`}</pre>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h5 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">⚠️ SELECT *</h5>
                    <div className="bg-background p-3 rounded border font-mono text-xs mb-2">
                      <pre className="text-muted-foreground">{`-- Ruim: Seleciona todas as colunas
SELECT * FROM contacts WHERE status = 'active';`}</pre>
                    </div>
                    <div className="bg-background p-3 rounded border font-mono text-xs">
                      <pre className="text-green-600">{`-- Bom: Seleciona apenas o necessário
SELECT id, name, email, phone FROM contacts WHERE status = 'active';`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Análise de Planos de Execução</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Use EXPLAIN para analisar como o banco executa suas queries:
                  </p>
                  <div className="bg-background p-3 rounded border font-mono text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span>PostgreSQL EXPLAIN</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT c.id, c.name, c.email, u.name as user_name
FROM contacts c
JOIN users u ON c.user_id = u.id
WHERE c.status = 'active'
  AND c.created_at >= '2024-01-01'
ORDER BY c.created_at DESC
LIMIT 100;`, "explain-query")}
                      >
                        {copiedCode === "explain-query" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <pre className="text-muted-foreground whitespace-pre-wrap">{`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT c.id, c.name, c.email, u.name as user_name
FROM contacts c
JOIN users u ON c.user_id = u.id
WHERE c.status = 'active'
  AND c.created_at >= '2024-01-01'
ORDER BY c.created_at DESC
LIMIT 100;`}</pre>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Otimizações Específicas</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Paginação Eficiente</h5>
                    <div className="bg-background p-3 rounded border font-mono text-xs">
                      <pre className="text-muted-foreground">{`-- Usar cursor-based pagination para grandes datasets
SELECT * FROM contacts 
WHERE id > :last_id 
ORDER BY id 
LIMIT 50;

-- Ao invés de OFFSET (que é lento)
SELECT * FROM contacts 
ORDER BY id 
LIMIT 50 OFFSET 10000; -- Evitar!`}</pre>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Agregações Otimizadas</h5>
                    <div className="bg-background p-3 rounded border font-mono text-xs">
                      <pre className="text-muted-foreground">{`-- Usar índices parciais para contadores
CREATE INDEX idx_active_contacts 
ON contacts(user_id) 
WHERE status = 'active';

-- Query otimizada para contagem
SELECT user_id, COUNT(*) 
FROM contacts 
WHERE status = 'active' 
GROUP BY user_id;`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Monitoramento Contínuo
              </CardTitle>
              <CardDescription>
                Ferramentas e métricas para acompanhar a performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Métricas Essenciais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Database</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Tempo de resposta de queries</li>
                      <li>• Conexões ativas/máximas</li>
                      <li>• Uso de CPU e memória</li>
                      <li>• Taxa de cache hit</li>
                      <li>• Deadlocks e locks</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Aplicação</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Tempo de resposta de APIs</li>
                      <li>• Throughput (req/sec)</li>
                      <li>• Taxa de erro</li>
                      <li>• Uso de memória/CPU</li>
                      <li>• Garbage collection</li>
                    </ul>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Ferramentas de Monitoramento</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">APM Tools</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• New Relic</li>
                      <li>• Datadog</li>
                      <li>• Dynatrace</li>
                      <li>• AppDynamics</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Database</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• pg_stat_statements</li>
                      <li>• pgAdmin</li>
                      <li>• PostgreSQL logs</li>
                      <li>• EXPLAIN ANALYZE</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Infraestrutura</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Prometheus + Grafana</li>
                      <li>• CloudWatch</li>
                      <li>• htop/top</li>
                      <li>• iostat</li>
                    </ul>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Alertas Automáticos</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Configure alertas para problemas críticos de performance:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-red-50 dark:bg-red-950/10 p-3 rounded border border-red-200 dark:border-red-800">
                      <h6 className="font-medium text-red-600 dark:text-red-400 text-sm mb-1">Críticos</h6>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Tempo de resposta &gt; 5s</li>
                        <li>• CPU &gt; 90% por 5 min</li>
                        <li>• Conexões &gt; 90% do limite</li>
                        <li>• Disk space &lt; 10%</li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-950/10 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                      <h6 className="font-medium text-yellow-600 dark:text-yellow-400 text-sm mb-1">Atenção</h6>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Tempo de resposta &gt; 2s</li>
                        <li>• CPU &gt; 70% por 10 min</li>
                        <li>• Memória &gt; 80%</li>
                        <li>• Cache hit rate &lt; 80%</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="border-blue-200 dark:border-blue-800">
                <RefreshCw className="h-4 w-4" />
                <AlertTitle>Otimização Contínua</AlertTitle>
                <AlertDescription>
                  Performance não é um projeto único, mas um processo contínuo. Monitore, analise e otimize regularmente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Próximos Passos e Links */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/docs/guides/security-best-practices" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Server className="h-6 w-6 text-red-500" />
                    <div>
                      <h4 className="font-medium">Melhores Práticas de Segurança</h4>
                      <p className="text-sm text-muted-foreground">Proteja seus dados e sistema</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/docs/guides/analytics-reporting" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Analytics e Relatórios</h4>
                      <p className="text-sm text-muted-foreground">Monitore performance com dashboards</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
