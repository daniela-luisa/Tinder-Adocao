module.exports = {
  friendlyName: 'Buscar perfil adotante',
  description: 'Busca o perfil de triagem de um usuário específico',

  inputs: {
    userId: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Perfil encontrado com sucesso!',
    },
    notFound: {
      description: 'Perfil não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao buscar perfil.',
    },
  },

  fn: async function (inputs, exits) {
    const { userId } = inputs;

    try {

      const usuario = await Usuario.findOne({ id: userId });
      if (!usuario) {
        return this.res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      const perfil = await PerfilAdotante.findOne({ usuario: userId }).populate('usuario');
      if (!perfil) {
        return exits.notFound({ erro: 'Este usuário ainda não possui perfil cadastrado.' });
      }

      const perfilFormatado = {
        ...perfil,
        createdAt: new Date(perfil.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(perfil.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Perfil encontrado com sucesso!',
        perfil: perfilFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao buscar o perfil.',
        detalhes: err.message,
      });
    }
  },

};
