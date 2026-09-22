import React from 'react';
import { LogIn, Sparkles } from 'lucide-react';
import { AbstractArtwork } from './AbstractArtwork';
import { THEME_COLORS } from '../../constants/colors';
import Logo from '../general/Logo';

interface HeroAuthProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const HeroAuth: React.FC<HeroAuthProps> = ({ onOpenAuth }) => {
  return (
    <section id="hero" className="relative h-[100vh] pt-12 pb-24 lg:pt-16 lg:pb-32 overflow-hidden">
      
      {/* Background Ambient Abstract Shapes flowing across the screen */}
      <div 
        className="absolute -top-12 -right-12 w-64 h-64 rounded-bl-[100%] pointer-events-none opacity-40"
        style={{ backgroundColor: THEME_COLORS.secondary }}
      />
      <div 
        className="absolute top-1/2 -left-20 w-48 h-48 rounded-full pointer-events-none opacity-30"
        style={{ backgroundColor: THEME_COLORS.primary }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[580px]">
          
          {/* LEFT SIDE: Freestanding Abstract Geometric Composition (Seamlessly in background) */}
          <div className="lg:col-span-6 flex justify-center">
            <AbstractArtwork />
          </div>

          {/* RIGHT SIDE: Logo + Action Buttons */}
          <div className="lg:col-span-6 ml-4 space-y-7 text-left">

            {/* Logo */}
            <Logo size="xl" theme="light" showBadge />

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-medium leading-relaxed max-w-xl" style={{ color: THEME_COLORS.gray }}>
              Auxiliamos professores da <strong>Educação Básica</strong> a construir planos de aula, dinâmicas de debate, teorias políticas e escrita argumentativa de forma plural, ética e engajadora.
            </p>

            {/* Action Buttons */}
            <div className="pt-6 flex flex-wrap items-center gap-4">
              
              {/* Primary Action Button (Terracotta / Transparent hover) */}
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-7 py-3.5 rounded-full text-white font-extrabold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
                style={{ 
                  backgroundColor: THEME_COLORS.primary,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.primaryHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.primary)}
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Acessar Plataforma</span>
              </button>

              {/* Glowing Blue Button "Criar Conta de Professor" */}
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="px-7 py-3.5 rounded-full font-extrabold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer shadow-lg shadow-[#FF0044]/40 hover:shadow-xl hover:shadow-[#FF0044]/60"
                style={{ 
                  backgroundColor: THEME_COLORS.secondary,
                  color: THEME_COLORS.textLight,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.secondaryHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.secondary)}
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>Criar Conta de Professor</span>
              </button>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
