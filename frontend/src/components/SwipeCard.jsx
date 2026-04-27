import { useState, useRef } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaWheelchair, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function SwipeCard({ kitten, onSwipe, isTop }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState(0);
  const startXRef = useRef(null);

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
      onSwipe(offset > 0 ? 'right' : 'left');
    }
    setOffset(0);
  };

  const rotate = offset / 15;
  const opacity = Math.max(0, 1 - Math.abs(offset) / 300);
  const swipeHintLeft = offset < -40;
  const swipeHintRight = offset > 40;

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        transform: `translateX(${offset}px) rotate(${rotate}deg)`,
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
          <img src={kitten.image} alt={kitten.name} className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent" />

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
              onClick={(e) => { e.stopPropagation(); navigate(`/gato/${kitten.id}`); }}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all hover:scale-110 z-10"
            >
              <FaInfoCircle size={18} className="text-pink-600" />
            </button>
          )}

          {kitten.disability && (
            <div className="absolute top-4 left-4 bg-blue-500 rounded-full p-3 shadow-lg z-10">
              <FaWheelchair size={18} className="text-white" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-4xl font-bold mb-2">{kitten.name}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FaCalendarAlt size={13} />
                <span className="text-sm">{kitten.age}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt size={13} />
                <span className="text-sm">{kitten.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">{kitten.description}</p>
          <div className="flex flex-wrap gap-2">
            {kitten.characteristics.map((char, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700">
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwipeCard;
