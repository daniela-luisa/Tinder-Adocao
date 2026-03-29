module.exports = {
  friendlyName: 'Listar personalidades',
  description: 'Retorna todas as personalidades cadastradas',

  inputs: {},

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
    try {

      const personalidades = await Personalidade.find();

      if (!personalidades || personalidades.length === 0) {
        return exits.notFound({ erro: 'Nenhuma personalidade encontrada.' });
      }

      const personalidadesFormatadas = personalidades.map(personalidade => ({
        ...personalidade,
        createdAt: new Date(personalidade.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(personalidade.updatedAt).toLocaleString('pt-BR'),
      }));

      return exits.success({
        message: 'Personalidades listadas com sucesso!',
        personalidades: personalidadesFormatadas,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao listar as personalidades.',
        detalhes: err.message,
      });
    }
  },

};
