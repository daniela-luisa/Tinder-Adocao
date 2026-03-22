module.exports = {
  friendlyName: 'Criar usuário',
  description: 'Permite o cadastro de novos usuários',

  inputs: {
    nome: { type: 'string', required: true},
    email: { type: 'string', required: true, isEmail: true},
    senha: { type: 'string', required: true, minLength: 6},
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

      const novoUsuario = await Usuario.create({nome, email, senhaHash: senha, cpf, telefone, fotoUrl,}).fetch();

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
