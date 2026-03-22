module.exports = {
  tableName: 'gato_personalidade',

  attributes: {

    gato: {
      model: 'gato',
      required: true,
    },

    personalidade: {
      model: 'personalidade',
      required: true,
    },

  },

};
