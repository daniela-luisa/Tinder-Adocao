import { useNavigate } from 'react-router-dom';
import EmpresaSidebar from '../../../components/EmpresaSidebar';

function EmpresaGatos() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#F5F5F3]">
      <EmpresaSidebar />

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-800">Gerenciar Gatos</h1>
            <p className="text-xs text-gray-400 mt-0.5">Todos os gatos cadastrados pela sua organização</p>
          </div>
          <button
            onClick={() => navigate('/empresa/gatos/novo')}
            className="px-4 py-2 text-sm text-white rounded-xl hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#d4537e' }}
          >
            + Cadastrar novo gato
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Listagem de gatos em construção...
        </div>
      </div>
    </div>
  );
}

export default EmpresaGatos;