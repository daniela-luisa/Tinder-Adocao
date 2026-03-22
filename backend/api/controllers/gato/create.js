module.exports = {
  friendlyName: 'Criar gato',
  description: 'Permite o cadastro de um novo gato',

  inputs: {
    nome: { type: 'string', required: true },
    idadeMeses: { type: 'number' },
    sexo: { type: 'string', isIn: ['M', 'F'] },
    raca: { type: 'string' },
    descricao: { type: 'string' },
    vacinado: { type: 'boolean' },
    castrado: { type: 'boolean' },
    vermifugado: { type: 'boolean' },
    deficiente: { type: 'boolean' },
  },

  exits: {
    success: {
      description: 'Gato cadastrado com sucesso!',
    },
    error: {
      description: 'Erro ao cadastrar gato.',
    },
  },

  fn: async function (inputs, exits) {
    const { nome, idadeMeses, sexo, raca, descricao, vacinado, castrado, vermifugado, deficiente } = inputs;

    try {

      const novoGato = await Gato.create({
        nome,
        idadeMeses,
        sexo,
        raca,
        descricao,
        vacinado,
        castrado,
        vermifugado,
        deficiente,
      }).fetch();

      const gatoFormatado = {
        ...novoGato,
        createdAt: new Date(novoGato.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(novoGato.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Gato cadastrado com sucesso!',
        gato: gatoFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao cadastrar o gato.',
        detalhes: err.message,
      });
    }
  },

};
