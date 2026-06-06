import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useEmpresaMatches() {
  const [likes,         setLikes]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [aba,           setAba]           = useState('pendentes');
  const [drawer,        setDrawer]        = useState(null);
  const [perfil,        setPerfil]        = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [comentario,    setComentario]    = useState('');
  const [salvando,      setSalvando]      = useState(false);
  const [erro,          setErro]          = useState(null);

  async function carregar() {
    try {
      const res = await api.get('/likeUsuario/readallbyempresa');
      setLikes(res.likes || []);
    } catch {
      setLikes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function abrirDrawer(like) {
    setDrawer(like);
    setPerfil(null);
    setComentario('');
    setErro(null);
    setLoadingPerfil(true);
    try {
      const res = await api.get(`/perfilAdotante/readoneid/${like.usuario.id}`);
      setPerfil(res.perfil);
    } catch {
      setPerfil(null);
    } finally {
      setLoadingPerfil(false);
    }
  }

  function fecharDrawer() {
    setDrawer(null);
    setPerfil(null);
    setErro(null);
  }

  async function handleDecisao(status) {
    if (!drawer) return;
    setErro(null);
    setSalvando(true);
    try {
      await api.post('/match/create', {
        likeId: drawer.likeId,
        status,
        comentario: comentario.trim() || undefined,
      });
      fecharDrawer();
      await carregar();
    } catch (err) {
      setErro(err && err.erro ? err.erro : 'Erro ao processar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleConfirmarAdocao() {
    if (!drawer || !drawer.match) return;
    setErro(null);
    setSalvando(true);
    try {
      await api.put(`/gato/update/${drawer.gato.id}`, { status: 'adotado' });
      fecharDrawer();
      await carregar();
    } catch (err) {
      setErro(err && err.erro ? err.erro : 'Erro ao confirmar adoção.');
    } finally {
      setSalvando(false);
    }
  }

  const pendentes  = likes.filter((l) => !l.match);
  const aprovados  = likes.filter((l) => l.match && l.match.status === 'aprovado');
  const recusados  = likes.filter((l) => l.match && l.match.status === 'recusado');
  const listaAtual = aba === 'pendentes' ? pendentes : aba === 'aprovados' ? aprovados : recusados;
  const drawerStatus = drawer && drawer.match ? drawer.match.status : 'pendente';

  return {
    likes, loading, aba, setAba,
    drawer, perfil, loadingPerfil,
    comentario, setComentario,
    salvando, erro,
    pendentes, aprovados, recusados, listaAtual,
    drawerStatus,
    abrirDrawer, fecharDrawer,
    handleDecisao, handleConfirmarAdocao,
  };
}