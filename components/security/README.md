# Componentes de Segurança

Esta pasta contém os componentes relacionados à segurança do sistema, incluindo autenticação, autorização, monitoramento e conformidade.

## 📁 Estrutura de Arquivos

```
components/security/
├── security-integration.tsx    # Componente principal de integração
├── security-metrics.tsx        # Componente de métricas de segurança
├── security-alerts.tsx         # Componente de alertas de segurança
└── README.md                   # Este arquivo
```

## 🔐 Componentes Principais

### SecurityIntegration

**Arquivo:** `security-integration.tsx`

Componente principal que oferece uma interface completa para gerenciamento de segurança.

**Funcionalidades:**
- Dashboard de visão geral com métricas
- Configuração de MFA (Multi-Factor Authentication)
- Gerenciamento de SSO (Single Sign-On)
- Monitoramento de eventos e alertas
- Verificação de conformidade
- Logs de auditoria

**Uso:**
```tsx
import { SecurityIntegration } from '@/components/security/security-integration';

function SecurityPage() {
  return <SecurityIntegration />;
}
```

### SecurityMetrics

**Arquivo:** `security-metrics.tsx`

Componente reutilizável para exibir métricas de segurança com visualizações.

**Props:**
```typescript
interface SecurityMetricsProps {
  metrics: SecurityMetric[];
  className?: string;
}
```

**Uso:**
```tsx
import { SecurityMetrics, defaultSecurityMetrics } from '@/components/security/security-metrics';

function Dashboard() {
  return (
    <SecurityMetrics 
      metrics={defaultSecurityMetrics}
      className="mb-6"
    />
  );
}
```

### SecurityAlerts

**Arquivo:** `security-alerts.tsx`

Componente para exibir e gerenciar alertas de segurança.

**Props:**
```typescript
interface SecurityAlertsProps {
  alerts: SecurityAlert[];
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
  className?: string;
}
```

**Uso:**
```tsx
import { SecurityAlerts, mockSecurityAlerts } from '@/components/security/security-alerts';

function AlertsPage() {
  const handleAcknowledge = (alertId: string) => {
    console.log('Alerta reconhecido:', alertId);
  };

  const handleDismiss = (alertId: string) => {
    console.log('Alerta dispensado:', alertId);
  };

  return (
    <SecurityAlerts
      alerts={mockSecurityAlerts}
      onAcknowledge={handleAcknowledge}
      onDismiss={handleDismiss}
    />
  );
}
```

## 🔧 Hook Personalizado

### useSecurity

**Arquivo:** `hooks/use-security.ts`

Hook personalizado para gerenciar estado e ações relacionadas à segurança.

**Funcionalidades:**
- Carregamento de dados de segurança
- Configuração de MFA
- Gerenciamento de SSO
- Atualização automática de dados
- Ações de backup e recuperação

**Uso:**
```tsx
import { useSecurity } from '@/hooks/use-security';

function SecurityComponent() {
  const { data, loading, error, actions } = useSecurity({
    refreshInterval: 30000,
    autoRefresh: true
  });

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {data && (
        <div>
          <h2>MFA Status: {data.mfaSetup.enabled ? 'Ativo' : 'Inativo'}</h2>
          <button onClick={actions.setupMFA}>Configurar MFA</button>
        </div>
      )}
    </div>
  );
}
```

## 📊 Interfaces TypeScript

### SecurityMetric

```typescript
interface SecurityMetric {
  id: string;
  title: string;
  value: number;
  unit?: string;
  previousValue?: number;
  target?: number;
  type: 'percentage' | 'number' | 'score';
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
  description?: string;
}
```

### SecurityAlert

```typescript
interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  acknowledged: boolean;
  actionRequired: boolean;
  category: 'authentication' | 'authorization' | 'system' | 'compliance' | 'monitoring';
  details?: {
    ip?: string;
    userAgent?: string;
    location?: string;
    affectedUsers?: number;
    riskScore?: number;
  };
}
```

### MFASetup

```typescript
interface MFASetup {
  enabled: boolean;
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  lastUsed: Date | null;
  trustedDevices: number;
  setupProgress: number;
  methodType: 'app' | 'sms' | 'email' | 'hardware';
}
```

### SSOProvider

```typescript
interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oauth' | 'oidc';
  enabled: boolean;
  users: number;
  lastSync: Date;
  status: 'active' | 'inactive' | 'error' | 'syncing';
  config: {
    domain?: string;
    clientId?: string;
    issuer?: string;
    autoProvisioning: boolean;
    groupMapping: boolean;
  };
}
```

## 🎨 Estilos e Temas

### Classes CSS Customizadas

