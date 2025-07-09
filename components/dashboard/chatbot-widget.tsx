import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Loader2, Trash2, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SUGESTOES = [
  "Como está o funil de vendas hoje?",
  "Quais contatos não foram respondidos?",
  "Resumo das oportunidades perdidas",
  "Qual o melhor horário para ligar para leads?",
];

function respostaAutomatica(msg: string) {
  if (msg.toLowerCase().includes("funil")) return "Seu funil tem **4 etapas ativas** e **12 oportunidades** em negociação.";
  if (msg.toLowerCase().includes("contato")) return "Você tem **5 contatos** sem resposta há mais de 3 dias.";
  if (msg.toLowerCase().includes("perdidas")) return "Foram detectadas **3 oportunidades perdidas** este mês.";
  if (msg.toLowerCase().includes("horário")) return "O melhor horário para ligar é entre **10h e 12h**, segundo o histórico.";
  if (msg.toLowerCase().includes("limpar")) return "Conversa limpa!";
  return "Desculpe, não entendi. Tente perguntar sobre funil, contatos ou oportunidades.";
}

function renderMarkdown(text: string) {
  // Suporte simples a **negrito** e links [texto](url)
  let t = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  t = t.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return t;
}

export interface ChatbotWidgetProps {
  title?: string;
  suggestions?: string[];
  placeholder?: string;
  onSend?: (msg: string) => void;
  onClose?: () => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  title = "Assistente Virtual",
  suggestions = SUGESTOES,
  placeholder = "Digite sua pergunta...",
  onSend,
  onClose,
}) => {
  const [mensagens, setMensagens] = useState([
    { autor: "bot", texto: "Olá! Sou seu assistente virtual. Como posso ajudar?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [mensagens]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function enviarMensagem(msg: string) {
    if (!msg.trim()) return;
    setMensagens((msgs) => [...msgs, { autor: "user", texto: msg }]);
    setLoading(true);
    onSend?.(msg);
    setTimeout(() => {
      setMensagens((msgs) => [...msgs, { autor: "bot", texto: respostaAutomatica(msg) }]);
      setLoading(false);
    }, 700);
  }

  function limparConversa() {
    setMensagens([{ autor: "bot", texto: "Conversa limpa! Como posso ajudar?" }]);
    toast({ title: "Conversa limpa", description: "O histórico do chat foi apagado." });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input.trim() && !loading) {
      enviarMensagem(input);
      setInput("");
    }
    if (e.key === "Escape") {
      onClose?.();
    }
    // Atalho para editar última mensagem (opcional)
    if (e.key === "ArrowUp" && mensagens.length > 1 && input === "") {
      const lastUserMsg = [...mensagens].reverse().find(m => m.autor === "user");
      if (lastUserMsg) setInput(lastUserMsg.texto);
    }
  }

  return (
    <div className="w-80 max-w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg flex flex-col border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-8">
      <div className="flex items-center gap-2 p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 rounded-t-lg relative">
        <MessageCircle className="w-5 h-5 text-primary" />
        <span className="font-semibold text-sm flex-1 truncate">{title}</span>
        {onClose && (
          <button className="absolute right-2 top-2 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700" onClick={onClose} title="Fechar">
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
        <button className="ml-2 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700" onClick={limparConversa} title="Limpar conversa">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[180px] max-h-[260px]">
        {mensagens.map((m, idx) => (
          <div key={m.autor + m.texto + idx} className={`flex ${m.autor === "user" ? "justify-end" : "justify-start"}`}>
            {m.autor === "bot" ? (
              <div
                className="px-3 py-2 rounded-lg text-sm max-w-[80%] whitespace-pre-line shadow-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(m.texto) }}
              />
            ) : (
              <div
                className="px-3 py-2 rounded-lg text-sm max-w-[80%] whitespace-pre-line shadow-sm bg-primary text-white"
              >
                {m.texto}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" /> Digitando...
            </div>
          </div>
        )}
      </div>
      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 flex gap-1">
        <input
          ref={inputRef}
          className="flex-1 rounded border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-sm bg-white dark:bg-zinc-900 focus:outline-none"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="p-2 rounded bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
          onClick={() => { if (input.trim() && !loading) { enviarMensagem(input); setInput(""); } }}
          title="Enviar mensagem"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-2 pt-0 text-xs text-muted-foreground">
        Sugestões:
        <div className="flex flex-wrap gap-1 mt-1">
          {suggestions.map((s) => (
            <button key={s} className="bg-zinc-100 dark:bg-zinc-800 rounded px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-700" onClick={() => { setInput(s); inputRef.current?.focus(); }} title={s}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
