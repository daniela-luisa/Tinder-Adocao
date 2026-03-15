module.exports = {
  tableName: 'empresa',

  attributes: {

    nome: {
      type: 'string',
      required: true,
      maxLength: 100,
    },

    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
    },

    senhaHash: {
      type: 'string',
      required: true,
    },

    whatsapp: {
      type: 'string',
      maxLength: 20,
    },

  },

};
