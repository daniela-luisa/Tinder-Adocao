import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { FaArrowLeft, FaHeart, FaRegUser, FaRegAddressCard } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import Input from '../../components/Input';
import InputSenha from '../../components/InputSenha';
import Button from '../../components/button';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleCadastro(e) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      await api.post('/usuario/create', { nome, email, senha, cpf });
      navigate('/login');
    } catch (err) {
      setErro(err.erro || 'Erro ao realizar cadastro.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#fff8f0]">

      <div className="w-full max-w-[600px] mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all hover:-translate-x-1 duration-300"
        >
          <FaArrowLeft size={16} />
          <span className="text-base font-medium">Voltar</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-6 sm:p-10 w-full max-w-[600px] flex flex-col items-center gap-6">

        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#ff399f] to-[#fd7a1c]">
            <FaHeart className="text-white text-base sm:text-3xl" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-[#FC008C] to-[#e66000] bg-clip-text text-transparent">
              MiauMatch
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">Crie sua conta</p>
          </div>
        </div>

        <form onSubmit={handleCadastro} className="w-full flex flex-col gap-4">

          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              icon={FaRegUser}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Input
              label="CPF"
              type="text"
              placeholder="000.000.000-00"
              icon={FaRegAddressCard}
              value={cpf}
              onChange={(e) => {
                const valor = e.target.value
                  .replace(/\D/g, '')
                  .replace(/(\d{3})(\d)/, '$1.$2')
                  .replace(/(\d{3})(\d)/, '$1.$2')
                  .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                  .slice(0, 14);
                setCpf(valor);
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
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
          </div>

          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

          <Button text={loading ? 'Cadastrando...' : 'Cadastrar'} type="submit" disabled={loading} />
        </form>

        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-400 text-sm">ou</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <p className="text-gray-500 text-sm">
          Já tem uma conta?{' '}
          <span
            onClick={() => navigate('/login')}
            className="font-semibold cursor-pointer"
            style={{ color: '#f9437a' }}
          >
            Entre aqui
          </span>
        </p>

      </div>
    </div>
  );
}

export default Cadastro;