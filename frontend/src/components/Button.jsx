function Button({ text, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF308C] to-[#FF7200] text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80">
      {text}
    </button>
  );
}

export default Button;