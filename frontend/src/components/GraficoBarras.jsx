function GraficoBarras({ dados }) {
  const largura = 420;
  const altura  = 100;
  const paddingX = 10;
  const paddingY = 12;
  const areaW = largura - paddingX * 2;
  const areaH = altura - paddingY - 20; // 24px pro eixo X

  const max = Math.max(...dados.map((d) => d.aprovados), 1);
  const barW = Math.floor(areaW / dados.length) - 8;

  return (
    <svg width="100%" viewBox={`0 0 ${largura} ${altura}`} style={{ overflow: 'visible', display: 'block' }}>
      {/* Linhas horizontais de referência */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = paddingY + areaH * (1 - frac);
        const val = Math.round(max * frac);
        return (
          <g key={frac}>
            <line x1={paddingX} x2={largura - paddingX} y1={y} y2={y} stroke="#f3f4f6" strokeWidth={1} />
            <text x={paddingX - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">{val}</text>
          </g>
        );
      })}

      {/* Barras */}
      {dados.map((d, i) => {
        const slotW = areaW / dados.length;
        const x = paddingX + i * slotW + (slotW - barW) / 2;
        const barH = max === 0 ? 0 : (d.aprovados / max) * areaH;
        const y = paddingY + areaH - barH;

        return (
          <g key={d.mes}>
            {/* Barra */}
            <rect x={x} y={barH === 0 ? y - 2 : y} width={barW} height={barH === 0 ? 2 : barH}
              fill={barH === 0 ? '#f3f4f6' : '#d4537e'} rx={3} />
            {/* Valor em cima */}
            {d.aprovados > 0 && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={9} fill="#d4537e" fontWeight="600">
                {d.aprovados}
              </text>
            )}
            {/* Label mês */}
            <text x={x + barW / 2} y={altura - 4} textAnchor="middle" fontSize={9} fill="#9ca3af">
              {d.mes.replace(' de ', ' ')}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default GraficoBarras;