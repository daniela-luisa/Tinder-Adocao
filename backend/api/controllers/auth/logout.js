module.exports = {
  friendlyName: 'Logout usuário',
  description: 'Encerra a sessão do usuário removendo o cookie de autenticação',

  exits: {
    success: {
      description: 'Logout realizado com sucesso!',
    },
  },

  fn: async function (inputs, exits) {
    this.res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return exits.success({ message: 'Logout realizado com sucesso!' });
  },

};
