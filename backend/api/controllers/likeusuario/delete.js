module.exports = {
  friendlyName: 'Deletar like',
  description: 'Remove o like de um usuário em um gato',

  inputs: {
    id: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Like removido com sucesso!',
    },
    notFound: {
      description: 'Like não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao remover like.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const like = await LikeUsuario.findOne({ id });
      if (!like) {
        return this.res.status(404).json({ erro: 'Like não encontrado' });
      }

      await LikeUsuario.destroyOne({ id });

      return exits.success({
        message: 'Like removido com sucesso!',
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao remover o like.',
        detalhes: err.message,
      });
    }
  },

};
