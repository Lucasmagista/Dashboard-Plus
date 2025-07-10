// Arquivo principal do bot
// Conexão com WhatsApp, leitura de mensagens e integração com módulos de armazenamento e relatórios serão implementados aqui.

require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { parseMensagemErroRobusto, validarErro } = require('../utils');
const { saveErrorUniversal, getErrorsUniversal } = require('./storage');
const cron = require('node-cron');
const { gerarRelatorioDiario, gerarRelatorioSemanal, gerarRelatorioMensal, filtrarErrosPorDia, filtrarErrosPorSemana, filtrarErrosPorMes, filtrarErrosPorData } = require('./report');
const { uploadBackup } = require('./backup');
const { gerarPDF, gerarExcelAvancado, enviarEmail, gerarPDFDetalhado } = require('./relatorio_avancado');
const { gerarGraficoRankingResponsaveis, gerarGraficoMotivos } = require('./estatisticas');
const path = require('path');
const fs = require('fs');
const { logPersistente } = require('./logger');
const { t, setIdioma } = require('./i18n');
const { setQRCode, setConectado, startWebPanel } = require('./web');
const { gerarMensagensRelatorio, gerarMensagensRelatorioDetalhado } = require('./utils/relatorioMensagem');
const dotenv = require('dotenv');
const ENV_PATH = path.join(__dirname, '../.env');

// Utilitário para salvar admins no .env (simples, sem reload automático)
function salvarAdminsNoEnv(novosAdmins) {
  let env = fs.readFileSync(ENV_PATH, 'utf8');
  env = env.replace(/ADMINS=.*/g, `ADMINS=${novosAdmins.join(',')}`);
  fs.writeFileSync(ENV_PATH, env);
}

// Utilitário para salvar suportes no .env (simples, sem reload automático)
function salvarSuportesNoEnv(novosSuportes) {
  let env = fs.readFileSync(ENV_PATH, 'utf8');
  if (/SUPORTES=.*/.test(env)) {
    env = env.replace(/SUPORTES=.*/g, `SUPORTES=${novosSuportes.join(',')}`);
  } else {
    env += `\nSUPORTES=${novosSuportes.join(',')}`;
  }
  fs.writeFileSync(ENV_PATH, env);
}

// Inicializa o cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
});

// Inicializa o painel web para QR code
startWebPanel(3000);

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true }); // Tamanho reduzido
  setQRCode(qr); // Envia o QR para o painel web
  console.log('Escaneie o QR Code acima para autenticar o bot no WhatsApp.');
});

client.on('ready', async () => {
  setConectado(); // Atualiza status no painel web
  logPersistente('info', t('BOT_ONLINE'));
  console.log(t('BOT_ONLINE'));
  // Notifica todos os admins por mensagem privada
  for (const admin of ADMINS) {
    try {
      const jid = admin.replace('+', '') + '@c.us';
      await client.sendMessage(jid, t('RESTARTED'));
    } catch (e) {
      logPersistente('erro', 'Falha ao notificar admin sobre reinício', { admin, erro: e.message });
    }
  }
});

// Busca variáveis do .env
// Suporta múltiplos grupos separados por vírgula
let NOME_GRUPO_ERROS = (process.env.NOME_GRUPO_ERROS || 'NOME DO GRUPO DE ERROS')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
let HORA_RELATORIO_DIARIO = process.env.HORA_RELATORIO_DIARIO || '18';
let HORA_RELATORIO_SEMANAL = process.env.HORA_RELATORIO_SEMANAL || '18';
let DIA_RELATORIO_SEMANAL = process.env.DIA_RELATORIO_SEMANAL || '5';
let HORA_RELATORIO_MENSAL = process.env.HORA_RELATORIO_MENSAL || '18';
const IDIOMA = process.env.IDIOMA || 'pt-BR';
const DEBUG = process.env.DEBUG === 'true';
let CAMINHO_ARQUIVO_ERROS = process.env.CAMINHO_ARQUIVO_ERROS || './data/erros.json';
const ADMINS = (process.env.ADMINS || '').split(',').map(s => s.trim()).filter(Boolean);
const SUPORTES = (process.env.SUPORTES || '').split(',').map(s => s.trim()).filter(Boolean);

// Suporta múltiplos grupos monitorados
let idGruposErros = [];

function isAdmin(msg) {
  // msg.author para grupos, msg.from para privado
  const sender = msg.author || msg.from;
  if (!sender) return false;
  // WhatsApp formata como 55NUMERO@c.us
  return ADMINS.some(admin => sender.includes(admin.replace('+', '')));
}

function isSuporte(msg) {
  const sender = msg.author || msg.from;
  if (!sender) return false;
  return SUPORTES.some(sup => sender.includes(sup.replace('+', '')));
}

