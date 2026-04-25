const path = require('path');
const fs = require('fs');
const multer = require('multer');

const pastaUploads = path.join(sails.config.appPath, 'assets', 'uploads', 'fotos');

if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUploads);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (tiposPermitidos.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error('Tipo de arquivo não permitido. Use JPG, PNG ou WEBP.'));
  },
}).single('foto');

module.exports = {
  friendlyName: 'Upload foto gato',

  exits: {
    success: { description: 'Foto enviada com sucesso!' },
  },

  fn: async function (unusedInputs, unusedExits) {
    const req = this.req;
    const res = this.res;

    const gatoId = req.param('gatoId');
    const principal = req.param('principal') === 'true';

    if (!gatoId) {
      return res.badRequest({ erro: 'gatoId é obrigatório.' });
    }

    const gato = await Gato.findOne({ id: gatoId });
    if (!gato) {
      return res.notFound({ erro: 'Gato não encontrado.' });
    }

    await new Promise((resolve, reject) => {
      uploadMiddleware(req, res, (err) => {
        if (err) { return reject(err); }
        return resolve();
      });
    }).then(async () => {
      if (!req.file) {
        return res.badRequest({ erro: 'Nenhum arquivo enviado.' });
      }

      const urlPublica = `http://localhost:1337/uploads/fotos/${req.file.filename}`;

      const fotosExistentes = await FotoGato.find({ gato: gatoId });
      const ehPrimeira = fotosExistentes.length === 0;

      if (principal || ehPrimeira) {
        await FotoGato.update({ gato: gatoId }).set({ principal: false });
      }

      const novaFoto = await FotoGato.create({
        gato: gatoId,
        url: urlPublica,
        principal: principal || ehPrimeira,
      }).fetch();

      return res.ok({
        message: 'Foto enviada com sucesso!',
        foto: {
          ...novaFoto,
          createdAt: new Date(novaFoto.createdAt).toLocaleString('pt-BR'),
          updatedAt: new Date(novaFoto.updatedAt).toLocaleString('pt-BR'),
        },
      });
    }).catch((err) => {
      return res.badRequest({ erro: err.message });
    });
  },
};
