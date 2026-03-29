module.exports = {
  friendlyName: 'Buscar match',
  description: 'Busca um match pelo id',

  inputs: {
    id: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Match encontrado com sucesso!',
    },
    notFound: {
      description: 'Match não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao buscar match.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const match = await Match.findOne({ id }).populate('like');
      if (!match) {
        return this.res.status(404).json({ erro: 'Match não encontrado' });
      }

      const matchFormatado = {
        ...match,
        createdAt: new Date(match.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(match.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Match encontrado com sucesso!',
        match: matchFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao buscar o match.',
        detalhes: err.message,
      });
    }
  },

};
