module.exports = {
  tableName: 'personalidade',

  attributes: {

    nome: {
      type: 'string',
      required: true,
      maxLength: 80,
      unique: true,
    },

  },

};
