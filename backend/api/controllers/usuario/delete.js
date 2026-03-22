module.exports = {
  friendlyName: 'Deletar usuário',
  description: 'Remove um usuário do sistema',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Usuário deletado com sucesso!',
    },
    notFound: {
      description: 'Usuário não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao deletar usuário.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const usuario = await Usuario.findOne({ id });
      if (!usuario) {
        return this.res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      await Usuario.destroyOne({ id });

      return exits.success({
        message: 'Usuário deletado com sucesso!',
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao deletar o usuário.',
        detalhes: err.message,
      });
    }
  },

};
