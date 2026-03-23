module.exports = {
  friendlyName: 'Criar foto gato',
  description: 'Adiciona uma foto a um gato',

  inputs: {
    gatoId: { type: 'number', required: true },
    url: { type: 'string', required: true },
    principal: { type: 'boolean' },
  },

  exits: {
    success: {
      description: 'Foto cadastrada com sucesso!',
    },
    notFound: {
      description: 'Gato não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao cadastrar foto.',
    },
  },

  fn: async function (inputs, exits) {
    const { gatoId, url, principal } = inputs;

    try {

      const gato = await Gato.findOne({ id: gatoId });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      const fotosExistentes = await FotoGato.find({ gato: gatoId });
      const ehPrimeira = fotosExistentes.length === 0;

      if (principal || ehPrimeira) {
        await FotoGato.update({ gato: gatoId }).set({ principal: false });
      }

      const novaFoto = await FotoGato.create({
        gato: gatoId,
        url,
        principal: principal || ehPrimeira,
      }).fetch();

      const fotoFormatada = {
        ...novaFoto,
        createdAt: new Date(novaFoto.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(novaFoto.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Foto cadastrada com sucesso!',
        foto: fotoFormatada,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao cadastrar a foto.',
        detalhes: err.message,
      });
    }
  },

};
