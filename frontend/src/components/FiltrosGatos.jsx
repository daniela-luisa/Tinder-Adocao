const STATUS_CONFIG = {
  disponivel:  { label: 'Disponível'  },
  em_processo: { label: 'Em processo' },
  adotado:     { label: 'Adotado'     },
};

const FILTROS_STATUS = ['disponivel', 'em_processo', 'adotado'];
const FILTROS_SEXO   = ['M', 'F'];
const SEXO_LABEL     = { M: 'Macho', F: 'Fêmea' };

const tagCls = (ativo) =>
  `text-xs px-3 py-1.5 rounded-full border transition-all ${
    ativo
      ? 'bg-pink-50 border-[#d4537e] text-[#d4537e] font-medium'
      : 'border-gray-200 text-gray-500 hover:border-gray-300'
  }`;

function FiltrosGatos({ busca, setBusca, filtroStatus, filtroSexo, filtrosAtivos, onToggleStatus, onToggleSexo, onLimpar }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-shrink-0">

      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome..."
        className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#d4537e] transition-colors w-52"
      />

      <div className="h-4 w-px bg-gray-200" />

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Status:</span>
        {FILTROS_STATUS.map((s) => (
          <button key={s} onClick={() => onToggleStatus(s)} className={tagCls(filtroStatus.includes(s))}>
            {STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-gray-200" />

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Sexo:</span>
        {FILTROS_SEXO.map((s) => (
          <button key={s} onClick={() => onToggleSexo(s)} className={tagCls(filtroSexo.includes(s))}>
            {SEXO_LABEL[s]}
          </button>
        ))}
      </div>

      {filtrosAtivos > 0 && (
        <>
          <div className="h-4 w-px bg-gray-200" />
          <button onClick={onLimpar} className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            Limpar ({filtrosAtivos})
          </button>
        </>
      )}

    </div>
  );
}

export default FiltrosGatos;