import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function idadeHint(anos, meses) {
  const total = (parseInt(anos) || 0) * 12 + (parseInt(meses) || 0);
  if (!total) { return ''; }
  const a = Math.floor(total / 12);
  const m = total % 12;
  if (total < 12) { return `${total} mês(es)`; }
  return m > 0 ? `${a} ano(s) e ${m} mês(es)` : `${a} ano(s)`;
}

function useCadastrarGato() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '', sexo: '', raca: '', anos: '', meses: '', descricao: '',
    vacinado: false, castrado: false, vermifugado: false, deficiente: false,
  });
  const [personalidades, setPersonalidades] = useState([]);
  const [deficiencias, setDeficiencias] = useState([]);
  const [personalidadesSelecionadas, setPersonalidadesSelecionadas] = useState([]);
  const [deficienciasSelecionadas, setDeficienciasSelecionadas] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const [resP, resD] = await Promise.all([
          api.get('/personalidade/readall'),
          api.get('/deficiencia/readall'),
        ]);
        setPersonalidades(resP.personalidades || resP);
        setDeficiencias(resD.deficiencias || resD);
      } catch (err) {
        console.error('Erro ao carregar opções:', err);
      }
    }
    carregar();
  }, []);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSaude(key) {
    if (key === 'deficiente') { setDeficienciasSelecionadas([]); }
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleTag(id, setLista) {
    setLista((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function handleAddFoto(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) { return; }
    const preview = URL.createObjectURL(arquivo);
    setFotos((prev) => [...prev, { file: arquivo, preview, principal: prev.length === 0 }]);
    e.target.value = '';
  }

  function definirPrincipal(index) {
    setFotos((prev) => prev.map((f, i) => ({ ...f, principal: i === index })));
  }

  function removerFoto(index) {
    setFotos((prev) => {
      const novas = prev.filter((_, i) => i !== index);
      if (prev[index].principal && novas.length > 0) { novas[0].principal = true; }
      return novas;
    });
  }

  async function handleSalvar() {
      console.log('handleSalvar chamado', form);

    setErro(null);
    if (!form.nome.trim()) { setErro('O nome do gato é obrigatório.'); return; }
    setLoading(true);

    try {
      const idadeMeses = (parseInt(form.anos) || 0) * 12 + (parseInt(form.meses) || 0);
      const resGato = await api.post('/gato/create', {
        nome: form.nome,
        sexo: form.sexo || undefined,
        raca: form.raca || undefined,
        idadeMeses: idadeMeses || undefined,
        descricao: form.descricao || undefined,
        vacinado: form.vacinado,
        castrado: form.castrado,
        vermifugado: form.vermifugado,
        deficiente: form.deficiente,
      });

      const gatoId = resGato.gato.id;

      for (const foto of fotos) {
        const formData = new FormData();
        formData.append('foto', foto.file);
        formData.append('principal', foto.principal ? 'true' : 'false');
        await fetch(`http://localhost:1337/fotogato/upload/${gatoId}`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
      }

      if (personalidadesSelecionadas.length > 0) {
        await Promise.all(
          personalidadesSelecionadas.map((personalidadeId) =>
            api.post('/gatoPersonalidade/create', { gatoId, personalidadeId })
          )
        );
      }

      if (form.deficiente && deficienciasSelecionadas.length > 0) {
        await Promise.all(
          deficienciasSelecionadas.map((deficienciaId) =>
            api.post('/gatoDeficiencia/create', { gatoId, deficienciaId })
          )
        );
      }

      navigate('/empresa/gatos');
    } catch (err) {
      console.error(err);
      setErro('Erro ao cadastrar o gato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return {
    form, setField,
    personalidades, deficiencias,
    personalidadesSelecionadas, setPersonalidadesSelecionadas,
    deficienciasSelecionadas, setDeficienciasSelecionadas,
    fotos,
    loading, erro,
    toggleSaude, toggleTag,
    handleAddFoto, definirPrincipal, removerFoto,
    handleSalvar,
    idadeHint: () => idadeHint(form.anos, form.meses),
  };
}

export default useCadastrarGato;