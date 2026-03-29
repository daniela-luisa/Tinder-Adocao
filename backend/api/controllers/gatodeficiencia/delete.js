module.exports = {
  friendlyName: 'Desvincular deficiência do gato',
  description: 'Remove uma deficiência de um gato',

  inputs: {
    id: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Deficiência desvinculada com sucesso!',
    },
    notFound: {
      description: 'Vínculo não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao desvincular deficiência.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const vinculo = await GatoDeficiencia.findOne({ id });
      if (!vinculo) {
        return this.res.status(404).json({ erro: 'Vínculo não encontrado' });
      }

      await GatoDeficiencia.destroyOne({ id });

      return exits.success({
        message: 'Deficiência desvinculada com sucesso!',
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao desvincular a deficiência.',
        detalhes: err.message,
      });
    }
  },

};
