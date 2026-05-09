import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';

function useHomeGatos() {
  const [gatos, setGatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swipedIds, setSwipedIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ locations: [], ages: [], characteristics: [] });

  const usuarioId = Number(localStorage.getItem('usuario_id'));

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const res = await api.get('/gato/readall');
        // Só mostra gatos disponíveis
        const disponiveis = (res.gatos || []).filter((g) => g.status === 'disponivel');
        setGatos(disponiveis);
      } catch (err) {
        console.error('Erro ao carregar gatos:', err);
        setGatos([]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  // Opções únicas para os filtros
  const availableLocations = useMemo(() => [], []); // backend não retorna location ainda
  const availableAges = useMemo(() => {
    const set = new Set();
    gatos.forEach((g) => {
      if (g.idadeMeses != null) {
        const anos = Math.floor(g.idadeMeses / 12);
        if (anos === 0) set.add('Filhote');
        else if (anos <= 2) set.add('Jovem');
        else set.add('Adulto');
      }
    });
    return [...set];
  }, [gatos]);

  const availableCharacteristics = useMemo(() => {
    const set = new Set();
    if (gatos.some((g) => g.vacinado)) set.add('Vacinado');
    if (gatos.some((g) => g.castrado)) set.add('Castrado');
    if (gatos.some((g) => g.vermifugado)) set.add('Vermifugado');
    return [...set];
  }, [gatos]);

  // Filtragem
  const gatosFiltrados = useMemo(() => {
    let result = gatos.filter((g) => !swipedIds.includes(g.id));

    if (filters.ages.length > 0) {
      result = result.filter((g) => {
        const anos = Math.floor((g.idadeMeses || 0) / 12);
        const categoria = anos === 0 ? 'Filhote' : anos <= 2 ? 'Jovem' : 'Adulto';
        return filters.ages.includes(categoria);
      });
    }

    if (filters.characteristics.length > 0) {
      result = result.filter((g) =>
        filters.characteristics.every((c) => {
          if (c === 'Vacinado') return g.vacinado;
          if (c === 'Castrado') return g.castrado;
          if (c === 'Vermifugado') return g.vermifugado;
          return true;
        })
      );
    }

    return result;
  }, [gatos, swipedIds, filters]);

  function showToast(message, type = 'info') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  async function handleSwipe(direction) {
    if (gatosFiltrados.length === 0) return;
    const gato = gatosFiltrados[0];

    if (direction === 'right') {
      // Registra like no backend
      if (usuarioId) {
        try {
          await api.post('/likeUsuario/create', { usuarioId, gatoId: gato.id });
        } catch (err) {
          // Se já deu like antes, ignora o erro e segue
          console.warn('Like:', err?.erro || err);
        }
      }
      showToast(`❤️ Você curtiu ${gato.nome}!`, 'success');
    } else {
      showToast(`Você passou por ${gato.nome}`, 'info');
    }

    setTimeout(() => setSwipedIds((prev) => [...prev, gato.id]), 300);
  }

  function handleReset() {
    setSwipedIds([]);
    setFilters({ locations: [], ages: [], characteristics: [] });
    showToast('🔄 Vamos começar de novo!', 'info');
  }

  return {
    gatos,
    gatosFiltrados,
    loading,
    toast,
    filters,
    setFilters,
    availableLocations,
    availableAges,
    availableCharacteristics,
    handleSwipe,
    handleReset,
  };
}

export default useHomeGatos;