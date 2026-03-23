module.exports = {
  friendlyName: 'Listar fotos do gato',
  description: 'Retorna todas as fotos de um gato específico',

  inputs: {
    gatoId: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Fotos listadas com sucesso!',
    },
    notFound: {
      description: 'Nenhuma foto encontrada.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao listar fotos.',
    },
  },

  fn: async function (inputs, exits) {
    const { gatoId } = inputs;

    try {

      const gato = await Gato.findOne({ id: gatoId });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      const fotos = await FotoGato.find({ gato: gatoId });

      if (!fotos || fotos.length === 0) {
        return this.res.status(404).json({ erro: 'Nenhuma foto encontrada para este gato.' });
      }

      const fotosFormatadas = fotos.map(foto => ({
        ...foto,
        createdAt: new Date(foto.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(foto.updatedAt).toLocaleString('pt-BR'),
      }));

      return exits.success({
        message: 'Fotos listadas com sucesso!',
        fotos: fotosFormatadas,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao listar as fotos.',
        detalhes: err.message,
      });
    }
  },

};
