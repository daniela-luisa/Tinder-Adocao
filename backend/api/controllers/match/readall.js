module.exports = {
  friendlyName: 'Listar matches do usuário',
  description: 'Retorna todos os matches de um usuário com dados do gato',

  inputs: {
    userId: { type: 'number', required: true },
  },

  exits: {
    success: { description: 'Matches listados com sucesso!' },
    error: { description: 'Erro ao listar matches.' },
  },

  fn: async function (inputs, exits) {
    try {
      const matches = await Match.find({ usuario: inputs.userId });

      if (!matches || matches.length === 0) {
        return exits.success({ message: 'Nenhum match encontrado.', matches: [] });
      }

      // Busca os likes relacionados
      const likeIds = matches.map((m) => m.like);
      const likes = await LikeUsuario.find({ id: likeIds });

      // Busca os gatos
      const gatoIds = likes.map((l) => l.gato);
      const gatos = await Gato.find({ id: gatoIds });
      const todasFotos = await FotoGato.find({ gato: gatoIds });

      // Busca empresa pra pegar whatsapp
      const empresas = await Empresa.find();

      const matchesFormatados = matches.map((match) => {
        const like = likes.find((l) => l.id === match.like) || null;
        if (!like) {
          return null;
        }

        const gato = gatos.find((g) => g.id === like.gato) || null;
        if (!gato) {
          return null;
        }

        const fotos = todasFotos.filter((f) => f.gato === gato.id);
        const fotoPrincipal = fotos.find((f) => f.principal) || fotos[0] || null;

        // Pega o primeiro whatsapp disponível (sistema tem uma empresa só)
        const empresa = empresas[0] || null;

        return {
          matchId: match.id,
          status: match.status,
          comentario: match.comentario || null,
          gato: {
            id: gato.id,
            nome: gato.nome,
            raca: gato.raca,
            idadeMeses: gato.idadeMeses,
            fotoPrincipal: fotoPrincipal ? fotoPrincipal.url : null,
          },
          empresa: empresa ? { nome: empresa.nome, whatsapp: empresa.whatsapp || null } : null,
          createdAt: new Date(match.createdAt).toLocaleString('pt-BR'),
        };
      }).filter(Boolean);

      return exits.success({
        message: 'Matches listados com sucesso!',
        matches: matchesFormatados,
      });

    } catch (err) {
      return exits.error({ erro: 'Erro ao listar matches.', detalhes: err.message });
    }
  },
};
