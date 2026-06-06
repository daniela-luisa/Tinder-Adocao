import { FaChevronRight } from 'react-icons/fa';
import { corPorUsuario, avatarIniciais, formatarIdade, STATUS_CONFIG } from './matchUtils';

function TagSaude({ label }) {
  return <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">{label}</span>;
}

function InfoItem({ label, value }) {
  if (!value && value !== false) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-medium text-gray-700">{value}</span>
    </div>
  );
}

function LikeCard({ like, onVerPerfil }) {
  const cor = corPorUsuario(like.usuario.id);
  const idade = formatarIdade(like.gato.idadeMeses);
  const statusCfg = like.match ? STATUS_CONFIG[like.match.status] : null;

  const tipoMoradiaLabel = like.usuario.tipoMoradia === 'casa'
    ? 'Casa 🏠'
    : like.usuario.tipoMoradia === 'apartamento'
    ? 'Apartamento 🏢'
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

      {/* Topo */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${cor}`}>
          {avatarIniciais(like.usuario.nome)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{like.usuario.nome}</p>
          <p className="text-xs text-gray-400 truncate">{like.usuario.email} · {like.createdAt}</p>
        </div>
        {statusCfg && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusCfg.bg} ${statusCfg.text}`}>
            {statusCfg.label}
          </span>
        )}
      </div>

      {/* Corpo — adotante | divisória | gato */}
      <div className="flex items-stretch px-5 py-4 gap-5">

        {/* Adotante */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Adotante</p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <InfoItem label="Nome" value={like.usuario.nome} />

            {tipoMoradiaLabel && <InfoItem label="Moradia" value={tipoMoradiaLabel} />}
            {like.usuario.temOutrosAnimais !== undefined && (
                <InfoItem label="Outros animais" value={like.usuario.temOutrosAnimais ? 'Sim' : 'Não'} />
            )}
            {like.usuario.temTelasProtecao !== undefined && (
                <InfoItem label="Telas proteção" value={like.usuario.temTelasProtecao ? 'Sim' : 'Não'} />
            )}
            </div>
        </div>

        {/* Divisória */}
        <div className="w-px bg-gray-100 flex-shrink-0" />

        {/* Gato */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Gato solicitado</p>

          <div className="flex items-center gap-2">
            {like.gato.fotoPrincipal ? (
              <img src={like.gato.fotoPrincipal} alt={like.gato.nome} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-base flex-shrink-0">🐱</div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{like.gato.nome}</p>
              <p className="text-xs text-gray-400 truncate">
                {[like.gato.raca, like.gato.sexo === 'M' ? 'Macho' : like.gato.sexo === 'F' ? 'Fêmea' : null, idade]
                  .filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {like.gato.vacinado    && <TagSaude label="Vacinado" />}
            {like.gato.castrado    && <TagSaude label="Castrado" />}
            {like.gato.vermifugado && <TagSaude label="Vermifugado" />}
          </div>
        </div>

      </div>

      {/* Rodapé */}
      <div className="flex items-center justify-between px-5 py-4 pt-1">
        {like.match && like.match.comentario ? (
          <p className="text-xs text-gray-400 italic truncate mr-3">"{like.match.comentario}"</p>
        ) : <div />}
        <button
          onClick={() => onVerPerfil(like)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          Ver perfil <FaChevronRight size={10} />
        </button>
      </div>

    </div>
  );
}

export default LikeCard;