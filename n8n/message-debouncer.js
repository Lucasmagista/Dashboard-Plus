// =========================
// 🔄 SISTEMA DE DEBOUNCE DE MENSAGENS
// =========================

class MessageDebouncer {
    /**
     * Gera relatório automático (stub)
     */
    async generateReport(type = 'daily') {
        // Exemplo: gerar relatório diário/semana/mensal
        // Integre com BI, email, dashboard, etc
        return { status: 'ok', type, generatedAt: new Date().toISOString() };
    }

    /**
     * Dispara alerta para problemas recorrentes (stub)
     */
    async triggerAlertIfNeeded(context = {}) {
        // Exemplo: enviar alerta para Slack, WhatsApp, email, etc
        return { status: 'ok', context };
    }

    /**
     * ROI do atendimento automatizado (stub)
     */
    async calculateROI() {
        // Exemplo: calcule com base em métricas de vendas, tempo, etc
        return { roi: 1.0 };
    }

    /**
     * Satisfação do cliente por período (stub)
     */
    async getSatisfactionByPeriod(period = 'month') {
        // Exemplo: agregue respostas de satisfação
        return { period, satisfaction: 4.7 };
    }

    async setRetentionPolicy(days = 365) {
        // Defina política de retenção de dados
        return { days };
    }

    /**
     * Validação real de CPF
     */
    validateCPF(cpf) {
        if (!cpf) return false;
        
        // Remove caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');
        
        // Verifica se tem 11 dígitos
        if (cpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        // Validação do primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf[i]) * (10 - i);
        }
        let digit1 = 11 - (sum % 11);
        if (digit1 > 9) digit1 = 0;
        
        if (parseInt(cpf[9]) !== digit1) return false;
        
        // Validação do segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf[i]) * (11 - i);
        }
        let digit2 = 11 - (sum % 11);
        if (digit2 > 9) digit2 = 0;
        
