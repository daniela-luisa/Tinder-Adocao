module.exports = {
  friendlyName: 'Listar notificações do usuário',
  description: 'Retorna todas as notificações de um usuário específico',

  inputs: {
    userId: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Notificações listadas com sucesso!',
    },
    notFound: {
      description: 'Nenhuma notificação encontrada.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao listar notificações.',
    },
  },

  fn: async function (inputs, exits) {
    const { userId } = inputs;

    try {

      const usuario = await Usuario.findOne({ id: userId });
      if (!usuario) {
        return this.res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      const notificacoes = await Notificacao.find({ usuario: userId }).populate('match');

      if (!notificacoes || notificacoes.length === 0) {
        return exits.notFound({ erro: 'Nenhuma notificação encontrada para este usuário.' });
      }

      const notificacoesFormatadas = notificacoes.map(notificacao => ({
        ...notificacao,
        createdAt: new Date(notificacao.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(notificacao.updatedAt).toLocaleString('pt-BR'),
      }));

      return exits.success({
        message: 'Notificações listadas com sucesso!',
        notificacoes: notificacoesFormatadas,
        naoLidas: notificacoesFormatadas.filter(n => !n.lida).length,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao listar as notificações.',
        detalhes: err.message,
      });
    }
  },

};
