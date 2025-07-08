import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";

const SUGESTOES = [
  "Como está o funil de vendas hoje?",
  "Quais contatos não foram respondidos?",
  "Resumo das oportunidades perdidas",
  "Qual o melhor horário para ligar para leads?",
];

function respostaAutomatica(msg: string) {
  if (msg.toLowerCase().includes("funil")) return "Seu funil tem 4 etapas ativas e 12 oportunidades em negociação.";
  if (msg.toLowerCase().includes("contato")) return "Você tem 5 contatos sem resposta há mais de 3 dias.";
  if (msg.toLowerCase().includes("perdidas")) return "Foram detectadas 3 oportunidades perdidas este mês.";
  if (msg.toLowerCase().includes("horário")) return "O melhor horário para ligar é entre 10h e 12h, segundo o histórico.";
  return "Desculpe, não entendi. Tente perguntar sobre funil, contatos ou oportunidades.";
}

export const ChatbotWidget: React.FC = () => {
  const [mensagens, setMensagens] = useState([
    { autor: "bot", texto: "Olá! Sou seu assistente virtual. Como posso ajudar?" },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [mensagens]);

  function enviarMensagem(msg: string) {
    setMensagens((msgs) => [...msgs, { autor: "user", texto: msg }]);
    setTimeout(() => {
      setMensagens((msgs) => [...msgs, { autor: "bot", texto: respostaAutomatica(msg) }]);
    }, 600);
  }

  return (
    <div className="w-80 max-w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg flex flex-col border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 rounded-t-lg">
        <MessageCircle className="w-5 h-5 text-primary" />
        <span className="font-semibold text-sm">Assistente Virtual</span>
      </div>
      <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[180px] max-h-[260px]">
        {mensagens.map((m, idx) => (
          <div key={m.autor + m.texto + idx} className={`flex ${m.autor === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${m.autor === "user" ? "bg-primary text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"}`}>
              {m.texto}
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 flex gap-1">
        <input
          className="flex-1 rounded border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-sm bg-white dark:bg-zinc-900 focus:outline-none"
          placeholder="Digite sua pergunta..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && input.trim()) { enviarMensagem(input); setInput(""); } }}
        />
        <button
          className="p-2 rounded bg-primary text-white hover:bg-primary/90"
          onClick={() => { if (input.trim()) { enviarMensagem(input); setInput(""); } }}
          title="Enviar mensagem"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <div className="p-2 pt-0 text-xs text-muted-foreground">
        Sugestões:
        <div className="flex flex-wrap gap-1 mt-1">
          {SUGESTOES.map((s) => (
            <button key={s} className="bg-zinc-100 dark:bg-zinc-800 rounded px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-700" onClick={() => { setInput(s); }} title={s}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
