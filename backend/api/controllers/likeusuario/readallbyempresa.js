module.exports = {
  friendlyName: 'Listar todos os likes',
  description: 'Retorna todos os likes com dados do usuario, gato e match',

  inputs: {},

  exits: {
    success: { description: 'Likes listados com sucesso!' },
    error: { description: 'Erro ao listar likes.' },
  },

  fn: async function (inputs, exits) {
    try {
      const likes = await LikeUsuario.find().populate('usuario');

      if (!likes || likes.length === 0) {
        return exits.success({ message: 'Nenhum like encontrado.', likes: [] });
      }

      // Busca todos os gatos, fotos, matches e perfis de adotante
      const gatos = await Gato.find();
      const todasFotos = await FotoGato.find();
      const matches = await Match.find();
      const perfis = await PerfilAdotante.find();

      const matchPorLike = {};
      matches.forEach((m) => { matchPorLike[m.like] = m; });

      const likesFormatados = likes.map((like) => {
        const gato = gatos.find((g) => g.id === like.gato);
        const fotos = todasFotos.filter((f) => f.gato === like.gato);
        const fotoPrincipal = fotos.find((f) => f.principal) || fotos[0] || null;
        const match = matchPorLike[like.id] || null;

        return {
          likeId: like.id,
          usuario: (function() {
            var u = like.usuario;
            var usuId = u ? u.id : null; var p = null; for (var pi = 0; pi < perfis.length; pi++) { if (perfis[pi].usuario === usuId) { p = perfis[pi]; break; } }
            return {
              id:               u ? u.id    : null,
              nome:             u ? u.nome  : null,
              email:            u ? u.email : null,
              tipoMoradia:              p ? p.tipoMoradia              : null,
              moradiaPropria:           p ? p.moradiaPropria           : null,
              temOutrosAnimais:         p ? p.temOutrosAnimais         : null,
              temTelasProtecao:         p ? p.temTelasProtecao         : null,
            };
          })(),
          gato: {
            id:          gato ? gato.id          : null,
            nome:        gato ? gato.nome        : null,
            raca:        gato ? gato.raca        : null,
            sexo:        gato ? gato.sexo        : null,
            idadeMeses:  gato ? gato.idadeMeses  : null,
            vacinado:    gato ? gato.vacinado    : false,
            castrado:    gato ? gato.castrado    : false,
            vermifugado: gato ? gato.vermifugado : false,
            status:      gato ? gato.status      : null,
            fotoPrincipal: fotoPrincipal ? fotoPrincipal.url : null,
          },
          match: match ? { id: match.id, status: match.status, comentario: match.comentario } : null,
          createdAt: new Date(like.createdAt).toLocaleString('pt-BR'),
        };
      });

      return exits.success({
        message: 'Likes listados com sucesso!',
        likes: likesFormatados,
      });

    } catch (err) {
      return exits.error({ erro: 'Erro ao listar likes.', detalhes: err.message });
    }
  },
};
