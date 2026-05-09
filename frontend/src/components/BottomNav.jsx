import { useLocation, useNavigate } from 'react-router-dom';
import { FaHeart, FaHome } from 'react-icons/fa';
import { MdFavoriteBorder } from 'react-icons/md';

const navItems = [
  { path: '/home',     label: 'Início',   icon: FaHome },
  { path: '/curtidas', label: 'Curtidas', icon: MdFavoriteBorder },
  { path: '/matches',  label: 'Matches',  icon: FaHeart },
];

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 flex items-center justify-center gap-12 px-2 py-2">
      {navItems.map((item) => {
        const ativo = location.pathname === item.path;
        const ItemIcon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
              ativo ? 'text-[#FC008C]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ItemIcon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;