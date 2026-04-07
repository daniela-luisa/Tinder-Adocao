import { useState } from 'react';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function InputSenha({ label, placeholder, value, onChange }) {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="flex flex-col gap-1 w-full min-w-0">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-pink-500 transition-colors bg-white">
        <RiLockPasswordLine size={18} className="text-gray-400 shrink-0" />
        <input
          type={mostrar ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
        />
        <button
          type="button"
          onClick={() => setMostrar(!mostrar)}
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        >
          {mostrar ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default InputSenha;