client.on('message', async (msg) => {
  // Descobre os IDs dos grupos de erros monitorados
  if (msg.from.endsWith('@g.us')) {
    const chat = await msg.getChat();
    if (chat.isGroup && NOME_GRUPO_ERROS.includes(chat.name)) {
      if (!idGruposErros.includes(chat.id._serialized)) {
        idGruposErros.push(chat.id._serialized);
        console.log('Monitorando grupo:', chat.name);
      }
    }
  }

  // Comandos de admin (grupo ou privado)
  if (msg.body.startsWith('/')) {
    const admin = isAdmin(msg);
    const suporte = isSuporte(msg);
    if (!admin && !suporte) {
      // Ignora comandos de não-admins e não-suportes
      return;
    }
    // Sempre responde comandos no privado do admin/suporte
    const userJid = (msg.author || msg.from).replace('+', '').replace(/[^0-9]/g, '') + '@c.us';
    let resposta = '';
    let erros = [];
    let tipo = '';
    let dataRef = '';
    // Lista de comandos permitidos para suporte
    const comandosSuporte = [
      '/relatorio hoje', '/relatorio semanal', '/relatorio mensal', '/relatorio ', '/relatorio pendentes', '/relatorio por', '/grafico semanal', '/status', '/ajuda', '/help', '/template relatorio'
    ];
    // Se for suporte, só permite comandos de relatório, status, ajuda e template
    if (suporte && !admin) {
      const permitido = comandosSuporte.some(cmd => msg.body.startsWith(cmd) || new RegExp(cmd).test(msg.body));
      if (!permitido) {
        resposta = '🔒 *Acesso restrito!*\nVocê só pode usar comandos de relatórios, gráficos, status e ajuda.';
        await client.sendMessage(userJid, resposta);
        return;
      }
    }
    if (msg.body.startsWith('/relatorio hoje') || msg.body.startsWith('/report today')) {
      const hoje = new Date().toISOString();
      erros = filtrarErrosPorDia(hoje);
      tipo = 'diário';
      dataRef = hoje;
      logPersistente('comando', t('REPORT_SENT'), { numero: msg.author || msg.from });
    } else if (msg.body.startsWith('/relatorio semanal') || msg.body.startsWith('/report weekly')) {
      const hoje = new Date().toISOString();
      erros = filtrarErrosPorSemana(hoje);
      tipo = 'semanal';
      dataRef = hoje;
      logPersistente('comando', 'Relatório semanal enviado', { numero: msg.author || msg.from });
    } else if (msg.body.startsWith('/relatorio mensal') || msg.body.startsWith('/report monthly')) {
      const hoje = new Date().toISOString();
      erros = filtrarErrosPorMes(hoje);
      tipo = 'mensal';
      dataRef = hoje;
      logPersistente('comando', 'Relatório mensal enviado', { numero: msg.author || msg.from });
    } else if (/^\/relatorio \d{2}\/\d{2}\/\d{4}/.test(msg.body)) {
      const data = msg.body.split(' ')[1];
      erros = filtrarErrosPorDia(data);
      tipo = 'diário';
      dataRef = data;
      logPersistente('comando', `Relatório do dia ${data} enviado`, { numero: msg.author || msg.from });
    } else if (msg.body.startsWith('/ajuda') || msg.body.startsWith('/help')) {
      if (admin) {
        resposta = [
          '🤖 *Comandos disponíveis (Admin)*',
          '──────────────────────────────',
          '📊 *Relatórios*',
          '• /relatorio hoje — Relatório do dia (PDF + tabelas)',
          '• /relatorio semanal — Relatório da semana',
          '• /relatorio mensal — Relatório do mês',
          '• /relatorio DD/MM/AAAA — Relatório de um dia específico',
          '• /relatorio pendentes — Apenas erros pendentes',
          '• /relatorio por [responsavel|conta|sku|motivo] valor — Relatório filtrado',
          '• /grafico semanal — Gráfico semanal de erros',
          '',
          '🛠️ *Administração*',
          '• /backup agora — Backup manual dos dados',
          '• /admins — Lista os administradores',
          '• /addadmin <numero> — Adiciona um novo admin',
          '• /removeradmin <numero> — Remove um admin',
          '• /config — Mostra as configurações do bot',
          '• /limpar erros — Limpa todos os erros registrados',
          '• /recuperar rejeitadas — Processa mensagens rejeitadas',
          '• /template relatorio — Mostra/edita o template do relatório',
          '',
          '⚙️ *Outros*',
          '• /status — Mostra status do bot',
          '• /idioma <pt-BR|en-US> — Altera o idioma do bot',
          '• /ajuda — Mostra esta lista de comandos',
          '──────────────────────────────',
          '*Relatórios*: PDF detalhado e tabelas agrupadas por conta/marketplace, com custos separados por tipo (Desconto, Reembolso, Devolução, Envio, Tampo, etc).',
          '_Apenas administradores cadastrados podem usar todos os comandos._',
        ].join('\n');
      } else if (suporte) {
        resposta = [
          '🤖 *Comandos disponíveis (Suporte)*',
          '──────────────────────────────',
          '📊 *Relatórios*',
          '• /relatorio hoje — Relatório do dia (PDF + tabelas)',
          '• /relatorio semanal — Relatório da semana',
          '• /relatorio mensal — Relatório do mês',
          '• /relatorio DD/MM/AAAA — Relatório de um dia específico',
          '• /relatorio pendentes — Apenas erros pendentes',
          '• /relatorio por [responsavel|conta|sku|motivo] valor — Relatório filtrado',
          '• /grafico semanal — Gráfico semanal de erros',
          '',
          '• /status — Mostra status do bot',
          '• /template relatorio — Visualiza o template do relatório',
          '• /ajuda — Mostra esta lista de comandos',
          '──────────────────────────────',
          '*Relatórios*: PDF detalhado e tabelas agrupadas por conta/marketplace, com custos separados por tipo.',
          '_Comandos administrativos são restritos aos administradores._',
        ].join('\n');
      }
      logPersistente('comando', 'Comando /ajuda executado', { numero: msg.author || msg.from });
    } else if (msg.body.startsWith('/status')) {
      // Status WhatsApp
      const statusWhatsapp = client.info && client.info.wid ? '🟢 Online' : '🔴 Offline';
      const agora = new Date();
      const errosHoje = filtrarErrosPorDia(agora.toISOString()).length;
      const errosSemana = filtrarErrosPorSemana(agora.toISOString()).length;
      const errosMes = filtrarErrosPorMes(agora.toISOString()).length;
      const caminhoErros = process.env.CAMINHO_ARQUIVO_ERROS || './data/erros.json';
      const painelWeb = 'http://localhost:3000';
      let versao = '1.0.0';
      try { versao = require('../package.json').version; } catch {}
      resposta = [
        '🤖 *Status do Bot*',
        '━━━━━━━━━━━━━━━━━━━━━━━',
        `• WhatsApp: ${statusWhatsapp}`,
        `• Data/hora servidor: ${agora.toLocaleString('pt-BR')}`,
        `• Erros registrados hoje: *${errosHoje}*`,
        `• Erros na semana: *${errosSemana}*`,
        `• Erros no mês: *${errosMes}*`,
        `• Caminho dos erros: ${caminhoErros}`,
        `• Painel web: ${painelWeb}`,
        `• Versão do bot: ${versao}`,
        '━━━━━━━━━━━━━━━━━━━━━━━'
      ].join('\n');
      logPersistente('comando', 'Comando /status executado', { numero: msg.author || msg.from });
    } else if (msg.body.startsWith('/idioma ')) {
      const novo = msg.body.split(' ')[1];
      setIdioma(novo);
      resposta = `🌐 Idioma alterado para: *${novo}*`;
    } else if (msg.body.startsWith('/relatorio pendentes')) {
      const pendentes = getErrorsUniversal().filter(e => !e.resolvido);
      if (!pendentes.length) resposta = '✅ *Nenhum erro pendente!*\nTudo resolvido por aqui. 🎉';
      else {
        const { gerarMensagensRelatorioDetalhado } = require('./utils/relatorioMensagem');
        resposta = [
          '🔔 *Relatório de Erros Pendentes*',
          '──────────────────────────────',
          'Erros ainda não resolvidos:',
          gerarMensagensRelatorioDetalhado(pendentes, '', '').join('\n\n'),
          '──────────────────────────────',
          'Para marcar um erro como resolvido, utilize o comando correspondente. ✅',
        ].join('\n');
      }
    } else if (/^\/relatorio por (responsavel|conta|sku|motivo) (.+)/i.test(msg.body)) {
      const [, tipo, valor] = msg.body.match(/^\/relatorio por (responsavel|conta|sku|motivo) (.+)/i) || [];
      const filtrados = getErrorsUniversal().filter(e => (e[tipo]||'').toLowerCase().includes(valor.toLowerCase()));
      if (!filtrados.length) resposta = `❌ *Nenhum erro encontrado* para ${tipo}: _${valor}_`;
      else {
        const { gerarMensagensRelatorioDetalhado } = require('./utils/relatorioMensagem');
        resposta = [
          `📋 *Relatório por ${tipo}:* _${valor}_`,
          '──────────────────────────────',
          gerarMensagensRelatorioDetalhado(filtrados, '', '').join('\n\n'),
          '──────────────────────────────',
          'Use outros filtros para refinar sua busca. 🔎',
        ].join('\n');
      }
    } else if (msg.body.startsWith('/grafico semanal')) {
      const erros = filtrarErrosPorSemana(new Date().toISOString());
      const filePath = path.join(__dirname, `../relatorios/grafico_semanal_${Date.now()}.png`);
      await gerarGraficoRankingResponsaveis(erros, filePath);
      await client.sendMessage(userJid, fs.createReadStream(filePath), { sendMediaAsDocument: true, caption: '📊 Gráfico semanal de erros por responsável.' });
      resposta = '✅ *Gráfico semanal enviado!* Confira o anexo.';
    } else if (msg.body.startsWith('/backup agora')) {
      const filePath = CAMINHO_ARQUIVO_ERROS;
      const fileName = `backup_erros_${new Date().toISOString().slice(0,10)}.json`;
      await uploadBackup(filePath, fileName);
      resposta = '☁️ *Backup manual enviado para o Google Drive!*';
    } else if (msg.body.startsWith('/admins')) {
      resposta = [
        '👑 *Admins cadastrados:*',
        '──────────────────────────────',
        ADMINS.length ? ADMINS.map(a => `• +${a}`).join('\n') : 'Nenhum admin cadastrado.',
        '──────────────────────────────',
        'Use /addadmin <numero> ou /removeradmin <numero> para gerenciar.'
      ].join('\n');
    } else if (/^\/addadmin (\d+)/.test(msg.body)) {
      const novoAdmin = msg.body.match(/^\/addadmin (\d+)/)[1];
      if (ADMINS.includes(novoAdmin)) resposta = '⚠️ *Admin já cadastrado!*';
      else {
        ADMINS.push(novoAdmin);
        salvarAdminsNoEnv(ADMINS);
        recarregarAdminsSuportes();
        resposta = `✅ *Admin +${novoAdmin} adicionado!*`;
      }
    } else if (/^\/removeradmin (\d+)/.test(msg.body)) {
      const removeAdmin = msg.body.match(/^\/removeradmin (\d+)/)[1];
      if (!ADMINS.includes(removeAdmin)) resposta = '❌ *Admin não encontrado!*';
      else {
        const idx = ADMINS.indexOf(removeAdmin);
        ADMINS.splice(idx, 1);
        salvarAdminsNoEnv(ADMINS);
        recarregarAdminsSuportes();
        resposta = `✅ *Admin +${removeAdmin} removido!*`;
      }
    } else if (msg.body.startsWith('/config')) {
      resposta = [
        '⚙️ *Configurações do Bot*',
        '──────────────────────────────',
        `• Grupo monitorado: *${NOME_GRUPO_ERROS}*`,
        `• Relatório diário: *${HORA_RELATORIO_DIARIO}h*`,
        `• Relatório semanal: *${HORA_RELATORIO_SEMANAL}h* (dia *${DIA_RELATORIO_SEMANAL}*)`,
        `• Relatório mensal: *${HORA_RELATORIO_MENSAL}h*`,
        `• Idioma: *${IDIOMA}*`,
        `• Caminho dos erros: *${CAMINHO_ARQUIVO_ERROS}*`,
        '──────────────────────────────',
        'Edite o .env para alterar configurações avançadas.'
      ].join('\n');
    } else if (msg.body.startsWith('/limpar erros')) {
      resposta = [
        '⚠️ *Atenção!*',
        'Você está prestes a apagar *TODOS* os erros registrados.',
        'Se tem certeza, envie: /confirmar limpar erros',
        '──────────────────────────────',
        'Esta ação é irreversível!'
      ].join('\n');
    } else if (msg.body.startsWith('/confirmar limpar erros')) {
      fs.writeFileSync(CAMINHO_ARQUIVO_ERROS, '[]');
      // Se houver cache de erros em memória, recarregue aqui (exemplo):
      if (typeof global.getErrorsUniversal === 'function') {
        global.getErrorsUniversal(true); // true = forçar reload, se implementado
      }
      resposta = '🗑️ *Todos os erros foram apagados com sucesso!*';
    } else if (msg.body.startsWith('/recuperar rejeitadas')) {
      try {
        const { processarMensagensRejeitadas, salvarErrosRecuperados } = require('../utils');
        resposta = '🔄 *Processando mensagens rejeitadas...*\nAguarde alguns instantes.';
        await client.sendMessage(userJid, resposta);
        
        const errosRecuperados = processarMensagensRejeitadas();
        
        if (errosRecuperados.length > 0) {
          // Agrupa por responsável para o resumo
          const porResponsavel = errosRecuperados.reduce((acc, erro) => {
            const resp = erro.responsavel || 'Não identificado';
            if (!acc[resp]) acc[resp] = 0;
            acc[resp]++;
            return acc;
          }, {});
          
          salvarErrosRecuperados(errosRecuperados);
          
          const resumo = Object.entries(porResponsavel)
            .map(([resp, count]) => `• ${resp}: ${count} erro(s)`)
            .join('\n');
          
          resposta = [
            '✅ *Recuperação concluída!*',
            '──────────────────────────────',
            `📈 Total: *${errosRecuperados.length}* erro(s) recuperado(s)`,
            '',
            '📊 *Resumo por responsável:*',
            resumo,
            '──────────────────────────────',
            '💾 Erros salvos no arquivo principal.',
            '📦 Backup do log de rejeitadas criado.'
          ].join('\n');
        } else {
          resposta = 'ℹ️ *Nenhuma mensagem válida encontrada* no log de rejeitadas.';
        }
      } catch (error) {
        console.error('Erro ao recuperar rejeitadas:', error);
        resposta = '❌ *Erro ao processar mensagens rejeitadas.*\nVerifique os logs do sistema.';
      }
    } else if (/^\/template relatorio editar[\s\S]+/i.test(msg.body)) {
      const novoTemplate = msg.body.replace(/^\/template relatorio editar\s*/i, '');
      const resultado = editarTemplateRelatorio(novoTemplate);
      recarregarTemplateRelatorio();
      resposta = resultado.msg;
    } else if (msg.body.startsWith('/template relatorio')) {
      recarregarTemplateRelatorio();
      const template = TEMPLATE_RELATORIO;
      resposta = [
        '📄 *Template atual do relatório:*',
        '──────────────────────────────',
        '```env',
        template,
        '```',
        '──────────────────────────────',
        'Para editar, envie:',
        '*/template relatorio editar <novo conteúdo>*',
        'Exemplo de variáveis: ${DATA}, ${RESPONSAVEL}, ${ERROS}, ...',
      ].join('\n');
    } else if (msg.body.startsWith('/ajuda') || msg.body.startsWith('/help')) {
      if (admin) {
        resposta = [
          '🤖 *Comandos disponíveis (Admin)*',
          '──────────────────────────────',
          '📊 *Relatórios*',
          '• /relatorio hoje — Relatório do dia (PDF + tabelas)',
          '• /relatorio semanal — Relatório da semana',
          '• /relatorio mensal — Relatório do mês',
          '• /relatorio DD/MM/AAAA — Relatório de um dia específico',
          '• /relatorio pendentes — Apenas erros pendentes',
          '• /relatorio por [responsavel|conta|sku|motivo] valor — Relatório filtrado',
          '• /grafico semanal — Gráfico semanal de erros',
          '',
          '🛠️ *Administração*',
          '• /backup agora — Backup manual dos dados',
          '• /admins — Lista os administradores',
          '• /addadmin <numero> — Adiciona um novo admin',
          '• /removeradmin <numero> — Remove um admin',
          '• /config — Mostra as configurações do bot',
          '• /limpar erros — Limpa todos os erros registrados',
          '• /recuperar rejeitadas — Processa mensagens rejeitadas',
          '• /template relatorio — Mostra/edita o template do relatório',
          '',
          '⚙️ *Outros*',
          '• /status — Mostra status do bot',
          '• /idioma <pt-BR|en-US> — Altera o idioma do bot',
          '• /ajuda — Mostra esta lista de comandos',
          '──────────────────────────────',
          '*Relatórios*: PDF detalhado e tabelas agrupadas por conta/marketplace, com custos separados por tipo (Desconto, Reembolso, Devolução, Envio, Tampo, etc).',
          '_Apenas administradores cadastrados podem usar todos os comandos._',
        ].join('\n');
      } else if (suporte) {
        resposta = [
          '🤖 *Comandos disponíveis (Suporte)*',
          '──────────────────────────────',
          '📊 *Relatórios*',
          '• /relatorio hoje — Relatório do dia (PDF + tabelas)',
          '• /relatorio semanal — Relatório da semana',
          '• /relatorio mensal — Relatório do mês',
          '• /relatorio DD/MM/AAAA — Relatório de um dia específico',
          '• /relatorio pendentes — Apenas erros pendentes',
          '• /relatorio por [responsavel|conta|sku|motivo] valor — Relatório filtrado',
          '• /grafico semanal — Gráfico semanal de erros',
          '',
          '• /status — Mostra status do bot',
          '• /template relatorio — Visualiza o template do relatório',
          '• /ajuda — Mostra esta lista de comandos',
          '──────────────────────────────',
          '*Relatórios*: PDF detalhado e tabelas agrupadas por conta/marketplace, com custos separados por tipo.',
          '_Comandos administrativos são restritos aos administradores._',
        ].join('\n');
      }
      logPersistente('comando', 'Comando /ajuda executado', { numero: msg.author || msg.from });
    } else if (msg.body.startsWith('/status')) {
      const statusWhatsapp = client.info && client.info.wid ? '🟢 Online' : '🔴 Offline';
      const agora = new Date();
      const errosHoje = filtrarErrosPorDia(agora.toISOString()).length;
      const errosSemana = filtrarErrosPorSemana(agora.toISOString()).length;
      const errosMes = filtrarErrosPorMes(agora.toISOString()).length;
      const caminhoErros = process.env.CAMINHO_ARQUIVO_ERROS || './data/erros.json';
      const painelWeb = 'http://localhost:3000';
      let versao = '1.0.0';
      try { versao = require('../package.json').version; } catch {}
      resposta = [
        '🤖 *Status do Bot*',
        '──────────────────────────────',
        `• WhatsApp: ${statusWhatsapp}`,
        `• Data/hora servidor: *${agora.toLocaleString('pt-BR')}*`,
        `• Erros registrados hoje: *${errosHoje}*`,
        `• Erros na semana: *${errosSemana}*`,
        `• Erros no mês: *${errosMes}*`,
        `• Caminho dos erros: *${caminhoErros}*`,
        `• Painel web: ${painelWeb}`,
        `• Versão do bot: *${versao}*`,
        '──────────────────────────────',
      ].join('\n');
      logPersistente('comando', 'Comando /status executado', { numero: msg.author || msg.from });
    } else if (/^\/set ([A-Z0-9_]+) (.+)/i.test(msg.body)) {
      const [, variavel, valor] = msg.body.match(/^\/set ([A-Z0-9_]+) (.+)/i) || [];
      // Lista de variáveis permitidas para alteração dinâmica
      const permitidas = [
        'NOME_GRUPO_ERROS', 'HORA_RELATORIO_DIARIO', 'HORA_RELATORIO_SEMANAL', 'DIA_RELATORIO_SEMANAL',
        'HORA_RELATORIO_MENSAL', 'DIA_RELATORIO_MENSAL', 'IDIOMA', 'TIMEZONE', 'FORMATO_DATAHORA',
        'PREFIXO_RELATORIO', 'DEBUG', 'LOG_LEVEL', 'CAMINHO_ARQUIVO_ERROS', 'CAMINHO_ARQUIVO_LOG',
        'EMAIL_DESTINATARIO', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_HOST'
      ];
      if (!permitidas.includes(variavel)) {
        resposta = `❌ Variável não permitida para alteração dinâmica: *${variavel}*`;
      } else {
        setEnvVar(variavel, valor);
        recarregarAdminsSuportes();
        recarregarTemplateRelatorio();
        dotenv.config({ path: ENV_PATH });
        resposta = `✅ *${variavel}* atualizado para: _${valor}_ (hot reload aplicado)`;
      }
    }
    // NOVO FLUXO DE ENVIO DE RELATÓRIO AGRUPADO DETALHADO
    if (erros && erros.length && tipo) {
      const { format, parseISO } = require('date-fns');
      const { TITULO_RELATORIO, TEXTO_INTRO } = require('./report');
      const titulo = `${TITULO_RELATORIO || 'Relatório de Erros'} (${tipo} - ${format(parseISO(dataRef), 'dd/MM/yyyy')})`;
      const intro = TEXTO_INTRO || 'Segue abaixo o resumo dos erros registrados no período.';
      // Gera PDF detalhado
      const filePath = path.join(__dirname, `../relatorios/relatorio_${tipo}_${format(parseISO(dataRef), 'yyyyMMdd_HHmmss')}.pdf`);
      // Garante que a pasta existe
      const pastaRelatorios = path.dirname(filePath);
      if (!fs.existsSync(pastaRelatorios)) fs.mkdirSync(pastaRelatorios, { recursive: true });
      // Gera o PDF e aguarda o término da escrita antes de enviar
      await new Promise((resolve, reject) => {
        gerarPDFDetalhado(erros, filePath, titulo, intro);
        // Aguarda o arquivo ser realmente escrito
        const check = setInterval(() => {
          fs.access(filePath, fs.constants.F_OK, (err) => {
            if (!err) {
              clearInterval(check);
              resolve();
            }
          });
        }, 100);
        // Timeout de segurança
        setTimeout(() => {
          clearInterval(check);
          reject(new Error('Timeout ao gerar PDF'));
        }, 5000);
      });
      // Envia PDF como anexo
      await client.sendMessage(userJid, fs.createReadStream(filePath), { sendMediaAsDocument: true, caption: 'Relatório detalhado em PDF.' });

      // Gera imagem da tabela e envia
      try {
        const { gerarImagemTabelaErros } = require('./utils/relatorioImagem');
        const imgPath = path.join(__dirname, `../relatorios/tabela_${tipo}_${format(parseISO(dataRef), 'yyyyMMdd_HHmmss')}.png`);
        await gerarImagemTabelaErros(erros, titulo, intro, imgPath);
        await client.sendMessage(userJid, fs.createReadStream(imgPath), { sendMediaAsDocument: true, caption: 'Tabela detalhada dos erros.' });
      } catch (err) {
        console.error('Erro ao gerar/enviar imagem da tabela:', err);
      }

      // Gera e envia o .txt das mensagens detalhadas
      try {
        const { gerarTxtRelatorio } = require('./utils/relatorioTxt');
        const txtPath = path.join(__dirname, `../relatorios/relatorio_${tipo}_${format(parseISO(dataRef), 'yyyyMMdd_HHmmss')}.txt`);
        await gerarTxtRelatorio(erros, titulo, intro, txtPath);
        await client.sendMessage(userJid, fs.createReadStream(txtPath), { sendMediaAsDocument: true, caption: 'Relatório detalhado em texto (.txt).' });
      } catch (err) {
        console.error('Erro ao gerar/enviar txt do relatório:', err);
      }

      return;
    }
    if (resposta) {
      await client.sendMessage(userJid, resposta);
    }
    return;
  }

  // Só registra erros dos grupos monitorados
  if (idGruposErros.includes(msg.from)) {
    const erro = parseMensagemErroRobusto(msg.body, true);
    if (validarErro(erro)) {
      saveErrorUniversal({ ...erro, data: new Date().toISOString() });
      logPersistente('erro_registrado', 'Erro registrado', { erro, numero: msg.author || msg.from });
      console.log('Erro registrado:', erro);
    } else {
      logPersistente('mensagem_ignorada', 'Mensagem ignorada (não é erro válido)', { texto: msg.body, numero: msg.author || msg.from });
      // Ignora mensagens que não são erros válidos
    }
  }
});

