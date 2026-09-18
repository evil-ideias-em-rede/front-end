import type { FalaParticipante, PosicaoTema } from '../data/mockAudiencias';
import type { AudienciaParticipante } from '../data/mockAudiencias';

export const POSICAO_TEMA_META: Record<
  PosicaoTema,
  { label: string; color: string; bg: string }
> = {
  contra: { label: 'Contra', bg: '#FEF2F2', color: '#e42d2d' },
  neutro: { label: 'Neutro', bg: 'rgba(0,0,0,0.05)', color: '#9c9c9c' },
  favor: { label: 'A favor', bg: '#ECFDF5', color: '#10ca3e' },
  ambiguo: { label: 'Ambíguo', bg: '#FEF3C7', color: '#B45309' },
};

export const POSICAO_ORDEM: PosicaoTema[] = ['contra', 'neutro', 'favor', 'ambiguo'];

/** Presidente media o debate e permanece imparcial: fora dos cards e sem página clicável. */
export function isPresidente(participante: AudienciaParticipante): boolean {
  return participante.papel === 'presidente';
}

/** Normaliza o valor de `taxonomia["Posicionamento"]` do payload (ex.: "Favorável"). */
export function normalizarPosicao(valor: unknown): PosicaoTema {
  const s = String(valor ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (s.startsWith('favor')) return 'favor';
  if (s.startsWith('contra')) return 'contra';
  if (s.startsWith('ambigu')) return 'ambiguo';
  return 'neutro';
}

/** Posição de uma fala a partir de sua taxonomia. */
export function posicaoDaFala(fala: FalaParticipante): PosicaoTema {
  const valores = fala.taxonomia?.['Posicionamento'] ?? [];
  return normalizarPosicao(valores[0]);
}

/**
 * Posição agregada do participante: a mais frequente entre suas falas.
 * Empate ou ausência de falas → 'ambiguo'/'neutro' respectivamente.
 */
export function posicaoAgregada(falas: FalaParticipante[]): PosicaoTema {
  if (falas.length === 0) return 'neutro';
  const contagem = new Map<PosicaoTema, number>();
  falas.forEach((f) => {
    const p = posicaoDaFala(f);
    contagem.set(p, (contagem.get(p) ?? 0) + 1);
  });
  let melhor: PosicaoTema = 'neutro';
  let melhorTotal = -1;
  let empate = false;
  contagem.forEach((total, pos) => {
    if (total > melhorTotal) {
      melhor = pos;
      melhorTotal = total;
      empate = false;
    } else if (total === melhorTotal) {
      empate = true;
    }
  });
  return empate ? 'ambiguo' : melhor;
}

/** Cor fixa por categoria da taxonomia (exibida como tag na fala). */
export function corCategoriaTaxonomia(categoria: string): { bg: string; color: string } {
  switch (categoria) {
    case 'Alinhamento Temático':
      return { bg: '#EDE9FE', color: '#7C3AED' };
    case 'Postura do Orador':
      return { bg: '#CCFBF1', color: '#00B8A9' };
    case 'Credibilidade e Validação':
      return { bg: '#FEF3C7', color: '#B45309' };
    default:
      return { bg: 'rgba(0,0,0,0.05)', color: '#625D75' };
  }
}
