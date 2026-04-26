// Componente de upload e gerenciamento de fotos do gato
function UploadFotos({ fotos, onAdd, onRemover, onDefinirPrincipal }) {
  function handleChange(e) {
    onAdd(e);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Fotos</p>

      {fotos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {fotos.map((foto, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden"
              style={{ border: `2px solid ${foto.principal ? '#d4537e' : 'transparent'}` }}
            >
              <img src={foto.preview} alt="" className="w-full h-full object-cover" />

              {foto.principal && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#d4537e] text-white text-[9px] text-center py-0.5 font-medium">
                  Principal
                </div>
              )}

              <div className="absolute top-1 right-1 flex gap-1">
                {!foto.principal && (
                  <button
                    type="button"
                    onClick={() => onDefinirPrincipal(index)}
                    className="w-5 h-5 bg-white rounded-full text-[9px] text-gray-600 flex items-center justify-center shadow"
                    title="Definir como principal"
                  >★</button>
                )}
                <button
                  type="button"
                  onClick={() => onRemover(index)}
                  className="w-5 h-5 bg-white rounded-full text-[9px] text-gray-600 flex items-center justify-center shadow"
                  title="Remover foto"
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="flex flex-col items-center justify-center gap-1 border border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-colors">
        <span className="text-gray-400 text-xl">+</span>
        <span className="text-xs text-gray-400 text-center">Adicionar foto</span>
        <span className="text-[10px] text-gray-300">JPG, PNG até 5MB</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {fotos.length > 0 && (
        <p className="text-[10px] text-gray-400 text-center mt-2">
          Clique em ★ para definir a foto principal
        </p>
      )}
    </div>
  );
}

export default UploadFotos;