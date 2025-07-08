# Controle de Pausa/Retomada por Atendente no WhatsApp Web.js

## Visão Geral
Este sistema permite que atendentes humanos assumam ou finalizem o atendimento de um chat, pausando ou retomando o bot automaticamente para aquele cliente/grupo. É fundamental para operações híbridas (bot + humano) e para garantir qualidade no atendimento.

## Como Funciona
- **Assumir Chat:**
  - O atendente envia o comando `/assumir` ou `#ASSUMIR` no chat.
  - O bot registra o atendente, pausa o bot para aquele chat e responde confirmando a pausa.
- **Finalizar Chat:**
  - O atendente envia `/finalizar` ou `#FINALIZAR`.
  - O bot retoma o atendimento automático, registra a ação e solicita feedback ao cliente.
- **Mensagens em Chat Pausado:**
  - Enquanto o chat está pausado, o bot ignora todas as mensagens do cliente, exceto comandos de retomada.

## Fluxo no Código
- O listener principal de mensagens executa, em ordem:
  1. `processAttendantCommands(message)` — Trata comandos de pausa/retomada.
  2. `shouldIgnoreMessage(message)` — Ignora mensagens se o chat está pausado.
  3. Demais fluxos do bot.
- Todas as ações são logadas para auditoria.

## Comandos Disponíveis
- `/assumir` ou `#ASSUMIR`: Atendente assume o chat (pausa o bot).
- `/finalizar` ou `#FINALIZAR`: Atendente finaliza o atendimento (retoma o bot).

## Auditoria e Logs
- Todas as ações de pausa/retomada são registradas em `./logs/bot-control.log` com timestamp, chatId, atendente e motivo.

## Exemplo de Uso
1. O cliente inicia uma conversa normalmente.
2. O atendente envia `/assumir` no chat do cliente.
3. O bot responde: "✅ Você assumiu este chat. O bot foi pausado para este cliente."
4. O atendente resolve a demanda e envia `/finalizar`.
5. O bot responde: "✅ Chat finalizado. O bot foi reativado para este cliente." e solicita feedback ao cliente.

## Observações
- O sistema é robusto, previne conflitos e garante que apenas um atendente por vez assuma o chat.
- O controle é persistente e sobrevive a reinicializações do bot.
- O feedback do cliente é solicitado automaticamente ao final do atendimento humano.

---

*Documentação gerada automaticamente em 03/07/2025.*
