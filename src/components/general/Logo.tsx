import React from 'react';
import { THEME_COLORS } from '../../constants/colors';

export interface LogoProps {
  /**
   * Tamanho visual do componente
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Variação do logo: completo (ícone + texto), apenas ícone ou apenas texto
   * @default 'full'
   */
  variant?: 'full' | 'icon-only' | 'text-only';
  /**
   * Tema de contraste: 'light' (para fundos claros #F2F0F7) ou 'dark' (para fundos escuros #201436)
   * @default 'light'
   */
  theme?: 'light' | 'dark';
  /**
   * Exibir ou ocultar a tag/badge "Educação Básica"
   * @default false
   * @deprecated Mantido por compatibilidade, sem efeito visual.
   */
  showBadge?: boolean;
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Link opcional para redirecionamento
   */
  href?: string;
  /**
   * Callback de clique opcional
   */
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  theme = 'light',
  className = '',
  href,
  onClick,
}) => {
  const sizeMap = {
    sm: {
      icon: 'w-10 h-10',
      iconSvg: 'w-4 h-4',
      dot: 'w-4 h-4',
      text: 'text-3xl',
      badge: 'text-[9px] px-1.5 py-0.2',
      subtitle: 'text-[10px]',
      gap: 'gap-2',
    },
    md: {
      icon: 'w-16 h-16',
      iconSvg: 'w-6 h-6',
      dot: 'w-6 h-6',
      text: 'text-5xl',
      badge: 'text-[10px] px-2 py-0.5',
      subtitle: 'text-xs',
      gap: 'gap-3',
    },
    lg: {
      icon: 'w-20 h-20',
      iconSvg: 'w-7 h-7',
      dot: 'w-8 h-8',
      text: 'text-6xl',
      badge: 'text-xs px-2.5 py-0.5',
      subtitle: 'text-sm',
      gap: 'gap-3.5',
    },
    xl: {
      icon: 'w-20 h-20',
      iconSvg: 'w-9 h-9',
      dot: 'w-8 h-8',
      text: 'text-6xl sm:text-7xl',
      badge: 'text-xs px-3 py-1',
      subtitle: 'text-base',
      gap: 'gap-4',
    },
  };

  const currentSize = sizeMap[size];
  const isDarkBg = theme === 'dark';

  const IconElement = (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`${variant === 'icon-only' ? currentSize.icon : currentSize.dot} rotate-30 shrink-0 self-end mb-[0.08em] select-none transition-transform duration-200 group-hover:scale-105`}
      fill={isDarkBg ? THEME_COLORS.textLight : THEME_COLORS.star}
      aria-hidden="true"
    >
      <path d="M50 0 L58 35 L90 20 L68 46 L100 50 L68 54 L90 80 L58 65 L50 100 L42 65 L10 80 L32 54 L0 50 L32 46 L10 20 L42 35 Z" />
    </svg>
  );

  const TextElement = (
    <span
      className={`font-black tracking-tight ${currentSize.text} leading-none select-none`}
      style={{ color: isDarkBg ? THEME_COLORS.textLight : THEME_COLORS.textDark }}
    >
      contraponto
    </span>
  );

  const innerContent = (
    <div className={`inline-flex items-end gap-0 group ${className}`}>
      {variant !== 'icon-only' && TextElement}
      {variant !== 'text-only' && IconElement}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-block text-decoration-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-2xl"
        style={{ color: 'inherit' }}
      >
        {innerContent}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-block bg-transparent border-0 p-0 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-2xl"
      >
        {innerContent}
      </button>
    );
  }

  return innerContent;
};

export default Logo;
