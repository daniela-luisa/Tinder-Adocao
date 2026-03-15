module.exports = {
  tableName: 'notificacao',

  attributes: {

    usuario: {
      model: 'usuario',
      required: true,
    },

    match: {
      model: 'match',
      required: true,
    },

    lida: {
      type: 'boolean',
      defaultsTo: false,
    },

  },

};
