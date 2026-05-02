import { useNavigate } from 'react-router-dom';
import EmpresaSidebar from '../../../components/EmpresaSidebar';
import GatoCard from '../../../components/GatoCard';
import FiltrosGatos from '../../../components/FiltrosGatos';
import useEmpresaGatos from '../../../hooks/useEmpresaGatos';

function EmpresaGatos() {
  const navigate = useNavigate();
  const {
    gatos, gatosFiltrados, loading, contadores,
    busca, setBusca,
    filtroStatus, filtroSexo, filtrosAtivos,
    confirmarExcluir, setConfirmarExcluir,
    toggleFiltro, setFiltroStatus, setFiltroSexo,
    limparFiltros, handleExcluir,
  } = useEmpresaGatos();

  return (
    <div className="flex h-screen bg-[#F5F5F3]">
      <EmpresaSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-base font-semibold text-gray-800">Gerenciar Gatos</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {contadores.total} gatos · {contadores.disponivel} disponíveis · {contadores.em_processo} em processo · {contadores.adotado} adotados
            </p>
          </div>
          <button
            onClick={() => navigate('/empresa/gatos/novo')}
            className="px-4 py-2 text-sm text-white rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: '#d4537e' }}
          >
            + Cadastrar novo gato
          </button>
        </div>

        {/* Filtros */}
        <FiltrosGatos
          busca={busca}
          setBusca={setBusca}
          filtroStatus={filtroStatus}
          filtroSexo={filtroSexo}
          filtrosAtivos={filtrosAtivos}
          onToggleStatus={(v) => toggleFiltro(filtroStatus, setFiltroStatus, v)}
          onToggleSexo={(v) => toggleFiltro(filtroSexo, setFiltroSexo, v)}
          onLimpar={limparFiltros}
        />

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-12">

          {loading && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Carregando...</div>
          )}

          {!loading && gatos.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <p className="text-gray-400 text-sm">Nenhum gato cadastrado ainda.</p>
              <button
                onClick={() => navigate('/empresa/gatos/novo')}
                className="px-4 py-2 text-sm text-white rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: '#d4537e' }}
              >
                Cadastrar primeiro gato
              </button>
            </div>
          )}

          {!loading && gatos.length > 0 && gatosFiltrados.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Nenhum gato encontrado com esses filtros.
            </div>
          )}

          {!loading && gatosFiltrados.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {gatosFiltrados.map((gato) => (
                <GatoCard
                  key={gato.id}
                  gato={gato}
                  onExcluir={(id) => setConfirmarExcluir(id)}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Modal confirmação exclusão */}
      {confirmarExcluir && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
            <p className="text-sm font-semibold text-gray-800 mb-1">Excluir gato</p>
            <p className="text-sm text-gray-500 mb-5">Tem certeza que deseja excluir este gato? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmarExcluir(null)}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleExcluir(confirmarExcluir)}
                className="flex-1 py-2 text-sm text-white rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: '#ef4444' }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default EmpresaGatos;