module.exports = {
  tableName: 'usuario',

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

    cpf: {
      type: 'string',
      maxLength: 14,
    },

    telefone: {
      type: 'string',
      maxLength: 20,
    },

    fotoUrl: {
      type: 'string',
      allowNull: true,
    },

  },

};
