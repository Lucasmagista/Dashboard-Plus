import React, { useEffect, useState } from "react";
import { TrendingDown, Users, DollarSign, CheckCircle } from "lucide-react";

interface FunilEtapa {
  nome: string;
  quantidade: number;
  valor: number;
  cor: string;
  icone: any;
}

// Mock de dados do funil em tempo real
function gerarDadosFunil(): FunilEtapa[] {
  return [
    {
      nome: "Leads",
      quantidade: 1250,
      valor: 0,
      cor: "bg-blue-500",
      icone: Users,
    },
    {
      nome: "Qualificados",
      quantidade: 420,
      valor: 0,
      cor: "bg-green-500",
      icone: CheckCircle,
    },
    {
      nome: "Propostas",
      quantidade: 85,
      valor: 425000,
      cor: "bg-yellow-500",
      icone: DollarSign,
    },
    {
      nome: "Fechados",
      quantidade: 23,
      valor: 145000,
      cor: "bg-purple-500",
      icone: CheckCircle,
    },
  ];
}

export const SalesFunnelWidget: React.FC = () => {
  const [etapas, setEtapas] = useState<FunilEtapa[]>([]);
  const [atualizacaoTempo, setAtualizacaoTempo] = useState(Date.now());

  useEffect(() => {
    // Simula dados em tempo real
    const carregarDados = () => setEtapas(gerarDadosFunil());
    carregarDados();

    // Atualiza a cada 30 segundos para simular tempo real
    const interval = setInterval(() => {
      carregarDados();
      setAtualizacaoTempo(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (etapas.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <div className="animate-pulse text-sm text-muted-foreground">Carregando funil...</div>
      </div>
    );
  }

  const maxQuantidade = etapas[0]?.quantidade || 1;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-green-500" />
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">Funil de Vendas</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Atualizado: {new Date(atualizacaoTempo).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="space-y-3">
        {etapas.map((etapa, index) => {
          const largura = (etapa.quantidade / maxQuantidade) * 100;
          const IconeEtapa = etapa.icone;
          
          return (
            <div key={etapa.nome} className="relative">
              {/* Barra do funil */}
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden h-8">
                <div
                  className={`h-full ${etapa.cor} transition-all duration-500 flex items-center justify-between px-3`}
                  style={{ width: `${Math.max(largura, 10)}%` }}
                >
                  <div className="flex items-center gap-2 text-white text-xs font-medium">
                    <IconeEtapa className="w-3 h-3" />
                    <span>{etapa.nome}</span>
                  </div>
                  <span className="text-white text-xs font-bold">
                    {etapa.quantidade}
                  </span>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                <span>
                  {index > 0 && etapas[index - 1] && (
                    `${((etapa.quantidade / etapas[index - 1].quantidade) * 100).toFixed(1)}% conversão`
                  )}
                </span>
                {etapa.valor > 0 && (
                  <span className="font-medium">
                    R$ {etapa.valor.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground border-t pt-2">
        <div className="flex justify-between">
          <span>Taxa de conversão geral:</span>
          <span className="font-medium">
            {((etapas[etapas.length - 1]?.quantidade / etapas[0]?.quantidade) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};
