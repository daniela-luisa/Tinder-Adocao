import { useState, useEffect } from 'react';
import { FaBuilding, FaWhatsapp, FaEdit, FaSave, FaTimes, FaHeart } from 'react-icons/fa';
import EmpresaSidebar from '../../../components/EmpresaSidebar';
import InputAdmin from '../../../components/InputAdmin';
import { api } from '../../../services/api';

function EmpresaPerfil() {
  const empresaId   = Number(localStorage.getItem('empresa_id'));
  const empresaNome = localStorage.getItem('empresa_nome') || '';

  const [empresa,  setEmpresa]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro,     setErro]     = useState(null);
  const [sucesso,  setSucesso]  = useState(false);

  const [form, setForm] = useState({ nome: '', whatsapp: '' });

  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get(`/empresa/readoneid/${empresaId}`);
        setEmpresa(res.empresa);
        setForm({ nome: res.empresa.nome || '', whatsapp: res.empresa.whatsapp || '' });
      } catch {
        setEmpresa(null);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [empresaId]);

  function handleWhatsapp(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 13);
    setForm((f) => ({ ...f, whatsapp: v }));
  }

  async function handleSalvar() {
    setErro(null);
    if (!form.nome.trim()) { setErro('O nome é obrigatório.'); return; }
    setSalvando(true);
    try {
      const res = await api.put(`/empresa/update/${empresaId}`, {
        nome: form.nome,
        whatsapp: form.whatsapp || undefined,
      });
      setEmpresa(res.empresa);
      localStorage.setItem('empresa_nome', res.empresa.nome);
      setEditando(false);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch (err) {
      setErro(err?.erro || 'Erro ao salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  function handleCancelar() {
    setForm({ nome: empresa?.nome || '', whatsapp: empresa?.whatsapp || '' });
    setEditando(false);
    setErro(null);
  }

  return (
    <div className="flex h-screen bg-[#F5F5F3]">
      <EmpresaSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h1 className="text-base font-semibold text-gray-800">Perfil da Empresa</h1>
          <p className="text-xs text-gray-400 mt-0.5">Gerencie as informações da sua organização</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-lg mx-auto flex flex-col gap-4">

            {/* Cabeçalho */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff399f] to-[#fd7a1c] flex items-center justify-center flex-shrink-0">
                <FaHeart size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-gray-800 truncate">{empresa?.nome || empresaNome}</p>
                <p className="text-sm text-gray-400">{empresa?.email}</p>
              </div>
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                  style={{ background: '#fbeaf0', color: '#d4537e' }}
                >
                  <FaEdit size={13} /> Editar
                </button>
              )}
            </div>

            {/* Sucesso */}
            {sucesso && (
              <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm text-green-700 font-medium">
                ✓ Perfil atualizado com sucesso!
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                Carregando...
              </div>
            )}

            {/* Visualização */}
            {!loading && !editando && empresa && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Informações</p>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 py-2 border-b border-gray-50">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0">
                      <FaBuilding size={14} className="text-pink-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Nome</p>
                      <p className="text-sm font-medium text-gray-800">{empresa.nome}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <FaWhatsapp size={14} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">WhatsApp</p>
                      <p className="text-sm font-medium text-gray-800">
                        {empresa.whatsapp || <span className="text-gray-300 italic">Não informado</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edição */}
            {!loading && editando && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Editar informações</p>

                <InputAdmin
                  label="Nome da organização"
                  placeholder="Ex: ONG Patinhas Felizes"
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  maxLength={100}
                  required
                />

                <InputAdmin
                  label="WhatsApp"
                  placeholder="5547999999999"
                  value={form.whatsapp}
                  onChange={handleWhatsapp}
                />
                <p className="text-xs text-gray-400 -mt-2">
                  Formato internacional sem espaços — ex: 5547999999999
                </p>

                {erro && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                    {erro}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleCancelar}
                    className="flex-1 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaTimes size={13} /> Cancelar
                  </button>
                  <button
                    onClick={handleSalvar}
                    disabled={salvando}
                    className="flex-1 py-2.5 text-sm text-white rounded-xl disabled:opacity-60 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#d4537e' }}
                  >
                    <FaSave size={13} /> {salvando ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default EmpresaPerfil;