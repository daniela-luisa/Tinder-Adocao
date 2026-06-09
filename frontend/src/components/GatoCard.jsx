import { useNavigate } from 'react-router-dom';
import { GoTrash } from "react-icons/go";

const STATUS_CONFIG = {
  disponivel:  { label: 'Disponível',  cor: 'bg-green-100 text-green-700' },
  em_processo: { label: 'Em processo', cor: 'bg-amber-100 text-amber-700' },
  adotado:     { label: 'Adotado',     cor: 'bg-gray-100 text-gray-500'   },
};

const SEXO_LABEL = { M: 'Macho', F: 'Fêmea' };

function idadeLabel(meses) {
  if (!meses) { return 'Idade não informada'; }
  const a = Math.floor(meses / 12);
  const m = meses % 12;
  if (meses < 12) { return `${meses} mês(es)`; }
  return m > 0 ? `${a} ano(s) e ${m} mês(es)` : `${a} ano(s)`;
}

function GatoCard({ gato, onExcluir }) {
  const navigate = useNavigate();
  const status = STATUS_CONFIG[gato.status] || STATUS_CONFIG.disponivel;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer relative group">

      {/* Botão excluir */}
      <button
        onClick={(e) => { e.stopPropagation(); onExcluir(gato.id); }}
        className="absolute bottom-2 right-2 z-10 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        style={{ cursor: 'pointer' }}
        title="Excluir gato"
      >
        <GoTrash size={15} className="text-red-400" />
      </button>

      {/* Card clicável pra editar */}
      <div onClick={() => navigate(`/empresa/gatos/editar/${gato.id}`)}>

        {/* Foto */}
        <div className="aspect-square bg-gray-100 relative">
          {gato.fotoPrincipal ? (
            <img src={gato.fotoPrincipal} alt={gato.nome} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🐱</div>
          )}
          <span className={`absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${status.cor}`}>
            {status.label}
          </span>
          {gato.createdAt && (
            <div className="absolute top-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              Cadastrado em {gato.createdAt}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-2.5">
          <p className="font-semibold text-gray-800 text-base truncate">{gato.nome}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {gato.sexo ? SEXO_LABEL[gato.sexo] : '—'} · {idadeLabel(gato.idadeMeses)}
          </p>
          {gato.raca && <p className="text-xs text-gray-400 truncate">{gato.raca}</p>}

        </div>

      </div>
    </div>
  );
}

export default GatoCard;