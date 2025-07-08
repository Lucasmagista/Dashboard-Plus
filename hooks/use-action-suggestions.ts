import { useMemo } from "react"

export type UserAction = "add-contact" | "create-deal" | "schedule-meeting" | "send-email"

interface Suggestion {
  action: UserAction
  label: string
  reason: string
}

// Exemplo simples: analisa atividades recentes e tarefas pendentes
export function useActionSuggestions({ recentActivities, upcomingTasks }: {
  recentActivities: any[]
  upcomingTasks: any[]
}): Suggestion[] {
  return useMemo(() => {
    const suggestions: Suggestion[] = []
    // Se não há contatos recentes, sugerir adicionar contato
    if (!recentActivities.some(a => a.type === "contact")) {
      suggestions.push({ action: "add-contact", label: "Adicionar novo contato", reason: "Nenhum contato recente adicionado." })
    }
    // Se há tarefas pendentes, sugerir agendar reunião
    if (upcomingTasks.some(t => t.status === "pending")) {
      suggestions.push({ action: "schedule-meeting", label: "Agendar follow-up", reason: "Você possui tarefas pendentes." })
    }
    // Se há mensagens recentes, sugerir enviar e-mail
    if (recentActivities.some(a => a.type === "message")) {
      suggestions.push({ action: "send-email", label: "Enviar e-mail de acompanhamento", reason: "Você recebeu mensagens recentes." })
    }
    // Se há negócios ativos, sugerir criar novo negócio
    if (!recentActivities.some(a => a.type === "deal")) {
      suggestions.push({ action: "create-deal", label: "Criar novo negócio", reason: "Nenhum negócio recente criado." })
    }
    return suggestions
  }, [recentActivities, upcomingTasks])
}