// Função para enviar mensagem em todos os grupos de erros monitorados
async function enviarNoGrupo(texto) {
  for (const idGrupo of idGruposErros) {
    await client.sendMessage(idGrupo, texto);
  }
}

// Função para editar o template do relatório com validação básica
function editarTemplateRelatorio(novoTemplate) {
  // Validação simples: impedir template vazio e limitar tamanho
  if (!novoTemplate || novoTemplate.trim().length < 10) {
    return { ok: false, msg: '❌ O template não pode ser vazio ou muito curto.' };
  }
  if (novoTemplate.length > 5000) {
    return { ok: false, msg: '❌ O template é muito grande. Limite: 5000 caracteres.' };
  }
  // (Opcional) Validar presença de pelo menos uma variável obrigatória
  if (!/\$\{ERROS\}/.test(novoTemplate)) {
    return { ok: false, msg: '❌ O template deve conter a variável ${ERROS} para listar os erros.' };
  }
  try {
    fs.writeFileSync(path.join(__dirname, '../relatorio_template.env'), novoTemplate);
    return { ok: true, msg: '📝 *Template do relatório atualizado com sucesso!*' };
  } catch (e) {
    return { ok: false, msg: '❌ Erro ao salvar o template: ' + e.message };
  }
}

// Função para recarregar ADMINS e SUPORTES do .env em tempo real, sem reiniciar o bot
function recarregarAdminsSuportes() {
  dotenv.config({ path: ENV_PATH });
  // Atualiza arrays globais
  ADMINS.length = 0;
  SUPORTES.length = 0;
  (process.env.ADMINS || '').split(',').map(s => s.trim()).filter(Boolean).forEach(a => ADMINS.push(a));
  (process.env.SUPORTES || '').split(',').map(s => s.trim()).filter(Boolean).forEach(s => SUPORTES.push(s));
}

