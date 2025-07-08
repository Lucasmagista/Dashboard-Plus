import React from "react";
import { BarChart3, Users, DollarSign, MessageSquare, Target, Filter, Download, Clock, GitBranch, Bell, CreditCard, Mail, Bot, Brain, MessageCircle } from "lucide-react";
import { SalesPredictionWidget } from "@/components/dashboard/sales-prediction-widget";
import { LostOpportunitiesWidget } from "@/components/dashboard/lost-opportunities-widget";
import { ChatbotWidget } from "@/components/dashboard/chatbot-widget";
import { ActivitySummaryWidget } from "@/components/dashboard/activity-summary-widget";
import { ContextualAlertsWidget } from "@/components/dashboard/contextual-alerts-widget";
import { InteractiveChartsWidget } from "@/components/dashboard/interactive-charts-widget";
import { HeatmapWidget } from "@/components/dashboard/heatmap-widget";
import { SalesFunnelWidget } from "@/components/dashboard/sales-funnel-widget";
import { CustomerTimelineWidget } from "@/components/dashboard/customer-timeline-widget";
import { DashboardBuilderWidget } from "@/components/dashboard/dashboard-builder-widget";
import { AdvancedFiltersWidget } from "@/components/dashboard/advanced-filters-widget";
import { ExportWidget } from "@/components/dashboard/export-widget";
import { ScheduledReportsWidget } from "@/components/dashboard/scheduled-reports-widget";
import { VisualWorkflowWidget } from "@/components/dashboard/visual-workflow-widget";
import { SmartNotificationsWidget } from "@/components/dashboard/smart-notifications-widget";
import { PaymentIntegrationWidget } from "@/components/dashboard/payment-integration-widget";
import { MarketingIntegrationWidget } from "@/components/dashboard/marketing-integration-widget";
import { BIIntegrationWidget } from "@/components/dashboard/bi-integration-widget";
import { CRMContactsWidget } from "@/components/dashboard/crm-contacts-widget";
import { SalesPipelineWidget } from "@/components/dashboard/sales-pipeline-widget";
import { SmartTemplatesWidget } from "@/components/dashboard/smart-templates-widget";
import { AutoResponseWidget } from "@/components/dashboard/auto-response-widget";
import { IntelligentBotWidget } from "@/components/dashboard/intelligent-bot-widget";
import { MultiChannelWorkflowWidget } from "@/components/dashboard/multi-channel-workflow-widget";
import { ResponseMetricsWidget } from "@/components/dashboard/response-metrics-widget";

export type UserProfile = "vendas" | "marketing" | "suporte" | "admin";

