module.exports = {
  friendlyName: 'Criar like',
  description: 'Registra o like de um usuário em um gato',

  inputs: {
    usuarioId: { type: 'number', required: true },
    gatoId:    { type: 'number', required: true },
  },

  exits: {
    success:    { description: 'Like registrado com sucesso!' },
    notFound:   { description: 'Usuário ou gato não encontrado.', responseType: 'notFound' },
    badRequest: { description: 'Operação não permitida.',         responseType: 'badRequest' },
    error:      { description: 'Erro ao registrar like.' },
  },

  fn: async function (inputs, exits) {
    const { usuarioId, gatoId } = inputs;

    try {
      const usuario = await Usuario.findOne({ id: usuarioId });
      if (!usuario) {
        return this.res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      const gato = await Gato.findOne({ id: gatoId });
      if (!gato) {
        return this.res.status(404).json({ erro: 'Gato não encontrado' });
      }

      if (gato.status !== 'disponivel') {
        return exits.badRequest({ erro: 'Este gato não está disponível para adoção.' });
      }

      const likeExistente = await LikeUsuario.findOne({ usuario: usuarioId, gato: gatoId });

      if (likeExistente) {
        // Verifica se o match foi rejeitado — se sim, permite curtir de novo
        const matchExistente = await Match.findOne({ like: likeExistente.id });
        const foiRejeitado = matchExistente && matchExistente.status === 'recusado';

        if (!foiRejeitado) {
          return exits.badRequest({ erro: 'Você já deu like neste gato.' });
        }
        // Se rejeitado, cai aqui e cria um novo like mantendo o histórico
      }

      const novoLike = await LikeUsuario.create({
        usuario: usuarioId,
        gato:    gatoId,
      }).fetch();

      const likeFormatado = {
        ...novoLike,
        createdAt: new Date(novoLike.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(novoLike.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Like registrado com sucesso!',
        like: likeFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao registrar o like.',
        detalhes: err.message,
      });
    }
  },
};
