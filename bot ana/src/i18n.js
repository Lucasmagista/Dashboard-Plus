const fs = require('fs');
const path = require('path');

let idioma = process.env.IDIOMA || 'pt-BR';
let i18n = {};

function loadI18n() {
  const raw = fs.readFileSync(path.join(__dirname, '../i18n.json'));
  i18n = JSON.parse(raw);
}

function t(key) {
  if (!i18n[idioma]) return key;
  return i18n[idioma][key] || key;
}

function setIdioma(novo) {
  idioma = novo;
}

loadI18n();

module.exports = { t, setIdioma, loadI18n };
