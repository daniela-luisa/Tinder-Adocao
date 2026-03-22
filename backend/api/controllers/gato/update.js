module.exports = {
  friendlyName: 'Atualizar gato',
  description: 'Atualiza os dados de um gato',

  inputs: {
    id: { type: 'number', required: true },
    nome: { type: 'string' },
    idadeMeses: { type: 'number' },
    sexo: { type: 'string', isIn: ['M', 'F'] },
    raca: { type: 'string' },
    descricao: { type: 'string' },
    status: { type: 'string', isIn: ['disponivel', 'em_processo', 'adotado'] },
    vacinado: { type: 'boolean' },
    castrado: { type: 'boolean' },
    vermifugado: { type: 'boolean' },
    deficiente: { type: 'boolean' },
  },

  exits: {
    success: {
      description: 'Gato atualizado com sucesso!',
    },
    notFound: {
      description: 'Gato não encontrado.',
      responseType: 'notFound',
    },
    error: {
      description: 'Erro ao atualizar gato.',
    },
  },

  fn: async function (inputs, exits) {
    const { id, nome, idadeMeses, sexo, raca, descricao, status, vacinado, castrado, vermifugado, deficiente } = inputs;

    try {

      const gato = await Gato.findOne({ id });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      const gatoAtualizado = await Gato.updateOne({ id }).set({
        nome: nome || gato.nome,
        idadeMeses: idadeMeses !== undefined ? idadeMeses : gato.idadeMeses,
        sexo: sexo || gato.sexo,
        raca: raca || gato.raca,
        descricao: descricao || gato.descricao,
        status: status || gato.status,
        vacinado: vacinado !== undefined ? vacinado : gato.vacinado,
        castrado: castrado !== undefined ? castrado : gato.castrado,
        vermifugado: vermifugado !== undefined ? vermifugado : gato.vermifugado,
        deficiente: deficiente !== undefined ? deficiente : gato.deficiente,
      });

      const gatoFormatado = {
        ...gatoAtualizado,
        createdAt: new Date(gatoAtualizado.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(gatoAtualizado.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Gato atualizado com sucesso!',
        gato: gatoFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao atualizar o gato.',
        detalhes: err.message,
      });
    }
  },

};
