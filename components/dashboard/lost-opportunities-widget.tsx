import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

// Simulação de oportunidades perdidas detectadas por "ML"
const MOCK_OPPS = [
  { nome: "Empresa Alpha", diasSemContato: 22, valor: 12000 },
  { nome: "Beta Solutions", diasSemContato: 17, valor: 8500 },
  { nome: "Gamma Tech", diasSemContato: 30, valor: 21000 },
];

export const LostOpportunitiesWidget: React.FC = () => {
  const [oportunidades, setOportunidades] = useState<typeof MOCK_OPPS>([]);

  useEffect(() => {
    // Simula análise automática
    setTimeout(() => setOportunidades(MOCK_OPPS), 600);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">Oportunidades Perdidas</span>
      </div>
      {oportunidades.length === 0 ? (
        <div className="text-xs text-muted-foreground">Analisando oportunidades...</div>
      ) : (
        <ul className="w-full text-xs space-y-1">
          {oportunidades.map((opp) => (
            <li key={opp.nome} className="flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/30 rounded px-2 py-1">
              <span className="font-medium">{opp.nome}</span>
              <span className="text-yellow-700 dark:text-yellow-300">{opp.diasSemContato}d • R$ {opp.valor.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="text-xs text-muted-foreground mt-1">Negócios sem contato recente ou parados</div>
    </div>
  );
};