// Função para recarregar template do relatório em memória (se necessário em outros módulos)
let TEMPLATE_RELATORIO = '';
function recarregarTemplateRelatorio() {
  try {
    TEMPLATE_RELATORIO = fs.readFileSync(path.join(__dirname, '../relatorio_template.env'), 'utf8');
  } catch {
    TEMPLATE_RELATORIO = '';
  }
}
recarregarTemplateRelatorio();

function recarregarErros() {
  try {
    delete require.cache[require.resolve('../data/erros.json')];
  } catch {}
}
function recarregarTemplate() {
  try {
    delete require.cache[require.resolve('../relatorio_template.env')];
  } catch {}
}

// Agendamento dos relatórios
cron.schedule(`0 ${HORA_RELATORIO_DIARIO} * * *`, async () => { // Diário
  const hoje = new Date().toISOString();
  const erros = filtrarErrosPorDia(hoje);
  const filePath = `./relatorios/relatorio_DIARIO_${hoje.slice(0,10)}.xlsx`;
  if (!fs.existsSync('./relatorios')) fs.mkdirSync('./relatorios');
  await gerarExcelAvancado(erros, filePath);
  await enviarNoGrupo('Relatório diário gerado. Segue anexo:', { files: [filePath] });
  console.log('Relatório diário enviado!');
});

