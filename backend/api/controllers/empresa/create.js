module.exports = {
  friendlyName: 'Criar empresa',
  description: 'Permite o cadastro de uma empresa',

  inputs: {
    nome: { type: 'string', required: true },
    email: { type: 'string', required: true, isEmail: true },
    senha: { type: 'string', required: true, minLength: 6 },
    whatsapp: { type: 'string' },
  },

  exits: {
    success: {
      description: 'Empresa cadastrada com sucesso!',
    },
    emailJaCadastrado: {
      description: 'E-mail já cadastrado no sistema.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao cadastrar empresa.',
    },
  },

  fn: async function (inputs, exits) {
    const { nome, email, senha, whatsapp } = inputs;

    try {

      const empresaExistente = await Empresa.findOne({ email });
      if (empresaExistente) {
        return exits.emailJaCadastrado({ erro: 'E-mail já cadastrado no sistema.' });
      }

      const novaEmpresa = await Empresa.create({
        nome,
        email,
        senhaHash: senha,
        whatsapp,
      }).fetch();

      const dataFormatada = {
        ...novaEmpresa,
        createdAt: new Date(novaEmpresa.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(novaEmpresa.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Empresa cadastrada com sucesso!',
        empresa: dataFormatada,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao cadastrar a empresa.',
        detalhes: err.message,
      });
    }
  },

};
