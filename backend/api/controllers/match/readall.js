module.exports = {
  friendlyName: 'Listar matches do usuário',
  description: 'Retorna todos os matches de um usuário com dados do gato',

  inputs: {
    userId: { type: 'number', required: true },
  },

  exits: {
    success: { description: 'Matches listados com sucesso!' },
    error:   { description: 'Erro ao listar matches.' },
  },

  fn: async function (inputs, exits) {
    try {
      const todosMatches = await Match.find();
      const todosLikes   = await LikeUsuario.find();
      const todosGatos   = await Gato.find();
      const todasFotos   = await FotoGato.find();
      const empresas     = await Empresa.find();

      // Filtra likes do usuário
      const likesDoUsuario = todosLikes.filter((l) => l.usuario === inputs.userId);
      const likeIdsDoUsuario = likesDoUsuario.map((l) => l.id);

      // Filtra matches dos likes do usuário
      const matchesDoUsuario = todosMatches.filter((m) => likeIdsDoUsuario.includes(m.like));

      if (!matchesDoUsuario.length) {
        return exits.success({ message: 'Nenhum match encontrado.', matches: [] });
      }

      const empresa = empresas[0] || null;

      const matchesFormatados = matchesDoUsuario.map((match) => {
        const like = likesDoUsuario.find((l) => l.id === match.like) || null;
        if (!like) { return null; }

        const gato = todosGatos.find((g) => g.id === like.gato) || null;
        if (!gato) { return null; }

        const fotos = todasFotos.filter((f) => f.gato === gato.id);
        const fotoPrincipal = fotos.find((f) => f.principal) || fotos[0] || null;

        return {
          matchId:    match.id,
          status:     match.status,
          comentario: match.comentario || null,
          gato: {
            id:           gato.id,
            nome:         gato.nome,
            raca:         gato.raca,
            idadeMeses:   gato.idadeMeses,
            fotoPrincipal: fotoPrincipal ? fotoPrincipal.url : null,
          },
          empresa: empresa ? { nome: empresa.nome, whatsapp: empresa.whatsapp || null } : null,
          createdAt: new Date(match.createdAt).toLocaleString('pt-BR'),
        };
      }).filter(Boolean);

      // Ordena do mais recente pro mais antigo
      matchesFormatados.sort((a, b) => b.matchId - a.matchId);

      return exits.success({
        message: 'Matches listados com sucesso!',
        matches: matchesFormatados,
      });

    } catch (err) {
      return exits.error({ erro: 'Erro ao listar matches.', detalhes: err.message });
    }
  },
};
