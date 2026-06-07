import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaInfoCircle } from 'react-icons/fa';
import { api } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import HomeHeader from '../../components/HomeHeader';

const STATUS_BADGE = {
  pendente:  { label: 'Aguardando resposta', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  aprovado:  { label: 'Match aprovado! 🎉',  bg: 'bg-green-100',  text: 'text-green-700'  },
  recusado:  { label: 'Não foi dessa vez',   bg: 'bg-red-100',    text: 'text-red-600'    },
  adotado:   { label: 'Adotado por outro',   bg: 'bg-gray-100',   text: 'text-gray-500'   },
};

function resolverStatus(like) {
  if (!like.match) { return 'pendente'; }
  if (like.match.status === 'aprovado') {
    return like.gato.status === 'adotado' ? 'adotado' : 'aprovado';
  }
  return like.match.status; // recusado
}

function Curtidas() {
  const navigate = useNavigate();
  const [likes,   setLikes]   = useState([]);
  const [loading, setLoading] = useState(true);

  const usuarioId = Number(localStorage.getItem('usuario_id'));

  useEffect(() => {
    async function carregar() {
      if (!usuarioId) { return; }
      try {
        const res = await api.get(`/likeUsuario/readallbyusuario/${usuarioId}`);
        setLikes(res.likes || []);
      } catch {
        setLikes([]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [usuarioId]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50">

      <HomeHeader />

      <main className="px-4 pb-24 pt-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Minhas Curtidas</h2>
        <p className="text-sm text-gray-500 mb-6">Histórico de gatinhos que você curtiu</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-sm">Carregando...</p>
          </div>
        ) : likes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="text-5xl">🐱</div>
            <p className="text-gray-600 font-medium">Nenhuma curtida ainda</p>
            <p className="text-gray-400 text-sm">Volte à home e curta alguns gatinhos!</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-2 px-5 py-2 bg-gradient-to-r from-[#FF308C] to-[#FF7200] text-white rounded-full text-sm font-medium shadow-md hover:opacity-90 transition-opacity"
            >
              Ver gatinhos
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {likes.slice().sort((a, b) => b.likeId - a.likeId).map((like) => {
              const status = resolverStatus(like);
              const badge  = STATUS_BADGE[status];

              return (
                <div key={like.likeId} className="bg-white rounded-2xl shadow-md overflow-hidden flex items-center gap-4 p-3">

                  {/* Foto */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-pink-50">
                    {like.gato.fotoPrincipal ? (
                      <img src={like.gato.fotoPrincipal} alt={like.gato.nome} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🐱</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-base">{like.gato.nome}</p>
                    {like.gato.raca && <p className="text-xs text-gray-400">{like.gato.raca}</p>}
                    <div className="flex items-center gap-1 mt-1">
                      <FaHeart size={10} className="text-pink-400" />
                      <span className="text-xs text-gray-400">Curtido em {like.createdAt}</span>
                    </div>
                    <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>

                    {/* Comentário da empresa */}
                    {like.match && like.match.comentario && (
                      <p className="text-xs text-gray-400 italic mt-1">"{like.match.comentario}"</p>
                    )}

                    {/* Ações por status */}
                    {status === 'aprovado' && (
                      <button
                        onClick={() => navigate('/matches')}
                        className="mt-2 text-xs text-green-600 font-medium hover:underline"
                      >
                        Ver no Matches →
                      </button>
                    )}
                    {status === 'recusado' && (
                      <button
                        onClick={() => navigate(`/gato/${like.gato.id}`)}
                        className="mt-2 text-xs text-pink-500 font-medium hover:underline"
                      >
                        Curtir novamente →
                      </button>
                    )}
                  </div>

                  {/* Botão detalhe */}
                  <button
                    onClick={() => navigate(`/gato/${like.gato.id}`)}
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-50 hover:bg-pink-50 transition-colors"
                  >
                    <FaInfoCircle size={16} className="text-pink-400" />
                  </button>

                </div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

export default Curtidas;