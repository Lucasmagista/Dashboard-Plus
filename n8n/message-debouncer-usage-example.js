// =========================
// 📋 EXEMPLO DE USO DO MESSAGE DEBOUNCER AVANÇADO
// =========================

/**
 * Este arquivo mostra como usar todos os recursos implementados
 * no MessageDebouncer para criar um sistema completo de atendimento
 */

const MessageDebouncer = require('./message-debouncer');

// Simulação de um dbManager (substitua pelo seu real)
const dbManager = {
    query: async (sql, params) => {
        console.log('🔍 SQL:', sql.substring(0, 100) + '...');
        console.log('📊 Params:', params);
        return { rows: [] }; // Mock
    }
};

// Configuração do debouncer com opções avançadas
const debouncer = new MessageDebouncer(dbManager, {
    waitTime: 2000,        // 2 segundos entre mensagens
    maxMessages: 3,        // máximo 3 mensagens por grupo
    maxWaitTime: 8000     // máximo 8 segundos total
});

// =========================
// 🎯 EXEMPLO 1: PROCESSAMENTO DE MENSAGENS COM UX AVANÇADA
// =========================
async function exemploProcessamentoMensagem() {
    console.log('\n🎯 === EXEMPLO 1: PROCESSAMENTO DE MENSAGENS ===');
    
    // Simular mensagens do cliente
    const mensagem1 = {
        id: 'msg_001',
        from: '5511999887766@c.us',
        body: 'Oi, quero comprar um produto',
        type: 'text',
        timestamp: Date.now()
    };
    
    const mensagem2 = {
        id: 'msg_002', 
        from: '5511999887766@c.us',
        body: 'Vocês têm catálogo?',
        type: 'text',
        timestamp: Date.now() + 1000
    };
    
    // Callback que será chamado quando processar as mensagens
    const processCallback = async (combinedMessage) => {
        console.log('📨 Mensagem processada:', combinedMessage.body);
        console.log('🧠 Intenção detectada:', combinedMessage.intentAnalysis?.detectedIntent);
        console.log('🎯 Fluxo sugerido:', combinedMessage.flowDestination);
        
        // Aqui você integraria com seu bot principal
        // Ex: ConversationFlow.processMessage(combinedMessage, userState)
    };
    
    // Adicionar mensagens (elas serão agrupadas e processadas)
    debouncer.addMessage(mensagem1, processCallback);
    debouncer.addMessage(mensagem2, processCallback);
    
    // Aguardar processamento
    await new Promise(resolve => setTimeout(resolve, 3000));
}

// =========================
// 🎯 EXEMPLO 2: PERSONALIZAÇÃO E HISTÓRICO
// =========================
async function exemploPersonalizacao() {
    console.log('\n🎯 === EXEMPLO 2: PERSONALIZAÇÃO E HISTÓRICO ===');
    
    const chatId = '5511999887766@c.us';
    
    // Salvar preferências do cliente
    await debouncer.saveUserPreference(chatId, 'idioma', 'pt-br');
    await debouncer.saveUserPreference(chatId, 'modo_atendimento', 'formal');
    await debouncer.saveUserPreference(chatId, 'horario_preferido', 'manha');
    
    // Buscar preferências
    const prefs = await debouncer.getUserPreferences(chatId);
    console.log('⚙️ Preferências do cliente:', prefs);
    
    // Salvar mensagem no histórico
    await debouncer.saveMessageHistory(chatId, {
        id: 'msg_003',
        body: 'Mensagem de exemplo para histórico',
        type: 'text',
        timestamp: Date.now()
    });
    
    // Buscar histórico
    const historico = await debouncer.getMessageHistory(chatId, 5);
    console.log('📜 Histórico de mensagens:', historico);
}

// =========================
// 🎯 EXEMPLO 3: VALIDAÇÃO E COMPLIANCE
// =========================
async function exemploValidacao() {
    console.log('\n🎯 === EXEMPLO 3: VALIDAÇÃO E COMPLIANCE ===');
    
    const chatId = '5511999887766@c.us';
    
    // Validar CPF e CNPJ
    console.log('✅ CPF válido:', debouncer.validateCPF('11144477735'));
    console.log('❌ CPF inválido:', debouncer.validateCPF('12345678900'));
    console.log('✅ CNPJ válido:', debouncer.validateCNPJ('11222333000181'));
    
    // Rate limiting
    const rateCheck1 = await debouncer.checkSpamOrRateLimit(chatId, 'message', 3, 1);
    console.log('🚦 Rate limit check 1:', rateCheck1);
    
    const rateCheck2 = await debouncer.checkSpamOrRateLimit(chatId, 'message', 3, 1);
    console.log('🚦 Rate limit check 2:', rateCheck2);
    
    // LGPD - Consentimento
    const consent = await debouncer.saveConsent(chatId, true);
    console.log('🔒 Consentimento LGPD:', consent);
    
    // Análise de sentimento
    console.log('😊 Sentimento positivo:', debouncer.analyzeSentiment('Obrigado, excelente atendimento!'));
    console.log('😞 Sentimento negativo:', debouncer.analyzeSentiment('Produto ruim, pior compra!'));
    console.log('😐 Sentimento neutro:', debouncer.analyzeSentiment('Quando chega meu pedido?'));
}

