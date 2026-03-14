function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Tailwind funcionou! 🎉</h1>
        <p className="text-gray-500 text-lg">Se você está vendo isso com estilo, está tudo certo.</p>
        <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Botão de teste
        </button>
      </div>
    </div>
  )
}

export default App