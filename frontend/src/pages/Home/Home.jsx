import { useState } from 'react';
import { FaHeart, FaTimes, FaRedo, FaFilter } from 'react-icons/fa';
import HomeHeader from '../../components/HomeHeader';
import SwipeCard from '../../components/SwipeCard';
import FilterPanel from '../../components/FilterPanel';
import BottomNav from '../../components/BottomNav';
import useHomeGatos from '../../hooks/useHomeGatos';

function Home() {
  const [filtroAberto, setFiltroAberto] = useState(false);

  const {
    gatosFiltrados,
    loading,
    toast,
    filters,
    setFilters,
    availableLocations,
    availableAges,
    availableCharacteristics,
    handleSwipe,
    handleReset,
    possuiPerfil,
    avisarPerfilObrigatorio,
  } = useHomeGatos();

  const activeFilterCount =
    filters.locations.length + filters.ages.length + filters.characteristics.length;

  return (
   <div className="min-h-screen bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 relative overflow-x-hidden">

{toast && (
  <div className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
    <div
      className={`max-w-md w-full px-4 py-3 rounded-2xl shadow-xl text-white text-sm font-medium text-center break-words ${
        toast.type === 'success'
          ? 'bg-green-500'
          : 'bg-gray-800'
      }`}
    >
      {toast.message}
    </div>
  </div>
)}

      <HomeHeader />

      <main className="flex flex-col items-center px-4 pb-10 md:pb-6">

        {/* Botão de filtro — design original, abre como overlay */}
        <div className="w-full max-w-md mb-0 lg:-mb-2">
          <button
            onClick={() => setFiltroAberto(true)}
            className="w-full px-6 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FaFilter size={16} className="text-pink-600" />
              <span className="font-medium text-gray-700">
                Filtros
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </span>
            </div>
            <FaFilter size={14} className="text-gray-400" />
          </button>
        </div>

        <div className="relative w-full max-w-md h-[580px] lg:h-[470px] flex items-center justify-center">
          {loading ? (
            <div className="text-center text-gray-400 text-sm">Buscando gatinhos...</div>
          ) : gatosFiltrados.length === 0 ? (
            <div className="text-center">
              <div className="text-6xl mb-4">😿</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Não há mais gatinhos!</h2>
              <p className="text-gray-500 mb-6 text-sm">
                {activeFilterCount > 0
                  ? 'Nenhum gatinho encontrado com esses filtros'
                  : 'Você viu todos os gatinhos disponíveis'}
              </p>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-[#FF308C] to-[#FF7200] text-white rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity"
              >
                <FaRedo size={15} /> Ver novamente
              </button>
            </div>
          ) : (
            gatosFiltrados.slice(0, 2).reverse().map((gato, index, arr) => (
              <SwipeCard
                key={gato.id}
                gato={gato}
                onSwipe={handleSwipe}
                isTop={index === arr.length - 1}
                possuiPerfil={possuiPerfil}
                onPerfilObrigatorio={avisarPerfilObrigatorio}
              />
            ))
          )}
        </div>

        {gatosFiltrados.length > 0 && (
          <div className="flex items-center gap-6 mt-6 lg:-mt-2">
            <button
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
            >
              <FaTimes size={28} className="text-red-500 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => {
                if (!possuiPerfil) {
                  avisarPerfilObrigatorio();
                  return;
                }

                handleSwipe('right');
              }}
              className={`w-20 h-20 rounded-full shadow-lg transition-all flex items-center justify-center ${
                possuiPerfil
                  ? 'bg-gradient-to-br from-[#FF308C] to-[#FF7200] hover:scale-110'
                  : 'bg-gray-300 opacity-60'
              }`}
            >
              <FaHeart size={32} className="text-white" />
            </button>
          </div>
        )}

      </main>

      <BottomNav />

      {/* Overlay FilterPanel */}
      {filtroAberto && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setFiltroAberto(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl px-4 pt-4 pb-8 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-800">Filtros</h3>
              <button
                onClick={() => setFiltroAberto(false)}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-2 py-1"
              >
                Fechar
              </button>
            </div>
            <FilterPanel
              onFilterChange={(f) => { setFilters(f); setFiltroAberto(false); }}
              availableLocations={availableLocations}
              availableAges={availableAges}
              availableCharacteristics={availableCharacteristics}
              initialFilters={filters}
            />
          </div>
        </>
      )}

    </div>
  );
}

export default Home;