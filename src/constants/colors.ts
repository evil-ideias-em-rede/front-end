/**
 * Paleta Contraponto — roxo como protagonista, vermelho como apoio
 * Violeta (principal) + Vermelho escuro (secundário) + ponto vermelho vivo
 * Sem uso de branco puro (#FFFFFF).
 */
export const THEME_COLORS = {
  // Base clara — cinza bebê derivado do roxo
  white: '#ffffff31',
  bgLight: '#F2F0F7',
  bgLight2: '#E2DDF0',
  textLight: '#F2F0F7',

  // Texto escuro / Fundo escuro
  bgDark: '#201436',
  textDark: '#231942',

  // Cor principal (Violeta)
  primary: '#7C3AED',
  lightPrimary: '#EDE9FE',

  // Cor de destaque / Accent (Laranja Lava — energia/entusiasmo)
  accent: '#FF4D24',
  lightAccent: '#FFE1D6',

  // Cor secundária (Vermelho Vivo)
  secondary: '#FF0044',
  lightSecondary: '#FFE1E8',
  // Vermelho vivo escurecido nos textos sobre fundos claros (legibilidade)
  secondaryText: '#C8102E',

  // Cor terciária (Amarelo Sol — otimismo/ludicidade)
  sunshine: '#FFB800',
  lightSunshine: '#FEF3C7',

  // Ponto da logo — vermelho vivo (independente do primário)
  star: '#FF0044',

  // Cinza Neutro (arroxeado para harmonizar)
  gray: '#625D75',

  // Derivadas e tons de apoio (sem branco puro)
  cardBg: 'rgba(226, 221, 240, 0.7)',
  cardBgLight: '#EBE8F3',
  cardBgSolid: '#EAE0FF',
  borderLightBg: '#E9DEFF',
  borderLight: '#E4D6FF',
  borderDark: '#322652',
  primaryHover: '#6D28D9',
  accentHover: '#D63A12',
  secondaryHover: '#D6003B',
} as const;

export type ThemeColors = typeof THEME_COLORS;
