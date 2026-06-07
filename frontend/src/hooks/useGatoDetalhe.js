import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function formatarIdade(idadeMeses) {
  if (!idadeMeses && idadeMeses !== 0) return null;
  const anos = Math.floor(idadeMeses / 12);
  const meses = idadeMeses % 12;
  if (anos === 0) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  if (meses === 0) return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  return `${anos}a ${meses}m`;
}

export { formatarIdade };

function useGatoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gato,      setGato]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [jaCurtiu,  setJaCurtiu]  = useState(false);
  const [curtindo,  setCurtindo]  = useState(false);
  const [toast,     setToast]     = useState(null);

  const usuarioId = Number(localStorage.getItem('usuario_id'));

  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get(`/gato/readoneid/${id}`);
        setGato(res.gato);

        if (usuarioId) {
          try {
            const resLikes = await api.get(`/likeUsuario/readallbyusuario/${usuarioId}`);
            const jasCurtidos = resLikes.gatoIds || [];
            setJaCurtiu(jasCurtidos.includes(Number(id)));
          } catch {
            setJaCurtiu(false);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar gato:', err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id, usuarioId]);

  function showToast(msg, tipo = 'success') {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleCurtir() {
    if (!usuarioId || jaCurtiu || curtindo) return;
    setCurtindo(true);
    try {
      await api.post('/likeUsuario/create', { usuarioId, gatoId: Number(id) });
      setJaCurtiu(true);
      showToast(`❤️ Você curtiu ${gato.nome}!`);
      setTimeout(() => navigate('/home'), 1800);
    } catch (err) {
      showToast(err?.erro || 'Erro ao curtir. Tente novamente.', 'erro');
    } finally {
      setCurtindo(false);
    }
  }

  return {
    gato, loading,
    fotoAtiva, setFotoAtiva,
    jaCurtiu, curtindo,
    toast,
    handleCurtir,
  };
}

export default useGatoDetalhe;