module.exports = {
  tableName: 'gato',

  attributes: {

    nome: {
      type: 'string',
      required: true,
      maxLength: 80,
    },

    idadeMeses: {
      type: 'number',
      allowNull: true,
    },

    sexo: {
      type: 'string',
      isIn: ['M', 'F'],
      allowNull: true,
    },

    raca: {
      type: 'string',
      maxLength: 80,
      allowNull: true,
    },

    descricao: {
      type: 'string',
      allowNull: true,
    },

    status: {
      type: 'string',
      isIn: ['disponivel', 'em_processo', 'adotado'],
      defaultsTo: 'disponivel',
    },

    vacinado: {
      type: 'boolean',
      defaultsTo: false,
    },

    castrado: {
      type: 'boolean',
      defaultsTo: false,
    },

    vermifugado: {
      type: 'boolean',
      defaultsTo: false,
    },

    deficiente: {
      type: 'boolean',
      defaultsTo: false,
    },

  },

};
