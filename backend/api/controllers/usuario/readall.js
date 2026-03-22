module.exports = {
  friendlyName: 'Listar usuários',
  description: 'Retorna todos os usuários cadastrados',

  inputs: {},

  exits: {
    success: {
      description: 'Lista retornada com sucesso!',
    },
    error: {
      description: 'Erro ao listar usuários.',
    },
  },

  fn: async function (inputs, exits) {
    try {

      const usuarios = await Usuario.find();

      const usuariosFormatados = usuarios.map(usuario => ({
        ...usuario,
        createdAt: new Date(usuario.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(usuario.updatedAt).toLocaleString('pt-BR'),
      }));

      return exits.success({
        message: 'Usuários listados com sucesso!',
        usuarios: usuariosFormatados,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao listar os usuários.',
        detalhes: err.message,
      });
    }
  },

};
