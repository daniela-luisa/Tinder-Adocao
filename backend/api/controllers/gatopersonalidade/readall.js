module.exports = {
  friendlyName: 'Listar personalidades do gato',
  description: 'Retorna todas as personalidades de um gato específico',

  inputs: {
    gatoId: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Personalidades listadas com sucesso!',
    },
    notFound: {
      description: 'Nenhuma personalidade encontrada.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao listar personalidades.',
    },
  },

  fn: async function (inputs, exits) {
    const { gatoId } = inputs;

    try {

      const gato = await Gato.findOne({ id: gatoId });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      const vinculos = await GatoPersonalidade.find({ gato: gatoId }).populate('personalidade');

      if (!vinculos || vinculos.length === 0) {
        return this.res.status(404).json({ erro: 'Nenhuma personalidade encontrada para este gato.' });
      }

      const vinculosFormatados = vinculos.map(vinculo => ({
        ...vinculo,
        createdAt: new Date(vinculo.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(vinculo.updatedAt).toLocaleString('pt-BR'),
      }));

      return exits.success({
        message: 'Personalidades listadas com sucesso!',
        personalidades: vinculosFormatados,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao listar as personalidades.',
        detalhes: err.message,
      });
    }
  },

};