export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  icon: any;
  render: () => React.JSX.Element;
  profiles: UserProfile[];
}

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: "kpi-vendas",
    title: "Receita Total",
    description: "Resumo das vendas do mês",
    icon: DollarSign,
    render: () => <div className="text-2xl font-bold">R$ 45.231,89</div>,
    profiles: ["vendas", "admin"],
  },
  {
    id: "contatos-ativos",
    title: "Contatos Ativos",
    description: "Clientes em acompanhamento",
    icon: Users,
    render: () => <div className="text-2xl font-bold">2.847</div>,
    profiles: ["vendas", "marketing", "admin"],
  },
  {
    id: "mensagens",
    title: "Mensagens Recentes",
    description: "Últimas interações recebidas",
    icon: MessageSquare,
    render: () => <div className="text-2xl font-bold">+12 novas</div>,
    profiles: ["suporte", "admin"],
  },
  {
    id: "previsao-vendas-ml",
    title: "Previsão de Vendas (ML)",
    description: "Estimativa de vendas futuras baseada em Machine Learning",
    icon: DollarSign,
    render: () => <SalesPredictionWidget />,
    profiles: ["vendas", "admin"],
  },
  {
    id: "oportunidades-perdidas",
    title: "Oportunidades Perdidas",
    description: "Negócios com alta chance de perda detectados automaticamente",
    icon: Target,
    render: () => <LostOpportunitiesWidget />,
    profiles: ["vendas", "admin"],
  },
  {
    id: "negocios-ativos",
    title: "Negócios Ativos",
    description: "Negócios em andamento",
    icon: Target,
    render: () => <div className="text-2xl font-bold">234</div>,
    profiles: ["vendas", "admin"],
  },
  {
    id: "performance-marketing",
    title: "Performance Marketing",
    description: "Campanhas em destaque",
    icon: BarChart3,
    render: () => <div className="text-2xl font-bold">+20% ROI</div>,
    profiles: ["marketing", "admin"],
  },
  {
    id: "assistente-virtual-chatbot",
    title: "Assistente Virtual",
    description: "Chatbot integrado para consultas rápidas",
    icon: MessageSquare,
    render: () => <ChatbotWidget />,
    profiles: ["vendas", "marketing", "suporte", "admin"],
  },
  {
    id: "resumo-atividades-automatico",
    title: "Resumo de Atividades",
    description: "Resumos automáticos das atividades do dia",
    icon: BarChart3,
    render: () => <ActivitySummaryWidget />,
    profiles: ["vendas", "marketing", "suporte", "admin"],
  },
  {
    id: "alertas-contextuais",
    title: "Alertas Contextuais",
    description: "Alertas inteligentes baseados no contexto atual",
    icon: Target,
    render: () => <ContextualAlertsWidget />,
    profiles: ["vendas", "marketing", "suporte", "admin"],
  },
  {
    id: "graficos-interativos-drilldown",
    title: "Gráficos Interativos",
    description: "Charts dinâmicos com drill-down",
    icon: BarChart3,
    render: () => <InteractiveChartsWidget />,
    profiles: ["vendas", "marketing", "admin"],
  },
  {
    id: "mapa-calor-atividades",
    title: "Mapa de Calor",
    description: "Intensidade de atividades por horário",
    icon: Target,
    render: () => <HeatmapWidget />,
    profiles: ["vendas", "marketing", "suporte", "admin"],
  },
  {
    id: "funil-vendas-tempo-real",
    title: "Funil de Vendas",
    description: "Funil visual em tempo real com conversões",
    icon: DollarSign,
    render: () => <SalesFunnelWidget />,
    profiles: ["vendas", "admin"],
  },
  {
    id: "timeline-eventos-cliente",
    title: "Timeline do Cliente",
    description: "Cronologia de eventos e interações",
    icon: Users,
    render: () => <CustomerTimelineWidget />,
    profiles: ["vendas", "suporte", "admin"],
  },
  {
    id: "dashboard-builder-drag-drop",
    title: "Builder Dashboard",
    description: "Personalize widgets por arrastar e soltar",
    icon: Target,
    render: () => <DashboardBuilderWidget />,
    profiles: ["admin"],
  },
  {
    id: "filtros-avancados-salvamento",
    title: "Filtros Avançados",
    description: "Filtros personalizados com salvamento e reutilização",
    icon: Filter,
    render: () => <AdvancedFiltersWidget />,
    profiles: ["vendas", "marketing", "suporte", "admin"],
  },
  {
    id: "exportacao-multiplos-formatos",
    title: "Exportação de Dados",
    description: "Exporte dados em PDF, Excel, CSV e outros formatos",
    icon: Download,
    render: () => <ExportWidget />,
    profiles: ["vendas", "marketing", "admin"],
  },
  {
    id: "relatorios-agendados-automaticos",
    title: "Relatórios Agendados",
    description: "Automatize a geração e envio de relatórios",
    icon: Clock,
    render: () => <ScheduledReportsWidget />,
    profiles: ["admin"],
  },
  {
    id: "workflows-visuais-nocode",
    title: "Workflows Visuais",
    description: "Editor visual de automações sem código",
    icon: GitBranch,
    render: () => <VisualWorkflowWidget />,
    profiles: ["admin"],
  },
  {
    id: "notificacoes-inteligentes-multicanal",
    title: "Notificações Inteligentes",
    description: "Sistema multi-canal com agrupamento e priorização",
    icon: Bell,
    render: () => <SmartNotificationsWidget />,
    profiles: ["vendas", "marketing", "suporte", "admin"],
  },
  {
    id: "integracao-pagamentos",
    title: "Integrações de Pagamento",
    description: "Provedores de pagamento conectados",
    icon: CreditCard,
    render: () => <PaymentIntegrationWidget />,
    profiles: ["vendas", "admin"],
  },
  {
    id: "integracao-marketing",
    title: "Integrações de Marketing",
    description: "Plataformas de marketing conectadas",
    icon: Mail,
    render: () => <MarketingIntegrationWidget />,
    profiles: ["marketing", "admin"],
  },
  {
    id: "integracao-bi",
    title: "Integrações de BI",
    description: "Plataformas de Business Intelligence conectadas",
    icon: BarChart3,
    render: () => <BIIntegrationWidget />,
    profiles: ["admin"],
  },
  {
    id: "crm-gestao-contatos",
    title: "Gestão de Contatos",
    description: "Perfil 360° dos seus clientes e prospects",
    icon: Users,
    render: () => <CRMContactsWidget />,
    profiles: ["vendas", "marketing", "suporte", "admin"],
  },
  {
    id: "pipeline-vendas-kanban",
    title: "Pipeline de Vendas",
    description: "Kanban interativo com previsões de fechamento",
    icon: Target,
    render: () => <SalesPipelineWidget />,
    profiles: ["vendas", "admin"],
  },
  {
    id: "templates-inteligentes",
    title: "Templates Inteligentes",
    description: "Mensagens personalizadas com IA para diferentes situações",
    icon: Brain,
    render: () => <SmartTemplatesWidget />,
    profiles: ["vendas", "marketing", "suporte", "admin"],
  },
  {
    id: "respostas-automaticas",
    title: "Respostas Automáticas",
    description: "Configure respostas automáticas com NLP em múltiplos canais",
    icon: Bot,
    render: () => <AutoResponseWidget />,
    profiles: ["suporte", "marketing", "admin"],
  },
  {
    id: "bot-inteligente",
    title: "Bot Inteligente",
    description: "Assistente virtual com NLP avançado e ChatGPT",
    icon: Bot,
    render: () => <IntelligentBotWidget />,
    profiles: ["suporte", "admin"],
  },
  {
    id: "workflows-multicanal",
    title: "Workflows Multi-canal",
    description: "Automações complexas em email, WhatsApp, SMS e chat",
    icon: GitBranch,
    render: () => <MultiChannelWorkflowWidget />,
    profiles: ["marketing", "vendas", "admin"],
  },
  {
    id: "metricas-resposta",
    title: "Métricas de Resposta",
    description: "KPIs de tempo de resposta, satisfação e performance por canal",
    icon: MessageCircle,
    render: () => <ResponseMetricsWidget />,
    profiles: ["suporte", "admin"],
  },
];
