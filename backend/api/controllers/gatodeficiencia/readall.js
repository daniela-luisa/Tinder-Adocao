module.exports = {
  friendlyName: 'Listar deficiências do gato',
  description: 'Retorna todas as deficiências de um gato específico',

  inputs: {
    gatoId: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Deficiências listadas com sucesso!',
    },
    notFound: {
      description: 'Nenhuma deficiência encontrada.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao listar deficiências.',
    },
  },

  fn: async function (inputs, exits) {
    const { gatoId } = inputs;

    try {

      const gato = await Gato.findOne({ id: gatoId });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      const vinculos = await GatoDeficiencia.find({ gato: gatoId }).populate('deficiencia');

      const vinculosFormatados = vinculos.map(vinculo => ({
        ...vinculo,
        createdAt: new Date(vinculo.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(vinculo.updatedAt).toLocaleString('pt-BR'),
      }));

      return exits.success({
        message: 'Deficiências listadas com sucesso!',
        deficiencias: vinculosFormatados,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao listar as deficiências.',
        detalhes: err.message,
      });
    }
  },

};
