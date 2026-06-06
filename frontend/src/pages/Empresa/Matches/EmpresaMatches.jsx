import { useEmpresaMatches } from '../../../hooks/useEmpresaMatches';
import EmpresaSidebar from '../../../components/EmpresaSidebar';
import LikeCard from '../../../components/LikeCard';
import PerfilDrawer from '../../../components/PerfilDrawer';

const ABAS = [
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'aprovados', label: 'Aprovados' },
  { key: 'recusados', label: 'Recusados' },
];

function EmpresaMatches() {
  const {
    likes, loading, aba, setAba,
    drawer, perfil, loadingPerfil,
    comentario, setComentario,
    salvando, erro,
    pendentes, aprovados, recusados, listaAtual,
    drawerStatus,
    abrirDrawer, fecharDrawer,
    handleDecisao, handleConfirmarAdocao,
  } = useEmpresaMatches();

  return (
    <div className="flex h-screen bg-[#F5F5F3] overflow-hidden">
      <EmpresaSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h1 className="text-base font-semibold text-gray-800">Solicitações de Adoção</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {likes.length} solicitaç{likes.length !== 1 ? 'ões' : 'ão'} no total
          </p>
        </div>

        {/* Abas */}
        <div className="bg-white border-b border-gray-200 px-6 flex gap-1 flex-shrink-0">
          {ABAS.map(({ key, label }) => {
            const count = key === 'pendentes' ? pendentes.length : key === 'aprovados' ? aprovados.length : recusados.length;
            return (
              <button
                key={key}
                onClick={() => setAba(key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  aba === key ? 'border-[#d4537e] text-[#d4537e]' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${aba === key ? 'bg-pink-100 text-[#d4537e]' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Carregando...</div>
          ) : listaAtual.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="text-4xl">{aba === 'pendentes' ? '🐱' : aba === 'aprovados' ? '✅' : '❌'}</div>
              <p className="text-gray-400 text-sm">
                {aba === 'pendentes' ? 'Nenhuma solicitação pendente' : aba === 'aprovados' ? 'Nenhuma aprovação ainda' : 'Nenhuma recusa ainda'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-3xl">
              {listaAtual.map((like) => (
                <LikeCard key={like.likeId} like={like} onVerPerfil={abrirDrawer} />
              ))}
            </div>
          )}
        </div>
      </div>

      <PerfilDrawer
        drawer={drawer}
        perfil={perfil}
        loadingPerfil={loadingPerfil}
        drawerStatus={drawerStatus}
        comentario={comentario}
        setComentario={setComentario}
        salvando={salvando}
        erro={erro}
        onFechar={fecharDrawer}
        onDecisao={handleDecisao}
        onConfirmarAdocao={handleConfirmarAdocao}
      />
    </div>
  );
}

export default EmpresaMatches;