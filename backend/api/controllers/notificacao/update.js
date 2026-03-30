module.exports = {
  friendlyName: 'Marcar notificação como lida',
  description: 'Atualiza o status de leitura de uma notificação',

  inputs: {
    id: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Notificação marcada como lida com sucesso!',
    },
    notFound: {
      description: 'Notificação não encontrada.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao atualizar notificação.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const notificacao = await Notificacao.findOne({ id });
      if (!notificacao) {
        return this.res.status(404).json({ erro: 'Notificação não encontrada' });
      }

      const notificacaoAtualizada = await Notificacao.updateOne({ id }).set({ lida: true });

      const notificacaoFormatada = {
        ...notificacaoAtualizada,
        createdAt: new Date(notificacaoAtualizada.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(notificacaoAtualizada.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Notificação marcada como lida!',
        notificacao: notificacaoFormatada,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao atualizar a notificação.',
        detalhes: err.message,
      });
    }
  },

};
