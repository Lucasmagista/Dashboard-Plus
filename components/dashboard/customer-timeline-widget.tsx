import React, { useEffect, useState } from "react";
import { Clock, Mail, Phone, Calendar, MessageCircle, DollarSign } from "lucide-react";

interface EventoTimeline {
  id: string;
  tipo: "email" | "ligacao" | "reuniao" | "mensagem" | "venda";
  titulo: string;
  descricao: string;
  data: Date;
  valor?: number;
}

// Mock de eventos do cliente
function gerarEventosTimeline(): EventoTimeline[] {
  const agora = new Date();
  return [
    {
      id: "1",
      tipo: "venda",
      titulo: "Venda Fechada",
      descricao: "Contrato assinado para implementação do CRM",
      data: new Date(agora.getTime() - 2 * 60 * 60 * 1000), // 2h atrás
      valor: 25000,
    },
    {
      id: "2",
      tipo: "reuniao",
      titulo: "Reunião de Fechamento",
      descricao: "Apresentação final da proposta",
      data: new Date(agora.getTime() - 4 * 60 * 60 * 1000), // 4h atrás
    },
    {
      id: "3",
      tipo: "email",
      titulo: "Proposta Enviada",
      descricao: "Proposta comercial detalhada enviada por e-mail",
      data: new Date(agora.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    },
    {
      id: "4",
      tipo: "ligacao",
      titulo: "Ligação de Follow-up",
      descricao: "Esclarecimento de dúvidas técnicas",
      data: new Date(agora.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    },
    {
      id: "5",
      tipo: "mensagem",
      titulo: "WhatsApp - Interesse",
      descricao: "Cliente demonstrou interesse no produto",
      data: new Date(agora.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    },
  ];
}

function getIconeEvento(tipo: EventoTimeline['tipo']) {
  switch (tipo) {
    case "email": return <Mail className="w-4 h-4 text-blue-500" />;
    case "ligacao": return <Phone className="w-4 h-4 text-green-500" />;
    case "reuniao": return <Calendar className="w-4 h-4 text-purple-500" />;
    case "mensagem": return <MessageCircle className="w-4 h-4 text-orange-500" />;
    case "venda": return <DollarSign className="w-4 h-4 text-green-600" />;
  }
}

function getCorEvento(tipo: EventoTimeline['tipo']) {
  switch (tipo) {
    case "email": return "border-blue-500 bg-blue-50 dark:bg-blue-900/30";
    case "ligacao": return "border-green-500 bg-green-50 dark:bg-green-900/30";
    case "reuniao": return "border-purple-500 bg-purple-50 dark:bg-purple-900/30";
    case "mensagem": return "border-orange-500 bg-orange-50 dark:bg-orange-900/30";
    case "venda": return "border-green-600 bg-green-100 dark:bg-green-800/30";
  }
}

function formatarTempo(data: Date) {
  const agora = new Date();
  const diff = agora.getTime() - data.getTime();
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) return `${dias}d atrás`;
  if (horas > 0) return `${horas}h atrás`;
  return "Agora";
}

export const CustomerTimelineWidget: React.FC = () => {
  const [eventos, setEventos] = useState<EventoTimeline[]>([]);

  useEffect(() => {
    setTimeout(() => setEventos(gerarEventosTimeline()), 700);
  }, []);

  if (eventos.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <div className="animate-pulse text-sm text-muted-foreground">Carregando timeline...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-indigo-500" />
        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">Timeline do Cliente</span>
      </div>

      <div className="relative">
        {/* Linha vertical da timeline */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600"></div>

        <div className="space-y-4">
          {eventos.map((evento, index) => (
            <div key={evento.id} className="relative flex gap-3">
              {/* Ícone do evento */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getCorEvento(evento.tipo)}`}>
                {getIconeEvento(evento.tipo)}
              </div>

              {/* Conteúdo do evento */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">{evento.titulo}</h4>
                  <span className="text-xs text-muted-foreground">{formatarTempo(evento.data)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{evento.descricao}</p>
                {evento.valor && (
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">
                    R$ {evento.valor.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground border-t pt-2">
        Histórico completo de interações com o cliente
      </div>
    </div>
  );
};
