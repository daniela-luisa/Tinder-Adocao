import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaInfoCircle, FaWhatsapp } from 'react-icons/fa';
import { api } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import HomeHeader from '../../components/HomeHeader';

const STATUS_CONFIG = {
  pendente:  { label: 'Aguardando aprovação', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  aprovado:  { label: 'Match aprovado! 🎉',   bg: 'bg-green-100',  text: 'text-green-700'  },
  recusado:  { label: 'Não foi dessa vez',     bg: 'bg-red-100',    text: 'text-red-600'    },
};

function formatarIdade(idadeMeses) {
  if (!idadeMeses) return null;
  const anos = Math.floor(idadeMeses / 12);
  const meses = idadeMeses % 12;
  if (anos === 0) return `${meses}m`;
  if (meses === 0) return `${anos}a`;
  return `${anos}a ${meses}m`;
}

function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuarioId = Number(localStorage.getItem('usuario_id'));
  const usuarioNome = localStorage.getItem('usuario_nome') || '';

  useEffect(() => {
    async function carregar() {
      if (!usuarioId) return;
      try {
        const res = await api.get(`/match/readall/${usuarioId}`);
        setMatches(res.matches || []);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [usuarioId]);

  function abrirWhatsapp(match) {
    const whatsapp = match.empresa?.whatsapp;
    if (!whatsapp) return;
    const numero = whatsapp.replace(/\D/g, '');
    const mensagem = encodeURIComponent(
      `Olá! Sou ${usuarioNome} e tive um match com o gatinho ${match.gato.nome} no MiauMatch. Gostaria de saber mais sobre a adoção! 🐱❤️`
    );
    window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50">

      <HomeHeader />

      <main className="px-4 pb-24 pt-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Meus Matches</h2>
        <p className="text-sm text-gray-500 mb-6">Gatinhos que deram match com você</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-sm">Carregando...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="text-5xl">💔</div>
            <p className="text-gray-600 font-medium">Nenhum match ainda</p>
            <p className="text-gray-400 text-sm">Continue curtindo gatinhos para ter matches!</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-2 px-5 py-2 bg-gradient-to-r from-[#FF308C] to-[#FF7200] text-white rounded-full text-sm font-medium shadow-md hover:opacity-90 transition-opacity"
            >
              Ver gatinhos
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {matches.map((match) => {
              const config = STATUS_CONFIG[match.status] || STATUS_CONFIG.pendente;
              const idade = formatarIdade(match.gato.idadeMeses);
              return (
                <div key={match.matchId} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="flex items-center gap-4 p-3">

                    {/* Foto */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-pink-50 relative">
                      {match.gato.fotoPrincipal ? (
                        <img src={match.gato.fotoPrincipal} alt={match.gato.nome} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🐱</div>
                      )}
                      {match.status === 'aprovado' && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow">
                          <FaHeart size={10} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-base">{match.gato.nome}</p>
                      <p className="text-xs text-gray-400">
                        {[match.gato.raca, idade].filter(Boolean).join(' · ')}
                      </p>
                      <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.text}`}>
                        {config.label}
                      </span>
                    </div>

                    {/* Botão detalhe */}
                    <button
                      onClick={() => navigate(`/gato/${match.gato.id}`)}
                      className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-50 hover:bg-pink-50 transition-colors"
                    >
                      <FaInfoCircle size={16} className="text-pink-400" />
                    </button>

                  </div>

                  {/* Comentário da empresa */}
                  {match.comentario && (
                    <div className="px-4 pb-3">
                      <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 italic">
                        "{match.comentario}"
                      </p>
                    </div>
                  )}

                  {/* Botão WhatsApp — só aparece se aprovado e tiver whatsapp */}
                  {match.status === 'aprovado' && match.empresa?.whatsapp && (
                    <div className="px-3 pb-3">
                      <button
                        onClick={() => abrirWhatsapp(match)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        <FaWhatsapp size={16} />
                        Entrar em contato
                      </button>
                    </div>
                  )}

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

export default Matches;