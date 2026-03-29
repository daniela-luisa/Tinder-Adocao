module.exports = {
  friendlyName: 'Vincular personalidade ao gato',
  description: 'Adiciona uma personalidade a um gato',

  inputs: {
    gatoId: { type: 'number', required: true },
    personalidadeId: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Personalidade vinculada com sucesso!',
    },
    notFound: {
      description: 'Gato ou personalidade não encontrado.',
      responseType: 'notFound',
    },
    badRequest: {
      description: 'Personalidade já vinculada a este gato.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao vincular personalidade.',
    },
  },

  fn: async function (inputs, exits) {
    const { gatoId, personalidadeId } = inputs;

    try {

      const gato = await Gato.findOne({ id: gatoId });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      const personalidade = await Personalidade.findOne({ id: personalidadeId });
      if (!personalidade) {
        return this.res.status(404).json({ erro: 'Personalidade não encontrada' });
      }

      const vinculoExistente = await GatoPersonalidade.findOne({ gato: gatoId, personalidade: personalidadeId });
      if (vinculoExistente) {
        return exits.badRequest({ erro: 'Esta personalidade já está vinculada a este gato.' });
      }

      const novoVinculo = await GatoPersonalidade.create({
        gato: gatoId,
        personalidade: personalidadeId,
      }).fetch();

      const vinculoFormatado = {
        ...novoVinculo,
        createdAt: new Date(novoVinculo.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(novoVinculo.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Personalidade vinculada com sucesso!',
        vinculo: vinculoFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao vincular a personalidade.',
        detalhes: err.message,
      });
    }
  },

};
