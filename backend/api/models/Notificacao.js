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

    mensagem: {
      type: 'string',
      allowNull: true,
    },

    lida: {
      type: 'boolean',
      defaultsTo: false,
    },

  },

};
