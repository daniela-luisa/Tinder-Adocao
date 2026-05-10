module.exports = {
  friendlyName: 'Listar likes do usuário',
  description: 'Retorna todos os likes de um usuário com dados do gato',

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

      const gatoIds = likes.map((l) => l.gato);
      const gatos = await Gato.find({ id: gatoIds });
      const todasFotos = await FotoGato.find({ gato: gatoIds });

      const likesFormatados = likes.map((like) => {
        const gato = gatos.find((g) => g.id === like.gato) || null;
        if (!gato){
          return null;
        }
        const fotos = todasFotos.filter((f) => f.gato === gato.id);
        const fotoPrincipal = fotos.find((f) => f.principal) || fotos[0] || null;

        return {
          likeId: like.id,
          gato: {
            ...gato,
            fotoPrincipal: fotoPrincipal ? fotoPrincipal.url : null,
          },
          createdAt: new Date(like.createdAt).toLocaleString('pt-BR'),
        };
      }).filter(Boolean);

      return exits.success({
        message: 'Likes listados com sucesso!',
        likes: likesFormatados,
        gatoIds,
      });
    } catch (err) {
      return exits.error({ erro: 'Erro ao listar likes.', detalhes: err.message });
    }
  },
};
