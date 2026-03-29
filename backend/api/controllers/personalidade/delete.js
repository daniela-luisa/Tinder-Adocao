module.exports = {
  friendlyName: 'Deletar personalidade',
  description: 'Remove uma personalidade do sistema',

  inputs: {
    id: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Personalidade deletada com sucesso!',
    },
    notFound: {
      description: 'Personalidade não encontrada.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao deletar personalidade.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const personalidade = await Personalidade.findOne({ id });
      if (!personalidade) {
        return this.res.status(404).json({ erro: 'Personalidade não encontrada' });
      }

      await Personalidade.destroyOne({ id });

      return exits.success({
        message: 'Personalidade deletada com sucesso!',
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao deletar a personalidade.',
        detalhes: err.message,
      });
    }
  },

};
