module.exports = {
  friendlyName: 'Atualizar perfil adotante',
  description: 'Atualiza o perfil de triagem de um usuário',

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
      description: 'Perfil atualizado com sucesso!',
    },
    notFound: {
      description: 'Perfil não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao atualizar perfil.',
    },
  },

  fn: async function (inputs, exits) {
    const { userId, ...dadosPerfil } = inputs;

    try {

      const perfil = await PerfilAdotante.findOne({ usuario: userId });
      if (!perfil) {
        return exits.notFound({ erro: 'Perfil não encontrado para este usuário.' });
      }

      const perfilAtualizado = await PerfilAdotante.updateOne({ usuario: userId }).set({
        dataNascimento: dadosPerfil.dataNascimento || perfil.dataNascimento,
        enderecoRua: dadosPerfil.enderecoRua || perfil.enderecoRua,
        enderecoBairro: dadosPerfil.enderecoBairro || perfil.enderecoBairro,
        enderecoCidade: dadosPerfil.enderecoCidade || perfil.enderecoCidade,
        enderecoEstado: dadosPerfil.enderecoEstado || perfil.enderecoEstado,
        enderecoCep: dadosPerfil.enderecoCep || perfil.enderecoCep,
        tipoMoradia: dadosPerfil.tipoMoradia || perfil.tipoMoradia,
        moradiaPropria: dadosPerfil.moradiaPropria !== undefined ? dadosPerfil.moradiaPropria : perfil.moradiaPropria,
        contratoPermiteAnimais: dadosPerfil.contratoPermiteAnimais !== undefined ? dadosPerfil.contratoPermiteAnimais : perfil.contratoPermiteAnimais,
        temTelasProtecao: dadosPerfil.temTelasProtecao !== undefined ? dadosPerfil.temTelasProtecao : perfil.temTelasProtecao,
        temOutrosAnimais: dadosPerfil.temOutrosAnimais !== undefined ? dadosPerfil.temOutrosAnimais : perfil.temOutrosAnimais,
        animaisVacinadosCastrados: dadosPerfil.animaisVacinadosCastrados !== undefined ? dadosPerfil.animaisVacinadosCastrados : perfil.animaisVacinadosCastrados,
        comportamentoOutrosAnimais: dadosPerfil.comportamentoOutrosAnimais || perfil.comportamentoOutrosAnimais,
        motivoAdocao: dadosPerfil.motivoAdocao || perfil.motivoAdocao,
        finalidadeAdocao: dadosPerfil.finalidadeAdocao || perfil.finalidadeAdocao,
      });

      const perfilFormatado = {
        ...perfilAtualizado,
        createdAt: new Date(perfilAtualizado.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(perfilAtualizado.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Perfil atualizado com sucesso!',
        perfil: perfilFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao atualizar o perfil.',
        detalhes: err.message,
      });
    }
  },

};
