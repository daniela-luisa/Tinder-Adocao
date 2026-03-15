module.exports = {
  tableName: 'perfil_adotante',

  attributes: {

    usuario: {
      model: 'usuario',
      required: true,
      unique: true,
    },

    dataNascimento: {
      type: 'ref',
      columnType: 'date',
    },

    enderecoRua: {
      type: 'string',
      maxLength: 200,
      allowNull: true,
    },

    enderecoCidade: {
      type: 'string',
      maxLength: 100,
      allowNull: true,
    },

    enderecoEstado: {
      type: 'string',
      maxLength: 2,
      allowNull: true,
    },

    enderecoCep: {
      type: 'string',
      maxLength: 9,
      allowNull: true,
    },

    tipoMoradia: {
      type: 'string',
      isIn: ['casa', 'apartamento'],
      allowNull: true,
    },

    moradiaPropria: {
      type: 'boolean',
      allowNull: true,
    },

    contratoPermiteAnimais: {
      type: 'boolean',
      allowNull: true,
    },

    temTelasProtecao: {
      type: 'boolean',
      allowNull: true,
    },

    temOutrosAnimais: {
      type: 'boolean',
      allowNull: true,
    },

    animaisVacinadosCastrados: {
      type: 'boolean',
      allowNull: true,
    },

    comportamentoOutrosAnimais: {
      type: 'string',
      allowNull: true,
    },

    motivoAdocao: {
      type: 'string',
      allowNull: true,
    },

    finalidadeAdocao: {
      type: 'string',
      isIn: ['companhia', 'terapia', 'presente', 'outro'],
      allowNull: true,
    },

  },

};
