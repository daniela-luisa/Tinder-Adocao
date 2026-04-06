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
      statusCode: 401,
    },
  },

  fn: async function (inputs, exits) {
    const { email, senha } = inputs;

    const empresa = await Empresa.findOne({ email });
    if (!empresa) {
      return exits.credenciaisInvalidas({ erro: 'E-mail ou senha incorretos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, empresa.senhaHash);
    if (!senhaCorreta) {
      return exits.credenciaisInvalidas({ erro: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: empresa.id, email: empresa.email, tipo: 'empresa' },
      sails.config.custom.jwtSecret,
      { expiresIn: '8h' }
    );

    this.res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return exits.success({
      message: 'Login realizado com sucesso!',
      empresa: {
        id: empresa.id,
        email: empresa.email,
        nome: empresa.nome,
      },
    });
  },

};
