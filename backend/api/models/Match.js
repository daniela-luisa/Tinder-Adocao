module.exports = {
  tableName: 'match',

  attributes: {

    like: {
      model: 'likeusuario',
      required: true,
    },

    status: {
      type: 'string',
      isIn: ['pendente', 'aprovado', 'recusado'],
      defaultsTo: 'pendente',
    },

    comentario: {
      type: 'string',
      allowNull: true,
    },

  },

};
