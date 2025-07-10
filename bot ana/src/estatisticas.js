// Estatísticas avançadas e geração de gráficos para relatórios
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');

async function gerarGraficoRankingResponsaveis(erros, filePath) {
  const contagem = {};
  erros.forEach(e => {
    const r = e.responsavel || 'Desconhecido';
    contagem[r] = (contagem[r] || 0) + 1;
  });
  const labels = Object.keys(contagem);
  const data = Object.values(contagem);
  const width = 600, height = 400;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Erros por responsável', data, backgroundColor: 'rgba(54, 162, 235, 0.6)' }]
    },
    options: { plugins: { legend: { display: false } } }
  };
  const buffer = await chartJSNodeCanvas.renderToBuffer(config);
  fs.writeFileSync(filePath, buffer);
}

async function gerarGraficoMotivos(erros, filePath) {
  const contagem = {};
  erros.forEach(e => {
    const m = e.motivo || 'Desconhecido';
    contagem[m] = (contagem[m] || 0) + 1;
  });
  const labels = Object.keys(contagem);
  const data = Object.values(contagem);
  const width = 600, height = 400;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  const config = {
    type: 'pie',
    data: {
      labels,
      datasets: [{ label: 'Motivos mais comuns', data }]
    }
  };
  const buffer = await chartJSNodeCanvas.renderToBuffer(config);
  fs.writeFileSync(filePath, buffer);
}

module.exports = { gerarGraficoRankingResponsaveis, gerarGraficoMotivos };
