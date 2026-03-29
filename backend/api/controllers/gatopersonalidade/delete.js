module.exports = {
  friendlyName: 'Desvincular personalidade do gato',
  description: 'Remove uma personalidade de um gato',

  inputs: {
    id: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Personalidade desvinculada com sucesso!',
    },
    notFound: {
      description: 'Vínculo não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao desvincular personalidade.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const vinculo = await GatoPersonalidade.findOne({ id });
      if (!vinculo) {
        return this.res.status(404).json({ erro: 'Vínculo não encontrado' });
      }

      await GatoPersonalidade.destroyOne({ id });

      return exits.success({
        message: 'Personalidade desvinculada com sucesso!',
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao desvincular a personalidade.',
        detalhes: err.message,
      });
    }
  },

};
