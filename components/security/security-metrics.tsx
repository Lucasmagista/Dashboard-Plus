import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Key, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

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

interface SecurityMetricsProps {
  metrics: SecurityMetric[];
  className?: string;
}

export function SecurityMetrics({ metrics, className }: SecurityMetricsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return <Badge variant="default" className="bg-green-100 text-green-800">Bom</Badge>;
      case 'warning': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
      case 'critical': return <Badge variant="destructive">Crítico</Badge>;
      default: return null;
    }
  };

  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return null;
    
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const formatValue = (value: number, type: string, unit?: string) => {
    switch (type) {
      case 'percentage':
        return `${value}%`;
      case 'score':
        return `${value}/100`;
      case 'number':
        return unit ? `${value} ${unit}` : value.toString();
      default:
        return value.toString();
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {metrics.map((metric) => (
        <Card key={metric.id} className="relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <div className="flex items-center space-x-2">
              {metric.icon}
              {getTrendIcon(metric.value, metric.previousValue)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                <span className={getStatusColor(metric.status)}>
                  {formatValue(metric.value, metric.type, metric.unit)}
                </span>
              </div>
              {getStatusBadge(metric.status)}
            </div>
            
            {metric.type === 'percentage' && (
              <Progress 
                value={metric.value} 
                className="mt-2"
                color={
                  metric.status === 'good' ? 'bg-green-600' :
                  metric.status === 'warning' ? 'bg-yellow-600' :
                  'bg-red-600'
                }
              />
            )}
            
            {metric.description && (
              <p className="text-xs text-muted-foreground mt-2">
                {metric.description}
              </p>
            )}
            
            {metric.target && (
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>Meta: {formatValue(metric.target, metric.type, metric.unit)}</span>
                <span>
                  {metric.value >= metric.target ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  )}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Predefined security metrics
export const defaultSecurityMetrics: SecurityMetric[] = [
  {
    id: 'risk-score',
    title: 'Score de Risco',
    value: 25,
    previousValue: 30,
    target: 20,
    type: 'score',
    status: 'warning',
    icon: <Shield className="h-4 w-4" />,
    description: 'Baixo risco geral'
  },
  {
    id: 'mfa-adoption',
    title: 'Adoção MFA',
    value: 78,
    previousValue: 65,
    target: 90,
    type: 'percentage',
    status: 'good',
    icon: <Key className="h-4 w-4" />,
    description: 'Crescimento constante'
  },
  {
    id: 'sso-usage',
    title: 'Uso SSO',
    value: 65,
    previousValue: 60,
    target: 80,
    type: 'percentage',
    status: 'good',
    icon: <Users className="h-4 w-4" />,
    description: 'Acima da média'
  },
  {
    id: 'active-users',
    title: 'Usuários Ativos',
    value: 45,
    previousValue: 42,
    type: 'number',
    status: 'good',
    icon: <Activity className="h-4 w-4" />,
    description: 'Crescimento saudável'
  }
];

export function SecurityMetricsCard({ 
  title = "Métricas de Segurança",
  metrics = defaultSecurityMetrics,
  className
}: {
  title?: string;
  metrics?: SecurityMetric[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SecurityMetrics metrics={metrics} />
      </CardContent>
    </Card>
  );
}
