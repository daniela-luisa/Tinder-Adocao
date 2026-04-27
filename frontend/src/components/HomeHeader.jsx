import { FaHeart, FaUser, FaSignOutAlt, FaSignInAlt, FaPaw, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function HomeHeader({ userName, onLogout }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isAuthenticated = !!userName;

  return (
    <header className="w-full py-5 px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-r from-[#ff399f] to-[#fd7a1c] rounded-2xl p-3 shadow-lg">
          <FaHeart size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-[#FC008C] to-[#e66000] bg-clip-text text-transparent">
            MiauMatch
          </h1>
          <p className="text-sm text-gray-500">Encontre seu companheiro perfeito</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full">
            <FaUser size={14} className="text-pink-600" />
            <span className="text-sm font-medium text-pink-700">{userName}</span>
          </div>
        )}

        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#ff399f] to-[#fd7a1c] text-white rounded-full shadow-md hover:opacity-90 transition-opacity"
            >
              <FaPlus size={14} />
              <span className="text-sm font-medium">Cadastrar</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <button
                  onClick={() => { navigate('/empresa/gatos/novo'); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                >
                  <FaPaw size={14} className="text-pink-500" />
                  Cadastrar gatinho
                </button>
                <button
                  onClick={() => { navigate('/cadastro'); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                >
                  <FaUser size={14} className="text-pink-500" />
                  Perfil de adotante
                </button>
              </div>
            )}
          </div>
        )}

        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <FaSignOutAlt size={14} className="text-gray-600" />
            <span className="hidden sm:inline text-sm font-medium text-gray-700">Sair</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <FaSignInAlt size={14} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Entrar</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;
