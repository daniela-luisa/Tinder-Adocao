module.exports = {
  friendlyName: 'Listar likes do gato',
  description: 'Retorna todos os likes de um gato específico',

  inputs: {
    gatoId: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Likes listados com sucesso!',
    },
    notFound: {
      description: 'Nenhum like encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao listar likes.',
    },
  },

  fn: async function (inputs, exits) {
    const { gatoId } = inputs;

    try {

      const gato = await Gato.findOne({ id: gatoId });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      const likes = await LikeUsuario.find({ gato: gatoId }).populate('usuario');

      if (!likes || likes.length === 0) {
        return this.res.status(404).json({ erro: 'Nenhum like encontrado para este gato.' });
      }

      const likesFormatados = likes.map(like => ({
        ...like,
        createdAt: new Date(like.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(like.updatedAt).toLocaleString('pt-BR'),
      }));

      return exits.success({
        message: 'Likes listados com sucesso!',
        likes: likesFormatados,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao listar os likes.',
        detalhes: err.message,
      });
    }
  },

};
