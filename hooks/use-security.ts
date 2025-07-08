import { useState, useEffect, useCallback } from 'react';

interface SecurityHookConfig {
  refreshInterval?: number;
  autoRefresh?: boolean;
}

interface SecurityData {
  mfaSetup: any;
  ssoProviders: any[];
  securityEvents: any[];
  securityMetrics: any;
  complianceStandards: any[];
}

interface SecurityActions {
  setupMFA: () => Promise<void>;
  verifyMFA: (code: string) => Promise<void>;
  toggleSSO: (providerId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  downloadBackupCodes: () => void;
  regenerateBackupCodes: () => Promise<void>;
  copyToClipboard: (text: string, type: string) => Promise<void>;
}

export function useSecurity(config: SecurityHookConfig = {}) {
  const { refreshInterval = 30000, autoRefresh = true } = config;
  
  const [data, setData] = useState<SecurityData>({
    mfaSetup: {
      enabled: false,
      secret: '',
      qrCodeUrl: '',
      backupCodes: [],
      lastUsed: null,
      trustedDevices: 0,
      setupProgress: 0,
      methodType: 'app'
    },
    ssoProviders: [],
    securityEvents: [],
    securityMetrics: {
      totalLogins: 0,
      mfaAdoptionRate: 0,
      ssoUsage: 0,
      failedLogins: 0,
      activeUsers: 0,
      riskScore: 0,
      lastSecurityScan: new Date()
    },
    complianceStandards: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadSecurityData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data would be replaced with actual API calls
      const mockData = generateMockSecurityData();
      setData(mockData);
      
    } catch (err) {
      setError('Erro ao carregar dados de segurança');
    } finally {
      setLoading(false);
    }
  }, []);

  const setupMFA = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate MFA setup process
      setData(prev => ({
        ...prev,
        mfaSetup: { ...prev.mfaSetup, setupProgress: 25 }
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSecret = generateRandomSecret();
      const qrCode = generateQRCode(newSecret);
      const backupCodes = generateBackupCodes();
      
      setData(prev => ({
        ...prev,
        mfaSetup: {
          ...prev.mfaSetup,
          secret: newSecret,
          qrCodeUrl: qrCode,
          backupCodes,
          setupProgress: 100
        }
      }));
      
      setSuccess('MFA configurado com sucesso!');
      
    } catch (err) {
      setError('Erro ao configurar MFA');
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyMFA = useCallback(async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (code.length !== 6) {
        setError('Código deve ter 6 dígitos');
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(prev => ({
        ...prev,
        mfaSetup: {
          ...prev.mfaSetup,
          enabled: true,
          lastUsed: new Date(),
          trustedDevices: prev.mfaSetup.trustedDevices + 1
        }
      }));
      
      setSuccess('MFA ativado com sucesso!');
      
    } catch (err) {
      setError('Código inválido');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSSO = useCallback(async (providerId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      setData(prev => ({
        ...prev,
        ssoProviders: prev.ssoProviders.map(provider => 
          provider.id === providerId 
            ? { ...provider, status: 'syncing' }
            : provider
        )
      }));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setData(prev => ({
        ...prev,
        ssoProviders: prev.ssoProviders.map(provider => 
          provider.id === providerId 
            ? { 
                ...provider, 
                enabled: !provider.enabled,
                status: provider.enabled ? 'inactive' : 'active',
                lastSync: new Date()
              }
            : provider
        )
      }));
      
      setSuccess('Configuração SSO atualizada!');
      
    } catch (err) {
      setError('Erro ao atualizar SSO');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await loadSecurityData();
  }, [loadSecurityData]);

  const downloadBackupCodes = useCallback(() => {
    const content = `Códigos de Backup - CRM Pro Dashboard

Data de geração: ${new Date().toLocaleString()}

${data.mfaSetup.backupCodes.join('\n')}

IMPORTANTE: Guarde estes códigos em local seguro. Cada código só pode ser usado uma vez.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-codes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [data.mfaSetup.backupCodes]);

  const regenerateBackupCodes = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCodes = generateBackupCodes();
      setData(prev => ({
        ...prev,
        mfaSetup: { ...prev.mfaSetup, backupCodes: newCodes }
      }));
      
      setSuccess('Códigos de backup regenerados!');
      
    } catch (err) {
      setError('Erro ao regenerar códigos');
    } finally {
      setLoading(false);
    }
  }, []);

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess(`${type} copiado para área de transferência`);
    } catch (err) {
      setError('Erro ao copiar para área de transferência');
    }
  }, []);

  useEffect(() => {
    loadSecurityData();
    
    if (autoRefresh) {
      const interval = setInterval(loadSecurityData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [loadSecurityData, autoRefresh, refreshInterval]);

  const actions: SecurityActions = {
    setupMFA,
    verifyMFA,
    toggleSSO,
    refreshData,
    downloadBackupCodes,
    regenerateBackupCodes,
    copyToClipboard
  };

  return {
    data,
    loading,
    error,
    success,
    actions,
    setError,
    setSuccess
  };
}

// Utility functions
function generateRandomSecret(): string {
  return Math.random().toString(36).substring(2, 15).toUpperCase();
}

function generateQRCode(secret: string): string {
  return `otpauth://totp/CRM Pro Dashboard:user@example.com?secret=${secret}&issuer=CRM Pro Dashboard`;
}

function generateBackupCodes(): string[] {
  return Array.from({ length: 8 }, () => 
    Math.floor(Math.random() * 90000000) + 10000000
  ).map(String);
}

function generateMockSecurityData(): SecurityData {
  return {
    mfaSetup: {
      enabled: true,
      secret: 'JBSWY3DPEHPK3PXP',
      qrCodeUrl: 'otpauth://totp/CRM Pro Dashboard:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=CRM Pro Dashboard',
      backupCodes: generateBackupCodes(),
      lastUsed: new Date(),
      trustedDevices: 3,
      setupProgress: 100,
      methodType: 'app'
    },
    ssoProviders: [
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
      }
    ],
    securityEvents: [
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
        description: 'Tentativa de login falhada',
        severity: 'medium',
        ip: '192.168.1.101'
      }
    ],
    securityMetrics: {
      totalLogins: 1247,
      mfaAdoptionRate: 78,
      ssoUsage: 65,
      failedLogins: 23,
      activeUsers: 45,
      riskScore: 25,
      lastSecurityScan: new Date(Date.now() - 7200000)
    },
    complianceStandards: [
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
      }
    ]
  };
}
