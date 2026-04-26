import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { MdDashboard, MdPets, MdFavorite, MdPerson, MdLogout } from 'react-icons/md';

const navItems = [
  { label: 'Dashboard',       icon: MdDashboard, path: '/empresa/home'    },
  { label: 'Gerenciar Gatos', icon: MdPets,      path: '/empresa/gatos'   },
  { label: 'Matches',         icon: MdFavorite,  path: '/empresa/matches' },
];

function getIniciais(nome) {
  if (!nome) { return '??'; }
  const partes = nome.trim().split(' ').filter(Boolean);
  if (partes.length === 1) { return partes[0].slice(0, 2).toUpperCase(); }
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function EmpresaSidebar() {
  const [popoverAberto, setPopoverAberto] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const nomeExibido = localStorage.getItem('empresa_nome') || '';
  const iniciais = getIniciais(nomeExibido);

  async function handleLogout() {
    setLoadingLogout(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      localStorage.removeItem('empresa_nome');
      localStorage.removeItem('empresa_id');
      setLoadingLogout(false);
      navigate('/empresa/login');
    }
  }

  return (
    <aside className="w-[200px] flex-shrink-0 flex flex-col bg-white border-r border-gray-200 h-screen sticky top-0">

      <div className="px-4 py-5 border-b border-gray-200">
        <p className="text-base font-semibold" style={{ color: '#d4537e' }}>MiauMatch</p>
        <p className="text-xs text-gray-400 mt-0.5">Painel Administrativo</p>
      </div>

      <nav className="flex flex-col gap-0.5 py-3 flex-1">
        {navItems.map((item) => {
          const ativo = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          const ItemIcon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition-colors border-l-2 ${
                ativo
                  ? 'border-[#d4537e] bg-pink-50 text-[#d4537e] font-medium'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <ItemIcon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3 relative">
        {popoverAberto && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setPopoverAberto(false)} />
            <div className="absolute bottom-[68px] left-3 right-3 bg-white border border-gray-200 rounded-xl shadow-md z-20 overflow-hidden">
              <button
                onClick={() => { setPopoverAberto(false); navigate('/empresa/perfil'); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <MdPerson size={16} />
                Editar perfil
              </button>
              <div className="h-px bg-gray-100 mx-3" />
              <button
                onClick={handleLogout}
                disabled={loadingLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
              >
                <MdLogout size={16} />
                {loadingLogout ? 'Saindo...' : 'Sair'}
              </button>
            </div>
          </>
        )}

        <button
          onClick={() => setPopoverAberto(!popoverAberto)}
          className="flex items-center gap-2.5 w-full rounded-xl px-2 py-2 hover:bg-gray-50 transition-colors"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: '#FBEAF0', color: '#d4537e' }}
          >
            {iniciais}
          </div>
          <span className="text-sm text-gray-700 font-medium truncate flex-1 text-left">{nomeExibido}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            className={`text-gray-400 flex-shrink-0 transition-transform ${popoverAberto ? 'rotate-180' : ''}`}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

export default EmpresaSidebar;