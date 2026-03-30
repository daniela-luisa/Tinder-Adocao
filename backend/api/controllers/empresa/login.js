const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Login empresa',
  description: 'Autentica a empresa e retorna um token JWT',

  inputs: {
    email: { type: 'string', required: true, isEmail: true },
    senha: { type: 'string', required: true },
  },

  exits: {
    success: {
      description: 'Login realizado com sucesso!',
    },
    credenciaisInvalidas: {
      description: 'E-mail ou senha incorretos.',
      responseType: 'unauthorized',
    },
  },

  fn: async function (inputs, exits) {
    const { email, senha } = inputs;

    const empresa = await Empresa.findOne({ email });
    if (!empresa) {
      return exits.credenciaisInvalidas();
    }

    const senhaCorreta = await bcrypt.compare(senha, empresa.senhaHash);
    if (!senhaCorreta) {
      return exits.credenciaisInvalidas();
    }

    const token = jwt.sign(
      { id: empresa.id, email: empresa.email, tipo: 'empresa' },
      sails.config.custom.jwtSecret,
      { expiresIn: '8h' }
    );

    return exits.success({ token });
  },

};
