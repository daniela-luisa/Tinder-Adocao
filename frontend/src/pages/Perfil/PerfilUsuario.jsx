import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaMapMarkerAlt, FaHome, FaPaw, FaHeart,
  FaEdit, FaSave, FaTimes, FaChevronDown
} from 'react-icons/fa';
import { MdApartment, MdHouse } from 'react-icons/md';
import { api } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import HomeHeader from '../../components/HomeHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ToggleSaude from '../../components/Togglesaude';


function Toggle({ label, sub, value, onChange }) {
  return <ToggleSaude label={label} sub={sub} value={value} onChange={onChange} />;
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff399f] to-[#fd7a1c] flex items-center justify-center">
          <Icon size={14} className="text-white" />
        </div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-2 py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right">
        {value !== undefined && value !== null && value !== '' ? String(value) : <span className="text-gray-300 italic">Não informado</span>}
      </span>
    </div>
  );
}

function BadgeBool({ value }) {
  if (value === true)  return <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Sim</span>;
  if (value === false) return <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">Não</span>;
  return <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full">—</span>;
}

const FINALIDADE_LABEL = {
  companhia: 'Companhia',
  terapia:   'Apoio emocional / terapia',
  presente:  'Presente',
  outro:     'Outro',
};


function PerfilUsuario() {
  const navigate   = useNavigate();
  const usuarioId  = Number(localStorage.getItem('usuario_id'));
  const usuarioNome = localStorage.getItem('usuario_nome') || '';

  const [perfil,    setPerfil]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [editando,  setEditando]  = useState(false);
  const [salvando,  setSalvando]  = useState(false);
  const [erro,      setErro]      = useState(null);
  const [sucesso,   setSucesso]   = useState(false);

  // campos do formulário
  const [form, setForm] = useState({
    dataNascimento:           '',
    enderecoRua:              '',
    enderecoBairro:           '',
    enderecoCidade:           '',
    enderecoEstado:           '',
    enderecoCep:              '',
    tipoMoradia:              '',
    moradiaPropria:           false,
    contratoPermiteAnimais:   false,
    temTelasProtecao:         false,
    temOutrosAnimais:         false,
    animaisVacinadosCastrados: false,
    comportamentoOutrosAnimais: '',
    motivoAdocao:             '',
    finalidadeAdocao:         '',
  });

  useEffect(() => {
    async function carregar() {
      if (!usuarioId) { setLoading(false); return; }
      try {
        const res = await api.get(`/perfilAdotante/readoneid/${usuarioId}`);
        setPerfil(res.perfil);
        preencherForm(res.perfil);
      } catch {
        setPerfil(null);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [usuarioId]);

  function preencherForm(p) {
    if (!p) return;
    setForm({
      dataNascimento:            p.dataNascimento            || '',
      enderecoRua:               p.enderecoRua               || '',
      enderecoBairro:            p.enderecoBairro            || '',
      enderecoCidade:            p.enderecoCidade            || '',
      enderecoEstado:            p.enderecoEstado            || '',
      enderecoCep:               p.enderecoCep               || '',
      tipoMoradia:               p.tipoMoradia               || '',
      moradiaPropria:            p.moradiaPropria            ?? false,
      contratoPermiteAnimais:    p.contratoPermiteAnimais    ?? false,
      temTelasProtecao:          p.temTelasProtecao          ?? false,
      temOutrosAnimais:          p.temOutrosAnimais          ?? false,
      animaisVacinadosCastrados: p.animaisVacinadosCastrados ?? false,
      comportamentoOutrosAnimais: p.comportamentoOutrosAnimais || '',
      motivoAdocao:              p.motivoAdocao              || '',
      finalidadeAdocao:          p.finalidadeAdocao          || '',
    });
  }

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }
  function toggle(field) {
    return () => setForm((f) => ({ ...f, [field]: !f[field] }));
  }


  async function handleSalvar() {
    setErro(null);
    setSalvando(true);
    try {
      const endpoint = perfil
        ? `/perfilAdotante/update/${usuarioId}`
        : `/perfilAdotante/create`;

      const body = perfil
        ? { ...form, userId: usuarioId }
        : { ...form, userId: usuarioId };

      const method = perfil ? 'put' : 'post';
      const res = await api[method](endpoint, body);

      setPerfil(res.perfil);
      preencherForm(res.perfil);
      setEditando(false);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch (err) {
      setErro(err?.erro || 'Erro ao salvar perfil. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  function handleCancelar() {
    preencherForm(perfil);
    setEditando(false);
    setErro(null);
  }


  function handleCep(e) {
    const v = e.target.value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
    setForm((f) => ({ ...f, enderecoCep: v }));
  }


  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50">
      <HomeHeader />

      <main className="px-4 pb-28 pt-4 max-w-lg mx-auto flex flex-col gap-4">

        {/* ── Cabeçalho do perfil ── */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff399f] to-[#fd7a1c] flex items-center justify-center flex-shrink-0">
            <FaUser size={28} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-gray-800 truncate">{usuarioNome}</p>
            <p className="text-sm text-gray-400">
              {perfil ? 'Perfil de adotante' : 'Perfil ainda não preenchido'}
            </p>
            {perfil && (
              <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                ✓ Perfil completo
              </span>
            )}
            {!perfil && !loading && (
              <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                Preencha seu perfil
              </span>
            )}
          </div>

          {!editando && (
            <button
              onClick={() => setEditando(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 text-[#d4537e] text-sm font-medium hover:bg-pink-100 transition-colors"
            >
              <FaEdit size={14} />
              {perfil ? 'Editar' : 'Preencher'}
            </button>
          )}
        </div>

        {/* ── Feedback de sucesso ── */}
        {sucesso && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm text-green-700 font-medium flex items-center gap-2">
            <FaHeart size={14} className="text-green-500" /> Perfil salvo com sucesso!
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-400 text-sm">Carregando perfil...</p>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            MODO VISUALIZAÇÃO
        ══════════════════════════════════════════════ */}
        {!loading && !editando && perfil && (
          <>
            {/* Dados pessoais */}
            <Section icon={FaUser} title="Dados pessoais">
              <InfoRow label="Data de nascimento" value={perfil.dataNascimento} />
            </Section>

            {/* Endereço */}
            <Section icon={FaMapMarkerAlt} title="Endereço">
              <InfoRow label="Rua"     value={perfil.enderecoRua} />
              <InfoRow label="Bairro"  value={perfil.enderecoBairro} />
              <InfoRow label="Cidade"  value={perfil.enderecoCidade} />
              <InfoRow label="Estado"  value={perfil.enderecoEstado} />
              <InfoRow label="CEP"     value={perfil.enderecoCep} />
            </Section>

            {/* Moradia */}
            <Section icon={FaHome} title="Moradia">
              <InfoRow
                label="Tipo de moradia"
                value={perfil.tipoMoradia === 'casa' ? 'Casa 🏠' : perfil.tipoMoradia === 'apartamento' ? 'Apartamento 🏢' : null}
              />
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Moradia própria</span>
                <BadgeBool value={perfil.moradiaPropria} />
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Contrato permite animais</span>
                <BadgeBool value={perfil.contratoPermiteAnimais} />
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Tem telas de proteção</span>
                <BadgeBool value={perfil.temTelasProtecao} />
              </div>
            </Section>

            {/* Animais */}
            <Section icon={FaPaw} title="Outros animais">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Tem outros animais</span>
                <BadgeBool value={perfil.temOutrosAnimais} />
              </div>
              {perfil.temOutrosAnimais && (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Vacinados e castrados</span>
                    <BadgeBool value={perfil.animaisVacinadosCastrados} />
                  </div>
                  <InfoRow label="Comportamento" value={perfil.comportamentoOutrosAnimais} />
                </>
              )}
            </Section>

            {/* Adoção */}
            <Section icon={FaHeart} title="Sobre a adoção">
              <InfoRow label="Finalidade"   value={FINALIDADE_LABEL[perfil.finalidadeAdocao]} />
              <div className="flex flex-col gap-1 py-2">
                <span className="text-sm text-gray-500">Motivo da adoção</span>
                <p className="text-sm font-medium text-gray-800 leading-relaxed">
                  {perfil.motivoAdocao || <span className="text-gray-300 italic">Não informado</span>}
                </p>
              </div>
            </Section>
          </>
        )}

        {/* ── Sem perfil ainda (visualização) ── */}
        {!loading && !editando && !perfil && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="text-5xl">🐾</div>
            <p className="text-gray-700 font-semibold">Seu perfil ainda não foi preenchido</p>
            <p className="text-gray-400 text-sm max-w-xs">
              Preencha seu perfil de adotante para aumentar suas chances de fazer um match!
            </p>
            <button
              onClick={() => setEditando(true)}
              className="mt-1 px-6 py-2.5 bg-gradient-to-r from-[#FF308C] to-[#FF7200] text-white rounded-full text-sm font-semibold shadow-md hover:opacity-90 transition-opacity"
            >
              Preencher agora
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            MODO EDIÇÃO
        ══════════════════════════════════════════════ */}
        {!loading && editando && (
          <>
            {/* Dados pessoais */}
            <Section icon={FaUser} title="Dados pessoais">
              <Input
                label="Data de nascimento"
                type="date"
                value={form.dataNascimento}
                onChange={set('dataNascimento')}
              />
            </Section>

            {/* Endereço */}
            <Section icon={FaMapMarkerAlt} title="Endereço">
              <Input label="Rua"    placeholder="Ex: Rua das Flores, 123" value={form.enderecoRua}    onChange={set('enderecoRua')} />
              <div className="flex gap-3">
                <Input label="Bairro"  placeholder="Bairro"   value={form.enderecoBairro}  onChange={set('enderecoBairro')} />
                <Input label="CEP"     placeholder="00000-000" value={form.enderecoCep}      onChange={handleCep} />
              </div>
              <div className="flex gap-3">
                <Input label="Cidade"  placeholder="Cidade"   value={form.enderecoCidade}  onChange={set('enderecoCidade')} />
                <div className="flex flex-col gap-2 w-full min-w-0">
                  <label className="ml-1 text-sm font-medium text-gray-700">Estado</label>
                  <div className="relative">
                    <select
                      value={form.enderecoEstado}
                      onChange={set('enderecoEstado')}
                      className="w-full appearance-none border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-700 bg-white focus:border-pink-500 focus:border-2 outline-none transition-colors pr-8"
                    >
                      <option value="">UF</option>
                      {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                    <FaChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </Section>

            {/* Moradia */}
            <Section icon={FaHome} title="Moradia">
              <div className="flex flex-col gap-2">
                <label className="ml-1 text-sm font-medium text-gray-700">Tipo de moradia</label>
                <div className="flex gap-3">
                  {[
                    { val: 'casa',       label: 'Casa',        Icon: MdHouse },
                    { val: 'apartamento', label: 'Apartamento', Icon: MdApartment },
                  ].map(({ val, label, Icon }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, tipoMoradia: val }))}
                      className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        form.tipoMoradia === val
                          ? 'border-[#d4537e] bg-pink-50 text-[#d4537e]'
                          : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      <Icon size={22} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                <Toggle label="Moradia própria"            sub="Você é dono do imóvel?"                   value={form.moradiaPropria}          onChange={toggle('moradiaPropria')} />
                <Toggle label="Contrato permite animais"   sub="Caso seja alugado, o contrato permite?"    value={form.contratoPermiteAnimais}  onChange={toggle('contratoPermiteAnimais')} />
                <Toggle label="Tem telas de proteção"      sub="Janelas e varandas protegidas?"            value={form.temTelasProtecao}        onChange={toggle('temTelasProtecao')} />
              </div>
            </Section>

            {/* Outros animais */}
            <Section icon={FaPaw} title="Outros animais">
              <Toggle label="Tem outros animais" sub="Você já tem pets em casa?" value={form.temOutrosAnimais} onChange={toggle('temOutrosAnimais')} />

              {form.temOutrosAnimais && (
                <div className="flex flex-col gap-4 pt-1">
                  <Toggle label="Vacinados e castrados" sub="Seus animais estão em dia?" value={form.animaisVacinadosCastrados} onChange={toggle('animaisVacinadosCastrados')} />
                  <div className="flex flex-col gap-2">
                    <label className="ml-1 text-sm font-medium text-gray-700">Comportamento dos animais</label>
                    <textarea
                      rows={3}
                      placeholder="Descreva como seus animais se comportam com outros bichos..."
                      value={form.comportamentoOutrosAnimais}
                      onChange={set('comportamentoOutrosAnimais')}
                      className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-pink-500 focus:border-2 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}
            </Section>

            {/* Sobre a adoção */}
            <Section icon={FaHeart} title="Sobre a adoção">
              <div className="flex flex-col gap-2">
                <label className="ml-1 text-sm font-medium text-gray-700">Finalidade da adoção</label>
                <div className="relative">
                  <select
                    value={form.finalidadeAdocao}
                    onChange={set('finalidadeAdocao')}
                    className="w-full appearance-none border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-700 bg-white focus:border-pink-500 focus:border-2 outline-none transition-colors pr-8"
                  >
                    <option value="">Selecione...</option>
                    <option value="companhia">Companhia</option>
                    <option value="terapia">Apoio emocional / terapia</option>
                    <option value="presente">Presente</option>
                    <option value="outro">Outro</option>
                  </select>
                  <FaChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="ml-1 text-sm font-medium text-gray-700">Por que você quer adotar?</label>
                <textarea
                  rows={4}
                  placeholder="Conte um pouco sobre sua motivação para adotar um gatinho..."
                  value={form.motivoAdocao}
                  onChange={set('motivoAdocao')}
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-pink-500 focus:border-2 transition-colors resize-none"
                />
              </div>
            </Section>

            {/* Erro */}
            {erro && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600">
                {erro}
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelar}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-base hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <FaTimes size={14} /> Cancelar
              </button>
              <button
                onClick={handleSalvar}
                disabled={salvando}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF308C] to-[#FF7200] text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <FaSave size={14} /> {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </>
        )}

      </main>

      <BottomNav />
    </div>
  );
}

export default PerfilUsuario;
