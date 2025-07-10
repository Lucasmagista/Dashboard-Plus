import React, { useState } from "react";
import { GripVertical, Plus, X, Settings } from "lucide-react";

interface WidgetConfig {
  id: string;
  nome: string;
  ativo: boolean;
  posicao: number;
}

// Mock de widgets disponíveis
const WIDGETS_DISPONIVEIS: WidgetConfig[] = [
  { id: "vendas", nome: "Vendas Totais", ativo: true, posicao: 0 },
  { id: "leads", nome: "Leads Ativos", ativo: true, posicao: 1 },
  { id: "funil", nome: "Funil de Vendas", ativo: false, posicao: 2 },
  { id: "timeline", nome: "Timeline Cliente", ativo: true, posicao: 3 },
  { id: "mapa-calor", nome: "Mapa de Calor", ativo: false, posicao: 4 },
  { id: "previsoes", nome: "Previsões ML", ativo: true, posicao: 5 },
];

export const DashboardBuilderWidget: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(WIDGETS_DISPONIVEIS);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const widgetsAtivos = widgets.filter(w => w.ativo).sort((a, b) => a.posicao - b.posicao);
  const widgetsInativos = widgets.filter(w => !w.ativo);

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedItem(widgetId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId?: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    setWidgets(prev => {
      const updated = [...prev];
      const draggedWidget = updated.find(w => w.id === draggedItem);
      const targetWidget = targetId ? updated.find(w => w.id === targetId) : null;

      if (draggedWidget) {
        if (targetWidget) {
          // Reordenar entre widgets ativos
          const draggedPos = draggedWidget.posicao;
          const targetPos = targetWidget.posicao;
          draggedWidget.posicao = targetPos;
          targetWidget.posicao = draggedPos;
        } else if (!draggedWidget.ativo) {
          // Adicionar widget inativo
          draggedWidget.ativo = true;
          draggedWidget.posicao = widgetsAtivos.length;
        }
      }

      return updated;
    });

    setDraggedItem(null);
  };

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, ativo: !w.ativo } : w
    ));
  };

  const salvarLayout = () => {
    // Simula salvamento do layout
    alert("Layout salvo com sucesso!");
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">Builder Dashboard</span>
        </div>
        <button
          onClick={salvarLayout}
          className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90"
        >
          Salvar Layout
        </button>
      </div>

      {/* Widgets Ativos */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Widgets Ativos</h4>
        <div
          className="space-y-1 min-h-[120px] p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e)}
        >
          {widgetsAtivos.map(widget => (
            <div
              key={widget.id}
              draggable
              onDragStart={(e) => handleDragStart(e, widget.id)}
              className="flex items-center justify-between p-2 bg-card dark:bg-gray-800 border rounded cursor-move hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{widget.nome}</span>
              </div>
              <button
                onClick={() => toggleWidget(widget.id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Remover widget"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {widgetsAtivos.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              Arraste widgets aqui para ativar
            </div>
          )}
        </div>
      </div>

      {/* Widgets Disponíveis */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Widgets Disponíveis</h4>
        <div className="grid grid-cols-2 gap-2">
          {widgetsInativos.map(widget => (
            <div
              key={widget.id}
              draggable
              onDragStart={(e) => handleDragStart(e, widget.id)}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded cursor-move hover:shadow-md transition-shadow"
            >
              <span className="text-sm">{widget.nome}</span>
              <button
                onClick={() => toggleWidget(widget.id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Adicionar widget"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Arraste e solte para reorganizar widgets ou clique nos botões para ativar/desativar
      </div>
    </div>
  );
};