cron.schedule(`0 ${HORA_RELATORIO_SEMANAL} * * ${DIA_RELATORIO_SEMANAL}`, async () => { // Semanal
  const hoje = new Date().toISOString();
  const erros = filtrarErrosPorSemana(hoje);
  const filePath = `./relatorios/relatorio_SEMANAL_${hoje.slice(0,10)}.xlsx`;
  if (!fs.existsSync('./relatorios')) fs.mkdirSync('./relatorios');
  await gerarExcelAvancado(erros, filePath);
  await enviarNoGrupo('Relatório semanal gerado. Segue anexo:', { files: [filePath] });
  console.log('Relatório semanal enviado!');
});

cron.schedule(`0 ${HORA_RELATORIO_MENSAL} 28-31 * *`, async () => { // Mensal
  const hoje = new Date();
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
  if (hoje.getDate() === ultimoDia) {
    const dataISO = hoje.toISOString();
    const erros = filtrarErrosPorMes(dataISO);
    const filePath = `./relatorios/relatorio_MENSAL_${dataISO.slice(0,10)}.xlsx`;
    if (!fs.existsSync('./relatorios')) fs.mkdirSync('./relatorios');
    await gerarExcelAvancado(erros, filePath);
    await enviarNoGrupo('Relatório mensal gerado. Segue anexo:', { files: [filePath] });
    console.log('Relatório mensal enviado!');
  }
});

