module.exports = {
  friendlyName: 'Vincular deficiência ao gato',
  description: 'Adiciona uma deficiência a um gato',

  inputs: {
    gatoId: { type: 'number', required: true },
    deficienciaId: { type: 'number', required: true },
  },

  exits: {
    success: {
      description: 'Deficiência vinculada com sucesso!',
    },
    notFound: {
      description: 'Gato ou deficiência não encontrado.',
      responseType: 'notFound',
    },
    badRequest: {
      description: 'Deficiência já vinculada a este gato.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao vincular deficiência.',
    },
  },

  fn: async function (inputs, exits) {
    const { gatoId, deficienciaId } = inputs;

    try {

      const gato = await Gato.findOne({ id: gatoId });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      const deficiencia = await Deficiencia.findOne({ id: deficienciaId });
      if (!deficiencia) {
        return this.res.status(404).json({ erro: 'Deficiência não encontrada' });
      }

      const vinculoExistente = await GatoDeficiencia.findOne({ gato: gatoId, deficiencia: deficienciaId });
      if (vinculoExistente) {
        return exits.badRequest({ erro: 'Esta deficiência já está vinculada a este gato.' });
      }

      const novoVinculo = await GatoDeficiencia.create({
        gato: gatoId,
        deficiencia: deficienciaId,
      }).fetch();

      const vinculoFormatado = {
        ...novoVinculo,
        createdAt: new Date(novoVinculo.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(novoVinculo.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Deficiência vinculada com sucesso!',
        vinculo: vinculoFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao vincular a deficiência.',
        detalhes: err.message,
      });
    }
  },

};
