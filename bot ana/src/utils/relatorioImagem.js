// Gera uma imagem PNG de uma tabela de erros usando Puppeteer (HTML → PNG)
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function gerarImagemTabelaErros(erros, titulo = '', intro = '', filePath = './relatorios/tabela_erros.png') {
  // Gera HTML da tabela
  const html = gerarHTMLTabela(erros, titulo, intro);
  // Cria arquivo temporário HTML
  const tempHtml = path.join(__dirname, '../../relatorios/tabela_temp.html');
  fs.writeFileSync(tempHtml, html, 'utf8');
  // Gera imagem com Puppeteer
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('file://' + tempHtml, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: filePath, fullPage: true });
  await browser.close();
  fs.unlinkSync(tempHtml);
  return filePath;
}


function gerarHTMLTabela(erros, titulo = '', intro = '') {
  // Caminho do logo (deve estar na pasta do projeto ou ser um caminho acessível pelo HTML)
  // Para garantir portabilidade, copie o logo para a pasta 'relatorios' e use caminho relativo
  const logoPath = path.join(__dirname, '../../relatorios/logo_inauguralar.png');
  let logoBase64 = '';
  try {
    // Lê o logo e converte para base64 para embutir no HTML
    const logoBuffer = fs.readFileSync(logoPath);
    logoBase64 = 'data:image/png;base64,' + logoBuffer.toString('base64');
  } catch (e) {
    // Se não encontrar o logo, ignora
    logoBase64 = '';
  }
  // Layout moderno: cabeçalho colorido, zebra, bordas arredondadas, destaque para totais
  let html = `
  <html><head>
    <meta charset='utf-8'>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; color: #222; margin: 0; padding: 0; }
      .container { max-width: 1200px; margin: 30px auto; background: #fff; border-radius: 18px; box-shadow: 0 4px 24px #0001; padding: 32px 28px; }
      .logo-wrap { display: flex; justify-content: center; align-items: center; margin-bottom: 18px; }
      .logo-img { max-width: 320px; max-height: 120px; width: auto; height: auto; border-radius: 12px; box-shadow: 0 2px 12px #0002; background: #fff; padding: 8px 18px; }
      h1 { text-align: center; color: #2a4d8f; margin-bottom: 8px; font-size: 2.2em; }
      .intro { text-align: center; margin-bottom: 24px; color: #555; font-size: 1.1em; }
      table { border-collapse: separate; border-spacing: 0; width: 100%; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px #0001; }
      th, td { padding: 10px 12px; font-size: 14px; }
      th { background: linear-gradient(90deg, #2a4d8f 60%, #4e8cff 100%); color: #fff; font-weight: 600; border-bottom: 2px solid #2a4d8f; }
      tr { transition: background 0.2s; }
      tr:nth-child(even) { background: #f0f4fa; }
      tr:hover { background: #e6f0ff; }
      td { border-bottom: 1px solid #e3e8f0; }
      .totais { margin-top: 24px; font-size: 1.08em; color: #2a4d8f; }
      .totais strong { color: #1a2d4d; }
    </style>
  </head><body><div class='container'>
    ${logoBase64 ? `<div class='logo-wrap'><img src='${logoBase64}' class='logo-img' alt='Logo'></div>` : ''}
    <h1>${titulo || 'Relatório de Erros'}</h1>
    <div class='intro'>${intro || ''}</div>
    <table>
      <tr>
        <th>#</th><th>Responsável</th><th>Motivo</th><th>Conta</th><th>Venda</th><th>SKU</th><th>Desconto</th><th>Reembolso</th><th>Devolução</th><th>Reembolso Parcial</th><th>Envio</th><th>Tampo</th><th>Outro</th><th>Custo Total</th><th>Data</th>
      </tr>
  `;
  const { detalharCustos, somarCustosPorCategoria } = require('./relatorioMensagemHelpers');
  erros.forEach((e, i) => {
    const custos = detalharCustos(e.custos || '');
    html += `<tr><td>${i+1}</td><td>${e.responsavel||'-'}</td><td>${e.motivo||'-'}</td><td>${e.conta||'-'}</td><td>${e.id_venda||'-'}</td><td>${e.sku||'-'}</td><td>${custos['Desconto']}</td><td>${custos['Reembolso']}</td><td>${custos['Devolução']}</td><td>${custos['Reembolso Parcial']}</td><td>${custos['Envio']}</td><td>${custos['Tampo']}</td><td>${custos['Outro']}</td><td>${e.custo_total||'-'}</td><td>${e.data||'-'}</td></tr>`;
  });
  html += '</table>';
  // Totais gerais
  if (erros.length) {
    const totais = somarCustosPorCategoria(erros);
    html += `<div class='totais'><strong>Totais:</strong> `;
    Object.entries(totais).forEach(([cat, val]) => {
      html += ` <strong>${cat}:</strong> R$ ${val.toFixed(2)} &nbsp;`;
    });
    html += '</div>';
  }
  html += '</div></body></html>';
  return html;
}

module.exports = { gerarImagemTabelaErros };
