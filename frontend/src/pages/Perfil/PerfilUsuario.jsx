import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser } from 'react-icons/fa';
import BottomNav from '../../components/BottomNav';

function PerfilUsuario() {
  const navigate = useNavigate();
  const usuarioNome = localStorage.getItem('usuario_nome') || '';

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50">
      <header className="w-full px-4 py-4 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all hover:-translate-x-1 duration-300"
        >
          <FaArrowLeft size={16} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Meu Perfil</h1>
      </header>

      <main className="flex flex-col items-center px-4 pb-24 pt-8 gap-6">
        <div className="w-20 h-20 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center">
          <FaUser size={36} className="text-pink-400" />
        </div>
        <p className="text-xl font-semibold text-gray-800">{usuarioNome}</p>
        <p className="text-sm text-gray-400">Página de perfil em construção</p>
      </main>

      <BottomNav />
    </div>
  );
}

export default PerfilUsuario;