module.exports = {
  friendlyName: 'Listar deficiências',
  description: 'Retorna todas as deficiências cadastradas',

  inputs: {},

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
    try {

      const deficiencias = await Deficiencia.find();

      if (!deficiencias || deficiencias.length === 0) {
        return exits.notFound({ erro: 'Nenhuma deficiência encontrada.' });
      }

      const deficienciasFormatadas = deficiencias.map(deficiencia => ({
        ...deficiencia,
        createdAt: new Date(deficiencia.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(deficiencia.updatedAt).toLocaleString('pt-BR'),
      }));

      return exits.success({
        message: 'Deficiências listadas com sucesso!',
        deficiencias: deficienciasFormatadas,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao listar as deficiências.',
        detalhes: err.message,
      });
    }
  },

};
