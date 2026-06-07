import { FaChevronLeft, FaWheelchair } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function FotoGato({ fotos, fotoAtiva, setFotoAtiva, deficiente }) {
  const navigate = useNavigate();
  const fotoUrl = fotos.length > 0 ? fotos[fotoAtiva]?.url : null;

  return (
    <div className="flex justify-center px-4 pt-4">
      <div className="relative bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl overflow-hidden flex-shrink-0 w-full h-64 sm:w-[480px] sm:h-[380px]">

        {fotoUrl ? (
          <img src={fotoUrl} alt="foto do gato" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl">🐱</div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all z-10"
        >
          <FaChevronLeft size={14} className="text-gray-700" />
        </button>

        {deficiente && (
          <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-2.5 shadow-md z-10">
            <FaWheelchair size={14} className="text-white" />
          </div>
        )}

        {fotos.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
            {fotos.map((f, i) => (
              <button
                key={f.id}
                onClick={() => setFotoAtiva(i)}
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                  i === fotoAtiva ? 'border-white scale-110' : 'border-white/50 opacity-70'
                }`}
              >
                <img src={f.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default FotoGato;