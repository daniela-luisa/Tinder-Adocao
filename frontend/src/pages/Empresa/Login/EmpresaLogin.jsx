import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { HiOutlineMail } from 'react-icons/hi';
import Input from '../../../components/Input';
import InputSenha from '../../../components/InputSenha';
import { FaArrowLeft, FaHeart } from "react-icons/fa";


function EmpresaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const data = await api.post('/empresa/login', { email, senha });

      // Salva id e nome da empresa para uso na sidebar e outras páginas
      localStorage.setItem('empresa_id', data.empresa.id);
      localStorage.setItem('empresa_nome', data.empresa.nome);

      navigate('/empresa/home');
    } catch (err) {
      setErro('E-mail ou senha incorretos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F3]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 w-full max-w-[420px] flex flex-col gap-6">

        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-semibold" style={{ color: '#d4537e' }}>
            MiauMatch
          </h1>
          <p className="text-gray-500 text-sm">Painel Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            icon={HiOutlineMail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputSenha
            label="Senha"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && (
            <p className="text-red-500 text-sm text-center">{erro}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-medium text-sm transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 mt-1"
            style={{ backgroundColor: '#d4537e' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Esqueci minha senha
        </p>

      </div>
    </div>
  );
}

export default EmpresaLogin;