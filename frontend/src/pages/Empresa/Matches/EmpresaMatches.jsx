import { useState, useEffect } from 'react';
import { FaHeart, FaTimes, FaCheck, FaUser, FaHome, FaPaw, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';
import EmpresaSidebar from '../../../components/EmpresaSidebar';
import { api } from '../../../services/api';

const STATUS_CONFIG = {
  aprovado:  { label: 'Aprovado',  bg: 'bg-blue-100',   text: 'text-blue-700'   },
  recusado:  { label: 'Recusado',  bg: 'bg-red-100',    text: 'text-red-600'    },
  adotado:   { label: 'Adotado',   bg: 'bg-green-100',  text: 'text-green-700'  },
};

const FINALIDADE = {
  companhia: 'Companhia',
  terapia:   'Apoio emocional',
  presente:  'Presente',
  outro:     'Outro',
};

const ABAS = [
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'aprovados', label: 'Aprovados' },
  { key: 'recusados', label: 'Recusados' },
];

function Chip({ ok }) {
  return ok
    ? <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Sim</span>
    : <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">Não</span>;
}

function InfoRow({ label, value }) {
  if (!value && value !== false) return null;
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0 gap-2">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-700 text-right">{value}</span>
    </div>
  );
}

function avatarIniciais(nome) {
  if (!nome) return '?';
  return nome.trim().split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}


const AVATAR_COLORS = [
  'bg-blue-200 text-blue-800',
  'bg-purple-200 text-purple-800',
  'bg-amber-200 text-amber-800',
  'bg-teal-200 text-teal-800',
  'bg-rose-200 text-rose-800',
];

