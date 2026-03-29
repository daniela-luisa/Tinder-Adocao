module.exports = {
  friendlyName: 'Criar deficiência',
  description: 'Permite o cadastro de uma nova deficiência',

  inputs: {
    nome: { type: 'string', required: true },
  },

  exits: {
    success: {
      description: 'Deficiência cadastrada com sucesso!',
    },
    badRequest: {
      description: 'Deficiência já cadastrada.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao cadastrar deficiência.',
    },
  },

  fn: async function (inputs, exits) {
    const { nome } = inputs;

    try {

      const deficienciaExistente = await Deficiencia.findOne({ nome });
      if (deficienciaExistente) {
        return exits.badRequest({ erro: 'Deficiência já cadastrada no sistema.' });
      }

      const novaDeficiencia = await Deficiencia.create({ nome }).fetch();

      const deficienciaFormatada = {
        ...novaDeficiencia,
        createdAt: new Date(novaDeficiencia.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(novaDeficiencia.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Deficiência cadastrada com sucesso!',
        deficiencia: deficienciaFormatada,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao cadastrar a deficiência.',
        detalhes: err.message,
      });
    }
  },

};