// =========================
// 🎯 EXEMPLO 4: FOLLOW-UP E AGENDAMENTO
// =========================
async function exemploFollowUp() {
    console.log('\n🎯 === EXEMPLO 4: FOLLOW-UP E AGENDAMENTO ===');
    
    const chatId = '5511999887766@c.us';
    
    // Agendar follow-up pós-venda
    const followUp = await debouncer.scheduleFollowUp(
        chatId, 
        'post_sale', 
        new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
        { 
            tipo: 'pesquisa_satisfacao',
            produto: 'Mesa de jantar',
            valor: 299.90
        }
    );
    console.log('📅 Follow-up agendado:', followUp);
    
    // Agendar lembrete de pagamento
    const lembrete = await debouncer.scheduleFollowUp(
        chatId,
        'payment_reminder',
        new Date(Date.now() + 2 * 60 * 60 * 1000), // 2h
        {
            pedido: 'PED-001',
            valor: 150.00,
            vencimento: '2025-07-08'
        }
    );
    console.log('💳 Lembrete de pagamento:', lembrete);
}

// =========================
// 🎯 EXEMPLO 5: INTEGRAÇÃO COM SERVIÇOS EXTERNOS
// =========================
async function exemploIntegracoes() {
    console.log('\n🎯 === EXEMPLO 5: INTEGRAÇÃO COM SERVIÇOS EXTERNOS ===');
    
    const chatId = '5511999887766@c.us';
    
    // Processamento de mídia (stub)
    const mediaResult = await debouncer.processMedia({
        type: 'image',
        data: 'base64_image_data_here',
        mimetype: 'image/jpeg'
    });
    console.log('🖼️ Mídia processada:', mediaResult);
    
    // Webhook (stub)
    const webhook = await debouncer.triggerWebhook('new_order', {
        chatId,
        produto: 'Sofá 3 lugares',
        valor: 899.90
    });
    console.log('🔗 Webhook enviado:', webhook);
    
    // Análise com IA (stub)
    const aiAnalysis = await debouncer.analyzeWithAI(
        'Quero comprar um sofá confortável para minha sala',
        { chatId, historico: 'primeira_compra' }
    );
    console.log('🤖 Análise IA:', aiAnalysis);
    
    // Sincronização com ERP (stub)
    const erpSync = await debouncer.syncWithERP({
        cliente: chatId,
        acao: 'criar_pedido',
        dados: { produto: 'Sofá', quantidade: 1 }
    });
    console.log('📊 Sync ERP:', erpSync);
}

// =========================
// 🎯 EXEMPLO 6: MONITORAMENTO E RELATÓRIOS
// =========================
async function exemploMonitoramento() {
    console.log('\n🎯 === EXEMPLO 6: MONITORAMENTO E RELATÓRIOS ===');
    
    // Estatísticas do debouncer
    const stats = debouncer.getStats();
    console.log('📈 Estatísticas:', stats);
    
    // Relatório diário (stub)
    const relatorio = await debouncer.generateReport('daily');
    console.log('📋 Relatório gerado:', relatorio);
    
    // ROI do atendimento (stub)
    const roi = await debouncer.calculateROI();
    console.log('💰 ROI:', roi);
    
    // Satisfação por período (stub)
    const satisfaction = await debouncer.getSatisfactionByPeriod('week');
    console.log('😊 Satisfação:', satisfaction);
    
    // Health check da infraestrutura (stub)
    const health = await debouncer.checkInfraHealth();
    console.log('❤️ Saúde do sistema:', health);
}

// =========================
// 🚀 EXECUTAR TODOS OS EXEMPLOS
// =========================
async function executarExemplos() {
    console.log('🚀 === INICIANDO DEMONSTRAÇÃO DO MESSAGE DEBOUNCER AVANÇADO ===\n');
    
    try {
        await exemploProcessamentoMensagem();
        await exemploPersonalizacao();
        await exemploValidacao();
        await exemploFollowUp();
        await exemploIntegracoes();
        await exemploMonitoramento();
        
        console.log('\n✅ === DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO ===');
        console.log('\n📚 PRÓXIMOS PASSOS:');
        console.log('1. Integre com seu banco de dados real');
        console.log('2. Substitua os stubs por integrações reais (OpenAI, Google Maps, etc)');
        console.log('3. Configure as variáveis de ambiente necessárias');
        console.log('4. Implemente os callbacks reais no seu bot');
        console.log('5. Configure cron jobs para follow-ups automáticos');
        console.log('6. Integre com seu dashboard/painel administrativo');
        
    } catch (error) {
        console.error('❌ Erro na demonstração:', error.message);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    executarExemplos();
}

module.exports = {
    exemploProcessamentoMensagem,
    exemploPersonalizacao,
    exemploValidacao,
    exemploFollowUp,
    exemploIntegracoes,
    exemploMonitoramento
};
