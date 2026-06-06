import { FaHeart, FaTimes, FaCheck, FaUser, FaHome, FaPaw, FaMapMarkerAlt } from 'react-icons/fa';
import { corPorUsuario, avatarIniciais, formatarData } from './matchUtils';

const FINALIDADE = {
  companhia: 'Companhia',
  terapia:   'Apoio emocional',
  presente:  'Presente',
  outro:     'Outro',
};

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

function Section({ icon: SectionIcon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <SectionIcon size={12} className="text-gray-400" />
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      </div>
      <div className="bg-[#F5F5F3] rounded-xl p-3">{children}</div>
    </div>
  );
}

function PerfilDrawer({
  drawer, perfil, loadingPerfil,
  drawerStatus, comentario, setComentario,
  salvando, erro,
  onFechar, onDecisao, onConfirmarAdocao,
}) {
  if (!drawer) return null;
  const cor = corPorUsuario(drawer.usuario.id);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onFechar} />
      <div className="fixed right-0 top-0 bottom-0 w-[360px] bg-white z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${cor}`}>
              {avatarIniciais(drawer.usuario.nome)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{drawer.usuario.nome}</p>
              <p className="text-xs text-gray-400">{drawer.usuario.email}</p>
            </div>
          </div>
          <button onClick={onFechar} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Gato */}
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

        {/* Corpo */}
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
              <Section icon={FaUser} title="Dados pessoais">
                <InfoRow label="Nascimento" value={formatarData(perfil.dataNascimento)} />
              </Section>

              <Section icon={FaMapMarkerAlt} title="Endereço">
                <InfoRow label="Rua"    value={perfil.enderecoRua} />
                <InfoRow label="Bairro" value={perfil.enderecoBairro} />
                <InfoRow label="Cidade" value={perfil.enderecoCidade} />
                <InfoRow label="Estado" value={perfil.enderecoEstado} />
                <InfoRow label="CEP"    value={perfil.enderecoCep} />
              </Section>

              <Section icon={FaHome} title="Moradia">
                <InfoRow label="Tipo" value={perfil.tipoMoradia === 'casa' ? 'Casa 🏠' : perfil.tipoMoradia === 'apartamento' ? 'Apartamento 🏢' : null} />
                <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                  <span className="text-xs text-gray-400">Moradia própria</span>
                  <Chip ok={perfil.moradiaPropria} />
                </div>
                {!perfil.moradiaPropria && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-xs text-gray-400">Contrato permite animais</span>
                    <Chip ok={perfil.contratoPermiteAnimais} />
                  </div>
                )}
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-xs text-gray-400">Telas de proteção</span>
                  <Chip ok={perfil.temTelasProtecao} />
                </div>
              </Section>

              <Section icon={FaPaw} title="Outros animais">
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
              </Section>

              <Section icon={FaHeart} title="Motivação">
                <InfoRow label="Finalidade" value={FINALIDADE[perfil.finalidadeAdocao]} />
                {perfil.motivoAdocao && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-400 mb-1">Motivo</p>
                    <p className="text-xs text-gray-700 leading-relaxed">{perfil.motivoAdocao}</p>
                  </div>
                )}
              </Section>
            </>
          )}

          {drawerStatus === 'pendente' && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Comentário <span className="text-gray-300 font-normal normal-case">(opcional)</span>
              </p>
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

        {/* Rodapé */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-2 flex-shrink-0">
          {drawerStatus === 'pendente' && (
            <>
              <button onClick={() => onDecisao('recusado')} disabled={salvando}
                className="flex-1 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                <FaTimes size={12} /> Recusar
              </button>
              <button onClick={() => onDecisao('aprovado')} disabled={salvando}
                className="flex-1 py-2.5 text-sm text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5"
                style={{ backgroundColor: '#d4537e' }}>
                <FaCheck size={12} /> Aprovar
              </button>
            </>
          )}
          {drawerStatus === 'aprovado' && (
            <button onClick={onConfirmarAdocao} disabled={salvando}
              className="flex-1 py-2.5 text-sm text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5"
              style={{ backgroundColor: '#d4537e' }}>
              <FaHeart size={12} /> Confirmar adoção
            </button>
          )}
          {drawerStatus === 'recusado' && (
            <p className="text-xs text-gray-400 text-center w-full py-2">Solicitação recusada</p>
          )}
        </div>

      </div>
    </>
  );
}

export default PerfilDrawer;