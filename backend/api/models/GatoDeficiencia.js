module.exports = {
  tableName: 'gato_deficiencia',

  attributes: {

    gato: {
      model: 'gato',
      required: true,
    },

    deficiencia: {
      model: 'deficiencia',
      required: true,
    },

  },

};
