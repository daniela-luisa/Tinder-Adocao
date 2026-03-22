module.exports = {
  friendlyName: 'Deletar gato',
  description: 'Remove um gato do sistema',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Gato deletado com sucesso!',
    },
    notFound: {
      description: 'Gato não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao deletar gato.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const gato = await Gato.findOne({ id });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      await Gato.destroyOne({ id });

      return exits.success({
        message: 'Gato deletado com sucesso!',
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao deletar o gato.',
        detalhes: err.message,
      });
    }
  },

};
