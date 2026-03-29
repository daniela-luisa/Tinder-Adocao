module.exports = {
  friendlyName: 'Criar personalidade',
  description: 'Permite o cadastro de uma nova personalidade',

  inputs: {
    nome: { type: 'string', required: true },
  },

  exits: {
    success: {
      description: 'Personalidade cadastrada com sucesso!',
    },
    badRequest: {
      description: 'Personalidade já cadastrada.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao cadastrar personalidade.',
    },
  },

  fn: async function (inputs, exits) {
    const { nome } = inputs;

    try {

      const personalidadeExistente = await Personalidade.findOne({ nome });
      if (personalidadeExistente) {
        return exits.badRequest({ erro: 'Personalidade já cadastrada no sistema.' });
      }

      const novaPersonalidade = await Personalidade.create({ nome }).fetch();

      const personalidadeFormatada = {
        ...novaPersonalidade,
        createdAt: new Date(novaPersonalidade.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(novaPersonalidade.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Personalidade cadastrada com sucesso!',
        personalidade: personalidadeFormatada,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao cadastrar a personalidade.',
        detalhes: err.message,
      });
    }
  },

};
