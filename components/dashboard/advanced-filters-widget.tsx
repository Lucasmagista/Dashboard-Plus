import React, { useState, useEffect } from "react";
import { Filter, Save, Trash2, Plus, X, Download, Upload, Settings } from "lucide-react";

interface FiltroCondicao {
  id: string;
  campo: string;
  operador: string;
  valor: string;
}

interface FiltroSalvo {
  id: string;
  nome: string;
  condicoes: FiltroCondicao[];
  dataCreacao: Date;
  aplicacoes: number;
}

const CAMPOS_DISPONIVEIS = [
  { valor: "nome", label: "Nome do Cliente" },
  { valor: "email", label: "E-mail" },
  { valor: "status", label: "Status" },
  { valor: "valor", label: "Valor do Negócio" },
  { valor: "origem", label: "Origem do Lead" },
  { valor: "data", label: "Data de Criação" },
  { valor: "telefone", label: "Telefone" },
  { valor: "cidade", label: "Cidade" },
  { valor: "categoria", label: "Categoria" },
];

const OPERADORES = [
  { valor: "contem", label: "Contém" },
  { valor: "igual", label: "Igual a" },
  { valor: "diferente", label: "Diferente de" },
  { valor: "maior", label: "Maior que" },
  { valor: "menor", label: "Menor que" },
  { valor: "entre", label: "Entre" },
  { valor: "comeca", label: "Começa com" },
  { valor: "termina", label: "Termina com" },
  { valor: "vazio", label: "Está vazio" },
  { valor: "nao_vazio", label: "Não está vazio" },
];

const STATUS_OPTIONS = ["qualificado", "negociação", "proposta", "fechado", "perdido"];
const ORIGEM_OPTIONS = ["website", "indicação", "redes sociais", "telemarketing", "evento"];

// Mock de filtros salvos com persistência
const FILTROS_INICIAIS: FiltroSalvo[] = [
  {
    id: "1",
    nome: "Leads Quentes",
    condicoes: [
      { id: "c1", campo: "status", operador: "igual", valor: "qualificado" },
      { id: "c2", campo: "valor", operador: "maior", valor: "10000" },
    ],
    dataCreacao: new Date(2025, 0, 1),
    aplicacoes: 15,
  },
  {
    id: "2", 
    nome: "Clientes Premium",
    condicoes: [
      { id: "c3", campo: "valor", operador: "maior", valor: "50000" },
    ],
    dataCreacao: new Date(2025, 0, 3),
    aplicacoes: 8,
  },
  {
    id: "3",
    nome: "Novos Leads Semana",
    condicoes: [
      { id: "c4", campo: "data", operador: "maior", valor: "2025-01-01" },
      { id: "c5", campo: "status", operador: "diferente", valor: "perdido" },
    ],
    dataCreacao: new Date(2025, 0, 5),
    aplicacoes: 22,
  },
];

const STORAGE_KEY = "crm-filtros-salvos";