// Agendamento de backup automático diário às 23h
cron.schedule('0 23 * * *', async () => {
  try {
    const useSqlite = process.env.USE_SQLITE === 'true';
    const filePath = useSqlite ? path.join(__dirname, '../data/erros.db') : CAMINHO_ARQUIVO_ERROS;
    const fileName = useSqlite ? `erros_${new Date().toISOString().slice(0,10)}.db` : `erros_${new Date().toISOString().slice(0,10)}.json`;
    await uploadBackup(filePath, fileName);
    console.log('Backup automático enviado para o Google Drive:', fileName);
  } catch (err) {
    console.error('Erro ao fazer backup automático:', err);
  }
});

// Exemplo de uso no agendamento do relatório diário (PDF e Excel)
cron.schedule(`5 ${HORA_RELATORIO_DIARIO} * * *`, async () => { // 5 minutos após o texto
  try {
    const erros = getErrorsUniversal();
    const data = new Date().toISOString().slice(0, 10);
    const pdfPath = `./relatorios/relatorio_${data}.pdf`;
    const excelPath = `./relatorios/relatorio_${data}.xlsx`;
    if (!fs.existsSync('./relatorios')) fs.mkdirSync('./relatorios');
    gerarPDF(erros, pdfPath);
    await gerarExcelAvancado(erros, excelPath);
    // Enviar por e-mail se configurado
    if (process.env.EMAIL_DESTINATARIO && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_HOST) {
      await enviarEmail(pdfPath, 'pdf', process.env.EMAIL_DESTINATARIO, {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        host: process.env.EMAIL_HOST,
        ssl: true
      });
      await enviarEmail(excelPath, 'excel', process.env.EMAIL_DESTINATARIO, {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        host: process.env.EMAIL_HOST,
        ssl: true
      });
      console.log('Relatórios enviados por e-mail!');
    }
  } catch (err) {
    console.error('Erro ao gerar/enviar relatórios avançados:', err);
  }
});

