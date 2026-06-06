const AVATAR_COLORS = [
  { bg: 'bg-blue-200',   text: 'text-blue-800'   },
  { bg: 'bg-purple-200', text: 'text-purple-800'  },
  { bg: 'bg-amber-200',  text: 'text-amber-800'   },
  { bg: 'bg-teal-200',   text: 'text-teal-800'    },
  { bg: 'bg-rose-200',   text: 'text-rose-800'    },
  { bg: 'bg-cyan-200',   text: 'text-cyan-800'    },
  { bg: 'bg-lime-200',   text: 'text-lime-800'    },
];

// Hash do id do usuário → sempre mesma cor pra mesma pessoa
export function corPorUsuario(usuarioId) {
  const idx = (usuarioId || 0) % AVATAR_COLORS.length;
  const c = AVATAR_COLORS[idx];
  return `${c.bg} ${c.text}`;
}

export function avatarIniciais(nome) {
  if (!nome) return '?';
  return nome.trim().split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function formatarData(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatarIdade(idadeMeses) {
  if (idadeMeses == null) return null;
  const a = Math.floor(idadeMeses / 12);
  const m = idadeMeses % 12;
  if (a === 0) return `${m}m`;
  if (m === 0) return `${a}a`;
  return `${a}a ${m}m`;
}

export const STATUS_CONFIG = {
  aprovado: { label: 'Aprovado', bg: 'bg-blue-100',  text: 'text-blue-700'  },
  recusado: { label: 'Recusado', bg: 'bg-red-100',   text: 'text-red-600'   },
  adotado:  { label: 'Adotado',  bg: 'bg-green-100', text: 'text-green-700' },
};