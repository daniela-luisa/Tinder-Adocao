import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaUser, FaBell } from 'react-icons/fa';
import { api } from '../services/api';

function HomeHeader() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const dropdownRef = useRef(null);

  const usuarioId = Number(localStorage.getItem('usuario_id'));
  const usuarioNome = localStorage.getItem('usuario_nome') || '';
  const iniciais = usuarioNome
    ? usuarioNome.trim().split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : '';

  useEffect(() => {
    if (!usuarioId) return;
    async function carregarNotificacoes() {
      try {
        const res = await api.get(`/notificacao/readall/${usuarioId}`);
        setNotificacoes(res.notificacoes || []);
        setNaoLidas(res.naoLidas || 0);
      } catch {
        setNotificacoes([]);
        setNaoLidas(0);
      }
    }
    carregarNotificacoes();
  }, [usuarioId]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function marcarLida(notif) {
    if (notif.lida) return;
    try {
      await api.put(`/notificacao/update/${notif.id}`, { lida: true });
      setNotificacoes((prev) => prev.map((n) => (n.id === notif.id ? { ...n, lida: true } : n)));
      setNaoLidas((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    }
  }

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between sticky top-0 z-30">

      {/* Logo — igual ao original */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-[#ff399f] to-[#fd7a1c] rounded-2xl p-2.5 shadow-lg">
          <FaHeart size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FC008C] to-[#e66000] bg-clip-text text-transparent">
            MiauMatch
          </h1>
          <p className="text-xs text-gray-500">Encontre seu companheiro perfeito</p>
        </div>
      </div>

      {/* Sino + Avatar */}
      <div className="flex items-center gap-2">

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <FaBell size={15} className="text-gray-500" />
            {naoLidas > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FC008C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {naoLidas > 9 ? '9+' : naoLidas}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">Notificações</span>
                {naoLidas > 0 && (
                  <span className="text-xs text-pink-500 font-medium">{naoLidas} nova{naoLidas > 1 ? 's' : ''}</span>
                )}
              </div>
              {notificacoes.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-400">Nenhuma notificação ainda</p>
                  <p className="text-xs text-gray-300 mt-1">Seus matches aparecerão aqui</p>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notificacoes.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => marcarLida(n)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 ${!n.lida ? 'bg-pink-50/50' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff399f] to-[#fd7a1c] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaHeart size={12} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 font-medium leading-snug">
                          {n.mensagem || 'Você teve um match! 🎉'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.createdAt}</p>
                      </div>
                      {!n.lida && <div className="w-2 h-2 rounded-full bg-[#FC008C] flex-shrink-0 mt-1.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/perfil')}
          className="w-9 h-9 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-[11px] font-semibold text-[#d4537e] hover:bg-pink-100 transition-colors"
        >
          {iniciais || <FaUser size={13} className="text-[#d4537e]" />}
        </button>

      </div>
    </header>
  );
}

export default HomeHeader;