        return parseInt(cpf[10]) === digit2;
    }

    /**
     * Validação real de CNPJ
     */
    validateCNPJ(cnpj) {
        if (!cnpj) return false;
        
        // Remove caracteres não numéricos
        cnpj = cnpj.replace(/\D/g, '');
        
        // Verifica se tem 14 dígitos
        if (cnpj.length !== 14) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cnpj)) return false;
        
        // Validação do primeiro dígito verificador
        const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cnpj[i]) * weights1[i];
        }
        let digit1 = 11 - (sum % 11);
        if (digit1 > 9) digit1 = 0;
        
        if (parseInt(cnpj[12]) !== digit1) return false;
        
        // Validação do segundo dígito verificador
        const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        sum = 0;
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cnpj[i]) * weights2[i];
        }
        let digit2 = 11 - (sum % 11);
        if (digit2 > 9) digit2 = 0;
        
        return parseInt(cnpj[13]) === digit2;
    }

    /**
     * Validação de endereço via API (stub)
     */
    async validateAddress(address) {
        // Integre com API de geolocalização, Google Maps, etc
        return { valid: true, address };
    }

    /**
     * Anti-spam e rate limiting funcional
     */
    async checkSpamOrRateLimit(chatId, actionType = 'message', maxCount = 10, windowMinutes = 5) {
        if (!this.dbManager) return { allowed: true };

        try {
            const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
            
            // Buscar ou criar registro de rate limit
            const existing = await this.dbManager.query(`
                SELECT * FROM rate_limits WHERE chat_id = $1 AND action_type = $2
            `, [chatId, actionType]);

            if (existing.rows && existing.rows.length > 0) {
                const record = existing.rows[0];
                const recordWindowStart = new Date(record.window_start);
                
                // Se ainda está na janela de tempo
                if (recordWindowStart > windowStart) {
                    if (record.count >= maxCount) {
                        // Bloquear por mais tempo se já ultrapassou
                        const blockedUntil = new Date(Date.now() + windowMinutes * 60 * 1000);
                        await this.dbManager.query(`
                            UPDATE rate_limits SET blocked_until = $1 WHERE id = $2
                        `, [blockedUntil, record.id]);
                        
                        return { 
                            allowed: false, 
                            reason: 'rate_limit_exceeded',
                            blockedUntil,
                            count: record.count,
                            maxCount 
                        };
                    } else {
                        // Incrementar contador
                        await this.dbManager.query(`
                            UPDATE rate_limits SET count = count + 1 WHERE id = $1
                        `, [record.id]);
                        return { allowed: true, count: record.count + 1, maxCount };
                    }
                } else {
                    // Resetar janela
                    await this.dbManager.query(`
                        UPDATE rate_limits SET count = 1, window_start = NOW(), blocked_until = NULL WHERE id = $1
                    `, [record.id]);
                    return { allowed: true, count: 1, maxCount };
                }
            } else {
                // Criar novo registro
                await this.dbManager.query(`
                    INSERT INTO rate_limits (chat_id, action_type, count, window_start)
                    VALUES ($1, $2, 1, NOW())
                `, [chatId, actionType]);
                return { allowed: true, count: 1, maxCount };
            }
        } catch (err) {
            console.error('❌ Erro no rate limiting:', err.message);
            return { allowed: true }; // Em caso de erro, permitir
        }
    }

    /**
     * LGPD/Privacidade: implementações funcionais
     */
    async saveConsent(chatId, consent = true) {
        if (!this.dbManager) return { chatId, consent };
        try {
            await this.dbManager.query(`
                INSERT INTO users (chat_id, consent_lgpd) VALUES ($1, $2)
                ON CONFLICT (chat_id) DO UPDATE SET consent_lgpd = $2, updated_at = NOW()
            `, [chatId, consent]);
            
            // Log da ação
            await this.dbManager.query(`
                INSERT INTO action_logs (chat_id, action_type, description, data)
                VALUES ($1, 'lgpd_consent', 'Consentimento LGPD registrado', $2)
            `, [chatId, JSON.stringify({ consent, timestamp: new Date() })]);
            
            return { chatId, consent, saved: true };
        } catch (err) {
            console.error('❌ Erro ao salvar consentimento LGPD:', err.message);
            return { chatId, consent, saved: false, error: err.message };
        }
    }

    async requestOptOut(chatId) {
        if (!this.dbManager) return { chatId, optedOut: true };
        try {
            await this.dbManager.query(`
                UPDATE users SET opt_out = TRUE, updated_at = NOW() WHERE chat_id = $1
            `, [chatId]);
            
            // Log da ação
            await this.dbManager.query(`
                INSERT INTO action_logs (chat_id, action_type, description)
                VALUES ($1, 'lgpd_opt_out', 'Usuário solicitou opt-out')
            `, [chatId]);
            
            return { chatId, optedOut: true, processed: true };
        } catch (err) {
            console.error('❌ Erro ao processar opt-out:', err.message);
            return { chatId, optedOut: false, error: err.message };
        }
    }

    async anonymizeUser(chatId) {
        if (!this.dbManager) return { chatId, anonymized: true };
        try {
            // Anonimizar dados pessoais
            await this.dbManager.query(`
                UPDATE users SET 
                    name = 'ANONIMIZADO',
                    phone = NULL,
                    email = NULL,
                    cpf_cnpj = NULL,
                    address = 'ANONIMIZADO',
                    anonymized = TRUE,
                    updated_at = NOW()
                WHERE chat_id = $1
            `, [chatId]);
            
            // Anonimizar histórico de mensagens
            await this.dbManager.query(`
                UPDATE message_history SET 
                    body = '[MENSAGEM ANONIMIZADA]',
                    meta = NULL
                WHERE chat_id = $1
            `, [chatId]);
            
            // Log da ação
            await this.dbManager.query(`
                INSERT INTO action_logs (chat_id, action_type, description)
                VALUES ($1, 'lgpd_anonymize', 'Dados do usuário anonimizados')
            `, [chatId]);
            
            return { chatId, anonymized: true, processed: true };
        } catch (err) {
            console.error('❌ Erro ao anonimizar usuário:', err.message);
            return { chatId, anonymized: false, error: err.message };
        }
    }

    /**
     * Automação de follow-up funcional
     */
    async scheduleFollowUp(chatId, type = 'post_sale', when = null, extra = {}) {
        if (!this.dbManager) return { chatId, type, when, extra, status: 'scheduled' };
        
        try {
            const scheduledAt = when ? new Date(when) : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h padrão
            
            await this.dbManager.query(`
                INSERT INTO scheduled_followups (chat_id, type, scheduled_at, extra_data)
                VALUES ($1, $2, $3, $4)
            `, [chatId, type, scheduledAt, JSON.stringify(extra)]);
            
            // Log da ação
            await this.dbManager.query(`
                INSERT INTO action_logs (chat_id, action_type, description, data)
                VALUES ($1, 'follow_up_scheduled', 'Follow-up agendado', $2)
            `, [chatId, JSON.stringify({ type, scheduledAt, extra })]);
            
            return { chatId, type, when: scheduledAt, extra, status: 'scheduled', saved: true };
        } catch (err) {
            console.error('❌ Erro ao agendar follow-up:', err.message);
            return { chatId, type, when, extra, status: 'error', error: err.message };
        }
    }

    /**
     * Pagamentos: notificação de PIX, aguardo, alerta para atendente (stub)
     */
    async handlePixNotification(chatId, pixData) {
        // Exemplo: notifique cliente e atendente, aguarde confirmação
        return { chatId, pixData, notified: true };
    }

    /**
     * RPA: integração com ERP/CRM, atualização de pedidos, sincronização, notas fiscais (stub)
     */
    async syncWithERP(data) {
        // Integre com ERP/CRM
        return { status: 'synced', data };
    }

    /**
     * API Ecosystem: webhooks, REST, marketplaces, logística (stub)
     */
    async triggerWebhook(event, payload) {
        // Envie webhook para sistemas externos
        return { event, payload, sent: true };
    }

    /**
     * Processamento avançado de mídia (stub)
     */
    async processMedia(mediaData) {
        // Integre com OCR, compressão, IA, etc
        return { processed: true, mediaData };
    }

    /**
     * Conteúdo dinâmico: catálogo, vídeos, GIFs, PDFs (stub)
     */
    async getDynamicContent(type, params = {}) {
        // Exemplo: busque catálogo, gere PDF, etc
        return { type, params, content: null };
    }

    /**
     * Escalabilidade: container, cache, CDN (stub)
     */
    async checkInfraHealth() {
        // Exemplo: monitore saúde do sistema
        return { healthy: true };
    }

    /**
     * Backup e recuperação (stub)
     */
    async backupConversations() {
        // Exemplo: backup automático
        return { backedUp: true };
    }
    async restoreConversations() {
        // Exemplo: restauração
        return { restored: true };
    }

    /**
     * Sistema de agendamento (stub)
     */
    async scheduleEvent(chatId, datetime, type = 'reminder', extra = {}) {
        // Integre com calendário, lembretes, etc
        return { chatId, datetime, type, extra, scheduled: true };
    }
    /**
     * Salva uma mensagem individual no histórico do cliente
     */
    async saveMessageHistory(chatId, message) {
        if (!this.dbManager) return;
        try {
            await this.dbManager.query(`
                INSERT INTO message_history (
                    chat_id, message_id, body, type, timestamp, has_media, meta
                ) VALUES ($1, $2, $3, $4, to_timestamp($5/1000.0), $6, $7)
            `, [
                chatId,
                message.id || null,
                message.body || '',
                message.type || 'text',
                message.timestamp || Date.now(),
                message.hasMedia || false,
                message.mediaData ? JSON.stringify(message.mediaData) : null
            ]);
        } catch (err) {
            console.error('❌ Erro ao salvar histórico de mensagem:', err.message);
        }
    }

    /**
     * Recupera o histórico de mensagens do cliente
     */
    async getMessageHistory(chatId, limit = 20) {
        if (!this.dbManager) return [];
        try {
            const res = await this.dbManager.query(`
                SELECT * FROM message_history WHERE chat_id = $1 ORDER BY timestamp DESC LIMIT $2
            `, [chatId, limit]);
            return res.rows || [];
        } catch (err) {
            console.error('❌ Erro ao buscar histórico de mensagens:', err.message);
            return [];
        }
    }

    /**
     * Salva preferências do cliente (ex: idioma, modo de atendimento, etc)
     */
    async saveUserPreference(chatId, key, value) {
        if (!this.dbManager) return;
        try {
            await this.dbManager.query(`
                INSERT INTO user_preferences (chat_id, pref_key, pref_value)
                VALUES ($1, $2, $3)
                ON CONFLICT (chat_id, pref_key) DO UPDATE SET pref_value = $3
            `, [chatId, key, value]);
        } catch (err) {
            console.error('❌ Erro ao salvar preferência do usuário:', err.message);
        }
    }

    /**
     * Recupera preferências do cliente
     */
    async getUserPreferences(chatId) {
        if (!this.dbManager) return {};
        try {
            const res = await this.dbManager.query(`
                SELECT pref_key, pref_value FROM user_preferences WHERE chat_id = $1
            `, [chatId]);
            const prefs = {};
            (res.rows || []).forEach(row => { prefs[row.pref_key] = row.pref_value; });
            return prefs;
        } catch (err) {
            console.error('❌ Erro ao buscar preferências do usuário:', err.message);
            return {};
        }
    }

    /**
     * Gatilho para integração com IA/NLP externa (ex: OpenAI, análise de sentimento, etc)
     */
    async analyzeWithAI(text, context = {}) {
        // Aqui você pode integrar com OpenAI, HuggingFace, Google, etc
        // Exemplo de stub:
        // const response = await openai.createChatCompletion({ ... })
        // return response.data;
        return {
            sentiment: 'neutral',
            aiResponse: null,
            contextUsed: context
        };
    }

    /**
     * Gatilho para análise de sentimento (stub)
     */
    analyzeSentiment(text) {
        // Exemplo simples, pode integrar com IA real
        const lower = (text || '').toLowerCase();
        if (lower.includes('obrigado') || lower.includes('ótimo') || lower.includes('excelente')) return 'positivo';
        if (lower.includes('ruim') || lower.includes('pior') || lower.includes('horrível')) return 'negativo';
        return 'neutro';
    }

    // ...existing code...
    constructor(dbManager, options = {}) {
        this.dbManager = dbManager;
        this.pendingMessages = new Map(); // chatId -> { messages: [], timer: timeoutId }
        this.config = {
            waitTime: options.waitTime || 3000, // 3 segundos padrão
            maxMessages: options.maxMessages || 5, // máximo 5 mensagens agrupadas
            maxWaitTime: options.maxWaitTime || 10000, // máximo 10 segundos total
            ...options
        };
        
        // Criar tabela para histórico de mensagens agrupadas
        this.initializeDatabase();
    }

    async initializeDatabase() {
        if (this.dbManager) {
            try {
                await this.dbManager.query(`
                    -- Tabela principal para grupos de mensagens
                    CREATE TABLE IF NOT EXISTS message_groups (
                        id SERIAL PRIMARY KEY,
                        chat_id VARCHAR(255) NOT NULL,
                        messages JSONB NOT NULL,
                        combined_text TEXT NOT NULL,
                        intent_analysis JSONB,
                        flow_destination VARCHAR(100),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        processed_at TIMESTAMP
                    );
                    
                    -- Histórico individual de mensagens
                    CREATE TABLE IF NOT EXISTS message_history (
                        id SERIAL PRIMARY KEY,
                        chat_id VARCHAR(255) NOT NULL,
                        message_id VARCHAR(255),
                        body TEXT,
                        type VARCHAR(50) DEFAULT 'text',
                        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        has_media BOOLEAN DEFAULT FALSE,
                        meta JSONB
                    );
                    
                    -- Preferências do usuário
                    CREATE TABLE IF NOT EXISTS user_preferences (
                        id SERIAL PRIMARY KEY,
                        chat_id VARCHAR(255) NOT NULL,
                        pref_key VARCHAR(100) NOT NULL,
                        pref_value TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE(chat_id, pref_key)
                    );
                    
                    -- Dados dos usuários
                    CREATE TABLE IF NOT EXISTS users (
                        id SERIAL PRIMARY KEY,
                        chat_id VARCHAR(255) UNIQUE NOT NULL,
                        name VARCHAR(255),
                        phone VARCHAR(50),
                        email VARCHAR(255),
                        cpf_cnpj VARCHAR(20),
                        address TEXT,
                        consent_lgpd BOOLEAN DEFAULT FALSE,
                        opt_out BOOLEAN DEFAULT FALSE,
                        anonymized BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    
                    -- Follow-ups agendados
                    CREATE TABLE IF NOT EXISTS scheduled_followups (
                        id SERIAL PRIMARY KEY,
                        chat_id VARCHAR(255) NOT NULL,
                        type VARCHAR(100) NOT NULL,
                        scheduled_at TIMESTAMP NOT NULL,
                        executed_at TIMESTAMP,
                        status VARCHAR(50) DEFAULT 'pending',
                        extra_data JSONB,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    
                    -- Relatórios gerados
                    CREATE TABLE IF NOT EXISTS reports (
                        id SERIAL PRIMARY KEY,
                        type VARCHAR(100) NOT NULL,
                        period_start TIMESTAMP,
                        period_end TIMESTAMP,
                        data JSONB,
                        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    
                    -- Rate limiting e anti-spam
                    CREATE TABLE IF NOT EXISTS rate_limits (
                        id SERIAL PRIMARY KEY,
                        chat_id VARCHAR(255) NOT NULL,
                        action_type VARCHAR(100) NOT NULL,
                        count INTEGER DEFAULT 1,
                        window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        blocked_until TIMESTAMP,
                        UNIQUE(chat_id, action_type)
                    );
                    
                    -- Eventos agendados (calendário)
                    CREATE TABLE IF NOT EXISTS scheduled_events (
                        id SERIAL PRIMARY KEY,
                        chat_id VARCHAR(255) NOT NULL,
                        event_type VARCHAR(100) NOT NULL,
                        scheduled_at TIMESTAMP NOT NULL,
                        executed_at TIMESTAMP,
                        status VARCHAR(50) DEFAULT 'scheduled',
                        extra_data JSONB,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    
                    -- Logs de ações importantes
                    CREATE TABLE IF NOT EXISTS action_logs (
                        id SERIAL PRIMARY KEY,
                        chat_id VARCHAR(255),
                        action_type VARCHAR(100) NOT NULL,
                        description TEXT,
                        data JSONB,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    
                    -- Índices para performance
                    CREATE INDEX IF NOT EXISTS idx_message_groups_chat_id ON message_groups(chat_id);
                    CREATE INDEX IF NOT EXISTS idx_message_groups_created_at ON message_groups(created_at);
                    CREATE INDEX IF NOT EXISTS idx_message_history_chat_id ON message_history(chat_id);
                    CREATE INDEX IF NOT EXISTS idx_message_history_timestamp ON message_history(timestamp);
                    CREATE INDEX IF NOT EXISTS idx_user_preferences_chat_id ON user_preferences(chat_id);
                    CREATE INDEX IF NOT EXISTS idx_users_chat_id ON users(chat_id);
                    CREATE INDEX IF NOT EXISTS idx_scheduled_followups_chat_id ON scheduled_followups(chat_id);
                    CREATE INDEX IF NOT EXISTS idx_scheduled_followups_scheduled_at ON scheduled_followups(scheduled_at);
                    CREATE INDEX IF NOT EXISTS idx_rate_limits_chat_id ON rate_limits(chat_id);
                    CREATE INDEX IF NOT EXISTS idx_scheduled_events_chat_id ON scheduled_events(chat_id);
                    CREATE INDEX IF NOT EXISTS idx_scheduled_events_scheduled_at ON scheduled_events(scheduled_at);
                    CREATE INDEX IF NOT EXISTS idx_action_logs_chat_id ON action_logs(chat_id);
                    CREATE INDEX IF NOT EXISTS idx_action_logs_created_at ON action_logs(created_at);
                `);
                console.log('✅ Todas as tabelas do sistema criadas/verificadas');
            } catch (error) {
                console.error('❌ Erro ao criar tabelas do sistema:', error.message);
            }
        }
    }

    /**
     * Adiciona uma mensagem ao sistema de debounce
     * @param {object} message - Mensagem do WhatsApp
     * @param {function} processCallback - Função que será chamada quando processar as mensagens agrupadas
     */
    addMessage(message, processCallback) {
        const chatId = message.from;

        // Se não existe entrada para este chat, criar
        if (!this.pendingMessages.has(chatId)) {
            this.pendingMessages.set(chatId, {
                messages: [],
                timer: null,
                startTime: Date.now(),
                processing: false, // Evita processamento paralelo
                processCallback
            });
        }

        const pending = this.pendingMessages.get(chatId);

        // Adicionar mensagem
        pending.messages.push({
            id: message.id?._serialized || message.id,
            body: message.body || '',
            type: message.type || 'text',
            timestamp: message.timestamp || Date.now(),
            hasMedia: message.hasMedia || false,
            mediaData: message.mediaData || null
        });

        // Atualiza o startTime a cada mensagem (sempre espera o tempo entre mensagens)
        pending.startTime = Date.now();

        console.log(`📥 Mensagem adicionada ao grupo (${pending.messages.length}/${this.config.maxMessages}): ${chatId}`);

        // Limpar timer anterior se existir
        if (pending.timer) {
            clearTimeout(pending.timer);
        }

        // Verificar se deve processar imediatamente
        const shouldProcessNow = this.shouldProcessImmediately(pending);

        if (shouldProcessNow) {
            this.processMessages(chatId);
        } else {
            // Configurar novo timer
            pending.timer = setTimeout(() => {
                this.processMessages(chatId);
            }, this.config.waitTime);
        }
    }

    /**
     * Verifica se deve processar as mensagens imediatamente
     */
    shouldProcessImmediately(pending) {
        // Processar se atingiu o máximo de mensagens
        if (pending.messages.length >= this.config.maxMessages) {
            return true;
        }

        // Processar se passou do tempo máximo total
        if (Date.now() - pending.startTime >= this.config.maxWaitTime) {
            return true;
        }

        // Processar se a última mensagem contém palavras-chave urgentes
        const lastMessage = pending.messages[pending.messages.length - 1];
        const urgentKeywords = [
            'urgente', 'emergência', 'agora', 'já', 'rápido', 'imediato',
            'atendente', 'humano', 'falar com alguém', 'problema grave'
        ];
        
        if (lastMessage.body && urgentKeywords.some(keyword => 
            lastMessage.body.toLowerCase().includes(keyword))) {
            console.log('🚨 Palavra-chave urgente detectada, processando imediatamente');
            return true;
        }

        return false;
    }

    /**
     * Processa as mensagens agrupadas
     */
    /**
     * Processa as mensagens agrupadas com digitação inteligente, delay e quebra de mensagens longas
     */
    async processMessages(chatId) {
        const pending = this.pendingMessages.get(chatId);
        if (!pending || pending.processing) return;

        pending.processing = true;
        if (pending.timer) clearTimeout(pending.timer);
        this.pendingMessages.delete(chatId);

        try {
            console.log(`🔄 Processando ${pending.messages.length} mensagens agrupadas para ${chatId}`);
            const combinedText = pending.messages
                .map(msg => msg.body)
                .filter(body => body && body.trim())
                .join(' ');
            const intentAnalysis = this.analyzeIntent(combinedText, pending.messages);
            await this.saveMessageGroup(chatId, pending.messages, combinedText, intentAnalysis);

            // Personalização: buscar nome do cliente se disponível
            let clientName = null;
            if (this.dbManager) {
                try {
                    const res = await this.dbManager.query('SELECT name FROM users WHERE chat_id = $1 LIMIT 1', [chatId]);
                    if (res.rows && res.rows[0] && res.rows[0].name) clientName = res.rows[0].name;
                } catch (e) {}
            }

            // Saudações baseadas no horário
            let greeting = '';
            const hour = new Date().getHours();
            if (hour < 12) greeting = 'Bom dia';
            else if (hour < 18) greeting = 'Boa tarde';
            else greeting = 'Boa noite';
            if (clientName) greeting += `, ${clientName}`;

            // Quebra de mensagens longas
            const maxLen = 1500; // WhatsApp limita ~4096, mas 1500 é seguro para UX
            const parts = [];
            let text = combinedText;
            while (text.length > maxLen) {
                let idx = text.lastIndexOf(' ', maxLen);
                if (idx < 0) idx = maxLen;
                parts.push(text.slice(0, idx));
                text = text.slice(idx).trim();
            }
            if (text) parts.push(text);

            // Função para simular digitação e delay
            const sendWithTyping = async (sendFn, msg, delayMs = 1200) => {
                if (typeof sendFn === 'function') {
                    if (globalThis.client && globalThis.client.sendTyping) {
                        await globalThis.client.sendTyping(chatId);
                    }
                    await new Promise(res => setTimeout(res, Math.max(800, Math.min(delayMs, 3000))));
                    await sendFn(msg);
                }
            };

            // Chamar callback de processamento com UX aprimorada
            if (pending.processCallback) {
                // Envia saudação personalizada antes da resposta, se for início de conversa
                if (intentAnalysis.detectedIntent === 'pedido' && clientName) {
                    await sendWithTyping(
                        async (msg) => await pending.processCallback({
                            ...msg,
                            body: `${greeting}! ${msg.body}`
                        }),
                        { ...parts[0] ? { body: parts[0] } : {} },
                        1200
                    );
                    parts.shift();
                }
                // Envia cada parte com delay e digitação
                for (let i = 0; i < parts.length; i++) {
                    await sendWithTyping(
                        async (msg) => await pending.processCallback({
                            ...msg,
                            body: msg.body
                        }),
                        { body: parts[i] },
                        1000 + Math.random() * 1200
                    );
                }
            }

            // Log detalhado
            console.log(`✅ Grupo processado | Intenção: ${intentAnalysis.detectedIntent} | Fluxo: ${intentAnalysis.suggestedFlow}`);

        } catch (error) {
            console.error('❌ Erro ao processar mensagens agrupadas:', error.message);
        } finally {
            pending.processing = false;
        }
    }

    /**
     * Analisa a intenção das mensagens combinadas
     */
    analyzeIntent(combinedText, messages) {
        const text = combinedText.toLowerCase();
        
        // Mapear palavras-chave para fluxos
        const intentMap = {
            pedido: {
                keywords: ['quero', 'gostaria', 'preciso', 'comprar', 'produto', 'catálogo', 'cardápio', 'menu'],
                flow: 'catalog_flow',
                confidence: 0
            },
            suporte: {
                keywords: ['problema', 'erro', 'não funciona', 'ajuda', 'suporte', 'dúvida', 'como'],
                flow: 'support_flow',
                confidence: 0
            },
            pagamento: {
                keywords: ['pagar', 'pagamento', 'pix', 'cartão', 'dinheiro', 'valor', 'preço'],
                flow: 'payment_flow',
                confidence: 0
            },
            entrega: {
                keywords: ['entrega', 'entregar', 'endereço', 'onde', 'local', 'casa', 'apartamento'],
                flow: 'delivery_flow',
                confidence: 0
            },
            atendente: {
                keywords: ['atendente', 'humano', 'pessoa', 'falar com alguém', 'operador'],
                flow: 'human_handoff',
                confidence: 0
            },
            cancelamento: {
                keywords: ['cancelar', 'desistir', 'não quero', 'mudar de ideia', 'esquecer'],
                flow: 'cancellation_flow',
                confidence: 0
            }
        };

        // Calcular confiança baseada na frequência das palavras-chave
        Object.keys(intentMap).forEach(intent => {
            const keywords = intentMap[intent].keywords;
            let matches = 0;
            
            keywords.forEach(keyword => {
                if (text.includes(keyword)) {
                    matches++;
                }
            });
            
            intentMap[intent].confidence = matches / keywords.length;
        });

        // Encontrar a intenção com maior confiança
        const bestIntent = Object.keys(intentMap).reduce((best, current) => {
            return intentMap[current].confidence > intentMap[best].confidence ? current : best;
        }, 'pedido');

        const result = {
            detectedIntent: bestIntent,
            confidence: intentMap[bestIntent].confidence,
            suggestedFlow: intentMap[bestIntent].flow,
            allIntents: intentMap,
            messageCount: messages.length,
            hasMedia: messages.some(msg => msg.hasMedia),
            totalLength: combinedText.length,
            analysisTimestamp: new Date().toISOString()
        };

        console.log(`🧠 Análise de intenção: ${bestIntent} (${(result.confidence * 100).toFixed(1)}%)`);
        
        return result;
    }

    /**
     * Salva o grupo de mensagens no banco de dados
     */
    async saveMessageGroup(chatId, messages, combinedText, intentAnalysis) {
        if (!this.dbManager) return;

        try {
            await this.dbManager.query(`
                INSERT INTO message_groups (
                    chat_id, messages, combined_text, intent_analysis, 
                    flow_destination, processed_at
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `, [
                chatId,
                JSON.stringify(messages),
                combinedText,
                JSON.stringify(intentAnalysis),
                intentAnalysis.suggestedFlow,
                new Date()
            ]);
        } catch (error) {
            console.error('❌ Erro ao salvar grupo de mensagens:', error.message);
        }
    }

    /**
     * Força o processamento de mensagens pendentes para um chat
     */
    async forceProcess(chatId) {
        if (this.pendingMessages.has(chatId)) {
            await this.processMessages(chatId);
        }
    }

    /**
     * Limpa mensagens pendentes antigas (limpeza de memória)
     */
    cleanup() {
        const now = Date.now();
        const maxAge = this.config.maxWaitTime * 2; // Dobro do tempo máximo

        for (const [chatId, pending] of this.pendingMessages.entries()) {
            if (now - pending.startTime > maxAge) {
                console.log(`🧹 Limpando mensagens pendentes antigas para ${chatId}`);
                if (pending.timer) {
                    clearTimeout(pending.timer);
                }
                this.pendingMessages.delete(chatId);
            }
        }
    }

    /**
     * Obtém estatísticas do debouncer
     */
    getStats() {
        return {
            pendingChats: this.pendingMessages.size,
            totalPendingMessages: Array.from(this.pendingMessages.values())
                .reduce((total, pending) => total + pending.messages.length, 0),
            config: this.config
        };
    }
}

module.exports = MessageDebouncer;
