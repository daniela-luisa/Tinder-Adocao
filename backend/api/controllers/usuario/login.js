const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Login usuário',
  description: 'Autentica um usuário e retorna um token JWT',

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

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return exits.credenciaisInvalidas();
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaCorreta) {
      return exits.credenciaisInvalidas();
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, tipo: 'usuario' },
      sails.config.custom.jwtSecret,
      { expiresIn: '8h' }
    );

    return exits.success({ token });
  },

};
