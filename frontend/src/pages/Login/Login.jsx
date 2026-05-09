import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import InputSenha from '../../components/InputSenha';
import Input from '../../components/Input';
import Button from '../../components/button';

function Login() {
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
      const data = await api.post('/usuario/login', { email, senha });

      if (data.usuario) {
        localStorage.setItem('usuario_id', data.usuario.id);
        localStorage.setItem('usuario_nome', data.usuario.nome);
      }

      navigate('/home');
    } catch (err) {
      setErro('E-mail ou senha incorretos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#fff8f0]">

      <div className="w-full max-w-[420px] mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all hover:-translate-x-1 duration-300"
        >
          <FaArrowLeft size={16} />
          <span className="text-base font-medium">Voltar</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-6 sm:p-10 w-full max-w-[420px] flex flex-col items-center gap-6">

        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#ff399f] to-[#fd7a1c]">
            <FaHeart size={32} className="text-white" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FC008C] to-[#e66000] bg-clip-text text-transparent">
              MiauMatch
            </h1>
            <p className="text-gray-600 text-sm">Entre na sua conta</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
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

          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

          <Button text={loading ? 'Entrando...' : 'Entrar'} type="submit" disabled={loading} />
        </form>

        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-400 text-sm">ou</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <p className="text-gray-500 text-sm">
          Não tem uma conta?{' '}
          <span
            onClick={() => navigate('/cadastro')}
            className="font-semibold cursor-pointer"
            style={{ color: '#f9437a' }}
          >
            Registre-se
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;