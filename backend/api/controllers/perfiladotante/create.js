module.exports = {
  friendlyName: 'Criar perfil adotante',
  description: 'Permite o cadastro do perfil de triagem do usuário',

  inputs: {
    userId: { type: 'number', required: true },
    dataNascimento: { type: 'string' },
    enderecoRua: { type: 'string' },
    enderecoBairro: { type: 'string' },
    enderecoCidade: { type: 'string' },
    enderecoEstado: { type: 'string' },
    enderecoCep: { type: 'string' },
    tipoMoradia: { type: 'string', isIn: ['casa', 'apartamento'] },
    moradiaPropria: { type: 'boolean' },
    contratoPermiteAnimais: { type: 'boolean' },
    temTelasProtecao: { type: 'boolean' },
    temOutrosAnimais: { type: 'boolean' },
    animaisVacinadosCastrados: { type: 'boolean' },
    comportamentoOutrosAnimais: { type: 'string' },
    motivoAdocao: { type: 'string' },
    finalidadeAdocao: { type: 'string', isIn: ['companhia', 'terapia', 'presente', 'outro'] },
  },

  exits: {
    success: {
      description: 'Perfil cadastrado com sucesso!',
    },
    notFound: {
      description: 'Usuário não encontrado.',
      responseType: 'notFound',
    },
    badRequest: {
      description: 'Perfil já cadastrado para este usuário.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao cadastrar perfil.',
    },
  },

  fn: async function (inputs, exits) {
    const { userId, ...dadosPerfil } = inputs;

    try {

      const usuario = await Usuario.findOne({ id: userId });
      if (!usuario) {
        return this.res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      const perfilExistente = await PerfilAdotante.findOne({ usuario: userId  });
      if (perfilExistente) {
        return exits.badRequest({ erro: 'Este usuário já possui um perfil cadastrado.' });
      }

      const novoPerfil = await PerfilAdotante.create({
        usuario: userId,
        ...dadosPerfil,
      }).fetch();

      const perfilFormatado = {
        ...novoPerfil,
        createdAt: new Date(novoPerfil.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(novoPerfil.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Perfil cadastrado com sucesso!',
        perfil: perfilFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao cadastrar o perfil.',
        detalhes: err.message,
      });
    }
  },

};
