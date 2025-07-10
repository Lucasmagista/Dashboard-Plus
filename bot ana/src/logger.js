// Logger persistente para auditoria e troubleshooting
const fs = require('fs');
const path = require('path');

const LOG_PATH = process.env.LOG_PATH || path.join(__dirname, '../logs/bot.log');

function logPersistente(tipo, mensagem, extra = {}) {
  const registro = {
    timestamp: new Date().toISOString(),
    tipo,
    mensagem,
    ...extra
  };
  fs.appendFileSync(LOG_PATH, JSON.stringify(registro) + '\n');
}

module.exports = { logPersistente };
