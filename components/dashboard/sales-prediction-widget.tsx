import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Brain } from "lucide-react";

// Simulação de previsão de vendas com ML (mock)

type Previsao = { mes: string; valor: number };
function gerarPrevisoes(): Previsao[] {
  const base = 40000;
  return Array.from({ length: 6 }, (_, i) => ({
    mes: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][i],
    valor: Math.round(base + Math.random() * 8000 + i * 2000),
  }));
}

export const SalesPredictionWidget: React.FC = () => {
  const [dados, setDados] = useState<Previsao[]>([]);

  useEffect(() => {
    setDados(gerarPrevisoes());
  }, []);

  return (
    <div className="w-full h-40 flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-primary">Previsão de Vendas (ML)</span>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={dados} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
          <XAxis dataKey="mes" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString()}`} />
          <Line type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-xs text-muted-foreground mt-1">Tendência de vendas para os próximos meses</div>
    </div>
  );
};
