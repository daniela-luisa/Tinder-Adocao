module.exports = {
  tableName: 'like_usuario',

  attributes: {

    usuario: {
      model: 'usuario',
      required: true,
    },

    gato: {
      model: 'gato',
      required: true,
    },

  },

};
