// Gera um arquivo .txt com as mensagens detalhadas do relatório
const fs = require('fs');
const path = require('path');
const { gerarMensagensRelatorioDetalhado } = require('./relatorioMensagem');

async function gerarTxtRelatorio(erros, titulo = '', intro = '', filePath = './relatorios/relatorio.txt') {
  const mensagens = gerarMensagensRelatorioDetalhado(erros, titulo, intro);
  const conteudo = mensagens.join('\n\n');
  fs.writeFileSync(filePath, conteudo, 'utf8');
  return filePath;
}

module.exports = { gerarTxtRelatorio };