function EmpresaMatches() {
  const [likes,      setLikes]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [aba,        setAba]        = useState('pendentes');
  const [drawer,     setDrawer]     = useState(null); // like selecionado
  const [perfil,     setPerfil]     = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [comentario, setComentario] = useState('');
  const [salvando,   setSalvando]   = useState(false);
  const [erro,       setErro]       = useState(null);

  async function carregar() {
    try {
      const res = await api.get('/likeUsuario/readallbyempresa');
      setLikes(res.likes || []);
    } catch {
      setLikes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function abrirDrawer(like) {
    setDrawer(like);
    setPerfil(null);
    setComentario('');
    setErro(null);
    setLoadingPerfil(true);
    try {
      const res = await api.get(`/perfilAdotante/readoneid/${like.usuario.id}`);
      setPerfil(res.perfil);
    } catch {
      setPerfil(null);
    } finally {
      setLoadingPerfil(false);
    }
  }

  function fecharDrawer() {
    setDrawer(null);
    setPerfil(null);
    setErro(null);
  }

  async function handleDecisao(status) {
    if (!drawer) return;
    setErro(null);
    setSalvando(true);
    try {
      await api.post('/match/create', {
        likeId: drawer.likeId,
        status,
        comentario: comentario.trim() || undefined,
      });
      fecharDrawer();
      await carregar();
    } catch (err) {
      setErro(err && err.erro ? err.erro : 'Erro ao processar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleConfirmarAdocao() {
    if (!drawer || !drawer.match) return;
    setErro(null);
    setSalvando(true);
    try {
      await api.put(`/gato/update/${drawer.gato.id}`, { status: 'adotado' });
      fecharDrawer();
      await carregar();
    } catch (err) {
      setErro(err && err.erro ? err.erro : 'Erro ao confirmar adoção.');
    } finally {
      setSalvando(false);
    }
  }

  const pendentes = likes.filter((l) => !l.match);
  const aprovados = likes.filter((l) => l.match && l.match.status === 'aprovado');
  const recusados = likes.filter((l) => l.match && l.match.status === 'recusado');
  const listaAtual = aba === 'pendentes' ? pendentes : aba === 'aprovados' ? aprovados : recusados;

  const drawerStatus = drawer && drawer.match ? drawer.match.status : 'pendente';

  return (
    <div className="flex h-screen bg-[#F5F5F3] overflow-hidden">
      <EmpresaSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h1 className="text-base font-semibold text-gray-800">Solicitações de Adoção</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {pendentes.length} pendente{pendentes.length !== 1 ? 's' : ''} · {aprovados.length} aprovado{aprovados.length !== 1 ? 's' : ''} · {recusados.length} recusado{recusados.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Métricas */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex gap-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs text-gray-500">{pendentes.length} pendente{pendentes.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-xs text-gray-500">{aprovados.length} aprovado{aprovados.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs text-gray-500">{recusados.length} recusado{recusados.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-xs text-gray-500">{likes.length} total</span>
          </div>
        </div>

        {/* Abas */}
        <div className="bg-white border-b border-gray-200 px-6 flex gap-1 flex-shrink-0">
          {ABAS.map(({ key, label }) => {
            const count = key === 'pendentes' ? pendentes.length : key === 'aprovados' ? aprovados.length : recusados.length;
            return (
              <button
                key={key}
                onClick={() => setAba(key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  aba === key ? 'border-[#d4537e] text-[#d4537e]' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${aba === key ? 'bg-pink-100 text-[#d4537e]' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Carregando...</div>
          ) : listaAtual.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="text-4xl">{aba === 'pendentes' ? '🐱' : aba === 'aprovados' ? '✅' : '❌'}</div>
              <p className="text-gray-400 text-sm">
                {aba === 'pendentes' ? 'Nenhuma solicitação pendente' : aba === 'aprovados' ? 'Nenhuma aprovação ainda' : 'Nenhuma recusa ainda'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-3xl">
              {listaAtual.map((like, i) => {
                const cor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <div key={like.likeId} className="bg-white border border-gray-200 rounded-2xl p-5">

                    {/* Cabeçalho do card */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${cor}`}>
                        {avatarIniciais(like.usuario.nome)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{like.usuario.nome}</p>
                        <p className="text-xs text-gray-400">{like.usuario.email} · {like.createdAt}</p>
                      </div>
                      {like.match && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[like.match.status] ? STATUS_CONFIG[like.match.status].bg : ''} ${STATUS_CONFIG[like.match.status] ? STATUS_CONFIG[like.match.status].text : ''}`}>
                          {STATUS_CONFIG[like.match.status] ? STATUS_CONFIG[like.match.status].label : ''}
                        </span>
                      )}
                    </div>

                    {/* Duas colunas */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Gato */}
                      <div className="bg-[#F5F5F3] rounded-xl p-3">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Gato solicitado</p>
                        <div className="flex items-center gap-2 mb-2">
                          {like.gato.fotoPrincipal ? (
                            <img src={like.gato.fotoPrincipal} alt={like.gato.nome} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-lg flex-shrink-0">🐱</div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{like.gato.nome}</p>
                            {like.gato.raca && <p className="text-xs text-gray-400">{like.gato.raca}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Perfil resumido */}
                      <div className="bg-[#F5F5F3] rounded-xl p-3">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Perfil adotante</p>
                        <p className="text-xs text-gray-400 italic">Clique em "Ver perfil" para detalhes</p>
                      </div>
                    </div>

                    {/* Rodapé do card */}
                    <div className="flex items-center justify-between">
                      {like.match && like.match.comentario && (
                        <p className="text-xs text-gray-400 italic truncate flex-1 mr-3">"{like.match.comentario}"</p>
                      )}
                      {!like.match && <div />}
                      <button
                        onClick={() => abrirDrawer(like)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
                      >
                        Ver perfil <FaChevronRight size={10} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Drawer lateral */}
      {drawer && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={fecharDrawer} />
          <div className="fixed right-0 top-0 bottom-0 w-[360px] bg-white z-50 flex flex-col shadow-2xl">

            {/* Header do drawer */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${AVATAR_COLORS[0]}`}>
                  {avatarIniciais(drawer.usuario.nome)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{drawer.usuario.nome}</p>
                  <p className="text-xs text-gray-400">{drawer.usuario.email}</p>
                </div>
              </div>
              <button onClick={fecharDrawer} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaTimes size={16} />
              </button>
            </div>

            {/* Gato no drawer */}
            <div className="px-5 py-3 bg-pink-50 border-b border-pink-100 flex items-center gap-3 flex-shrink-0">
              {drawer.gato.fotoPrincipal ? (
                <img src={drawer.gato.fotoPrincipal} alt={drawer.gato.nome} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-lg flex-shrink-0">🐱</div>
              )}
              <div>
                <p className="text-xs text-gray-400">Quer adotar</p>
                <p className="text-sm font-semibold text-[#d4537e]">{drawer.gato.nome}</p>
              </div>
              <p className="text-xs text-gray-400 ml-auto">{drawer.createdAt}</p>
            </div>

            {/* Corpo do drawer */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

              {loadingPerfil ? (
                <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Carregando perfil...</div>
              ) : !perfil ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
                  <FaUser size={28} className="text-gray-200" />
                  <p className="text-sm text-gray-400">Perfil não preenchido</p>
                  <p className="text-xs text-gray-300">O adotante ainda não cadastrou seu perfil</p>
                </div>
              ) : (
                <>
                  {/* Dados pessoais */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaUser size={12} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dados pessoais</p>
                    </div>
                    <div className="bg-[#F5F5F3] rounded-xl p-3">
                      <InfoRow label="Nascimento" value={perfil.dataNascimento} />
                    </div>
                  </div>

                  {/* Endereço */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt size={12} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</p>
                    </div>
                    <div className="bg-[#F5F5F3] rounded-xl p-3">
                      <InfoRow label="Rua"    value={perfil.enderecoRua} />
                      <InfoRow label="Bairro" value={perfil.enderecoBairro} />
                      <InfoRow label="Cidade" value={perfil.enderecoCidade} />
                      <InfoRow label="Estado" value={perfil.enderecoEstado} />
                      <InfoRow label="CEP"    value={perfil.enderecoCep} />
                    </div>
                  </div>

                  {/* Moradia */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaHome size={12} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Moradia</p>
                    </div>
                    <div className="bg-[#F5F5F3] rounded-xl p-3">
                      <InfoRow label="Tipo" value={perfil.tipoMoradia === 'casa' ? 'Casa 🏠' : perfil.tipoMoradia === 'apartamento' ? 'Apartamento 🏢' : null} />
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                        <span className="text-xs text-gray-400">Moradia própria</span>
                        <Chip ok={perfil.moradiaPropria} />
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                        <span className="text-xs text-gray-400">Contrato permite animais</span>
                        <Chip ok={perfil.contratoPermiteAnimais} />
                      </div>
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-xs text-gray-400">Telas de proteção</span>
                        <Chip ok={perfil.temTelasProtecao} />
                      </div>
                    </div>
                  </div>

                  {/* Outros animais */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaPaw size={12} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Outros animais</p>
                    </div>
                    <div className="bg-[#F5F5F3] rounded-xl p-3">
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                        <span className="text-xs text-gray-400">Tem outros animais</span>
                        <Chip ok={perfil.temOutrosAnimais} />
                      </div>
                      {perfil.temOutrosAnimais && (
                        <>
                          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                            <span className="text-xs text-gray-400">Vacinados e castrados</span>
                            <Chip ok={perfil.animaisVacinadosCastrados} />
                          </div>
                          <InfoRow label="Comportamento" value={perfil.comportamentoOutrosAnimais} />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Motivação */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaHeart size={12} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Motivação</p>
                    </div>
                    <div className="bg-[#F5F5F3] rounded-xl p-3">
                      <InfoRow label="Finalidade" value={FINALIDADE[perfil.finalidadeAdocao]} />
                      {perfil.motivoAdocao && (
                        <div className="pt-2">
                          <p className="text-xs text-gray-400 mb-1">Motivo</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{perfil.motivoAdocao}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Campo de comentário — só pra pendentes */}
              {drawerStatus === 'pendente' && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Comentário <span className="text-gray-300 font-normal normal-case">(opcional)</span></p>
                  <textarea
                    rows={3}
                    placeholder="Ex: Perfil aprovado! Entre em contato para finalizar."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-700 placeholder-gray-300 outline-none focus:border-pink-400 transition-colors resize-none"
                  />
                </div>
              )}

              {erro && <p className="text-xs text-red-500">{erro}</p>}
            </div>

            {/* Rodapé do drawer */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-2 flex-shrink-0">
              {drawerStatus === 'pendente' && (
                <>
                  <button
                    onClick={() => handleDecisao('recusado')}
                    disabled={salvando}
                    className="flex-1 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <FaTimes size={12} /> Recusar
                  </button>
                  <button
                    onClick={() => handleDecisao('aprovado')}
                    disabled={salvando}
                    className="flex-1 py-2.5 text-sm text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: '#d4537e' }}
                  >
                    <FaCheck size={12} /> Aprovar
                  </button>
                </>
              )}
              {drawerStatus === 'aprovado' && (
                <button
                  onClick={handleConfirmarAdocao}
                  disabled={salvando}
                  className="flex-1 py-2.5 text-sm text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: '#d4537e' }}
                >
                  <FaHeart size={12} /> Confirmar adoção
                </button>
              )}
              {drawerStatus === 'recusado' && (
                <p className="text-xs text-gray-400 text-center w-full py-2">Solicitação recusada</p>
              )}
            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default EmpresaMatches;