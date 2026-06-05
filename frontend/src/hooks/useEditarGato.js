import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

function idadeHint(anos, meses) {
  const total = (parseInt(anos) || 0) * 12 + (parseInt(meses) || 0);
  if (!total) return '';
  const a = Math.floor(total / 12);
  const m = total % 12;
  if (total < 12) return `${total} mês(es)`;
  return m > 0 ? `${a} ano(s) e ${m} mês(es)` : `${a} ano(s)`;
}

function useEditarGato() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nome: '', sexo: '', raca: '', anos: '', meses: '', descricao: '',
    vacinado: false, castrado: false, vermifugado: false, deficiente: false,
  });
  const [personalidades, setPersonalidades] = useState([]);
  const [deficiencias, setDeficiencias] = useState([]);
  const [personalidadesSelecionadas, setPersonalidadesSelecionadas] = useState([]);
  const [deficienciasSelecionadas, setDeficienciasSelecionadas] = useState([]);
  const [fotos, setFotos] = useState([]); // { id?, file?, preview, principal, nova }
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const [resP, resD, resGato] = await Promise.all([
          api.get('/personalidade/readall'),
          api.get('/deficiencia/readall'),
          api.get(`/gato/readoneid/${id}`),
        ]);

        setPersonalidades(resP.personalidades || resP);
        setDeficiencias(resD.deficiencias || resD);

        const gato = resGato.gato;
        const anos = gato.idadeMeses ? Math.floor(gato.idadeMeses / 12) : 0;
        const meses = gato.idadeMeses ? gato.idadeMeses % 12 : 0;

        setForm({
          nome:        gato.nome        || '',
          sexo:        gato.sexo        || '',
          raca:        gato.raca        || '',
          anos:        anos > 0 ? String(anos) : '',
          meses:       meses > 0 ? String(meses) : '',
          descricao:   gato.descricao   || '',
          vacinado:    gato.vacinado    ?? false,
          castrado:    gato.castrado    ?? false,
          vermifugado: gato.vermifugado ?? false,
          deficiente:  gato.deficiente  ?? false,
        });

        // Fotos existentes
        const fotosExistentes = (gato.fotos || []).map((f) => ({
          id: f.id,
          preview: f.url,
          principal: f.principal,
          nova: false,
        }));
        setFotos(fotosExistentes);

        // Personalidades selecionadas
        const idsPersonalidades = (gato.personalidades || []).map((p) =>
          typeof p === 'object' ? p.id : p
        );
        setPersonalidadesSelecionadas(
          (resP.personalidades || resP)
            .filter((p) => idsPersonalidades.includes(p.id) || gato.personalidades?.includes(p.nome))
            .map((p) => p.id)
        );

        // Deficiências selecionadas
        const idsDeficiencias = (gato.deficiencias || []).map((d) =>
          typeof d === 'object' ? d.id : d
        );
        setDeficienciasSelecionadas(
          (resD.deficiencias || resD)
            .filter((d) => idsDeficiencias.includes(d.id) || gato.deficiencias?.includes(d.nome))
            .map((d) => d.id)
        );

      } catch (err) {
        console.error('Erro ao carregar gato:', err);
        setErro('Erro ao carregar dados do gato.');
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSaude(key) {
    if (key === 'deficiente') setDeficienciasSelecionadas([]);
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleTag(tagId, setLista) {
    setLista((prev) =>
      prev.includes(tagId) ? prev.filter((x) => x !== tagId) : [...prev, tagId]
    );
  }

  function handleAddFoto(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    const preview = URL.createObjectURL(arquivo);
    setFotos((prev) => [
      ...prev,
      { file: arquivo, preview, principal: prev.length === 0, nova: true },
    ]);
    e.target.value = '';
  }

  function definirPrincipal(index) {
    setFotos((prev) => prev.map((f, i) => ({ ...f, principal: i === index })));
  }

  function removerFoto(index) {
    setFotos((prev) => {
      const novas = prev.filter((_, i) => i !== index);
      if (prev[index].principal && novas.length > 0) novas[0].principal = true;
      return novas;
    });
  }

  async function handleSalvar() {
    setErro(null);
    if (!form.nome.trim()) { setErro('O nome do gato é obrigatório.'); return; }
    setSalvando(true);

    try {
      const idadeMeses = (parseInt(form.anos) || 0) * 12 + (parseInt(form.meses) || 0);

      // Atualiza dados básicos
      await api.put(`/gato/update/${id}`, {
        nome:        form.nome,
        sexo:        form.sexo        || undefined,
        raca:        form.raca        || undefined,
        idadeMeses:  idadeMeses       || undefined,
        descricao:   form.descricao   || undefined,
        vacinado:    form.vacinado,
        castrado:    form.castrado,
        vermifugado: form.vermifugado,
        deficiente:  form.deficiente,
      });

      // Upload de fotos novas
      for (const foto of fotos.filter((f) => f.nova)) {
        const formData = new FormData();
        formData.append('foto', foto.file);
        formData.append('principal', foto.principal ? 'true' : 'false');
        await fetch(`http://localhost:1337/fotogato/upload/${id}`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
      }

      // Atualiza foto principal entre as existentes
      for (const foto of fotos.filter((f) => !f.nova && f.id)) {
        await api.put(`/fotogato/update/${foto.id}`, { principal: foto.principal });
      }

      // Personalidades — recria todas
      const gatoPersonalidades = await api.get(`/gatoPersonalidade/readall/${id}`);
      await Promise.all(
        (gatoPersonalidades.personalidades || []).map((gp) =>
          api.delete(`/gatoPersonalidade/delete/${gp.id}`)
        )
      );
      if (personalidadesSelecionadas.length > 0) {
        await Promise.all(
          personalidadesSelecionadas.map((personalidadeId) =>
            api.post('/gatoPersonalidade/create', { gatoId: Number(id), personalidadeId })
          )
        );
      }

      // Deficiências — recria todas
      const gatoDeficiencias = await api.get(`/gatoDeficiencia/readall/${id}`);
      await Promise.all(
        (gatoDeficiencias.deficiencias || []).map((gd) =>
          api.delete(`/gatoDeficiencia/delete/${gd.id}`)
        )
      );
      if (form.deficiente && deficienciasSelecionadas.length > 0) {
        await Promise.all(
          deficienciasSelecionadas.map((deficienciaId) =>
            api.post('/gatoDeficiencia/create', { gatoId: Number(id), deficienciaId })
          )
        );
      }

      navigate('/empresa/gatos');
    } catch (err) {
      console.error(err);
      setErro('Erro ao salvar as alterações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return {
    form, setField,
    personalidades, deficiencias,
    personalidadesSelecionadas, setPersonalidadesSelecionadas,
    deficienciasSelecionadas, setDeficienciasSelecionadas,
    fotos,
    loading, salvando, erro,
    toggleSaude, toggleTag,
    handleAddFoto, definirPrincipal, removerFoto,
    handleSalvar,
    idadeHint: () => idadeHint(form.anos, form.meses),
  };
}

export default useEditarGato;