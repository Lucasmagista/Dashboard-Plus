'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  ShoppingCart, 
  Brain, 
  Shield, 
  CreditCard, 
  BarChart3,
  Users,
  Settings,
  Activity,
  Zap,
  AlertTriangle
} from 'lucide-react';

import { EmailIntegration } from './integrations/email-integration';
import { EcommerceIntegration } from './integrations/ecommerce-integration';
import { AIIntegration } from './ai/ai-integration';
import { SecurityIntegration } from './security/security-integration';

interface IntegrationStatus {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: Date;
  description: string;
  category: 'communication' | 'ecommerce' | 'ai' | 'security' | 'payment' | 'marketing';
}

export function IntegrationsDashboard() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    {
      id: 'gmail',
      name: 'Gmail/Outlook',
      icon: <Mail className="h-5 w-5" />,
      status: 'connected',
      lastSync: new Date(),
      description: 'Sincronização de emails e contatos',
      category: 'communication'
    },
    {
      id: 'shopify',
      name: 'Shopify/WooCommerce',
      icon: <ShoppingCart className="h-5 w-5" />,
      status: 'connected',
      lastSync: new Date(),
      description: 'Integração com lojas online',
      category: 'ecommerce'
    },
    {
      id: 'stripe',
      name: 'Stripe/PayPal/PIX',
      icon: <CreditCard className="h-5 w-5" />,
      status: 'disconnected',
      lastSync: new Date(Date.now() - 86400000),
      description: 'Gateways de pagamento',
      category: 'payment'
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT/IA',
      icon: <Brain className="h-5 w-5" />,
      status: 'connected',
      lastSync: new Date(),
      description: 'Assistente de IA integrado',
      category: 'ai'
    },
    {
      id: 'hubspot',
      name: 'HubSpot/RD Station',
      icon: <BarChart3 className="h-5 w-5" />,
      status: 'error',
      lastSync: new Date(Date.now() - 3600000),
      description: 'Automação de marketing',
      category: 'marketing'
    },
    {
      id: 'meta',
      name: 'Meta Business Suite',
      icon: <Users className="h-5 w-5" />,
      status: 'connected',
      lastSync: new Date(),
      description: 'Redes sociais e anúncios',
      category: 'marketing'
    },
    {
      id: 'security',
      name: 'MFA/SSO',
      icon: <Shield className="h-5 w-5" />,
      status: 'connected',
      lastSync: new Date(),
      description: 'Segurança e autenticação',
      category: 'security'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'disconnected': return 'secondary';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'disconnected': return 'Desconectado';
      case 'error': return 'Erro';
      default: return 'Desconhecido';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return <Mail className="h-4 w-4" />;
      case 'ecommerce': return <ShoppingCart className="h-4 w-4" />;
      case 'ai': return <Brain className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'marketing': return <BarChart3 className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const errorCount = integrations.filter(i => i.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Central de Integrações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as integrações do seu dashboard
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default">{connectedCount} Conectadas</Badge>
          {errorCount > 0 && (
            <Badge variant="destructive">{errorCount} com Erro</Badge>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Integrações</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde o último mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conectadas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
            <p className="text-xs text-muted-foreground">
              {((connectedCount / integrations.length) * 100).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Erro</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Sincronização</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Agora</div>
            <p className="text-xs text-muted-foreground">
              Todas as integrações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Integration Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
          <TabsTrigger value="ai">IA & ML</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-3">
                    {integration.icon}
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(integration.category)}
                      <span className="text-xs text-muted-foreground capitalize">
                        {integration.category}
                      </span>
                    </div>
                    <Badge variant={getStatusColor(integration.status)}>
                      {getStatusText(integration.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Última sincronização: {integration.lastSync.toLocaleString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                      {integration.status === 'connected' && (
                        <Button size="sm">
                          Sincronizar
                        </Button>
                      )}
                      {integration.status === 'disconnected' && (
                        <Button size="sm">
                          Conectar
                        </Button>
                      )}
                      {integration.status === 'error' && (
                        <Button variant="destructive" size="sm">
                          Resolver Erro
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="email">
          <EmailIntegration />
        </TabsContent>

        <TabsContent value="ecommerce">
          <EcommerceIntegration />
        </TabsContent>

        <TabsContent value="ai">
          <AIIntegration />
        </TabsContent>

        <TabsContent value="security">
          <SecurityIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
