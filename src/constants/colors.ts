/**
 * Paleta Contraponto — roxo como protagonista, cinza bebê lavanda como base
 * Violeta elétrico (principal) + Turquesa (apoio) + Laranja (micro-detalhes) + Amarelo sol (alertas)
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

  // Cor principal (Violeta Elétrico — criatividade/imaginação)
  primary: '#7C3AED',
  lightPrimary: '#EDE9FE',

  // Cor de destaque / Accent (Laranja Lava — energia/entusiasmo)
  accent: '#FF4D24',
  lightAccent: '#FFE1D6',

  // Cor secundária (Turquesa Vibrante — frescor/inovação)
  secondary: '#00B8A9',
  lightSecondary: '#CCFBF1',

  // Cor terciária (Amarelo Sol — otimismo/ludicidade)
  sunshine: '#FFB800',
  lightSunshine: '#FEF3C7',

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
  secondaryHover: '#009489',
} as const;

export type ThemeColors = typeof THEME_COLORS;
