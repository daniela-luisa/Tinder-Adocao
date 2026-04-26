function InputAdmin({ label, type = 'text', placeholder, value, onChange, maxLength, min, max, required, as: As = 'input', rows, children }) {
  const cls = 'border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#d4537e] transition-colors w-full bg-white';

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-600">
          {label} {required && <span className="text-pink-500">*</span>}
        </label>
      )}
      {As === 'textarea' ? (
        <textarea
          className={cls + ' resize-none'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows || 3}
        />
      ) : As === 'select' ? (
        <select className={cls} value={value} onChange={onChange}>
          {children}
        </select>
      ) : (
        <input
          className={cls}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          min={min}
          max={max}
        />
      )}
    </div>
  );
}

export default InputAdmin;