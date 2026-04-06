function Input({ label, type = 'text', placeholder, icon: Icon, value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="ml-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3 py-3 focus-within:border-pink-500 focus-within:border-2 transition-colors bg-white">
        {Icon && <Icon size={18} className="text-gray-400 shrink-0" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
        />
      </div>
    </div>
  );
}

export default Input;   