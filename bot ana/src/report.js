// Módulo para geração de relatórios diário, semanal e mensal
// Funções para filtrar erros por período e gerar texto dos relatórios

const { getErrorsUniversal } = require('./storage');
const { format, parseISO, isSameDay, isSameWeek, isSameMonth } = require('date-fns');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../relatorio_template.env') });
const TITULO_RELATORIO = process.env.TITULO_RELATORIO || 'Relatório de Erros';
const TEXTO_INTRO = process.env.TEXTO_INTRO || 'Segue abaixo o resumo dos erros registrados no período.';
const TEXTO_FIM = process.env.TEXTO_FIM || 'Para mais detalhes, consulte o arquivo anexo ou entre em contato com o responsável.';

function gerarRelatorioDiario(dataISO) {
  const erros = getErrorsUniversal().filter(e => isSameDay(parseISO(e.data), parseISO(dataISO)));
  return gerarTextoRelatorio(erros, 'diário', dataISO);
}

function gerarRelatorioSemanal(dataISO) {
  const erros = getErrorsUniversal().filter(e => isSameWeek(parseISO(e.data), parseISO(dataISO), { weekStartsOn: 1 }));
  return gerarTextoRelatorio(erros, 'semanal', dataISO);
}

function gerarRelatorioMensal(dataISO) {
  const erros = getErrorsUniversal().filter(e => isSameMonth(parseISO(e.data), parseISO(dataISO)));
  return gerarTextoRelatorio(erros, 'mensal', dataISO);
}

function gerarTextoRelatorio(erros, tipo, dataISO) {
  if (!erros.length) return `${TITULO_RELATORIO} (${tipo} - ${format(parseISO(dataISO), 'dd/MM/yyyy')}):\nNenhum erro registrado.`;
  let texto = `${TITULO_RELATORIO} (${tipo} - ${format(parseISO(dataISO), 'dd/MM/yyyy')}):\n${TEXTO_INTRO}\nTotal de erros: ${erros.length}\n`;
  erros.forEach((e, i) => {
    texto += `\n${i + 1}. Responsável: ${e.responsavel || '-'}\nMotivo: ${e.motivo || '-'}\nConta: ${e.conta || '-'}\nVenda: ${e.id_venda || '-'}\nSKU: ${e.sku || '-'}\nCustos: ${e.custos || '-'}\nCusto total: ${e.custo_total || '-'}\nData: ${format(parseISO(e.data), 'dd/MM/yyyy HH:mm')}`;
  });
  texto += `\n\n${TEXTO_FIM}`;
  return texto;
}

function filtrarErrosPorDia(dataISO) {
  return getErrorsUniversal().filter(e => isSameDay(parseISO(e.data), parseISO(dataISO)));
}

function filtrarErrosPorSemana(dataISO) {
  return getErrorsUniversal().filter(e => isSameWeek(parseISO(e.data), parseISO(dataISO), { weekStartsOn: 1 }));
}

function filtrarErrosPorMes(dataISO) {
  return getErrorsUniversal().filter(e => isSameMonth(parseISO(e.data), parseISO(dataISO)));
}

function filtrarErrosPorData(dataISO) {
  // Aceita data no formato dd/MM/yyyy ou yyyy-MM-dd
  let data;
  if (/\d{2}\/\d{2}\/\d{4}/.test(dataISO)) {
    const [dia, mes, ano] = dataISO.split('/');
    data = `${ano}-${mes}-${dia}`;
  } else {
    data = dataISO;
  }
  return getErrorsUniversal().filter(e => isSameDay(parseISO(e.data), parseISO(data)));
}

module.exports = {
  gerarRelatorioDiario,
  gerarRelatorioSemanal,
  gerarRelatorioMensal,
  filtrarErrosPorDia,
  filtrarErrosPorSemana,
  filtrarErrosPorMes,
  filtrarErrosPorData
};
