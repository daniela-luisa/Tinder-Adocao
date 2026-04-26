// Componente de seleção múltipla por tags (personalidades, deficiências)
function SeletorTags({ opcoes, selecionadas, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opcoes.map((opcao) => {
        const ativo = selecionadas.includes(opcao.id);
        return (
          <button
            key={opcao.id}
            type="button"
            onClick={() => onToggle(opcao.id)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              ativo
                ? 'bg-pink-50 border-[#d4537e] text-[#d4537e] font-medium'
                : 'border-gray-200 text-gray-500'
            }`}
          >
            {opcao.nome}
          </button>
        );
      })}
    </div>
  );
}

export default SeletorTags;