// Painel web para exibir o QR code do WhatsApp
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

let qrAtual = null;
let conectado = false;

function setQRCode(qr) {
  qrAtual = qr;
  conectado = false;
  io.emit('qr', qr);
}

function setConectado() {
  conectado = true;
  io.emit('conectado');
}

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>QR Code WhatsApp Bot</title></head>
      <body style="font-family:sans-serif;text-align:center;margin-top:40px;">
        <h2>Escaneie o QR Code para autenticar o bot</h2>
        <div id="qrcode"></div>
        <div id="status" style="margin-top:20px;font-size:1.2em;"></div>
        <script src="/socket.io/socket.io.js"></script>
        <script>
          const socket = io();
          function renderQR(qr) {
            document.getElementById('qrcode').innerHTML = '';
            if (qr) {
              const img = document.createElement('img');
              img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(qr);
              img.alt = 'QR Code';
              document.getElementById('qrcode').appendChild(img);
              document.getElementById('status').innerText = 'Aguardando leitura do QR code...';
            }
          }
          socket.on('qr', renderQR);
          socket.on('conectado', () => {
            document.getElementById('qrcode').innerHTML = '';
            document.getElementById('status').innerText = '✅ Bot conectado ao WhatsApp!';
          });
          // Renderiza o QR atual se recarregar
          fetch('/qr').then(r => r.json()).then(data => {
            if (data.qr && !data.conectado) renderQR(data.qr);
            if (data.conectado) document.getElementById('status').innerText = '✅ Bot conectado ao WhatsApp!';
          });
        </script>
      </body>
    </html>
  `);
});

app.get('/qr', (req, res) => {
  res.json({ qr: qrAtual, conectado });
});

function startWebPanel(port = 3050) {
  http.listen(port, () => {
    console.log(`Painel QR code disponível em http://localhost:${port}`);
  });
}

module.exports = { setQRCode, setConectado, startWebPanel };
