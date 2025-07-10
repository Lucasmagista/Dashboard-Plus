
// Agrupa erros por conta/marketplace, agora agrupando também por data se existir
function agruparErrosPorContaMarketplace(erros, opcoes = {}) {
  // opcoes: { incluirData: boolean }
  return erros.reduce((acc, e) => {
    let chave = (e.conta || '-') + (e.marketplace ? ' / ' + e.marketplace : '');
    if (opcoes.incluirData && e.data) {
      chave += ' / ' + e.data;
    }
    if (!acc[chave]) acc[chave] = [];
    acc[chave].push(e);
    return acc;
  }, {});
}

// Detalha custos em categorias, agora mais robusto para diferentes formatos e valores
function detalharCustos(custosStr) {
  const categorias = ['Desconto', 'Reembolso', 'Devolução', 'Reembolso Parcial', 'Envio', 'Tampo', 'Outro'];
  const resultado = {};
  categorias.forEach(cat => resultado[cat] = '-');
  if (!custosStr) return resultado;
  // Aceita tanto ";" quanto "," como separador
  const partes = custosStr.split(/;|,/).map(s => s.trim()).filter(Boolean);
  partes.forEach(parte => {
    let encontrado = false;
    for (const cat of categorias) {
      if (parte.toLowerCase().includes(cat.toLowerCase())) {
        // Extrai valor numérico se houver
        const valor = parte.match(/([\d.,]+)/);
        resultado[cat] = valor ? valor[1].replace(',', '.') : parte.replace(/.*?:/,'').trim();
        encontrado = true;
        break;
      }
    }
    // Se não encontrou categoria conhecida, coloca em "Outro" (concatena se já houver)
    if (!encontrado && parte) {
      if (resultado['Outro'] === '-') resultado['Outro'] = parte;
      else resultado['Outro'] += ' | ' + parte;
    }
  });
  return resultado;
}

// Função extra: sumariza custos por categoria para um array de erros
function somarCustosPorCategoria(erros) {
  const categorias = ['Desconto', 'Reembolso', 'Devolução', 'Reembolso Parcial', 'Envio', 'Tampo', 'Outro'];
  const soma = {};
  categorias.forEach(cat => soma[cat] = 0);
  erros.forEach(e => {
    const detalhado = detalharCustos(e.custos || '');
    categorias.forEach(cat => {
      const valor = parseFloat((detalhado[cat] || '').replace(/[^\d.]/g, ''));
      if (!isNaN(valor)) soma[cat] += valor;
    });
  });
  return soma;
}

// Função extra: retorna lista única de marketplaces presentes nos erros
function listarMarketplaces(erros) {
  return [...new Set(erros.map(e => e.marketplace).filter(Boolean))];
}

module.exports = { agruparErrosPorContaMarketplace, detalharCustos, somarCustosPorCategoria, listarMarketplaces };
