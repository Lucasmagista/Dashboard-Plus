'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Shield, 
  Key, 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Users,
  Lock,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Trash2,
  Plus,
  AlertTriangle,
  Activity,
  Clock,
  Globe,
  Database,
  Copy,
  Check,
  History,
  FileText,
  Zap
} from 'lucide-react';

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

interface SecurityEvent {
  id: string;
  type: 'login' | 'mfa_setup' | 'sso_sync' | 'failed_login' | 'password_change';
  timestamp: Date;
  user: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip?: string;
  userAgent?: string;
}

interface SecurityMetrics {
  totalLogins: number;
  mfaAdoptionRate: number;
  ssoUsage: number;
  failedLogins: number;
  activeUsers: number;
  riskScore: number;
  lastSecurityScan: Date;
}

interface ComplianceStandard {
  name: string;
  status: 'compliant' | 'partial' | 'non_compliant';
  requirements: {
    mfa: boolean;
    sso: boolean;
    encryption: boolean;
    audit: boolean;
    backup: boolean;
  };
}

export function SecurityIntegration() {
  const [mfaSetup, setMfaSetup] = useState<MFASetup>({
    enabled: false,
    secret: '',
    qrCodeUrl: '',
    backupCodes: [],
    lastUsed: null,
    trustedDevices: 0,
    setupProgress: 0,
    methodType: 'app'
  });
  const [ssoProviders, setSSOProviders] = useState<SSOProvider[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    totalLogins: 0,
    mfaAdoptionRate: 0,
    ssoUsage: 0,
    failedLogins: 0,
    activeUsers: 0,
    riskScore: 0,
    lastSecurityScan: new Date()
  });
  const [complianceStandards, setComplianceStandards] = useState<ComplianceStandard[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      await Promise.all([
        loadSecuritySettings(),
        loadSecurityEvents(),
        loadSecurityMetrics(),
        loadComplianceData()
      ]);
    } catch (err) {
      setError('Erro ao carregar dados de segurança');
    }
  };

  const loadSecuritySettings = async () => {
    try {
      // Simular carregamento das configurações de segurança
      const mockMFA: MFASetup = {
        enabled: true,
        secret: 'JBSWY3DPEHPK3PXP',
        qrCodeUrl: 'otpauth://totp/CRM Pro Dashboard:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=CRM Pro Dashboard',
        backupCodes: [
          '12345678',
          '87654321',
          '11223344',
          '44332211',
          '99887766'
        ],
        lastUsed: new Date(),
        trustedDevices: 3,
        setupProgress: 100,
        methodType: 'app'
      };

      const mockSSO: SSOProvider[] = [
        {
          id: '1',
          name: 'Google Workspace',
          type: 'oauth',
          enabled: true,
          users: 25,
          lastSync: new Date(),
          status: 'active',
          config: {
            domain: 'company.com',
            clientId: 'google-client-id',
            autoProvisioning: true,
            groupMapping: true
          }
        },
        {
          id: '2',
          name: 'Microsoft Azure AD',
          type: 'saml',
          enabled: false,
          users: 0,
          lastSync: new Date(Date.now() - 86400000),
          status: 'inactive',
          config: {
            domain: 'company.onmicrosoft.com',
            autoProvisioning: false,
            groupMapping: false
          }
        },
        {
          id: '3',
          name: 'Custom SAML',
          type: 'saml',
          enabled: true,
          users: 12,
          lastSync: new Date(),
          status: 'error',
          config: {
            issuer: 'https://saml.company.com',
            autoProvisioning: true,
            groupMapping: true
          }
        }
      ];

      setMfaSetup(mockMFA);
      setSSOProviders(mockSSO);
    } catch (err) {
      setError('Erro ao carregar configurações de segurança');
    }
  };

  const loadSecurityEvents = async () => {
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'login',
        timestamp: new Date(),
        user: 'admin@company.com',
        description: 'Login realizado com sucesso',
        severity: 'low',
        ip: '192.168.1.100',
        userAgent: 'Chrome/120.0.0.0'
      },
      {
        id: '2',
        type: 'failed_login',
        timestamp: new Date(Date.now() - 300000),
        user: 'user@company.com',
        description: 'Tentativa de login falhada - senha incorreta',
        severity: 'medium',
        ip: '192.168.1.101'
      },
      {
        id: '3',
        type: 'mfa_setup',
        timestamp: new Date(Date.now() - 3600000),
        user: 'user2@company.com',
        description: 'MFA configurado com sucesso',
        severity: 'low'
      }
    ];
    setSecurityEvents(mockEvents);
  };

  const loadSecurityMetrics = async () => {
    const mockMetrics: SecurityMetrics = {
      totalLogins: 1247,
      mfaAdoptionRate: 78,
      ssoUsage: 65,
      failedLogins: 23,
      activeUsers: 45,
      riskScore: 25,
      lastSecurityScan: new Date(Date.now() - 7200000)
    };
    setSecurityMetrics(mockMetrics);
  };

  const loadComplianceData = async () => {
    const mockCompliance: ComplianceStandard[] = [
      {
        name: 'GDPR',
        status: 'compliant',
        requirements: {
          mfa: true,
          sso: true,
          encryption: true,
          audit: true,
          backup: true
        }
      },
      {
        name: 'SOC 2',
        status: 'partial',
        requirements: {
          mfa: true,
          sso: false,
          encryption: true,
          audit: true,
          backup: true
        }
      },
      {
        name: 'ISO 27001',
        status: 'non_compliant',
        requirements: {
          mfa: false,
          sso: false,
          encryption: true,
          audit: false,
          backup: true
        }
      }
    ];
    setComplianceStandards(mockCompliance);
  };

  const setupMFA = async () => {
    try {
      setLoading(true);
      setError(null);
      setMfaSetup(prev => ({ ...prev, setupProgress: 25 }));
      
      // Simular configuração do MFA
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMfaSetup(prev => ({ ...prev, setupProgress: 50 }));
      
      const newSecret = Math.random().toString(36).substring(2, 15).toUpperCase();
      const qrCode = `otpauth://totp/CRM Pro Dashboard:user@example.com?secret=${newSecret}&issuer=CRM Pro Dashboard`;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMfaSetup(prev => ({ ...prev, setupProgress: 75 }));
      
      setMfaSetup(prev => ({
        ...prev,
        secret: newSecret,
        qrCodeUrl: qrCode,
        backupCodes: Array.from({ length: 8 }, () => 
          Math.floor(Math.random() * 90000000) + 10000000
        ).map(String),
        setupProgress: 100
      }));
      
      setSuccess('MFA configurado com sucesso! Complete a verificação para ativar.');
    } catch (err) {
      setError('Erro ao configurar MFA');
      setMfaSetup(prev => ({ ...prev, setupProgress: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (verificationCode.length !== 6) {
        setError('Código deve ter 6 dígitos');
        return;
      }
      
      // Simular verificação do código
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMfaSetup(prev => ({
        ...prev,
        enabled: true,
        lastUsed: new Date(),
        trustedDevices: 1
      }));
      
      setVerificationCode('');
      setSuccess('MFA ativado com sucesso!');
      
      // Adicionar evento de segurança
      const newEvent: SecurityEvent = {
        id: Date.now().toString(),
        type: 'mfa_setup',
        timestamp: new Date(),
        user: 'current@user.com',
        description: 'MFA configurado e ativado',
        severity: 'low'
      };
      setSecurityEvents(prev => [newEvent, ...prev]);
      
    } catch (err) {
      setError('Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const toggleSSO = async (providerId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Atualizar status para syncing
      setSSOProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { ...provider, status: 'syncing' as const }
            : provider
        )
      );
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSSOProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { 
                ...provider, 
                enabled: !provider.enabled,
                status: provider.enabled ? 'inactive' : 'active' as const,
                lastSync: new Date()
              }
            : provider
        )
      );
      
      setSuccess('Configuração SSO atualizada com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar SSO');
      // Reverter status em caso de erro
      setSSOProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { ...provider, status: 'error' as const }
            : provider
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshSecurityData = async () => {
    setIsRefreshing(true);
    try {
      await loadSecurityData();
      setSuccess('Dados de segurança atualizados');
    } catch (err) {
      setError('Erro ao atualizar dados');
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      setError('Erro ao copiar para área de transferência');
    }
  }, []);

  const downloadBackupCodes = () => {
    const content = `Códigos de Backup - CRM Pro Dashboard\n\nData de geração: ${new Date().toLocaleString()}\n\n${mfaSetup.backupCodes.join('\n')}\n\nIMPORTANTE: Guarde estes códigos em local seguro. Cada código só pode ser usado uma vez.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-codes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const regenerateBackupCodes = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCodes = Array.from({ length: 8 }, () => 
        Math.floor(Math.random() * 90000000) + 10000000
      ).map(String);
      
      setMfaSetup(prev => ({ ...prev, backupCodes: newCodes }));
      setSuccess('Códigos de backup regenerados com sucesso!');
    } catch (err) {
      setError('Erro ao regenerar códigos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'error': return 'destructive';
      case 'syncing': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'error': return 'Erro';
      case 'syncing': return 'Sincronizando';
      default: return 'Desconhecido';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'default';
      case 'partial': return 'secondary';
      case 'non_compliant': return 'destructive';
      default: return 'secondary';
    }
  };

  const getComplianceText = (status: string) => {
    switch (status) {
      case 'compliant': return 'Conforme';
      case 'partial': return 'Parcial';
      case 'non_compliant': return 'Não Conforme';
      default: return 'Desconhecido';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    if (score < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'há poucos segundos';
    if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} horas`;
    return `há ${Math.floor(diffInSeconds / 86400)} dias`;
  };

  const SecurityOverview = () => (
    <div className="space-y-6">
      {/* Métricas de Segurança */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de Risco</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getRiskScoreColor(securityMetrics.riskScore)}>
                {securityMetrics.riskScore}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {securityMetrics.riskScore < 30 ? 'Baixo risco' : 
               securityMetrics.riskScore < 60 ? 'Risco médio' : 
               securityMetrics.riskScore < 80 ? 'Alto risco' : 'Risco crítico'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adoção MFA</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.mfaAdoptionRate}%</div>
            <Progress value={securityMetrics.mfaAdoptionRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uso SSO</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.ssoUsage}%</div>
            <Progress value={securityMetrics.ssoUsage} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {securityMetrics.failedLogins} tentativas falhadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conformidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Status de Conformidade
          </CardTitle>
          <CardDescription>
            Verificação de conformidade com padrões de segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceStandards.map((standard) => (
              <div key={standard.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={getComplianceColor(standard.status)}>
                    {getComplianceText(standard.status)}
                  </Badge>
                  <span className="font-medium">{standard.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {Object.entries(standard.requirements).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-1">
                      {value ? 
                        <CheckCircle className="h-4 w-4 text-green-600" /> : 
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      }
                      <span className="text-xs text-muted-foreground capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Eventos de Segurança Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Eventos de Segurança Recentes
          </CardTitle>
          <CardDescription>
            Monitoramento de atividades de segurança em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                  <div>
                    <p className="font-medium">{event.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.user} • {formatRelativeTime(event.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {event.ip && (
                    <span className="flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {event.ip}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Central de Segurança</h2>
          <p className="text-muted-foreground">
            Gerencie autenticação, autorização e monitoramento de segurança
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshSecurityData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Shield className="h-8 w-8 text-primary" />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="mfa">MFA</TabsTrigger>
          <TabsTrigger value="sso">SSO</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SecurityOverview />
        </TabsContent>

        <TabsContent value="mfa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Autenticação Multi-Fator (MFA)
              </CardTitle>
              <CardDescription>
                Configure e gerencie autenticação em duas etapas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mfa-enabled">Ativar MFA</Label>
                  <p className="text-sm text-muted-foreground">
                    Requer código do aplicativo authenticator
                  </p>
                </div>
                <Switch
                  id="mfa-enabled"
                  checked={mfaSetup.enabled}
                  onCheckedChange={(checked) => 
                    setMfaSetup(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              {mfaSetup.setupProgress > 0 && mfaSetup.setupProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da configuração</span>
                    <span>{mfaSetup.setupProgress}%</span>
                  </div>
                  <Progress value={mfaSetup.setupProgress} />
                </div>
              )}

              {!mfaSetup.enabled && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Aplicativo Authenticator</p>
                        <p className="text-sm text-muted-foreground">Recomendado</p>
                      </div>
                    </div>
                    <Button 
                      onClick={setupMFA} 
                      disabled={loading}
                      size="sm"
                    >
                      Configurar
                    </Button>
                  </div>
                  
                  {mfaSetup.secret && (
                    <div className="space-y-4 p-4 bg-muted rounded-lg">
                      <div className="text-center">
                        <p className="text-sm font-medium mb-4">
                          Escaneie o QR Code com seu app authenticator
                        </p>
                        <div className="flex justify-center">
                          <QRCodeSVG value={mfaSetup.qrCodeUrl} size={200} />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label htmlFor="secret">Ou digite o código manualmente:</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="secret"
                            type={showSecret ? 'text' : 'password'}
                            value={mfaSetup.secret}
                            readOnly
                            className="font-mono"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowSecret(!showSecret)}
                          >
                            {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(mfaSetup.secret, 'secret')}
                          >
                            {copied === 'secret' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="verification">Código de verificação:</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="verification"
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="123456"
                            maxLength={6}
                            className="font-mono text-center"
                          />
                          <Button
                            onClick={verifyMFA}
                            disabled={loading || verificationCode.length !== 6}
                          >
                            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Verificar'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mfaSetup.enabled && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">MFA Ativo</p>
                        <p className="text-sm text-green-600">
                          {mfaSetup.trustedDevices} dispositivos confiáveis
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100">
                      {mfaSetup.methodType.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {mfaSetup.lastUsed && (
                    <p className="text-sm text-muted-foreground">
                      Último uso: {mfaSetup.lastUsed.toLocaleString()}
                    </p>
                  )}
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Códigos de Backup</CardTitle>
                      <CardDescription>
                        Use estes códigos se não conseguir acessar seu dispositivo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                        {mfaSetup.backupCodes.map((code, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span>{code}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(code, `backup-${index}`)}
                            >
                              {copied === `backup-${index}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadBackupCodes}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Baixar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={regenerateBackupCodes}
                          disabled={loading}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerar
                        </Button>
                      </div>
                      
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Guarde estes códigos em local seguro. Cada código só pode ser usado uma vez.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sso" className="space-y-4">
          <div className="grid gap-4">
            {ssoProviders.map((provider) => (
              <Card key={provider.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                    <Badge variant="outline">{provider.type.toUpperCase()}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(provider.status)}>
                      {getStatusText(provider.status)}
                    </Badge>
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={() => toggleSSO(provider.id)}
                      disabled={loading || provider.status === 'syncing'}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Usuários conectados</p>
                      <p className="font-medium flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {provider.users}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Última sincronização</p>
                      <p className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatRelativeTime(provider.lastSync)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Configuração</p>
                      <div className="flex items-center space-x-2">
                        {provider.config.autoProvisioning && (
                          <Badge variant="secondary" className="text-xs">Auto Provisioning</Badge>
                        )}
                        {provider.config.groupMapping && (
                          <Badge variant="secondary" className="text-xs">Group Mapping</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configurar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Configurar {provider.name}</DialogTitle>
                          <DialogDescription>
                            Ajuste as configurações do provedor SSO
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Domínio</Label>
                            <Input value={provider.config.domain || ''} />
                          </div>
                          <div className="space-y-2">
                            <Label>Client ID</Label>
                            <Input value={provider.config.clientId || ''} />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch checked={provider.config.autoProvisioning} />
                            <Label>Auto Provisioning</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch checked={provider.config.groupMapping} />
                            <Label>Group Mapping</Label>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Ver Usuários
                    </Button>
                    <Button variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Novo Provedor SSO
              </CardTitle>
              <CardDescription>
                Configure um novo provedor de autenticação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24">
                  <div className="text-center">
                    <Key className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">SAML 2.0</p>
                    <p className="text-xs text-muted-foreground">Enterprise SSO</p>
                  </div>
                </Button>
                <Button variant="outline" className="h-24">
                  <div className="text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">OAuth 2.0</p>
                    <p className="text-xs text-muted-foreground">Social Login</p>
                  </div>
                </Button>
                <Button variant="outline" className="h-24">
                  <div className="text-center">
                    <Lock className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">OpenID Connect</p>
                    <p className="text-xs text-muted-foreground">Modern Standard</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Alertas de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Múltiplas tentativas de login falhadas</span>
                    </div>
                    <Badge variant="destructive">Alto</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Certificado SSL expirando em 7 dias</span>
                    </div>
                    <Badge variant="secondary">Médio</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Backup e Recuperação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Último backup</span>
                    <span className="text-sm text-muted-foreground">há 2 horas</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Próximo backup</span>
                    <span className="text-sm text-muted-foreground">em 22 horas</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Fazer Backup Manual
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Log de Auditoria
              </CardTitle>
              <CardDescription>
                Histórico detalhado de eventos de segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      <div>
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.user} • {event.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.ip && (
                        <span className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          {event.ip}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
