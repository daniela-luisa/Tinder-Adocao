module.exports = {
  friendlyName: 'Deletar foto gato',
  description: 'Remove uma foto de um gato',

  inputs: {
    id: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Foto deletada com sucesso!',
    },
    notFound: {
      description: 'Foto não encontrada.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao deletar foto.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const foto = await FotoGato.findOne({ id });
      if (!foto) {
        return this.res.status(404).json({ erro: 'Foto não encontrada' });
      }

      await FotoGato.destroyOne({ id });

      if (foto.principal) {
        const outraFoto = await FotoGato.findOne({ gato: foto.gato });
        if (outraFoto) {
          await FotoGato.updateOne({ id: outraFoto.id }).set({ principal: true });
        }
      }

      return exits.success({
        message: 'Foto deletada com sucesso!',
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao deletar a foto.',
        detalhes: err.message,
      });
    }
  },

};
