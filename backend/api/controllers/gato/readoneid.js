module.exports = {
  friendlyName: 'Buscar gato',
  description: 'Busca um gato pelo id com fotos e personalidades',

  inputs: {
    id: { type: 'number', required: true },
  },

  exits: {
    success: { description: 'Gato encontrado com sucesso!' },
    notFound: { description: 'Gato não encontrado.', responseType: 'notFound' },
    error: { description: 'Erro ao buscar gato.' },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;
    try {
      const gato = await Gato.findOne({ id });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      const fotos = await FotoGato.find({ gato: id });
      const gatoPersonalidades = await GatoPersonalidade.find({ gato: id }).populate('personalidade');
      const gatoDeficiencias = await GatoDeficiencia.find({ gato: id }).populate('deficiencia');

      return exits.success({
        message: 'Gato encontrado com sucesso!',
        gato: {
          ...gato,
          fotos: fotos.map((f) => ({ id: f.id, url: f.url, principal: f.principal })),
          personalidades: gatoPersonalidades.map((gp) => gp.personalidade.nome),
          deficiencias: gatoDeficiencias.map((gd) => gd.deficiencia.nome),
          createdAt: new Date(gato.createdAt).toLocaleString('pt-BR'),
          updatedAt: new Date(gato.updatedAt).toLocaleString('pt-BR'),
        },
      });
    } catch (err) {
      return exits.error({ erro: 'Ocorreu um erro ao buscar o gato.', detalhes: err.message });
    }
  },
};
