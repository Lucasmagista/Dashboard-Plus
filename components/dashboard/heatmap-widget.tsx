import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";

// Gera dados mock para mapa de calor (atividades por hora/dia)
function gerarDadosHeatmap() {
  const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const horas = Array.from({ length: 24 }, (_, i) => i);
  
  return dias.map(dia => ({
    dia,
    atividades: horas.map(hora => ({
      hora,
      intensidade: Math.floor(Math.random() * 100), // 0-100
    }))
  }));
}

function getCorIntensidade(intensidade: number) {
  if (intensidade < 20) return 'bg-gray-100 dark:bg-gray-800';
  if (intensidade < 40) return 'bg-blue-200 dark:bg-blue-900';
  if (intensidade < 60) return 'bg-blue-400 dark:bg-blue-700';
  if (intensidade < 80) return 'bg-blue-600 dark:bg-blue-500';
  return 'bg-blue-800 dark:bg-blue-300';
}

export const HeatmapWidget: React.FC = () => {
  const [dados, setDados] = useState<ReturnType<typeof gerarDadosHeatmap>>([]);
  const [hoveredCell, setHoveredCell] = useState<{dia: string; hora: number; intensidade: number} | null>(null);

  useEffect(() => {
    setTimeout(() => setDados(gerarDadosHeatmap()), 600);
  }, []);

  if (dados.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <div className="animate-pulse text-sm text-muted-foreground">Carregando mapa de calor...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5 text-orange-500" />
        <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">Mapa de Calor - Atividades</span>
      </div>

      <div className="relative">
        {/* Grid do heatmap */}
        <div className="grid grid-cols-8 gap-1 text-xs">
          {/* Cabeçalho com horas */}
          <div></div>
          {[0, 6, 12, 18].map(hora => (
            <div key={hora} className="text-center text-muted-foreground text-[10px]">
              {hora}h
            </div>
          ))}
          <div className="text-center text-muted-foreground text-[10px]">23h</div>
          <div></div>
          <div></div>

          {/* Linhas por dia */}
          {dados.map(({ dia, atividades }) => (
            <React.Fragment key={dia}>
              <div className="text-[10px] text-muted-foreground flex items-center justify-end pr-1">
                {dia}
              </div>
              {atividades.filter((_, i) => i % 6 === 0 || i === 23).map(({ hora, intensidade }) => (
                <button
                  key={`${dia}-${hora}`}
                  className={`w-4 h-4 rounded-sm cursor-pointer transition-all ${getCorIntensidade(intensidade)} hover:scale-110 border-0 p-0`}
                  onMouseEnter={() => setHoveredCell({ dia, hora, intensidade })}
                  onMouseLeave={() => setHoveredCell(null)}
                  title={`${dia} ${hora}h: ${intensidade} atividades`}
                  aria-label={`${dia} ${hora}h: ${intensidade} atividades`}
                />
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs rounded px-2 py-1 z-10">
            {hoveredCell.dia} {hoveredCell.hora}h: {hoveredCell.intensidade} atividades
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Menos</span>
        <div className="flex gap-1">
          {[0, 25, 50, 75, 95].map(intensidade => (
            <div key={intensidade} className={`w-3 h-3 rounded-sm ${getCorIntensidade(intensidade)}`} />
          ))}
        </div>
        <span className="text-muted-foreground">Mais</span>
      </div>

      <div className="text-xs text-muted-foreground">
        Intensidade de atividades por horário da semana
      </div>
    </div>
  );
};
