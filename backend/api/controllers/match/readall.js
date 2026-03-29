module.exports = {
  friendlyName: 'Listar matches do usuário',
  description: 'Retorna todos os matches de um usuário específico',

  inputs: {
    userId: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Matches listados com sucesso!',
    },
    notFound: {
      description: 'Nenhum match encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao listar matches.',
    },
  },

  fn: async function (inputs, exits) {
    const { userId } = inputs;

    try {

      const usuario = await Usuario.findOne({ id: userId });
      if (!usuario) {
        return this.res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      const matches = await Match.find({ usuario: userId }).populate('like');

      if (!matches || matches.length === 0) {
        return this.res.status(404).json({ erro: 'Nenhum match encontrado para este usuário.' });
      }

      const matchesFormatados = matches.map(match => ({
        ...match,
        createdAt: new Date(match.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(match.updatedAt).toLocaleString('pt-BR'),
      }));

      return exits.success({
        message: 'Matches listados com sucesso!',
        matches: matchesFormatados,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao listar os matches.',
        detalhes: err.message,
      });
    }
  },
};
