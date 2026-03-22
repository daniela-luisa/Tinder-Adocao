module.exports = {
  friendlyName: 'Buscar gato',
  description: 'Busca um gato pelo id',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Gato encontrado com sucesso!',
    },
    notFound: {
      description: 'Gato não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao buscar gato.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const gato = await Gato.findOne({ id });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      const gatoFormatado = {
        ...gato,
        createdAt: new Date(gato.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(gato.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Gato encontrado com sucesso!',
        gato: gatoFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao buscar o gato.',
        detalhes: err.message,
      });
    }
  },

};
