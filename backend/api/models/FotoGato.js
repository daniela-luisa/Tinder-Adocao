module.exports = {
  tableName: 'foto_gato',

  attributes: {

    gato: {
      model: 'gato',
      required: true,
    },

    url: {
      type: 'string',
      required: true,
      maxLength: 255,
    },

    principal: {
      type: 'boolean',
      defaultsTo: false,
    },

  },

};
