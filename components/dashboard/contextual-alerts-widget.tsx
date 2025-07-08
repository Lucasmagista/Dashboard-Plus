import React, { useEffect, useState } from "react";
import { AlertTriangle, Info, CheckCircle, X } from "lucide-react";

type AlertType = "warning" | "info" | "success";

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  contextual: boolean;
}

// Mock de alertas contextuais baseados no estado atual
function gerarAlertasContextuais(): Alert[] {
  const alertas: Alert[] = [];
  const agora = new Date();
  const hora = agora.getHours();

  // Alertas baseados no horário
  if (hora >= 9 && hora <= 12) {
    alertas.push({
      id: "manha-produtiva",
      type: "info",
      title: "Período Produtivo",
      message: "Este é o melhor horário para ligar para leads",
      contextual: true,
    });
  }

  if (hora >= 17) {
    alertas.push({
      id: "fim-expediente",
      type: "warning",
      title: "Fim do Expediente",
      message: "Você tem 3 tarefas pendentes para hoje",
      contextual: true,
    });
  }

  // Alertas baseados em atividades
  alertas.push({
    id: "oportunidade-quente",
    type: "success",
    title: "Oportunidade Quente",
    message: "Lead 'Empresa Alpha' abriu seu e-mail 3x hoje",
    contextual: true,
  });

  alertas.push({
    id: "follow-up-urgente",
    type: "warning",
    title: "Follow-up Urgente",
    message: "Contato 'João Silva' está há 5 dias sem resposta",
    contextual: true,
  });

  return alertas;
}

export const ContextualAlertsWidget: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Simula análise contextual
    setTimeout(() => setAlerts(gerarAlertasContextuais()), 1000);
  }, []);

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getIcon = (type: AlertType) => {
    switch (type) {
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info": return <Info className="w-4 h-4 text-blue-500" />;
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStyles = (type: AlertType) => {
    switch (type) {
      case "warning": return "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800";
      case "info": return "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800";
      case "success": return "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800";
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <div className="text-sm text-muted-foreground">Analisando contexto...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-5 h-5 text-blue-500" />
        <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Alertas Contextuais</span>
      </div>
      
      {alerts.map(alert => (
        <div key={alert.id} className={`p-3 rounded-lg border ${getStyles(alert.type)} relative`}>
          <button
            onClick={() => removeAlert(alert.id)}
            className="absolute top-1 right-1 p-1 hover:bg-black/10 rounded"
            title="Dispensar alerta"
          >
            <X className="w-3 h-3" />
          </button>
          
          <div className="flex items-start gap-2 pr-6">
            {getIcon(alert.type)}
            <div className="flex-1">
              <div className="text-sm font-medium">{alert.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{alert.message}</div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-xs text-muted-foreground">
        Alertas baseados no seu contexto atual
      </div>
    </div>
  );
};
