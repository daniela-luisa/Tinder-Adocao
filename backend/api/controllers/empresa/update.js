module.exports = {
  friendlyName: 'Atualizar empresa',
  description: 'Atualiza os dados da empresa',

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
    whatsapp: {
      type: 'string',
    },
  },

  exits: {
    success: {
      description: 'Empresa atualizada com sucesso!',
    },
    notFound: {
      description: 'Empresa não encontrada.',
      responseType: 'notFound',
    },
    emailJaCadastrado: {
      description: 'E-mail já cadastrado no sistema.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao atualizar empresa.',
    },
  },

  fn: async function (inputs, exits) {
    const { id, nome, email, whatsapp } = inputs;

    try {

      const empresa = await Empresa.findOne({ id });
      if (!empresa) {
        return this.res.status(404).json({ erro: 'Empresa não encontrada' });
      }

      if (email && email !== empresa.email) {
        const emailExistente = await Empresa.findOne({ email });
        if (emailExistente) {
          return exits.emailJaCadastrado({ erro: 'E-mail já cadastrado no sistema.' });
        }
      }

      const empresaAtualizada = await Empresa.updateOne({ id }).set({
        nome: nome || empresa.nome,
        email: email || empresa.email,
        whatsapp: whatsapp || empresa.whatsapp,
      });

      const empresaFormatada = {
        ...empresaAtualizada,
        createdAt: new Date(empresaAtualizada.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(empresaAtualizada.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Empresa atualizada com sucesso!',
        empresa: empresaFormatada,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao atualizar a empresa.',
        detalhes: err.message,
      });
    }
  },

};
