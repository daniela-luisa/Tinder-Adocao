module.exports = {
  friendlyName: 'Buscar usuário',
  description: 'Busca um usuário pelo id',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Usuário encontrado com sucesso!',
    },
    notFound: {
      description: 'Usuário não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao buscar usuário.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const usuario = await Usuario.findOne({ id });
      if (!usuario) {
        return this.res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      const usuarioFormatado = {
        ...usuario,
        createdAt: new Date(usuario.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(usuario.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Usuário encontrado com sucesso!',
        usuario: usuarioFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao buscar o usuário.',
        detalhes: err.message,
      });
    }
  },

};
