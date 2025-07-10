#!/usr/bin/env node

/**
 * Script para recuperar mensagens rejeitadas e processá-las novamente
 * Usar: npm run recuperar-rejeitadas
 */

const path = require('path');
const { processarMensagensRejeitadas, salvarErrosRecuperados } = require('../utils');

console.log('🔄 Iniciando recuperação de mensagens rejeitadas...\n');

// Processa as mensagens rejeitadas
const errosRecuperados = processarMensagensRejeitadas();

if (errosRecuperados.length > 0) {
  console.log('\n📊 Resumo dos erros recuperados:');
  console.log('='.repeat(50));
  
  // Agrupa por responsável
  const porResponsavel = errosRecuperados.reduce((acc, erro) => {
    const resp = erro.responsavel || 'Não identificado';
    if (!acc[resp]) acc[resp] = 0;
    acc[resp]++;
    return acc;
  }, {});
  
  Object.entries(porResponsavel).forEach(([responsavel, count]) => {
    console.log(`• ${responsavel}: ${count} erro(s)`);
  });
  
  console.log('='.repeat(50));
  console.log(`📈 Total: ${errosRecuperados.length} erro(s) recuperado(s)`);
  
  // Pergunta se deseja salvar
  console.log('\n💾 Salvando erros recuperados...');
  salvarErrosRecuperados(errosRecuperados);
  
  console.log('\n✅ Processo concluído com sucesso!');
  console.log('💡 Execute "npm start" para reiniciar o bot com os novos dados.');
  
} else {
  console.log('ℹ️  Nenhuma mensagem rejeitada foi encontrada ou todas eram inválidas.');
}

console.log('\n🏁 Finalizando...\n');