// Geração de gráficos junto com relatórios PDF/Excel
cron.schedule(`10 ${HORA_RELATORIO_DIARIO} * * *`, async () => { // 10 minutos após o texto
  try {
    const erros = getErrorsUniversal();
    const data = new Date().toISOString().slice(0, 10);
    if (!fs.existsSync('./relatorios')) fs.mkdirSync('./relatorios');
    const graficoResp = `./relatorios/grafico_responsaveis_${data}.png`;
    const graficoMotivos = `./relatorios/grafico_motivos_${data}.png`;
    await gerarGraficoRankingResponsaveis(erros, graficoResp);
    await gerarGraficoMotivos(erros, graficoMotivos);
    console.log('Gráficos de estatísticas gerados!');
  } catch (err) {
    console.error('Erro ao gerar gráficos de estatísticas:', err);
  }
});

client.initialize();

console.log('Bot de WhatsApp iniciado. Em breve, integração com whatsapp-web.js.');

if (DEBUG) {
  console.log('[DEBUG] Configurações carregadas:', {
    NOME_GRUPO_ERROS,
    HORA_RELATORIO_DIARIO,
    HORA_RELATORIO_SEMANAL,
    DIA_RELATORIO_SEMANAL,
    HORA_RELATORIO_MENSAL,
    IDIOMA,
    CAMINHO_ARQUIVO_ERROS
  });
}

// Função para setar variáveis do .env via WhatsApp
function setEnvVar(key, value) {
  let env = fs.readFileSync(ENV_PATH, 'utf8');
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(env)) {
    env = env.replace(regex, `${key}=${value}`);
  } else {
    env += `\n${key}=${value}`;
  }
  fs.writeFileSync(ENV_PATH, env);
}
