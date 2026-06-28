const bcrypt = require('bcryptjs');

module.exports = {
  friendlyName: 'Criar usuário',
  description: 'Permite o cadastro de novos usuários',

  inputs: {
    nome: { type: 'string', required: true},
    email: { type: 'string', required: true, isEmail: true},
    senha: { type: 'string', required: true},
    cpf: { type: 'string'},
    telefone: { type: 'string'},
    fotoUrl: { type: 'string'},
  },

  exits: {
    success: {
      description: 'Usuário cadastrado com sucesso!',
    },

    emailJaCadastrado: {
      description: 'E-mail já cadastrado no sistema.',
      responseType: 'badRequest',
    },

    dadosInvalidos: {
      description: 'Dados inválidos.',
      responseType: 'badRequest',
    },

    error: {
      description: 'Erro ao cadastrar usuário.',
    },
  },

  fn: async function (inputs, exits) {
    const { nome, email, senha, cpf, telefone, fotoUrl } = inputs;

    try {

      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return exits.emailJaCadastrado({ erro: 'E-mail já cadastrado no sistema.' });
      }

      if (!nome || !email || !senha || !cpf) {
        return exits.dadosInvalidos({
          erro: 'Todos os campos devem ser preenchidos.',
        });
      }

      if (senha.length < 6) {
        return exits.dadosInvalidos({
          erro: 'A senha deve conter pelo menos 6 caracteres.',
        });
      }

      const cpfLimpo = cpf.replace(/\D/g, '');

      if (cpfLimpo.length !== 11) {
        return exits.dadosInvalidos({
          erro: 'O CPF deve conter 11 dígitos.',
        });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const novoUsuario = await Usuario.create({nome, email, senhaHash, cpf, telefone, fotoUrl,}).fetch();

      const dataFormatada = {
        ...novoUsuario,
        createdAt: new Date(novoUsuario.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(novoUsuario.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Usuário cadastrado com sucesso!',
        usuario: dataFormatada,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao cadastrar o usuário.',
        detalhes: err.message,
      });
    }
  },

};
