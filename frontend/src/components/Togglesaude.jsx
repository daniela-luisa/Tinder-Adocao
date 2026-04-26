// Componente de toggle reutilizável para campos booleanos (vacinado, castrado, etc.)
function ToggleSaude({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${value ? 'bg-[#d4537e]' : 'bg-gray-200'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${value ? 'left-5' : 'left-1'}`} />
      </button>
    </div>
  );
}

export default ToggleSaude;