export const AdvancedFiltersWidget: React.FC = () => {
  const [condicoes, setCondicoes] = useState<FiltroCondicao[]>([
    { id: "1", campo: "nome", operador: "contem", valor: "" },
  ]);
  const [filtrosSalvos, setFiltrosSalvos] = useState<FiltroSalvo[]>([]);
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [showSalvar, setShowSalvar] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null);

  // Carregar filtros salvos do localStorage
  useEffect(() => {
    try {
      const salvos = localStorage.getItem(STORAGE_KEY);
      if (salvos) {
        const filtros = JSON.parse(salvos).map((f: any) => ({
          ...f,
          dataCreacao: new Date(f.dataCreacao),
        }));
        setFiltrosSalvos(filtros);
      } else {
        setFiltrosSalvos(FILTROS_INICIAIS);
      }
    } catch {
      setFiltrosSalvos(FILTROS_INICIAIS);
    }
  }, []);

  // Salvar filtros no localStorage
  useEffect(() => {
    if (filtrosSalvos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrosSalvos));
    }
  }, [filtrosSalvos]);

  const adicionarCondicao = () => {
    const novaCondicao: FiltroCondicao = {
      id: Date.now().toString(),
      campo: "nome",
      operador: "contem",
      valor: "",
    };
    setCondicoes([...condicoes, novaCondicao]);
  };

  const removerCondicao = (id: string) => {
    setCondicoes(condicoes.filter(c => c.id !== id));
  };

  const atualizarCondicao = (id: string, campo: keyof FiltroCondicao, valor: string) => {
    setCondicoes(condicoes.map(c => 
      c.id === id ? { ...c, [campo]: valor } : c
    ));
  };

  const salvarFiltro = () => {
    if (!nomeFiltro.trim()) return;
    
    const novoFiltro: FiltroSalvo = {
      id: Date.now().toString(),
      nome: nomeFiltro,
      condicoes: [...condicoes],
      dataCreacao: new Date(),
      aplicacoes: 0,
    };
    
    setFiltrosSalvos([...filtrosSalvos, novoFiltro]);
    setNomeFiltro("");
    setShowSalvar(false);
    alert(`Filtro "${nomeFiltro}" salvo com sucesso!`);
  };

  const carregarFiltro = (filtro: FiltroSalvo) => {
    setCondicoes([...filtro.condicoes]);
    setFiltroAtivo(filtro.id);
    
    // Incrementar contador de aplicações
    setFiltrosSalvos(prev => prev.map(f => 
      f.id === filtro.id ? { ...f, aplicacoes: f.aplicacoes + 1 } : f
    ));
  };

  const excluirFiltro = (id: string) => {
    setFiltrosSalvos(filtrosSalvos.filter(f => f.id !== id));
    if (filtroAtivo === id) {
      setFiltroAtivo(null);
    }
  };

  const aplicarFiltros = () => {
    const condicoesValidas = condicoes.filter(c => c.valor.trim());
    
    // Simula aplicação dos filtros com lógica mais realista
    const resultados = {
      total: Math.floor(Math.random() * 1000) + 100,
      filtrados: Math.floor(Math.random() * 200) + 10,
    };
    
    alert(`Filtros aplicados!\n${condicoesValidas.length} condições ativas\n${resultados.filtrados} de ${resultados.total} registros encontrados`);
  };

  const exportarFiltros = () => {
    const data = JSON.stringify(filtrosSalvos, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtros-crm.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importarFiltros = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importados = JSON.parse(e.target?.result as string);
        setFiltrosSalvos([...filtrosSalvos, ...importados]);
        alert(`${importados.length} filtros importados com sucesso!`);
      } catch {
        alert('Erro ao importar filtros. Verifique o formato do arquivo.');
      }
    };
    reader.readAsText(file);
  };

  const limparFiltros = () => {
    setCondicoes([{ id: Date.now().toString(), campo: "nome", operador: "contem", valor: "" }]);
    setFiltroAtivo(null);
  };

  const renderCampoInput = (condicao: FiltroCondicao) => {
    if (condicao.operador === "vazio" || condicao.operador === "nao_vazio") {
      return (
        <input
          type="text"
          value="(automático)"
          disabled
          placeholder="Valor automático"
          title="Valor automático"
          className="flex-1 text-xs border rounded px-2 py-1 bg-gray-100 dark:bg-gray-700"
        />
      );
    }

    if (condicao.campo === "status") {
      return (
        <select
          value={condicao.valor}
          onChange={(e) => atualizarCondicao(condicao.id, "valor", e.target.value)}
          className="flex-1 text-xs border rounded px-2 py-1 bg-background"
          aria-label="Valor do status"
        >
          <option value="">Selecione...</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      );
    }

    if (condicao.campo === "origem") {
      return (
        <select
          value={condicao.valor}
          onChange={(e) => atualizarCondicao(condicao.id, "valor", e.target.value)}
          className="flex-1 text-xs border rounded px-2 py-1 bg-background"
          aria-label="Valor da origem"
        >
          <option value="">Selecione...</option>
          {ORIGEM_OPTIONS.map(origem => (
            <option key={origem} value={origem}>{origem}</option>
          ))}
        </select>
      );
    }

    if (condicao.campo === "data") {
      return (
        <input
          type="date"
          value={condicao.valor}
          onChange={(e) => atualizarCondicao(condicao.id, "valor", e.target.value)}
          className="flex-1 text-xs border rounded px-2 py-1 bg-background"
          placeholder="Selecione a data"
          title="Data de Criação"
        />
      );
    }

    return (
      <input
        type={condicao.campo === "valor" ? "number" : "text"}
        value={condicao.valor}
        onChange={(e) => atualizarCondicao(condicao.id, "valor", e.target.value)}
        placeholder="Valor..."
        className="flex-1 text-xs border rounded px-2 py-1 bg-background"
      />
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-blue-500" />
        <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Filtros Avançados</span>
      </div>

      {/* Condições do Filtro */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Condições</h4>
        {condicoes.map((condicao, index) => (
          <div key={condicao.id} className="flex gap-2 items-start">
            {index > 0 && (
              <div className="text-xs text-muted-foreground mt-2">E</div>
            )}
            
            <select
              value={condicao.campo}
              onChange={(e) => atualizarCondicao(condicao.id, "campo", e.target.value)}
              className="flex-1 text-xs border rounded px-2 py-1 bg-background"
              aria-label="Campo do filtro"
              title="Campo do filtro"
            >
              {CAMPOS_DISPONIVEIS.map(campo => (
                <option key={campo.valor} value={campo.valor}>{campo.label}</option>
              ))}
            </select>

            <select
              value={condicao.operador}
              onChange={(e) => atualizarCondicao(condicao.id, "operador", e.target.value)}
              className="flex-1 text-xs border rounded px-2 py-1 bg-background"
              title="Operador do filtro"
              aria-label="Operador do filtro"
            >
              {OPERADORES.map(op => (
                <option key={op.valor} value={op.valor}>{op.label}</option>
              ))}
            </select>

            <input
              type="text"
              value={condicao.valor}
              onChange={(e) => atualizarCondicao(condicao.id, "valor", e.target.value)}
              placeholder="Valor..."
              className="flex-1 text-xs border rounded px-2 py-1 bg-background"
            />

            {condicoes.length > 1 && (
              <button
                onClick={() => removerCondicao(condicao.id)}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                title="Remover condição"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        <div className="flex gap-2">
          <button
            onClick={adicionarCondicao}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-3 h-3" />
            Adicionar Condição
          </button>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2 pt-2 border-t">
        <button
          onClick={aplicarFiltros}
          className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={() => setShowSalvar(!showSalvar)}
          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
        >
          <Save className="w-3 h-3 inline mr-1" />
          Salvar
        </button>
      </div>

      {/* Salvar Filtro */}
      {showSalvar && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
          <input
            type="text"
            value={nomeFiltro}
            onChange={(e) => setNomeFiltro(e.target.value)}
            placeholder="Nome do filtro..."
            className="w-full text-xs border rounded px-2 py-1 mb-2 bg-background"
          />
          <div className="flex gap-2">
            <button
              onClick={salvarFiltro}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
            >
              Confirmar
            </button>
            <button
              onClick={() => setShowSalvar(false)}
              className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Filtros Salvos */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Filtros Salvos</h4>
        <div className="space-y-1">
          {filtrosSalvos.map(filtro => (
            <div key={filtro.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
              <button
                onClick={() => carregarFiltro(filtro)}
                className="flex-1 text-left hover:text-primary"
              >
                <span className="font-medium">{filtro.nome}</span>
                <div className="text-muted-foreground">{filtro.condicoes.length} condições</div>
              </button>
              <button
                onClick={() => excluirFiltro(filtro.id)}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                title="Excluir filtro"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Configure múltiplas condições e salve seus filtros favoritos
      </div>
    </div>
  );
};
