/**
 * Parser robusto para mensagens de erro do WhatsApp
 * Analisa diferentes formatos de mensagens e extrai dados estruturados
 */

const fs = require('fs');
const path = require('path');

/**
 * Parseia uma mensagem de erro de forma robusta
 * @param {string} mensagem - Texto da mensagem recebida
 * @param {boolean} logRejeitadas - Se deve logar mensagens rejeitadas
 * @returns {object|null} - Objeto com dados do erro ou null se inválido
 */
function parseMensagemErroRobusto(mensagem, logRejeitadas = false) {
  if (!mensagem || typeof mensagem !== 'string') {
    if (logRejeitadas) logMensagemRejeitada(mensagem);
    return null;
  }

  const texto = mensagem.trim();
  
  // Ignora mensagens muito curtas ou que são apenas números
  if (texto.length < 10 || /^\d+$/.test(texto)) {
    if (logRejeitadas) logMensagemRejeitada(mensagem);
    return null;
  }

  // Ignora comandos e mensagens casuais
  if (texto.startsWith('/') || texto.toLowerCase() === 'teste') {
    if (logRejeitadas) logMensagemRejeitada(mensagem);
    return null;
  }

  let erro = {
    template: 'desconhecido',
    responsavel: null,
    conta: null,
    id_venda: null,
    sku: null,
    motivo: null,
    custos: null,
    custo_total: null,
    marketplace: null
  };

  // Padrões de regex para diferentes formatos
  const padroes = {
    // Formato 1: Responsável pelo erro: XXX
    responsavel: [
      /(?:\*)?(?:responsável|responsavel)\s*(?:pelo\s*)?(?:erro)?(?:\*)?\s*:\s*(.+)/im,
      /(?:\*)?responsável(?:\*)?\s*:\s*(.+)/im
    ],
    
    // Formato conta: com variações
    conta: [
      /(?:\*)?conta(?:\*)?\s*:\s*(.+?)(?:\n|$)/im,
      /(?:\*)?conta(?:\*)?\s*[:]\s*(.+?)(?:\s*identificação|\s*sku|\s*motivo|$)/im,
      /(?:\*)?conta(?:\*)?\s*:\s*(.+)/im
    ],
    
    // ID da venda com variações
    id_venda: [
      /(?:identificação|identificacao)\s*(?:da\s*)?(?:venda|pedido)(?:\*)?\s*:\s*(\d+)/im,
      /(?:id|numero)\s*(?:da\s*)?(?:venda|pedido)(?:\*)?\s*:\s*(\d+)/im,
      /(?:venda|pedido)(?:\*)?\s*:\s*(\d+)/im
    ],
    
    // SKU com variações
    sku: [
      /(?:\*)?sku(?:\*)?\s*:\s*(.+?)(?:\n|motivo|custo|$)/im,
      /(?:\*)?sku(?:\*)?\s*:\s*(.+)/im
    ],
    
    // Motivo com variações
    motivo: [
      /(?:\*)?motivo\s*(?:do\s*)?(?:erro)?(?:\*)?\s*:\s*(.+?)(?:\n(?:custo|valor)|$)/im,
      /(?:\*)?motivo(?:\*)?\s*:\s*(.+)/im
    ],
    
    // Custo com variações
    custo: [
      /(?:\*)?custo(?:\*)?\s*:\s*(.+)/im,
      /(?:\*)?valor(?:\*)?\s*:\s*(.+)/im,
      /r\$\s*[\d.,]+(?:\s*\([^)]+\))?/im
    ]
  };

  // Tenta extrair cada campo usando os padrões
  for (const [campo, regexes] of Object.entries(padroes)) {
    for (const regex of regexes) {
      const match = texto.match(regex);
      if (match && match[1]) {
        let valor = match[1].trim();
        
        // Remove formatação markdown
        valor = valor.replace(/\*(.+?)\*/g, '$1');
        valor = valor.replace(/[*_]/g, '');
        
        // Limpa quebras de linha extras
        valor = valor.replace(/\n.*/s, '').trim();
        
        if (valor && valor !== '-' && valor.length > 0) {
          if (campo === 'custo') {
            erro.custos = valor;
            // Tenta extrair o custo total
            const valorNumerico = valor.match(/[\d.,]+/);
            if (valorNumerico) {
              erro.custo_total = valorNumerico[0].replace(',', '.');
            }
          } else {
            erro[campo] = valor;
          }
          break;
        }
      }
    }
  }

  // Tenta identificar marketplace da conta
  if (erro.conta) {
    const contaLower = erro.conta.toLowerCase();
    if (contaLower.includes('ml') || contaLower.includes('mercado')) {
      erro.marketplace = 'ML';
    } else if (contaLower.includes('shopee')) {
      erro.marketplace = 'Shopee';
    } else if (contaLower.includes('amazon')) {
      erro.marketplace = 'Amazon';
    }
  }

  // Determina o template baseado nos campos preenchidos
  if (erro.responsavel && erro.motivo) {
    if (erro.conta && erro.id_venda && erro.sku) {
      erro.template = 'completo';
    } else if (erro.conta && (erro.sku || erro.custos)) {
      erro.template = 'custo_simples';
    } else {
      erro.template = 'basico';
    }
  }

  // Valida se é um erro válido
  if (validarErro(erro)) {
    return erro;
  } else {
    if (logRejeitadas) logMensagemRejeitada(mensagem);
    return null;
  }
}

