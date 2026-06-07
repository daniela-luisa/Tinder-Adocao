module.exports = {
  friendlyName: 'Listar likes do usuário',
  description: 'Retorna todos os likes de um usuário com dados do gato e status do match',

  inputs: {
    usuarioId: { type: 'number', required: true },
  },

  exits: {
    success: { description: 'Likes listados com sucesso!' },
    error: { description: 'Erro ao listar likes.' },
  },

  fn: async function (inputs, exits) {
    try {
      const likes = await LikeUsuario.find({ usuario: inputs.usuarioId });

      if (!likes || likes.length === 0) {
        return exits.success({ message: 'Nenhum like encontrado.', likes: [], gatoIds: [] });
      }

      const gatos    = await Gato.find();
      const todasFotos = await FotoGato.find();
      const matches  = await Match.find();

      const likesFormatados = likes.map((like) => {
        const gato = gatos.find((g) => g.id === like.gato) || null;
        if (!gato) { return null; }

        const fotos = todasFotos.filter((f) => f.gato === gato.id);
        const fotoPrincipal = fotos.find((f) => f.principal) || fotos[0] || null;
        const match = matches.find((m) => m.like === like.id) || null;

        return {
          likeId: like.id,
          gato: {
            id:          gato.id,
            nome:        gato.nome,
            raca:        gato.raca,
            status:      gato.status,
            fotoPrincipal: fotoPrincipal ? fotoPrincipal.url : null,
          },
          match: match ? {
            id:         match.id,
            status:     match.status,
            comentario: match.comentario,
          } : null,
          createdAt: new Date(like.createdAt).toLocaleString('pt-BR'),
        };
      }).filter(Boolean);

      // gatoIds excluindo rejeitados — usado pelo useHomeGatos pra filtrar a home
      const gatoIdsPendentesOuAprovados = likesFormatados
        .filter((l) => !l.match || l.match.status === 'aprovado')
        .map((l) => l.gato.id);

      return exits.success({
        message: 'Likes listados com sucesso!',
        likes: likesFormatados,
        gatoIds: gatoIdsPendentesOuAprovados,
      });
    } catch (err) {
      return exits.error({ erro: 'Erro ao listar likes.', detalhes: err.message });
    }
  },
};
