import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChevronLeft, BarChart3 } from "lucide-react";

// Dados mockados para demonstrar drill-down
const vendasPorRegiao = [
  { nome: "São Paulo", valor: 45000, detalhes: [
    { nome: "SP Capital", valor: 25000 },
    { nome: "Interior SP", valor: 20000 },
  ]},
  { nome: "Rio de Janeiro", valor: 32000, detalhes: [
    { nome: "RJ Capital", valor: 20000 },
    { nome: "Interior RJ", valor: 12000 },
  ]},
  { nome: "Minas Gerais", valor: 28000, detalhes: [
    { nome: "BH", valor: 15000 },
    { nome: "Interior MG", valor: 13000 },
  ]},
  { nome: "Outros", valor: 15000, detalhes: [
    { nome: "Sul", valor: 8000 },
    { nome: "Nordeste", valor: 7000 },
  ]},
];

const CORES = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const InteractiveChartsWidget: React.FC = () => {
  const [viewMode, setViewMode] = useState<"overview" | "drilldown">("overview");
  const [selectedRegion, setSelectedRegion] = useState<typeof vendasPorRegiao[0] | null>(null);

  const handleBarClick = (data: any) => {
    const regiao = vendasPorRegiao.find(r => r.nome === data.nome);
    if (regiao) {
      setSelectedRegion(regiao);
      setViewMode("drilldown");
    }
  };

  const voltarOverview = () => {
    setViewMode("overview");
    setSelectedRegion(null);
  };

  return (
    <div className="w-full h-80 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
            {viewMode === "overview" ? "Vendas por Região" : `Detalhes - ${selectedRegion?.nome}`}
          </span>
        </div>
        {viewMode === "drilldown" && (
          <button
            onClick={voltarOverview}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="w-3 h-3" />
            Voltar
          </button>
        )}
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === "overview" ? (
            <BarChart data={vendasPorRegiao} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString()}`} />
              <Bar 
                dataKey="valor" 
                fill="#8884d8" 
                onClick={handleBarClick}
                style={{ cursor: "pointer" }}
              />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={selectedRegion?.detalhes || []}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
                label={({ nome, value }) => `${nome}: R$ ${value.toLocaleString()}`}
              >
                {selectedRegion?.detalhes?.map((entry, index) => (
                  <Cell key={entry.nome} fill={CORES[index % CORES.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString()}`} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-muted-foreground mt-2">
        {viewMode === "overview" 
          ? "Clique em uma barra para ver detalhes"
          : "Distribuição detalhada da região selecionada"
        }
      </div>
    </div>
  );
};
