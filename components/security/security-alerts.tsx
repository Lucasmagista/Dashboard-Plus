import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Bell,
  Shield,
  Eye,
  Clock,
  Globe,
  User
} from 'lucide-react';

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

interface SecurityAlertsProps {
  alerts: SecurityAlert[];
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
  className?: string;
}

export function SecurityAlerts({ 
  alerts, 
  onAcknowledge, 
  onDismiss, 
  className 
}: SecurityAlertsProps) {
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'critical'>('all');
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
      case 'info':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'info': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <User className="h-3 w-3" />;
      case 'authorization': return <Shield className="h-3 w-3" />;
      case 'system': return <AlertTriangle className="h-3 w-3" />;
      case 'compliance': return <CheckCircle className="h-3 w-3" />;
      case 'monitoring': return <Eye className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unacknowledged':
        return !alert.acknowledged;
      case 'critical':
        return alert.type === 'critical';
      default:
        return true;
    }
  });

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'há poucos segundos';
    if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} horas`;
    return `há ${Math.floor(diffInSeconds / 86400)} dias`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Alertas de Segurança
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos ({alerts.length})
            </Button>
            <Button
              variant={filter === 'unacknowledged' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unacknowledged')}
            >
              Não Reconhecidos ({alerts.filter(a => !a.acknowledged).length})
            </Button>
            <Button
              variant={filter === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('critical')}
            >
              Críticos ({alerts.filter(a => a.type === 'critical').length})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-lg font-medium">Nenhum alerta encontrado</p>
              <p className="text-sm text-muted-foreground">
                {filter === 'all' 
                  ? 'Não há alertas de segurança no momento' 
                  : `Não há alertas ${filter === 'critical' ? 'críticos' : 'não reconhecidos'}`}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <Alert 
                key={alert.id} 
                variant={getAlertVariant(alert.type)}
                className={`${alert.acknowledged ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <AlertTitle className="text-sm font-medium">
                          {alert.title}
                        </AlertTitle>
                        <Badge variant="outline" className={getTypeColor(alert.type)}>
                          {alert.type.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          {getCategoryIcon(alert.category)}
                          <span className="capitalize">{alert.category}</span>
                        </Badge>
                      </div>
                      
                      <AlertDescription className="text-sm">
                        {alert.description}
                      </AlertDescription>
                      
                      {alert.details && (
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          {alert.details.ip && (
                            <div className="flex items-center space-x-1">
                              <Globe className="h-3 w-3" />
                              <span>IP: {alert.details.ip}</span>
                            </div>
                          )}
                          {alert.details.location && (
                            <div className="flex items-center space-x-1">
                              <Globe className="h-3 w-3" />
                              <span>Local: {alert.details.location}</span>
                            </div>
                          )}
                          {alert.details.affectedUsers && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>Usuários afetados: {alert.details.affectedUsers}</span>
                            </div>
                          )}
                          {alert.details.riskScore && (
                            <div className="flex items-center space-x-1">
                              <Shield className="h-3 w-3" />
                              <span>Score de risco: {alert.details.riskScore}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>{formatRelativeTime(alert.timestamp)}</span>
                          <span>•</span>
                          <span>{alert.source}</span>
                        </div>
                        {alert.acknowledged && (
                          <Badge variant="secondary" className="text-xs">
                            Reconhecido
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAcknowledge(alert.id)}
                      >
                        Reconhecer
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data for development
export const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Múltiplas tentativas de login falhadas',
    description: 'Detectadas 15 tentativas de login falhadas para o usuário admin@company.com nos últimos 5 minutos',
    timestamp: new Date(Date.now() - 300000),
    source: 'Sistema de Autenticação',
    acknowledged: false,
    actionRequired: true,
    category: 'authentication',
    details: {
      ip: '192.168.1.100',
      location: 'São Paulo, Brasil',
      affectedUsers: 1,
      riskScore: 85
    }
  },
  {
    id: '2',
    type: 'high',
    title: 'Certificado SSL expirando',
    description: 'O certificado SSL do domínio principal expirará em 7 dias',
    timestamp: new Date(Date.now() - 3600000),
    source: 'Monitor de Certificados',
    acknowledged: false,
    actionRequired: true,
    category: 'system'
  },
  {
    id: '3',
    type: 'medium',
    title: 'Novo dispositivo detectado',
    description: 'Login realizado a partir de novo dispositivo não reconhecido',
    timestamp: new Date(Date.now() - 7200000),
    source: 'Sistema de Monitoramento',
    acknowledged: true,
    actionRequired: false,
    category: 'monitoring',
    details: {
      ip: '192.168.1.101',
      userAgent: 'Chrome/120.0.0.0',
      location: 'Rio de Janeiro, Brasil'
    }
  },
  {
    id: '4',
    type: 'low',
    title: 'Backup concluído com sucesso',
    description: 'Backup automático dos dados de segurança foi realizado com sucesso',
    timestamp: new Date(Date.now() - 14400000),
    source: 'Sistema de Backup',
    acknowledged: true,
    actionRequired: false,
    category: 'system'
  },
  {
    id: '5',
    type: 'info',
    title: 'Atualização de política de segurança',
    description: 'Nova política de senhas foi aplicada com sucesso para todos os usuários',
    timestamp: new Date(Date.now() - 86400000),
    source: 'Sistema de Políticas',
    acknowledged: true,
    actionRequired: false,
    category: 'compliance'
  }
];
