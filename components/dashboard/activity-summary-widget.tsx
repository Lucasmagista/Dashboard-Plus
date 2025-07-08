import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, MessageSquare, Target, Calendar } from "lucide-react";

// Mock de dados de atividades do usuário
function gerarResumoAtividades() {
  const agora = new Date();
  const hoje = agora.toLocaleDateString('pt-BR');
  
  return {
    data: hoje,
    mensagens: Math.floor(Math.random() * 15) + 5,
    negociosFechados: Math.floor(Math.random() * 4) + 1,
    tarefasPendentes: Math.floor(Math.random() * 8) + 3,
    reunioesHoje: Math.floor(Math.random() * 3) + 1,
    tempoOnline: `${Math.floor(Math.random() * 6) + 2}h ${Math.floor(Math.random() * 59)}min`,
  };
}

export const ActivitySummaryWidget: React.FC = () => {
  const [resumo, setResumo] = useState<ReturnType<typeof gerarResumoAtividades> | null>(null);

  useEffect(() => {
    // Simula carregamento de dados
    setTimeout(() => setResumo(gerarResumoAtividades()), 800);
  }, []);

  if (!resumo) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <div className="animate-pulse text-sm text-muted-foreground">Carregando resumo...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-blue-500" />
        <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Resumo do Dia</span>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2">Hoje, {resumo.data}</div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 rounded p-2">
          <MessageSquare className="w-3 h-3 text-green-600" />
          <span className="text-green-800 dark:text-green-300">{resumo.mensagens} mensagens</span>
        </div>
        
        <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 rounded p-2">
          <CheckCircle className="w-3 h-3 text-blue-600" />
          <span className="text-blue-800 dark:text-blue-300">{resumo.negociosFechados} negócios</span>
        </div>
        
        <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/30 rounded p-2">
          <Target className="w-3 h-3 text-orange-600" />
          <span className="text-orange-800 dark:text-orange-300">{resumo.tarefasPendentes} tarefas</span>
        </div>
        
        <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 rounded p-2">
          <Calendar className="w-3 h-3 text-purple-600" />
          <span className="text-purple-800 dark:text-purple-300">{resumo.reunioesHoje} reuniões</span>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground border-t pt-2">
        Tempo online: <span className="font-medium">{resumo.tempoOnline}</span>
      </div>
    </div>
  );
};
