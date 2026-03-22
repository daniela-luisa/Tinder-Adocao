module.exports = {
  tableName: 'deficiencia',

  attributes: {

    nome: {
      type: 'string',
      required: true,
      maxLength: 80,
      unique: true,
    },

  },

};