Os componentes utilizam classes Tailwind CSS com algumas personalizações:

```css
.security-metric-card {
  @apply bg-white rounded-lg border shadow-sm;
}

.security-alert-critical {
  @apply bg-red-50 border-red-200;
}

.security-alert-high {
  @apply bg-orange-50 border-orange-200;
}

.security-alert-medium {
  @apply bg-yellow-50 border-yellow-200;
}
```

### Cores por Status

- **Bom/Sucesso:** `text-green-600`, `bg-green-100`
- **Aviso:** `text-yellow-600`, `bg-yellow-100`
- **Crítico:** `text-red-600`, `bg-red-100`
- **Neutro:** `text-gray-600`, `bg-gray-100`

## 🔄 Fluxo de Dados

### 1. Carregamento Inicial

```
useSecurity Hook → loadSecurityData() → setState()
```

### 2. Configuração MFA

```
setupMFA() → generateSecret() → generateQRCode() → setState()
```

### 3. Verificação MFA

```
verifyMFA() → validateCode() → enableMFA() → setState()
```

### 4. Atualização SSO

```
toggleSSO() → syncProvider() → updateStatus() → setState()
```

## 🧪 Testes

### Dados Mock

Os componentes incluem dados mock para desenvolvimento e testes:

```typescript
// security-metrics.tsx
export const defaultSecurityMetrics: SecurityMetric[]

// security-alerts.tsx
export const mockSecurityAlerts: SecurityAlert[]

// use-security.ts
function generateMockSecurityData(): SecurityData
```

### Testes Unitários

```typescript
// Exemplo de teste para SecurityMetrics
describe('SecurityMetrics', () => {
  it('deve renderizar métricas corretamente', () => {
    render(<SecurityMetrics metrics={defaultSecurityMetrics} />);
    expect(screen.getByText('Score de Risco')).toBeInTheDocument();
  });
});
```

## 🔒 Segurança

### Boas Práticas Implementadas

1. **Validação de Entrada:**
   - Códigos MFA validados no frontend e backend
   - Sanitização de dados do usuário

2. **Autenticação:**
   - Suporte a múltiplos fatores
   - Códigos de backup seguros

3. **Autorização:**
   - Verificação de permissões em cada ação
   - Logs de auditoria detalhados

4. **Criptografia:**
   - Secrets MFA armazenados de forma segura
   - Comunicação HTTPS obrigatória

## 📈 Monitoramento

### Métricas Coletadas

- Taxa de adoção de MFA
- Uso de SSO por provedor
- Tentativas de login falhadas
- Score de risco calculado
- Eventos de segurança por categoria

### Alertas Configuráveis

- Múltiplas tentativas de login
- Certificados expirando
- Novos dispositivos detectados
- Violações de conformidade
- Falhas de sincronização SSO

## 🔧 Configuração

### Variáveis de Ambiente

```env
NEXT_PUBLIC_SECURITY_REFRESH_INTERVAL=30000
NEXT_PUBLIC_MFA_ISSUER="CRM Pro Dashboard"
NEXT_PUBLIC_BACKUP_CODES_COUNT=8
```

### Configuração de Provedores SSO

```typescript
// Exemplo de configuração
const ssoConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    domain: process.env.GOOGLE_DOMAIN,
    autoProvisioning: true
  },
  azure: {
    tenantId: process.env.AZURE_TENANT_ID,
    clientId: process.env.AZURE_CLIENT_ID,
    groupMapping: true
  }
};
```

## 📝 Changelog

### v2.0.0 (Atual)
- ✅ Refatoração completa do componente
- ✅ Adição de hook `useSecurity`
- ✅ Componentes modulares para métricas e alertas
- ✅ Sistema de conformidade
- ✅ Monitoramento em tempo real
- ✅ Interface melhorada com múltiplas abas

### v1.0.0
- ✅ Implementação inicial
- ✅ Configuração básica de MFA
- ✅ Gerenciamento simples de SSO

## 🚀 Roadmap

### Próximas Versões

- [ ] Integração com API real
- [ ] Notificações push
- [ ] Relatórios em PDF
- [ ] Dashboard mobile
- [ ] Integração com SIEM
- [ ] Machine Learning para detecção de anomalias

## 📞 Suporte

Para dúvidas ou sugestões sobre os componentes de segurança:

1. Consulte a documentação
2. Verifique os exemplos de uso
3. Analise os dados mock
4. Teste com dados reais

---

**Nota:** Este é um componente em desenvolvimento ativo. Sempre verifique a documentação mais recente e teste as funcionalidades em ambiente de desenvolvimento antes de usar em produção.
