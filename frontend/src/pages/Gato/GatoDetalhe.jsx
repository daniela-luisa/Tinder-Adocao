import { FaHeart, FaCheck, FaTimes } from 'react-icons/fa';
import HomeHeader from '../../components/HomeHeader';
import BottomNav from '../../components/BottomNav';
import FotoGato from '../../components/FotoGato';
import useGatoDetalhe, { formatarIdade } from '../../hooks/useGatoDetalhe';

const STATUS_CONFIG = {
  disponivel:  { label: 'Disponível para adoção', cor: 'bg-green-100 text-green-700'   },
  em_processo: { label: 'Em processo de adoção',  cor: 'bg-yellow-100 text-yellow-700' },
  adotado:     { label: 'Já adotado',             cor: 'bg-gray-100 text-gray-500'     },
};

function GatoDetalhe() {
  const {
    gato, loading,
    fotoAtiva, setFotoAtiva,
    jaCurtiu, curtindo,
    toast,
    handleCurtir,
  } = useGatoDetalhe();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!gato) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Gato não encontrado.</p>
      </div>
    );
  }

  const fotos      = gato.fotos && gato.fotos.length > 0 ? gato.fotos : [];
  const idade      = formatarIdade(gato.idadeMeses);
  const statusLabel = STATUS_CONFIG[gato.status] || { label: gato.status, cor: 'bg-gray-100 text-gray-500' };
  const podeCurtir  = gato.status === 'disponivel' && !jaCurtiu;

  const labelBotao = curtindo
    ? 'Curtindo...'
    : jaCurtiu
    ? `Você já curtiu ${gato.nome}`
    : gato.status !== 'disponivel'
    ? 'Indisponível para adoção'
    : `Curtir ${gato.nome}`;

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 pb-32">

      <HomeHeader />

      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl shadow-lg text-white text-sm font-medium ${
          toast.tipo === 'erro' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {toast.msg}
        </div>
      )}

      <FotoGato
        fotos={fotos}
        fotoAtiva={fotoAtiva}
        setFotoAtiva={setFotoAtiva}
        deficiente={gato.deficiente}
      />

      <div className="max-w-lg mx-auto px-4 pt-5 flex flex-col gap-4">

        {/* Info principal */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="text-2xl font-bold text-gray-800">{gato.nome}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusLabel.cor}`}>
              {statusLabel.label}
            </span>
          </div>

          {gato.descricao && (
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{gato.descricao}</p>
          )}

          {gato.personalidades && gato.personalidades.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {gato.personalidades.map((p) => (
                <span key={p} className="px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700">
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Características */}
        {(gato.sexo || gato.raca || idade) && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Características</h2>
            <div className="grid grid-cols-3 gap-3">
              {gato.sexo && (
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-purple-400 mb-1">Gênero</p>
                  <p className="text-sm font-semibold text-purple-700">{gato.sexo === 'M' ? 'Macho' : 'Fêmea'}</p>
                </div>
              )}
              {gato.raca && (
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-400 mb-1">Raça</p>
                  <p className="text-sm font-semibold text-blue-700">{gato.raca}</p>
                </div>
              )}
              {idade && (
                <div className="bg-orange-50 rounded-xl p-3">
                  <p className="text-xs text-orange-400 mb-1">Idade</p>
                  <p className="text-sm font-semibold text-orange-700">{idade}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Saúde */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Saúde</h2>
          <div className="flex flex-col divide-y divide-gray-50">
            {[
              { label: 'Vacinado',    valor: gato.vacinado    },
              { label: 'Castrado',    valor: gato.castrado    },
              { label: 'Vermifugado', valor: gato.vermifugado },
            ].map(({ label, valor }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-gray-600">{label}</span>
                {valor
                  ? <FaCheck size={14} className="text-green-500" />
                  : <FaTimes size={14} className="text-red-400" />
                }
              </div>
            ))}
          </div>
        </div>

        {/* Deficiências */}
        {gato.deficiente && gato.deficiencias && gato.deficiencias.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Necessidades especiais</h2>
            <div className="flex flex-wrap gap-2">
              {gato.deficiencias.map((d) => (
                <span key={d} className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Botão fixo */}
      <div className="fixed bottom-16 left-0 right-0 px-4 z-20">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleCurtir}
            disabled={!podeCurtir || curtindo}
            className={`w-full py-4 rounded-2xl text-white font-semibold text-base shadow-lg flex items-center justify-center gap-2 transition-all ${
              jaCurtiu || gato.status !== 'disponivel'
                ? 'bg-gray-300 cursor-default'
                : 'bg-gradient-to-r from-[#FF308C] to-[#FF7200] hover:opacity-90 active:scale-95'
            }`}
          >
            <FaHeart size={16} />
            {labelBotao}
          </button>
          {podeCurtir && (
            <p className="text-center text-xs text-gray-400 mt-2">
              Entraremos em contato para discutir os próximos passos
            </p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default GatoDetalhe;