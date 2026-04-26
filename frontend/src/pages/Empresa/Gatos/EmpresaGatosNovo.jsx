import { useNavigate } from 'react-router-dom';
import EmpresaSidebar from '../../../components/EmpresaSidebar';
import ToggleSaude from '../../../components/ToggleSaude';
import SeletorTags from '../../../components/SeletorTags';
import UploadFotos from '../../../components/UploadFotos';
import InputAdmin from '../../../components/InputAdmin';
import useCadastrarGato from '../../../hooks/useCadastrarGato';

const togglesSaude = [
  { key: 'vacinado',    label: 'Vacinado',          sub: 'Possui carteira de vacinação em dia' },
  { key: 'castrado',    label: 'Castrado',           sub: 'Passou pelo procedimento de castração' },
  { key: 'vermifugado', label: 'Vermifugado',        sub: 'Tratamento antiparasitário realizado' },
  { key: 'deficiente',  label: 'Possui deficiência', sub: 'Necessidade especial física ou motora' },
];

function EmpresaGatosNovo() {
  const navigate = useNavigate();
  const {
    form, setField,
    personalidades, deficiencias,
    personalidadesSelecionadas, setPersonalidadesSelecionadas,
    deficienciasSelecionadas, setDeficienciasSelecionadas,
    fotos, loading, erro,
    toggleSaude, toggleTag,
    handleAddFoto, definirPrincipal, removerFoto,
    handleSalvar, idadeHint,
  } = useCadastrarGato();

  return (
    <div className="flex min-h-screen bg-[#F5F5F3]">
      <EmpresaSidebar />

      <div className="flex-1 flex flex-col">

        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/empresa/gatos')} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">← Gatos</button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-800">Cadastrar novo gato</span>
        </div>

        <div className="flex-1 flex gap-5 p-6 items-start overflow-y-auto">

          <div className="flex-1 flex flex-col gap-4 min-w-0">

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Informações básicas</p>
              <div className="flex flex-col gap-3">
                <InputAdmin label="Nome" placeholder="Ex: Bolinha" value={form.nome} onChange={(e) => setField('nome', e.target.value)} maxLength={80} required />
                <div className="grid grid-cols-2 gap-3">
                  <InputAdmin label="Sexo" as="select" value={form.sexo} onChange={(e) => setField('sexo', e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="M">Macho</option>
                    <option value="F">Fêmea</option>
                  </InputAdmin>
                  <InputAdmin label="Raça" placeholder="Ex: SRD, Siamês..." value={form.raca} onChange={(e) => setField('raca', e.target.value)} maxLength={80} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputAdmin label="Anos" type="number" min="0" max="25" placeholder="0" value={form.anos} onChange={(e) => setField('anos', e.target.value)} />
                  <InputAdmin label="Meses" type="number" min="0" max="11" placeholder="0" value={form.meses} onChange={(e) => setField('meses', e.target.value)} />
                </div>
                {idadeHint() && <p className="text-xs text-gray-400">{idadeHint()}</p>}
                <InputAdmin label="Descrição" as="textarea" placeholder="Conte um pouco sobre a história e personalidade do gato..." value={form.descricao} onChange={(e) => setField('descricao', e.target.value)} rows={3} />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Saúde e condição</p>
              <div className="flex flex-col divide-y divide-gray-100">
                {togglesSaude.map(({ key, label, sub }) => (
                  <ToggleSaude key={key} label={label} sub={sub} value={form[key]} onChange={() => toggleSaude(key)} />
                ))}
                {form.deficiente && (
                  <div className="pt-3">
                    <p className="text-xs text-gray-400 mb-2">Selecione as deficiências que se aplicam</p>
                    <SeletorTags opcoes={deficiencias} selecionadas={deficienciasSelecionadas} onToggle={(id) => toggleTag(id, setDeficienciasSelecionadas)} />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Personalidade</p>
              <SeletorTags opcoes={personalidades} selecionadas={personalidadesSelecionadas} onToggle={(id) => toggleTag(id, setPersonalidadesSelecionadas)} />
            </div>

          </div>

          <div className="w-52 flex-shrink-0">
            <UploadFotos fotos={fotos} onAdd={handleAddFoto} onRemover={removerFoto} onDefinirPrincipal={definirPrincipal} />
          </div>

        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between">
          {erro ? <p className="text-red-500 text-sm">{erro}</p> : <div />}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/empresa/gatos')}
              className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSalvar}
              disabled={loading}
              className="px-5 py-2 text-sm text-white rounded-xl disabled:opacity-60 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#d4537e' }}
            >
              {loading ? 'Salvando...' : 'Salvar gato'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EmpresaGatosNovo;