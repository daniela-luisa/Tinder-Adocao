import { useState, useRef } from 'react';
import { FaCalendarAlt, FaWheelchair, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function SwipeCard({ gato, onSwipe, isTop, possuiPerfil, onPerfilObrigatorio, }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState(0);
  const startXRef = useRef(null);

  if (!gato) return null;

  const handleMouseDown = (e) => {
    if (!isTop) return;
    startXRef.current = e.clientX;
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragging || !isTop) return;
    setOffset(e.clientX - startXRef.current);
  };

const handleMouseUp = () => {
  if (!dragging) return;

  setDragging(false);

  if (Math.abs(offset) > 100) {

if (offset > 0 && !possuiPerfil) {
  setOffset(0);
  onPerfilObrigatorio?.();
  return;
}

    onSwipe(offset > 0 ? 'right' : 'left');
  }

  setOffset(0);
};

  const handleTouchStart = (e) => {
    if (!isTop) return;
    startXRef.current = e.touches[0].clientX;
    setDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!dragging || !isTop) return;
    setOffset(e.touches[0].clientX - startXRef.current);
  };

const handleTouchEnd = () => {
  if (!dragging) return;

  setDragging(false);

  if (Math.abs(offset) > 100) {

    if (offset > 0 && !possuiPerfil) {
      setOffset(0);
      onPerfilObrigatorio?.();
      return;
    }

    onSwipe(offset > 0 ? 'right' : 'left');
  }

  setOffset(0);
};  

  const rotate = offset / 15;
  const opacity = Math.max(0, 1 - Math.abs(offset) / 300);
  const swipeHintLeft = offset < -40;
  const swipeHintRight = offset > 40;

  const fotoUrl = gato.fotoPrincipal || null;

  function formatarIdade(idadeMeses) {
    if (!idadeMeses && idadeMeses !== 0) return null;
    const anos = Math.floor(idadeMeses / 12);
    const meses = idadeMeses % 12;
    if (anos === 0) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    if (meses === 0) return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    return `${anos}a ${meses}m`;
  }

  const idade = formatarIdade(gato.idadeMeses);

  const tags = gato.personalidades && gato.personalidades.length > 0
    ? gato.personalidades
    : [
        gato.vacinado && 'Vacinada',
        gato.castrado && 'Castrada',
        gato.vermifugado && 'Vermifugada',
      ].filter(Boolean);

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isTop ? `translateX(${offset}px) rotate(${rotate}deg)` : 'translateY(12px) scale(0.95)',
        opacity: isTop ? opacity : 1,
        cursor: isTop ? (dragging ? 'grabbing' : 'grab') : 'default',
        zIndex: isTop ? 10 : 5,
        transition: dragging ? 'none' : 'transform 0.3s ease',
        userSelect: 'none',
      }}
      className="absolute w-full max-w-md"
    >
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative h-96">
          {fotoUrl ? (
            <img src={fotoUrl} alt={gato.nome} className="w-full h-full object-cover" draggable={false} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center text-8xl">
              🐱
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

          {swipeHintRight && (
            <div className="absolute top-6 left-6 border-4 border-green-400 text-green-400 font-bold text-2xl px-4 py-1 rounded-xl rotate-[-20deg]">
              CURTIR ❤️
            </div>
          )}
          {swipeHintLeft && (
            <div className="absolute top-6 right-6 border-4 border-red-400 text-red-400 font-bold text-2xl px-4 py-1 rounded-xl rotate-[20deg]">
              PASSAR ✕
            </div>
          )}

          {isTop && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/gato/${gato.id}`); }}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all hover:scale-110 z-10"
            >
              <FaInfoCircle size={18} className="text-pink-600" />
            </button>
          )}

          {gato.deficiente && (
            <div className="absolute top-4 left-4 bg-blue-500 rounded-full p-3 shadow-lg z-10">
              <FaWheelchair size={18} className="text-white" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-4xl font-bold mb-2">{gato.nome}</h2>
            <div className="flex items-center gap-4">
              {idade && (
                <div className="flex items-center gap-1">
                  <FaCalendarAlt size={13} />
                  <span className="text-sm">{idade}</span>
                </div>
              )}
              {gato.raca && (
                <span className="text-sm opacity-90">{gato.raca}</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {gato.descricao && (
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">{gato.descricao}</p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SwipeCard;