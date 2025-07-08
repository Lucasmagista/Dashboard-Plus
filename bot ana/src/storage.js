// Módulo para armazenamento dos erros
// Inicialmente, pode usar um arquivo JSON simples em /data/erros.json

const fs = require('fs');
const path = require('path');

const CAMINHO_ARQUIVO_ERROS = process.env.CAMINHO_ARQUIVO_ERROS || path.join(__dirname, '../data/erros.json');

function saveError(error) {
  let errors = [];
  if (fs.existsSync(CAMINHO_ARQUIVO_ERROS)) {
    errors = JSON.parse(fs.readFileSync(CAMINHO_ARQUIVO_ERROS));
  }
  errors.push(error);
  fs.writeFileSync(CAMINHO_ARQUIVO_ERROS, JSON.stringify(errors, null, 2));
}

function getErrors() {
  if (!fs.existsSync(CAMINHO_ARQUIVO_ERROS)) return [];
  return JSON.parse(fs.readFileSync(CAMINHO_ARQUIVO_ERROS));
}

// Adiciona suporte ao SQLite
const { saveErrorDB, getErrorsDB } = require('./storage-sqlite');

// Decide se usa SQLite ou arquivo JSON
const USE_SQLITE = process.env.USE_SQLITE === 'true';

function saveErrorUniversal(error) {
  if (USE_SQLITE) {
    saveErrorDB(error);
  } else {
    saveError(error);
  }
}

function getErrorsUniversal() {
  if (USE_SQLITE) {
    return getErrorsDB();
  } else {
    return getErrors();
  }
}

module.exports = { saveErrorUniversal, getErrorsUniversal };
