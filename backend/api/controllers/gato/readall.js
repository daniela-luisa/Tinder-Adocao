module.exports = {
  friendlyName: 'Listar gatos',
  description: 'Retorna todos os gatos cadastrados',

  inputs: {},

  exits: {
    success: {
      description: 'Lista retornada com sucesso!',
    },
    notFound: {
      description: 'Nenhum gato encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao listar gatos.',
    },
  },

  fn: async function (inputs, exits) {
    try {

      const gatos = await Gato.find();

      if (!gatos || gatos.length === 0) {
        return exits.notFound({ erro: 'Nenhum gato encontrado.' });
      }

      const gatosFormatados = gatos.map(gato => ({
        ...gato,
        createdAt: new Date(gato.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(gato.updatedAt).toLocaleString('pt-BR'),
      }));

      return exits.success({
        message: 'Gatos listados com sucesso!',
        gatos: gatosFormatados,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao listar os gatos.',
        detalhes: err.message,
      });
    }
  },

};
