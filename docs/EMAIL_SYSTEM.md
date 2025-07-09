# Sistema de E-mail Marketing - Dashboard Plus

## 📧 Visão Geral

O sistema de e-mail marketing do Dashboard Plus oferece uma solução completa para gerenciamento de campanhas de e-mail, integrado com o MailerSend para máxima confiabilidade e deliverability.

## 🚀 Funcionalidades

### ✨ Editor de E-mail Avançado
- **Editor HTML/Texto**: Suporte completo para criação de e-mails em HTML e texto simples
- **Templates Predefinidos**: Modelos profissionais para diferentes ocasiões
- **Sistema de Variáveis**: Personalização dinâmica de conteúdo
- **Anexos**: Suporte para múltiplos arquivos anexos
- **Preview em Tempo Real**: Visualização instantânea do e-mail
- **Rascunhos**: Salvamento automático de rascunhos

### 📊 Analytics e Estatísticas
- **Métricas Detalhadas**: Taxa de abertura, cliques, rejeições
- **Gráficos Interativos**: Visualização de performance ao longo do tempo
- **Insights Automáticos**: Recomendações baseadas em performance
- **Comparações Diárias**: Análise detalhada por período

### 📁 Gerenciamento de E-mails
- **Organização por Pastas**: Caixa de entrada, enviados, rascunhos, etc.
- **Sistema de Labels**: Categorização personalizada
- **Priorização**: Marcação de prioridade (alta, média, baixa)
- **Busca Avançada**: Filtros por remetente, assunto, conteúdo
- **Favoritos**: Marcação de e-mails importantes

## 🔧 Configuração do MailerSend

### 1. Criar Conta no MailerSend
1. Acesse [MailerSend](https://www.mailersend.com/)
2. Crie uma conta gratuita ou escolha um plano
3. Faça login no painel de controle

### 2. Configurar Domínio
1. Vá para **Domains** no painel
2. Clique em **Add Domain**
3. Digite seu domínio (ex: yourdomain.com)
4. Configure os registros DNS conforme instruções:
   - **SPF Record**: `v=spf1 include:mailersend.net ~all`
   - **DKIM**: Copie as chaves fornecidas
   - **DMARC**: Configure conforme recomendado

### 3. Obter API Key
1. Vá para **Settings** > **API Tokens**
2. Clique em **Create Token**
3. Escolha as permissões necessárias:
   - ✅ Email send
   - ✅ Analytics
   - ✅ Templates
4. Copie o token gerado

### 4. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```bash
MAILERSEND_API_KEY=your_api_key_here
MAILERSEND_FROM_EMAIL=noreply@yourdomain.com
MAILERSEND_FROM_NAME=Dashboard Plus
```

## 📋 Templates Predefinidos

### 1. Welcome Email
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb;">Bem-vindo(a)!</h1>
  <p>Olá {{name}},</p>
  <p>É um prazer tê-lo(a) conosco! Sua conta foi criada com sucesso.</p>
  <p>Atenciosamente,<br>Equipe Dashboard Plus</p>
</div>
```

**Variáveis disponíveis:**
- `{{name}}`: Nome do destinatário

### 2. Follow-up
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563eb;">Acompanhamento</h2>
  <p>Olá {{name}},</p>
  <p>Gostaria de fazer um acompanhamento sobre {{topic}}.</p>
  <p>Aguardo seu retorno.</p>
  <p>Atenciosamente,<br>{{sender_name}}</p>
</div>
```

**Variáveis disponíveis:**
- `{{name}}`: Nome do destinatário
- `{{topic}}`: Tópico do acompanhamento
- `{{sender_name}}`: Nome do remetente

### 3. Meeting Request
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563eb;">Convite para Reunião</h2>
  <p>Olá {{name}},</p>
  <p>Gostaria de agendar uma reunião para discutir {{meeting_topic}}.</p>
  <p><strong>Data:</strong> {{meeting_date}}<br>
     <strong>Horário:</strong> {{meeting_time}}<br>
     <strong>Local:</strong> {{meeting_location}}</p>
  <p>Por favor, confirme sua presença.</p>
  <p>Atenciosamente,<br>{{sender_name}}</p>
</div>
```

**Variáveis disponíveis:**
- `{{name}}`: Nome do destinatário
- `{{meeting_topic}}`: Tópico da reunião
- `{{meeting_date}}`: Data da reunião
- `{{meeting_time}}`: Horário da reunião
- `{{meeting_location}}`: Local da reunião
- `{{sender_name}}`: Nome do remetente

## 🔌 API Endpoints

### Enviar E-mail
```typescript
POST /api/email/send
{
  "to": ["destinatario@exemplo.com"],
  "cc": ["copia@exemplo.com"],
  "bcc": ["copia.oculta@exemplo.com"],
  "subject": "Assunto do e-mail",
  "html": "<p>Conteúdo HTML</p>",
  "text": "Conteúdo em texto",
  "templateId": "welcome",
  "variables": {
    "name": "João Silva"
  }
}
```

### Buscar Templates
```typescript
GET /api/email/templates
```

### Obter Estatísticas
```typescript
GET /api/email/stats
```

## 📈 Métricas e KPIs

### Principais Métricas
- **Taxa de Entrega**: % de e-mails entregues com sucesso
- **Taxa de Abertura**: % de e-mails abertos pelos destinatários
- **Taxa de Clique**: % de cliques em links dos e-mails
- **Taxa de Rejeição**: % de e-mails rejeitados
- **Taxa de Descadastro**: % de descadastros

### Benchmarks da Indústria
- **Taxa de Abertura**: 20-25% (boa), >25% (excelente)
- **Taxa de Clique**: 2-5% (boa), >5% (excelente)
- **Taxa de Rejeição**: <2% (boa), <1% (excelente)

## 🎨 Personalização de Design

### CSS Personalizados
O sistema suporta CSS customizado para templates:

```css
.email-container {
  font-family: 'Arial', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
}

.email-header {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 20px;
  text-align: center;
}

.email-content {
  padding: 20px;
  line-height: 1.6;
}

.email-footer {
  background-color: #f8f9fa;
  padding: 15px;
  text-align: center;
  font-size: 12px;
  color: #6b7280;
}
```

## 🔐 Boas Práticas de Segurança

### 1. Autenticação de Domínio
- Configure SPF, DKIM e DMARC
- Use domínios verificados
- Monitore reputação do IP

### 2. Conteúdo Seguro
- Evite palavras de spam
- Use links HTTPS
- Inclua link de descadastro

### 3. Lista de E-mails
- Mantenha listas limpas
- Remova e-mails inválidos
- Respeite opt-outs

## 🚨 Troubleshooting

### Problemas Comuns

#### E-mails não chegam
1. Verifique configuração DNS
2. Confirme API key válida
3. Cheque reputação do domínio

#### Taxa de abertura baixa
1. Melhore linha de assunto
2. Otimize horário de envio
3. Segmente melhor a lista

#### E-mails na spam
1. Configure autenticação
2. Melhore conteúdo
3. Aqueça o IP gradualmente

## 📞 Suporte

Para suporte técnico:
- 📧 Email: suporte@dashboardplus.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Documentação: [docs.dashboardplus.com](https://docs.dashboardplus.com)

---

**Dashboard Plus** - Sistema completo de gestão empresarial
