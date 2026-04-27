import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaTimes, FaRedo } from 'react-icons/fa';
import HomeHeader from '../../components/HomeHeader';
import SwipeCard from '../../components/SwipeCard';
import FilterPanel from '../../components/FilterPanel';
import { mockKittens } from '../../data/kittens';

function Home() {
  const navigate = useNavigate();
  const userName = null; // troque por seu contexto de auth quando tiver

  const [allKittens] = useState(mockKittens);
  const [swipedIds, setSwipedIds] = useState([]);
  const [likedKittens, setLikedKittens] = useState([]);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ locations: [], ages: [], characteristics: [] });

  const availableLocations = useMemo(() => [...new Set(allKittens.map((k) => k.location))], [allKittens]);
  const availableAges = useMemo(() => [...new Set(allKittens.map((k) => k.age))], [allKittens]);
  const availableCharacteristics = useMemo(() => {
    const set = new Set();
    allKittens.forEach((k) => k.characteristics.forEach((c) => set.add(c)));
    return [...set];
  }, [allKittens]);

  const filteredKittens = useMemo(() => {
    let result = allKittens.filter((k) => !swipedIds.includes(k.id));
    if (filters.locations.length > 0) result = result.filter((k) => filters.locations.includes(k.location));
    if (filters.ages.length > 0) result = result.filter((k) => filters.ages.includes(k.age));
    if (filters.characteristics.length > 0)
      result = result.filter((k) => filters.characteristics.some((c) => k.characteristics.includes(c)));
    return result;
  }, [allKittens, swipedIds, filters]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSwipe = (direction) => {
    if (filteredKittens.length === 0) return;
    const current = filteredKittens[0];
    if (direction === 'right') {
      setLikedKittens((prev) => [...prev, current]);
      showToast(`❤️ Você curtiu ${current.name}!`, 'success');
    } else {
      showToast(`Você passou ${current.name}`, 'info');
    }
    setTimeout(() => setSwipedIds((prev) => [...prev, current.id]), 300);
  };

  const handleReset = () => {
    setSwipedIds([]);
    setLikedKittens([]);
    setFilters({ locations: [], ages: [], characteristics: [] });
    showToast('🔄 Vamos começar de novo!', 'info');
  };

  const handleLogout = () => navigate('/login');

  return (
    <div className="min-h-screen bg-linear-to-r from-pink-50 via-orange-50 to-yellow-50 relative">

      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-500' : 'bg-gray-700'}`}>
          {toast.message}
        </div>
      )}

      <HomeHeader userName={userName} onLogout={handleLogout} />

      <main className="flex flex-col items-center px-4 pb-24">
        <FilterPanel
          onFilterChange={(f) => { setFilters(f); setSwipedIds([]); }}
          availableLocations={availableLocations}
          availableAges={availableAges}
          availableCharacteristics={availableCharacteristics}
        />

        <div className="relative w-full max-w-md h-[580px] flex items-center justify-center">
          {filteredKittens.length === 0 ? (
            <div className="text-center">
              <div className="text-6xl mb-4">😿</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Não há mais gatinhos!</h2>
              <p className="text-gray-500 mb-6 text-sm">
                {filters.locations.length > 0 || filters.ages.length > 0 || filters.characteristics.length > 0
                  ? 'Nenhum gatinho encontrado com esses filtros'
                  : 'Você viu todos os gatinhos disponíveis'}
              </p>
              {likedKittens.length > 0 && (
                <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg">
                  <p className="text-sm text-gray-500 mb-3">Você curtiu:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {likedKittens.map((k) => (
                      <span key={k.id} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                        {k.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={handleReset}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-linear-to-r from-[#FF308C] to-[#FF7200] text-white rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity">
                <FaRedo size={15} /> Ver novamente
              </button>
            </div>
          ) : (
            filteredKittens.slice(0, 2).reverse().map((kitten, index, arr) => (
              <SwipeCard key={kitten.id} kitten={kitten} onSwipe={handleSwipe} isTop={index === arr.length - 1} />
            ))
          )}
        </div>

        {filteredKittens.length > 0 && (
          <div className="flex items-center gap-6 mt-6">
            <button onClick={() => handleSwipe('left')}
              className="w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group">
              <FaTimes size={28} className="text-red-500 group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={() => handleSwipe('right')}
              className="w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group bg-gradient-to-br from-[#FF308C] to-[#FF7200]">
              <FaHeart size={32} className="text-white fill-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}

        <p className="mt-6 text-sm text-gray-500">
          {filteredKittens.length > 0
            ? `${filteredKittens.length} gatinho${filteredKittens.length !== 1 ? 's' : ''} disponível${filteredKittens.length !== 1 ? 'is' : ''}`
            : 'Nenhum gatinho disponível'}
        </p>
      </main>
    </div>
  );
}

export default Home;
