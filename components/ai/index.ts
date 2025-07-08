// Componente principal
export { AIIntegration } from './ai-integration';

// Componentes auxiliares
export { AIMetrics } from './ai-metrics';
export { AIAlerts } from './ai-alerts';

// Hooks
export { useAI } from '../../hooks/use-ai';

// Tipos
export type {
  ChatMessage,
  AIModel,
  ChatSettings,
  ChatSession,
  AIAnalytics,
  AIHookState
} from '../../hooks/use-ai';

// Re-exportações úteis
export * from './ai-integration';
export * from './ai-metrics';
export * from './ai-alerts';
