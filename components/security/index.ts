// Componentes principais de segurança
export { SecurityIntegration } from './security-integration';
export { SecurityMetrics, SecurityMetricsCard, defaultSecurityMetrics } from './security-metrics';
export { SecurityAlerts, mockSecurityAlerts } from './security-alerts';

// Hook personalizado
export { useSecurity } from '../../hooks/use-security';

// Constantes e utilitários
export const SECURITY_CONSTANTS = {
  REFRESH_INTERVAL: 30000,
  MFA_CODE_LENGTH: 6,
  BACKUP_CODES_COUNT: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  CERTIFICATE_WARNING_DAYS: 30
};

export const SECURITY_TYPES = {
  ALERTS: ['critical', 'high', 'medium', 'low', 'info'] as const,
  CATEGORIES: ['authentication', 'authorization', 'system', 'compliance', 'monitoring'] as const,
  SSO_TYPES: ['saml', 'oauth', 'oidc'] as const,
  MFA_METHODS: ['app', 'sms', 'email', 'hardware'] as const
};

export const COMPLIANCE_STANDARDS = {
  GDPR: 'GDPR',
  SOC2: 'SOC 2',
  ISO27001: 'ISO 27001',
  HIPAA: 'HIPAA',
  PCI_DSS: 'PCI DSS'
} as const;
