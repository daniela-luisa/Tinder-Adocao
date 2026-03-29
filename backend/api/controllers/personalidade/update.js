module.exports = {
  friendlyName: 'Atualizar personalidade',
  description: 'Atualiza o nome de uma personalidade',

  inputs: {
    id: { type: 'number', required: true },
    nome: { type: 'string', required: true },
  },

  exits: {
    success: {
      description: 'Personalidade atualizada com sucesso!',
    },
    notFound: {
      description: 'Personalidade não encontrada.',
      responseType: 'notFound',
    },
    badRequest: {
      description: 'Personalidade já cadastrada.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao atualizar personalidade.',
    },
  },

  fn: async function (inputs, exits) {
    const { id, nome } = inputs;

    try {

      const personalidade = await Personalidade.findOne({ id });
      if (!personalidade) {
        return this.res.status(404).json({ erro: 'Personalidade não encontrada' });
      }

      const personalidadeExistente = await Personalidade.findOne({ nome });
      if (personalidadeExistente) {
        return exits.badRequest({ erro: 'Já existe uma personalidade com esse nome.' });
      }

      const personalidadeAtualizada = await Personalidade.updateOne({ id }).set({ nome });

      const personalidadeFormatada = {
        ...personalidadeAtualizada,
        createdAt: new Date(personalidadeAtualizada.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(personalidadeAtualizada.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Personalidade atualizada com sucesso!',
        personalidade: personalidadeFormatada,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao atualizar a personalidade.',
        detalhes: err.message,
      });
    }
  },

};
