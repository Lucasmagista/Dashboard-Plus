// Módulo para persistência de erros em SQLite
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/erros.db');

// Cria o banco e tabela se não existir
function initDB() {
  const db = new Database(DB_PATH);
  db.exec(`CREATE TABLE IF NOT EXISTS erros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    responsavel TEXT,
    conta TEXT,
    id_venda TEXT,
    sku TEXT,
    motivo TEXT,
    custos TEXT,
    custo_total TEXT,
    template TEXT
  )`);
  db.close();
}

function saveErrorDB(erro) {
  const db = new Database(DB_PATH);
  const stmt = db.prepare(`INSERT INTO erros (data, responsavel, conta, id_venda, sku, motivo, custos, custo_total, template) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(
    erro.data,
    erro.responsavel || '',
    erro.conta || '',
    erro.id_venda || '',
    erro.sku || '',
    erro.motivo || '',
    erro.custos || '',
    erro.custo_total || '',
    erro.template || ''
  );
  db.close();
}

function getErrorsDB() {
  const db = new Database(DB_PATH);
  const rows = db.prepare('SELECT * FROM erros').all();
  db.close();
  return rows;
}

initDB();

module.exports = { saveErrorDB, getErrorsDB };
