import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';

function useEmpresaGatos() {
  const location = useLocation();

  const [gatos, setGatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState([]);
  const [filtroSexo, setFiltroSexo] = useState([]);
  const [confirmarExcluir, setConfirmarExcluir] = useState(null);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const res = await api.get('/gato/readall');
        const ordenados = (res.gatos || []).slice().sort((a, b) => b.id - a.id);
        setGatos(ordenados);
      } catch (err) {
        console.error('Erro ao carregar gatos:', err);
        setGatos([]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [location.key]);

  function toggleFiltro(lista, setLista, valor) {
    setLista((prev) => prev.includes(valor) ? prev.filter((v) => v !== valor) : [...prev, valor]);
  }

  function limparFiltros() {
    setFiltroStatus([]);
    setFiltroSexo([]);
    setBusca('');
  }

  async function handleExcluir(id) {
    try {
      await api.delete(`/gato/delete/${id}`);
      setGatos((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Erro ao excluir gato:', err);
    } finally {
      setConfirmarExcluir(null);
    }
  }

  const gatosFiltrados = gatos.filter((g) => {
    const matchBusca = g.nome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus.length === 0 || filtroStatus.includes(g.status);
    const matchSexo = filtroSexo.length === 0 || filtroSexo.includes(g.sexo);
    return matchBusca && matchStatus && matchSexo;
  });

  const contadores = {
    total: gatos.length,
    disponivel: gatos.filter((g) => g.status === 'disponivel').length,
    em_processo: gatos.filter((g) => g.status === 'em_processo').length,
    adotado: gatos.filter((g) => g.status === 'adotado').length,
  };

  const filtrosAtivos = filtroStatus.length + filtroSexo.length + (busca ? 1 : 0);

  return {
    gatos, gatosFiltrados, loading, contadores,
    busca, setBusca,
    filtroStatus, filtroSexo, filtrosAtivos,
    confirmarExcluir, setConfirmarExcluir,
    toggleFiltro, setFiltroStatus, setFiltroSexo,
    limparFiltros, handleExcluir,
  };
}

export default useEmpresaGatos;