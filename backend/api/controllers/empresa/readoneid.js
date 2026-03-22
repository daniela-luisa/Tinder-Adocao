module.exports = {
  friendlyName: 'Buscar empresa',
  description: 'Busca a empresa pelo id',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Empresa encontrada com sucesso!',
    },
    notFound: {
      description: 'Empresa não encontrada.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao buscar empresa.',
    },
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;

    try {

      const empresa = await Empresa.findOne({ id });
      if (!empresa) {
        return this.res.status(404).json({ erro: 'Empresa não encontrada' });
      }

      const empresaFormatada = {
        ...empresa,
        createdAt: new Date(empresa.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(empresa.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Empresa encontrada com sucesso!',
        empresa: empresaFormatada,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao buscar a empresa.',
        detalhes: err.message,
      });
    }
  },

};
