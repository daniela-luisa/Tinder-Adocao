module.exports = {
  friendlyName: 'Atualizar deficiência',
  description: 'Atualiza o nome de uma deficiência',

  inputs: {
    id: { type: 'number', required: true },
    nome: { type: 'string', required: true },
  },

  exits: {
    success: {
      description: 'Deficiência atualizada com sucesso!',
    },
    notFound: {
      description: 'Deficiência não encontrada.',
      responseType: 'notFound',
    },
    badRequest: {
      description: 'Deficiência já cadastrada.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao atualizar deficiência.',
    },
  },

  fn: async function (inputs, exits) {
    const { id, nome } = inputs;

    try {

      const deficiencia = await Deficiencia.findOne({ id });
      if (!deficiencia) {
        return this.res.status(404).json({ erro: 'Deficiência não encontrada' });
      }

      const deficienciaExistente = await Deficiencia.findOne({ nome });
      if (deficienciaExistente) {
        return exits.badRequest({ erro: 'Já existe uma deficiência com esse nome.' });
      }

      const deficienciaAtualizada = await Deficiencia.updateOne({ id }).set({ nome });

      const deficienciaFormatada = {
        ...deficienciaAtualizada,
        createdAt: new Date(deficienciaAtualizada.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(deficienciaAtualizada.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Deficiência atualizada com sucesso!',
        deficiencia: deficienciaFormatada,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao atualizar a deficiência.',
        detalhes: err.message,
      });
    }
  },

};
