module.exports = {
  friendlyName: 'Dashboard',
  description: 'Retorna métricas e dados para o dashboard da empresa',

  inputs: {},

  exits: {
    success: { description: 'Dashboard carregado com sucesso!' },
    error: { description: 'Erro ao carregar dashboard.' },
  },

  fn: async function (inputs, exits) {
    try {
      const gatos   = await Gato.find();
      const likes   = await LikeUsuario.find();
      const matches = await Match.find();

      // Métricas de gatos
      const disponiveis = gatos.filter((g) => g.status === 'disponivel').length;
      const emProcesso  = gatos.filter((g) => g.status === 'em_processo').length;
      const adotados    = gatos.filter((g) => g.status === 'adotado').length;

      // Likes sem match = pendentes
      const likesSemMatch = likes.filter((l) => {
        for (let i = 0; i < matches.length; i++) {
          if (matches[i].like === l.id) { return false; }
        }
        return true;
      });

      const aprovados = matches.filter((m) => m.status === 'aprovado').length;
      const recusados = matches.filter((m) => m.status === 'recusado').length;
      const pendentes = likesSemMatch.length;

      // Adoções por mês (últimos 6 meses)
      const hoje = new Date();
      const adocoesPorMes = [];
      for (let i = 5; i >= 0; i--) {
        const d   = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const ano = d.getFullYear();
        const mes = d.getMonth();
        const count = matches.filter((m) => {
          if (m.status !== 'aprovado') { return false; }
          const md = new Date(m.createdAt);
          return md.getFullYear() === ano && md.getMonth() === mes;
        }).length;
        adocoesPorMes.push({
          mes: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
          aprovados: count,
        });
      }

      // Últimos 5 likes
      const likesOrdenados = likes.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const ultimosLikes = [];
      for (let j = 0; j < Math.min(5, likesOrdenados.length); j++) {
        const like    = likesOrdenados[j];
        const usuario = await Usuario.findOne({ id: like.usuario });
        let gatoNome  = 'Desconhecido';
        for (let k = 0; k < gatos.length; k++) {
          if (gatos[k].id === like.gato) { gatoNome = gatos[k].nome; break; }
        }
        ultimosLikes.push({
          likeId:      like.id,
          usuarioNome: usuario ? usuario.nome : 'Desconhecido',
          gatoNome,
          createdAt:   new Date(like.createdAt).toLocaleString('pt-BR'),
        });
      }

      // Últimos 5 pendentes
      const pendentesLista = [];
      for (let p = 0; p < Math.min(5, likesSemMatch.length); p++) {
        const lk  = likesSemMatch[p];
        const usr = await Usuario.findOne({ id: lk.usuario });
        let gtNome = 'Desconhecido';
        for (let q = 0; q < gatos.length; q++) {
          if (gatos[q].id === lk.gato) { gtNome = gatos[q].nome; break; }
        }
        pendentesLista.push({
          likeId:      lk.id,
          usuarioNome: usr ? usr.nome : 'Desconhecido',
          gatoNome:    gtNome,
          createdAt:   new Date(lk.createdAt).toLocaleString('pt-BR'),
        });
      }

      return exits.success({
        metricas: {
          totalGatos: gatos.length,
          disponiveis, emProcesso, adotados,
          totalLikes: likes.length,
          pendentes, aprovados, recusados,
        },
        adocoesPorMes,
        ultimosLikes,
        pendentesLista,
      });

    } catch (err) {
      return exits.error({ erro: 'Erro ao carregar dashboard.', detalhes: err.message });
    }
  },
};
