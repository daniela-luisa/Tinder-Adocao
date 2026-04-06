function Button({ text, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full py-3 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80"
      style={{
        background: 'linear-gradient(to right, #f9437a, #f97316)',
      }}
    >
      {text}
    </button>
  );
}

export default Button;