/**
 * Valida se um objeto de erro é válido
 * @param {object} erro - Objeto do erro a ser validado
 * @returns {boolean} - true se válido, false caso contrário
 */
function validarErro(erro) {
  if (!erro || typeof erro !== 'object') return false;
  
  // Campos obrigatórios mínimos
  if (!erro.responsavel || !erro.motivo) return false;
  
  // Verifica se responsável não é muito genérico
  const responsavelLower = erro.responsavel.toLowerCase();
  if (responsavelLower.length < 3) return false;
  
  // Verifica se motivo não é muito curto
  if (!erro.motivo || erro.motivo.length < 5) return false;
  
  return true;
}

/**
 * Loga mensagens rejeitadas para análise posterior
 * @param {string} mensagem - Mensagem que foi rejeitada
 */
function logMensagemRejeitada(mensagem) {
  const logPath = path.join(__dirname, '../logs/rejeitadas.log');
  const timestamp = new Date().toISOString();
  const logEntry = `\n[${timestamp}]\n${mensagem}\n`;
  
  try {
    // Garante que o diretório existe
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    fs.appendFileSync(logPath, logEntry);
  } catch (error) {
    console.error('Erro ao escrever log de rejeitadas:', error);
  }
}

/**
 * Processa mensagens rejeitadas do log e tenta convertê-las em erros válidos
 * @returns {Array} - Array de erros processados das mensagens rejeitadas
 */
function processarMensagensRejeitadas() {
  const logPath = path.join(__dirname, '../logs/rejeitadas.log');
  const errosRecuperados = [];
  
  if (!fs.existsSync(logPath)) {
    console.log('Arquivo de rejeitadas não encontrado.');
    return errosRecuperados;
  }
  
  try {
    const conteudo = fs.readFileSync(logPath, 'utf8');
    const blocos = conteudo.split(/\n\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]\n/)
      .filter(bloco => bloco.trim().length > 0);
    
    console.log(`Processando ${blocos.length} mensagens rejeitadas...`);
    
    for (const bloco of blocos) {
      const mensagem = bloco.trim();
      if (mensagem.length < 10) continue;
      
      // Tenta processar a mensagem com parser aprimorado
      const erro = parseMensagemErroRobusto(mensagem, false);
      if (erro) {
        erro.data = new Date().toISOString();
        erro.origem = 'recuperado_rejeitadas';
        errosRecuperados.push(erro);
        console.log(`✅ Recuperado: ${erro.responsavel} - ${erro.motivo}`);
      }
    }
    
    console.log(`Total de erros recuperados: ${errosRecuperados.length}`);
    return errosRecuperados;
    
  } catch (error) {
    console.error('Erro ao processar mensagens rejeitadas:', error);
    return errosRecuperados;
  }
}

/**
 * Salva os erros recuperados no arquivo principal de erros
 * @param {Array} errosRecuperados - Array de erros para salvar
 */
function salvarErrosRecuperados(errosRecuperados) {
  if (errosRecuperados.length === 0) {
    console.log('Nenhum erro recuperado para salvar.');
    return;
  }
  
  const arquivoErros = path.join(__dirname, '../data/erros.json');
  
  try {
    let errosExistentes = [];
    if (fs.existsSync(arquivoErros)) {
      const conteudo = fs.readFileSync(arquivoErros, 'utf8');
      errosExistentes = JSON.parse(conteudo);
    }
    
    // Adiciona os erros recuperados
    errosExistentes.push(...errosRecuperados);
    
    // Salva de volta
    fs.writeFileSync(arquivoErros, JSON.stringify(errosExistentes, null, 2));
    
    console.log(`✅ ${errosRecuperados.length} erros recuperados salvos em ${arquivoErros}`);
    
    // Cria backup do log de rejeitadas
    const backupPath = path.join(__dirname, '../logs/rejeitadas_backup_' + Date.now() + '.log');
    fs.copyFileSync(path.join(__dirname, '../logs/rejeitadas.log'), backupPath);
    
    // Limpa o log de rejeitadas
    fs.writeFileSync(path.join(__dirname, '../logs/rejeitadas.log'), '');
    
    console.log(`📦 Backup criado: ${backupPath}`);
    
  } catch (error) {
    console.error('Erro ao salvar erros recuperados:', error);
  }
}

module.exports = {
  parseMensagemErroRobusto,
  validarErro,
  logMensagemRejeitada,
  processarMensagensRejeitadas,
  salvarErrosRecuperados
};