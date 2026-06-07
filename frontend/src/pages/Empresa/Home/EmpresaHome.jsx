import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaHeart, FaClock, FaCheck } from 'react-icons/fa';
import EmpresaSidebar from '../../../components/EmpresaSidebar';
import GraficoBarras from '../../../components/GraficoBarras';
import GraficoPizza from '../../../components/GraficoPizza';
import { api } from '../../../services/api';

function MetricCard(props) {
  const MetricIcon = props.icon;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${props.cor}`}>
        <MetricIcon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{props.value ?? '—'}</p>
        <p className="text-xs text-gray-400">{props.label}</p>
      </div>
    </div>
  );
}

function EmpresaHome() {
  const navigate = useNavigate();
  const [dados,   setDados]   = useState(null);
  const [loading, setLoading] = useState(true);
  const empresaNome = localStorage.getItem('empresa_nome') || 'Empresa';

  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get('/empresa/dashboard');
        setDados(res);
      } catch {
        setDados(null);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F5F5F3]">
        <EmpresaSidebar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Carregando...</div>
      </div>
    );
  }

  const m = dados && dados.metricas ? dados.metricas : {};
  const adocoesPorMes = dados && dados.adocoesPorMes ? dados.adocoesPorMes : [];
  const ultimosLikes  = dados && dados.ultimosLikes  ? dados.ultimosLikes  : [];
  const pendentes     = dados && dados.pendentesLista ? dados.pendentesLista : [];

  return (
    <div className="flex h-screen bg-[#F5F5F3] overflow-hidden">
      <EmpresaSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h1 className="text-base font-semibold text-gray-800">Olá, {empresaNome} 👋</h1>
          <p className="text-xs text-gray-400 mt-0.5">Aqui está um resumo do que está acontecendo</p>
        </div>

        <div className="flex-1 overflow-hidden p-5 flex flex-col gap-4">

          {/* Linha 1 — 4 métricas */}
          <div className="grid grid-cols-4 gap-4 flex-shrink-0">
            <MetricCard icon={FaPaw}   label="Disponíveis"       value={m.disponiveis} cor="bg-[#d4537e]" />
            <MetricCard icon={FaClock} label="Em processo"        value={m.emProcesso}  cor="bg-amber-400" />
            <MetricCard icon={FaCheck} label="Adotados"          value={m.adotados}    cor="bg-emerald-500" />
            <MetricCard icon={FaHeart} label="Aguardando avaliação" value={m.pendentes} cor="bg-blue-400" />
          </div>

          {/* Linha 2 — gráficos */}
          <div className="grid grid-cols-2 gap-4 flex-shrink-0">

            {/* Barra — adoções por mês */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col" style={{ height: 200 }}>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Aprovações por mês</p>
              <GraficoBarras dados={adocoesPorMes} />
            </div>

            {/* Pizza — status dos gatos */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col" style={{ height: 200 }}>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status dos gatos</p>
              <GraficoPizza disponiveis={m.disponiveis || 0} emProcesso={m.emProcesso || 0} adotados={m.adotados || 0} />
            </div>

          </div>

          {/* Linha 3 — listas */}
          <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">

            {/* Últimos likes */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col min-h-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Últimos likes</p>
              {ultimosLikes.length === 0 ? (
                <p className="text-xs text-gray-300 text-center py-4">Nenhum like ainda</p>
              ) : (
                <div className="flex flex-col gap-2 overflow-y-auto">
                  {ultimosLikes.map((l) => (
                    <div key={l.likeId} className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{l.usuarioNome}</p>
                        <p className="text-xs text-gray-400 truncate">curtiu <span className="font-medium">{l.gatoNome}</span></p>
                      </div>
                      <p className="text-xs text-gray-300 flex-shrink-0">{l.createdAt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pendentes */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Aguardando avaliação</p>
                {m.pendentes > 0 && (
                  <button
                    onClick={() => navigate('/empresa/matches')}
                    className="text-xs text-[#d4537e] hover:underline"
                  >
                    Ver todos
                  </button>
                )}
              </div>
              {pendentes.length === 0 ? (
                <p className="text-xs text-gray-300 text-center py-4">Nenhum pendente 🎉</p>
              ) : (
                <div className="flex flex-col gap-2 overflow-y-auto">
                  {pendentes.map((p) => (
                    <div key={p.likeId} className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{p.usuarioNome}</p>
                        <p className="text-xs text-gray-400 truncate">quer adotar <span className="font-medium">{p.gatoNome}</span></p>
                      </div>
                      <button
                        onClick={() => navigate('/empresa/matches')}
                        className="text-xs px-2 py-1 rounded-lg text-white flex-shrink-0 hover:opacity-90"
                        style={{ backgroundColor: '#d4537e' }}
                      >
                        Avaliar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default EmpresaHome;