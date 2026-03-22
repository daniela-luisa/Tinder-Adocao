module.exports = {
  friendlyName: 'Atualizar usuário',
  description: 'Atualiza os dados de um usuário',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    nome: {
      type: 'string',
    },
    email: {
      type: 'string',
      isEmail: true,
    },
    cpf: {
      type: 'string',
    },
    telefone: {
      type: 'string',
    },
    fotoUrl: {
      type: 'string',
    },
  },

  exits: {
    success: {
      description: 'Usuário atualizado com sucesso!',
    },
    notFound: {
      description: 'Usuário não encontrado.',
      responseType: 'notFound',
    },
    emailJaCadastrado: {
      description: 'E-mail já cadastrado no sistema.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao atualizar usuário.',
    },
  },

  fn: async function (inputs, exits) {
    const { id, nome, email, cpf, telefone, fotoUrl } = inputs;

    try {

      const usuario = await Usuario.findOne({ id });
      if (!usuario) {
        return this.res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      if (email && email !== usuario.email) {
        const emailExistente = await Usuario.findOne({ email });
        if (emailExistente) {
          return exits.emailJaCadastrado({ erro: 'E-mail já cadastrado no sistema.' });
        }
      }

      const usuarioAtualizado = await Usuario.updateOne({ id }).set({
        nome: nome || usuario.nome,
        email: email || usuario.email,
        cpf: cpf || usuario.cpf,
        telefone: telefone || usuario.telefone,
        fotoUrl: fotoUrl || usuario.fotoUrl,
      });

      const usuarioFormatado = {
        ...usuarioAtualizado,
        createdAt: new Date(usuarioAtualizado.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(usuarioAtualizado.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Usuário atualizado com sucesso!',
        usuario: usuarioFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao atualizar o usuário.',
        detalhes: err.message,
      });
    }
  },

};
