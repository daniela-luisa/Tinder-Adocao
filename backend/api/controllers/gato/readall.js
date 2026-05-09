module.exports = {
  friendlyName: 'Listar gatos',
  description: 'Retorna todos os gatos cadastrados com foto principal e personalidades',

  inputs: {},

  exits: {
    success: { description: 'Lista retornada com sucesso!' },
    error: { description: 'Erro ao listar gatos.' },
  },

  fn: async function (inputs, exits) {
    try {
      const gatos = await Gato.find();
      const ids = gatos.map((g) => g.id);

      const todasFotos = await FotoGato.find({ gato: ids });

      // Busca personalidades de todos os gatos de uma vez
      const gatoPersonalidades = await GatoPersonalidade.find({ gato: ids }).populate('personalidade');

      const gatosFormatados = gatos.map((gato) => {
        const fotos = todasFotos.filter((f) => f.gato === gato.id);
        const fotoPrincipal = fotos.find((f) => f.principal === true) || fotos[0] || null;

        const personalidades = gatoPersonalidades
          .filter((gp) => gp.gato === gato.id)
          .map((gp) => gp.personalidade.nome);

        return {
          ...gato,
          fotoPrincipal: fotoPrincipal ? fotoPrincipal.url : null,
          personalidades,
          createdAt: new Date(gato.createdAt).toLocaleString('pt-BR'),
          updatedAt: new Date(gato.updatedAt).toLocaleString('pt-BR'),
        };
      });

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
