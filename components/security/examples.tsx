import { SecurityIntegration } from '@/components/security';

/**
 * Exemplo de página que utiliza o componente SecurityIntegration
 */
export default function SecurityPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Central de Segurança</h1>
          <p className="text-xl text-muted-foreground">
            Gerencie toda a segurança da sua aplicação em um só lugar
          </p>
        </div>
        
        <SecurityIntegration />
      </div>
    </div>
  );
}

/**
 * Exemplo de uso dos componentes individuais
 */
export function SecurityExamples() {
  return (
    <div className="space-y-8">
      {/* Exemplo 1: Usando apenas as métricas */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Métricas de Segurança</h2>
        <SecurityMetrics metrics={defaultSecurityMetrics} />
      </section>

      {/* Exemplo 2: Usando apenas os alertas */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Alertas de Segurança</h2>
        <SecurityAlerts
          alerts={mockSecurityAlerts}
          onAcknowledge={(alertId) => console.log('Reconhecido:', alertId)}
          onDismiss={(alertId) => console.log('Dispensado:', alertId)}
        />
      </section>

      {/* Exemplo 3: Usando o hook personalizado */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hook Personalizado</h2>
        <SecurityHookExample />
      </section>
    </div>
  );
}

/**
 * Exemplo de componente usando o hook useSecurity
 */
function SecurityHookExample() {
  const { data, loading, error, actions } = useSecurity({
    refreshInterval: 30000,
    autoRefresh: true
  });

  if (loading) {
    return <div className="text-center">Carregando dados de segurança...</div>;
  }

  if (error) {
    return <div className="text-red-600">Erro: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Status MFA</h3>
          <p className="text-sm text-muted-foreground">
            {data.mfaSetup.enabled ? 'Ativo' : 'Inativo'}
          </p>
          {!data.mfaSetup.enabled && (
            <button
              onClick={actions.setupMFA}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              Configurar MFA
            </button>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Provedores SSO</h3>
          <p className="text-sm text-muted-foreground">
            {data.ssoProviders.filter(p => p.enabled).length} ativo(s)
          </p>
          <div className="mt-2 space-y-1">
            {data.ssoProviders.map(provider => (
              <div key={provider.id} className="flex items-center justify-between text-sm">
                <span>{provider.name}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  provider.enabled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {provider.enabled ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">Métricas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Score de Risco</p>
            <p className="text-lg font-semibold">{data.securityMetrics.riskScore}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Adoção MFA</p>
            <p className="text-lg font-semibold">{data.securityMetrics.mfaAdoptionRate}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Uso SSO</p>
            <p className="text-lg font-semibold">{data.securityMetrics.ssoUsage}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Usuários Ativos</p>
            <p className="text-lg font-semibold">{data.securityMetrics.activeUsers}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Exemplo de configuração personalizada
 */
export function CustomSecurityConfig() {
  // Métricas customizadas
  const customMetrics = [
    {
      id: 'custom-risk',
      title: 'Risco Personalizado',
      value: 15,
      type: 'score' as const,
      status: 'good' as const,
      icon: <Shield className="h-4 w-4" />,
      description: 'Métrica customizada para empresa'
    }
  ];

  // Alertas customizados
  const customAlerts = [
    {
      id: 'custom-1',
      type: 'high' as const,
      title: 'Alerta Personalizado',
      description: 'Descrição do alerta personalizado',
      timestamp: new Date(),
      source: 'Sistema Personalizado',
      acknowledged: false,
      actionRequired: true,
      category: 'system' as const
    }
  ];

  return (
    <div className="space-y-6">
      <SecurityMetrics metrics={customMetrics} />
      <SecurityAlerts
        alerts={customAlerts}
        onAcknowledge={(id) => console.log('Custom acknowledge:', id)}
        onDismiss={(id) => console.log('Custom dismiss:', id)}
      />
    </div>
  );
}

// Exports necessários
import { 
  SecurityMetrics, 
  SecurityAlerts, 
  defaultSecurityMetrics, 
  mockSecurityAlerts,
  useSecurity 
} from '@/components/security';
import { Shield } from 'lucide-react';
