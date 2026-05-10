module.exports = {
  friendlyName: 'Criar match',
  description: 'Cria um match a partir de um like avaliado pela empresa',

  inputs: {
    likeId: { type: 'number', required: true },
    status: { type: 'string', required: true, isIn: ['aprovado', 'recusado'] },
    comentario: { type: 'string' },
  },

  exits: {
    success: {
      description: 'Match criado com sucesso!',
    },
    notFound: {
      description: 'Like não encontrado.',
      responseType: 'notFound',
    },
    badRequest: {
      description: 'Este like já foi avaliado.',
      responseType: 'badRequest',
    },
    error: {
      description: 'Erro ao criar match.',
    },
  },

  fn: async function (inputs, exits) {
    const { likeId, status, comentario } = inputs;

    try {

      const like = await LikeUsuario.findOne({ id: likeId });
      if (!like) {
        return this.res.status(404).json({ erro: 'Like não encontrado' });
      }

      const matchExistente = await Match.findOne({ like: likeId });
      if (matchExistente) {
        return exits.badRequest({ erro: 'Este like já foi avaliado.' });
      }

      const novoMatch = await Match.create({
        like: likeId,
        usuario: like.usuario,
        status,
        comentario,
      }).fetch();

      if (status === 'aprovado') {
        await Gato.updateOne({ id: like.gato }).set({ status: 'em_processo' });
      }

      const gato = await Gato.findOne({ id: like.gato });
      const nomeGato = gato ? gato.nome : 'gatinho';

      const mensagem = status === 'aprovado'
        ? `Você teve um match com ${nomeGato}! 🎉 Entre em contato para adotar.`
        : `Sua solicitação para adotar ${nomeGato} não foi aprovada desta vez. 😿`;

      await Notificacao.create({
        usuario: like.usuario,
        match: novoMatch.id,
        mensagem,
        lida: false,
      }).fetch();

      const matchFormatado = {
        ...novoMatch,
        createdAt: new Date(novoMatch.createdAt).toLocaleString('pt-BR'),
        updatedAt: new Date(novoMatch.updatedAt).toLocaleString('pt-BR'),
      };

      return exits.success({
        message: 'Match criado com sucesso!',
        match: matchFormatado,
      });

    } catch (err) {
      return exits.error({
        erro: 'Ocorreu um erro ao criar o match.',
        detalhes: err.message,
      });
    }
  },

};
