const path = require('path');
const fs = require('fs');

module.exports.bootstrap = async function() {

  // Garante que a pasta de uploads existe
  const pastaUploads = path.join(__dirname, '..', 'assets', 'uploads', 'fotos');
  if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, { recursive: true });
  }

  // Registra a pasta assets como estática no Express
  // Isso serve os arquivos em tempo real sem depender do .tmp
  sails.hooks.http.app.use(
    '/uploads',
    require('express').static(path.join(__dirname, '..', 'assets', 'uploads'))
  );

};
