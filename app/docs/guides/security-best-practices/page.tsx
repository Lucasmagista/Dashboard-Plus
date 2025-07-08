"use client"

import { useState } from "react"
import { 
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  UserCheck,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Star,
  FileText,
  Copy,
  Download,
  Key,
  Shield as FileShield,
  Users,
  Settings
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function SecurityBestPracticesGuide() {
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
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Melhores Práticas de Segurança</h1>
            <p className="text-muted-foreground">Como manter seus dados seguros e em conformidade com LGPD</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            20 min de leitura
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Security Team
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            4.9 (156 avaliações)
          </div>
          <Badge variant="secondary">Intermediário</Badge>
          <Badge variant="outline">Segurança</Badge>
        </div>
      </div>

      {/* Alert de Importância */}
      <Alert className="mb-8 border-red-200 dark:border-red-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Atenção!</AlertTitle>
        <AlertDescription>
          A segurança dos dados é fundamental. Implemente todas as práticas listadas neste guia para garantir a proteção adequada.
        </AlertDescription>
      </Alert>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="security-config">Configurações</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="compliance">Conformidade</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Fundamentos de Segurança
              </CardTitle>
              <CardDescription>
                Principais aspectos de segurança que você deve considerar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Autenticação Segura
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Senhas fortes obrigatórias</li>
                    <li>• Autenticação de dois fatores (2FA)</li>
                    <li>• Bloqueio após tentativas falhadas</li>
                    <li>• Sessões com timeout automático</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Proteção de Dados
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Criptografia em repouso e trânsito</li>
                    <li>• Backup automatizado e seguro</li>
                    <li>• Logs de auditoria detalhados</li>
                    <li>• Anonimização de dados sensíveis</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Checklist de Segurança</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Configurar HTTPS em produção",
                    "Ativar autenticação 2FA",
                    "Definir políticas de senha",
                    "Configurar backup automático",
                    "Revisar logs de acesso",
                    "Atualizar dependências regularmente",
                    "Implementar rate limiting",
                    "Configurar monitoramento de segurança"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security-config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Como configurar as opções de segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">1. Configuração de Autenticação</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    Acesse Configurações → Segurança → Autenticação:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>✓ Ativar autenticação de dois fatores</div>
                    <div>✓ Definir política de senhas (mín. 8 caracteres, símbolos)</div>
                    <div>✓ Configurar timeout de sessão (recomendado: 30 min)</div>
                    <div>✓ Limitar tentativas de login (máx. 5 tentativas)</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">2. Configuração de Backup</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Configure backups automáticos para proteção de dados:
                  </p>
                  <div className="bg-background p-3 rounded border font-mono text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span>Configuração de Backup</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`{
  "backup": {
    "enabled": true,
    "frequency": "daily",
    "retention": "30d",
    "encryption": true,
    "location": "s3://secure-backup-bucket"
  }
}`, "backup-config")}
                      >
                        {copiedCode === "backup-config" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <pre className="text-muted-foreground">{`{
  "backup": {
    "enabled": true,
    "frequency": "daily",
    "retention": "30d",
    "encryption": true,
    "location": "s3://secure-backup-bucket"
  }
}`}</pre>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">3. Logs de Auditoria</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure logs detalhados para monitoramento:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>• Logs de login/logout</div>
                    <div>• Alterações em dados sensíveis</div>
                    <div>• Acessos a APIs</div>
                    <div>• Tentativas de acesso negadas</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestão de Permissões
              </CardTitle>
              <CardDescription>
                Como configurar e gerenciar permissões de usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Níveis de Acesso</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Usuário</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Visualizar contatos próprios</li>
                      <li>• Criar/editar leads</li>
                      <li>• Acessar relatórios básicos</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">Gerente</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Todas as permissões de usuário</li>
                      <li>• Gerenciar equipe</li>
                      <li>• Acessar todos os relatórios</li>
                      <li>• Configurar automações</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium text-red-600 dark:text-red-400 mb-2">Admin</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Todas as permissões</li>
                      <li>• Configurações do sistema</li>
                      <li>• Gestão de usuários</li>
                      <li>• Logs de auditoria</li>
                    </ul>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Configuração de Permissões</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Passos para configurar permissões:
                  </p>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Acesse Configurações → Usuários e Permissões</li>
                    <li>Selecione o usuário para editar permissões</li>
                    <li>Escolha o nível de acesso apropriado</li>
                    <li>Configure permissões específicas se necessário</li>
                    <li>Salve as alterações e notifique o usuário</li>
                  </ol>
                </div>
              </div>

              <Alert>
                <UserCheck className="h-4 w-4" />
                <AlertTitle>Princípio do Menor Privilégio</AlertTitle>
                <AlertDescription>
                  Sempre conceda apenas as permissões mínimas necessárias para que o usuário execute suas funções.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileShield className="h-5 w-5" />
                Conformidade LGPD
              </CardTitle>
              <CardDescription>
                Garantindo conformidade com a Lei Geral de Proteção de Dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Requisitos LGPD</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium">Direitos dos Titulares</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Acesso aos dados pessoais</li>
                      <li>• Correção de dados incompletos</li>
                      <li>• Anonimização/bloqueio</li>
                      <li>• Eliminação de dados</li>
                      <li>• Portabilidade de dados</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium">Obrigações do Controlador</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Demonstrar conformidade</li>
                      <li>• Designar DPO se necessário</li>
                      <li>• Realizar RIPD quando aplicável</li>
                      <li>• Notificar vazamentos</li>
                      <li>• Manter registros de tratamento</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Ferramentas de Conformidade</h4>
                <div className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Portal do Titular</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Disponibilize um portal onde os titulares podem exercer seus direitos:
                    </p>
                    <div className="space-y-1 text-sm">
                      <div>• Solicitar acesso aos dados</div>
                      <div>• Solicitar correção/exclusão</div>
                      <div>• Revogar consentimento</div>
                      <div>• Exportar dados pessoais</div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Relatórios de Conformidade</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Gere relatórios automáticos para demonstrar conformidade:
                    </p>
                    <div className="space-y-1 text-sm">
                      <div>• Inventário de dados pessoais</div>
                      <div>• Registro de atividades de tratamento</div>
                      <div>• Log de consentimentos</div>
                      <div>• Relatório de vazamentos (se houver)</div>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="border-blue-200 dark:border-blue-800">
                <FileText className="h-4 w-4" />
                <AlertTitle>Documentação Obrigatória</AlertTitle>
                <AlertDescription>
                  Mantenha sempre atualizados: Política de Privacidade, Termos de Uso, Registro de Atividades de Tratamento e Plano de Resposta a Incidentes.
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
            <Link href="/docs/guides/database-optimization" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Database className="h-6 w-6 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Otimização de Performance</h4>
                      <p className="text-sm text-muted-foreground">Técnicas para otimizar a performance do sistema</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/docs/guides/automation-workflows" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-green-500" />
                    <div>
                      <h4 className="font-medium">Workflows de Automação</h4>
                      <p className="text-sm text-muted-foreground">Aprenda a criar fluxos automatizados</p>
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
