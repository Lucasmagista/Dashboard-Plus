// Módulo para geração de relatórios em PDF e Excel e envio por e-mail
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const emailjs = require('emailjs');

function gerarPDF(erros, filePath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(16).text('Relatório de Erros', { align: 'center' });
  doc.moveDown();
  erros.forEach((e, i) => {
    doc.fontSize(10).text(`${i + 1}. Responsável: ${e.responsavel || '-'} | Motivo: ${e.motivo || '-'} | Conta: ${e.conta || '-'} | Venda: ${e.id_venda || '-'} | SKU: ${e.sku || '-'} | Custos: ${e.custos || '-'} | Custo total: ${e.custo_total || '-'} | Data: ${e.data}`);
    doc.moveDown(0.5);
  });
  doc.end();
}

function agruparPor(lista, chave) {
  return lista.reduce((acc, item) => {
    const valor = item[chave] || '-';
    if (!acc[valor]) acc[valor] = [];
    acc[valor].push(item);
    return acc;
  }, {});
}

function somarCusto(erros, campos = ['custo_total']) {
  return erros.reduce((soma, e) => {
    let total = 0;
    campos.forEach(campo => {
      let v = e[campo];
      if (typeof v === 'string') v = v.replace(/[^0-9.,]/g, '').replace(',', '.');
      total += parseFloat(v) || 0;
    });
    return soma + total;
  }, 0);
}

async function gerarExcelAvancado(erros, filePath) {
  const workbook = new ExcelJS.Workbook();

  // Aba 1: Resumo por Responsável
  const sheetResp = workbook.addWorksheet('Por Responsável');
  const porResp = agruparPor(erros, 'responsavel');
  sheetResp.columns = [
    { header: 'Responsável', key: 'responsavel' },
    { header: 'Qtde de Erros', key: 'qtd' },
    { header: 'Valor Total', key: 'valor' }
  ];
  Object.entries(porResp).forEach(([resp, lista]) => {
    sheetResp.addRow({
      responsavel: resp,
      qtd: lista.length,
      valor: somarCusto(lista).toFixed(2)
    });
  });

  // Aba 2: Resumo por Conta
  const sheetConta = workbook.addWorksheet('Por Conta');
  const porConta = agruparPor(erros, 'conta');
  sheetConta.columns = [
    { header: 'Conta', key: 'conta' },
    { header: 'Qtde de Erros', key: 'qtd' }
  ];
  Object.entries(porConta).forEach(([conta, lista]) => {
    sheetConta.addRow({ conta, qtd: lista.length });
  });

  // Aba 3: Resumo por SKU
  const sheetSKU = workbook.addWorksheet('Por SKU');
  const porSKU = agruparPor(erros, 'sku');
  sheetSKU.columns = [
    { header: 'SKU', key: 'sku' },
    { header: 'Qtde de Erros', key: 'qtd' }
  ];
  Object.entries(porSKU).forEach(([sku, lista]) => {
    sheetSKU.addRow({ sku, qtd: lista.length });
  });

  // Aba 4: Erros Detalhados
  const sheetDet = workbook.addWorksheet('Detalhado');
  sheetDet.columns = [
    { header: 'Data', key: 'data' },
    { header: 'Responsável', key: 'responsavel' },
    { header: 'Motivo', key: 'motivo' },
    { header: 'Conta', key: 'conta' },
    { header: 'Venda', key: 'id_venda' },
    { header: 'SKU', key: 'sku' },
    { header: 'Custos', key: 'custos' },
    { header: 'Custo total', key: 'custo_total' }
  ];
  erros.forEach(e => sheetDet.addRow(e));

  // Aba 5: Custos
  const sheetCusto = workbook.addWorksheet('Custos');
  const totalCusto = somarCusto(erros);
  // Custo + envio e custo + tampo (busca por palavras-chave)
  let totalEnvio = 0, totalTampo = 0;
  erros.forEach(e => {
    if (e.custos && /envio/i.test(e.custos)) {
      let v = e.custos.match(/([0-9]+[\.,][0-9]+)/g);
      if (v) totalEnvio += v.map(x => parseFloat(x.replace(',', '.'))).reduce((a, b) => a + b, 0);
    }
    if (e.custos && /tampo/i.test(e.custos)) {
      let v = e.custos.match(/([0-9]+[\.,][0-9]+)/g);
      if (v) totalTampo += v.map(x => parseFloat(x.replace(',', '.'))).reduce((a, b) => a + b, 0);
    }
  });
  sheetCusto.addRow(['Valor total de custo', totalCusto.toFixed(2)]);
  sheetCusto.addRow(['Valor total de envio', totalEnvio.toFixed(2)]);
  sheetCusto.addRow(['Valor total de tampo', totalTampo.toFixed(2)]);

  await workbook.xlsx.writeFile(filePath);
}

async function enviarEmail(relatorioPath, tipo, destinatario, config) {
  const server = emailjs.server.connect(config);
  const message = {
    text: `Segue em anexo o relatório de erros (${tipo}).`,
    from: config.user,
    to: destinatario,
    subject: `Relatório de erros (${tipo})`,
    attachment: [
      { path: relatorioPath, type: tipo === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', name: path.basename(relatorioPath) }
    ]
  };
  await server.sendAsync(message);
}

// Função para gerar PDF detalhado agrupado por conta/marketplace
const { agruparErrosPorContaMarketplace, detalharCustos } = require('./utils/relatorioMensagemHelpers');

function gerarPDFDetalhado(erros, filePath, titulo, intro) {
  const doc = new PDFDocument({ margin: 30 });
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(16).text(titulo, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(intro);
  doc.moveDown();
  const grupos = agruparErrosPorContaMarketplace(erros);
  Object.entries(grupos).forEach(([chave, lista]) => {
    doc.fontSize(12).text(`Conta/Marketplace: ${chave}`, { underline: true });
    doc.moveDown(0.2);
    // Cabeçalho da tabela
    doc.fontSize(10).text('SKU | Motivo | Desconto | Reembolso | Devolução | Reembolso Parcial | Envio | Tampo | Outro | Custo Total');
    doc.moveDown(0.1);
    lista.forEach(e => {
      const custos = detalharCustos(e.custos || '');
      doc.fontSize(9).text(
        `${e.sku || '-'} | ${e.motivo || '-'} | ${custos['Desconto']} | ${custos['Reembolso']} | ${custos['Devolução']} | ${custos['Reembolso Parcial']} | ${custos['Envio']} | ${custos['Tampo']} | ${custos['Outro']} | ${e.custo_total || '-'}`
      );
    });
    doc.moveDown();
  });
  doc.end();
}

// Alias para compatibilidade (gerarExcel é chamado em index.js)
const gerarExcel = gerarExcelAvancado;

module.exports = { gerarPDF, enviarEmail, gerarExcelAvancado, gerarExcel, gerarPDFDetalhado };
