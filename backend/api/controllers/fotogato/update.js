module.exports = {
  friendlyName: 'Atualizar foto gato',
  description: 'Atualiza os dados de uma foto de um gato',

  inputs: {
    id: { type: 'number', required: true },
    url: { type: 'string' },
    principal: { type: 'boolean' },
  },

  exits: {
    success: {
      description: 'Foto atualizada com sucesso!',
    },
    notFound: {
      description: 'Foto não encontrada.',
      responseType: 'notFound',
    },
    badRequest: {
      description: 'Operação não permitida.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao atualizar foto.',
    },
  },

  fn: async function (inputs, exits) {
    const { id, url, principal } = inputs;

    try {

      const foto = await FotoGato.findOne({ id });
      if (!foto) {
        return this.res.status(404).json({ erro: 'Foto não encontrada' });
      }

      // se era principal e foi desmarcada, promove outra
      if (principal === false && foto.principal) {
        const totalFotos = await FotoGato.count({ gato: foto.gato });
        if (totalFotos === 1) {
          return exits.badRequest({ erro: 'Não é possível desmarcar a única foto do gato.' });
        }
        const outraFoto = await FotoGato.findOne({ gato: foto.gato, id: { '!=': id } });
        if (outraFoto) {
          await FotoGato.updateOne({ id: outraFoto.id }).set({ principal: true });
        }
      }

      if (principal) {
        await FotoGato.update({ gato: foto.gato }).set({ principal: false });
      }

      const fotoAtualizada = await FotoGato.updateOne({ id }).set({
        url: url || foto.url,
        principal: principal !== undefined ? principal : foto.principal,
      });

      const fotoFormatada = {
        ...fotoAtualizada,
        createdAt: new Date(fotoAtualizada.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(fotoAtualizada.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Foto atualizada com sucesso!',
        foto: fotoFormatada,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao atualizar a foto.',
        detalhes: err.message,
      });
    }
  },

};
