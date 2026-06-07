const CORES = ['#d4537e', '#f59e0b', '#10b981'];
const LABELS = ['Disponível', 'Em processo', 'Adotado'];

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}


function GraficoPizza({ disponiveis, emProcesso, adotados }) {
  const valores = [disponiveis, emProcesso, adotados];
  const total   = valores.reduce((a, b) => a + b, 0);

  const cx = 80;
  const cy = 62;
  const r  = 55;
  const ri = 32; // raio interno (donut)

  let anguloAtual = 0;
  const fatias = valores.map((v, i) => {
    const pct   = total === 0 ? 0 : v / total;
    const graus  = pct * 360;
    const start  = anguloAtual;
    const end    = anguloAtual + graus;
    anguloAtual  = end;
    return { v, pct, start, end, cor: CORES[i], label: LABELS[i] };
  });

  return (
    <svg width="100%" viewBox="-100 10 440 130" style={{ display: 'block' }} style={{ overflow: 'visible' }}>
      {total === 0 ? (
        <>
          <circle cx={cx} cy={cy} r={r} fill="#f3f4f6" />
          <circle cx={cx} cy={cy} r={ri} fill="white" />
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fill="#9ca3af">Sem dados</text>
        </>
      ) : (
        fatias.map((f, i) => {
          if (f.v === 0) return null;

          // Se é 100%, desenha círculo completo
          if (f.pct === 1) {
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} fill={f.cor} />
                <circle cx={cx} cy={cy} r={ri} fill="white" />
              </g>
            );
          }

          const outerStart = polarToCartesian(cx, cy, r, f.start);
          const outerEnd   = polarToCartesian(cx, cy, r, f.end);
          const innerStart = polarToCartesian(cx, cy, ri, f.end);
          const innerEnd   = polarToCartesian(cx, cy, ri, f.start);
          const large      = f.end - f.start > 180 ? 1 : 0;

          const d = [
            `M ${outerStart.x} ${outerStart.y}`,
            `A ${r} ${r} 0 ${large} 1 ${outerEnd.x} ${outerEnd.y}`,
            `L ${innerStart.x} ${innerStart.y}`,
            `A ${ri} ${ri} 0 ${large} 0 ${innerEnd.x} ${innerEnd.y}`,
            'Z',
          ].join(' ');

          return <path key={i} d={d} fill={f.cor} />;
        })
      )}

      {/* Total no centro */}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={18} fontWeight="700" fill="#374151">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="#9ca3af">gatos</text>

      {/* Legenda */}
      {fatias.map((f, i) => (
        <g key={i} transform={`translate(170, ${18 + i * 36})`}>
          <rect x={0} y={0} width={10} height={10} rx={2} fill={f.cor} />
          <text x={14} y={9} fontSize={10} fill="#6b7280">{f.label}</text>
          <text x={14} y={22} fontSize={11} fontWeight="600" fill="#374151">{f.v}</text>
        </g>
      ))}
    </svg>
  );
}

export default GraficoPizza;