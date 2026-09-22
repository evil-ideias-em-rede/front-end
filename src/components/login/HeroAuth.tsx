import React from 'react';
import { LogIn, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
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

          {/* RIGHT SIDE: Editorial Outline & Solid Typography + Action Buttons */}
          <div className="lg:col-span-6 ml-4 space-y-7 text-left">
            
            {/* Tag Badge (No pure white, uses transparent/semi-transparent background) 
            <div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(226, 221, 240, 0.7)',
                borderColor: THEME_COLORS.borderLight,
                color: THEME_COLORS.primary,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: THEME_COLORS.primary }} />
              <span>Educação Básica • Cidadania & Pensamento Crítico</span>
            </div>*/}

            {/* Logo */}
            <Logo size="lg" theme="light" showBadge />

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-medium leading-relaxed max-w-xl" style={{ color: THEME_COLORS.gray }}>
              Auxiliamos professores da <strong>Educação Básica</strong> a construir planos de aula, dinâmicas de debate, teorias políticas e escrita argumentativa de forma plural, ética e engajadora.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              
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
                className="px-7 py-3.5 rounded-full font-extrabold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer shadow-lg shadow-[#AEF03D]/40 hover:shadow-xl hover:shadow-[#AEF03D]/60"
                style={{ 
                  backgroundColor: THEME_COLORS.secondary,
                  color: THEME_COLORS.textDark,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.secondaryHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.secondary)}
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>Criar Conta de Professor</span>
              </button>

            </div>

            {/* Reassurance Badges */}
            <div 
              className="pt-4 border-t flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-bold"
              style={{ borderColor: THEME_COLORS.borderLight, color: THEME_COLORS.gray }}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: THEME_COLORS.primary }} />
                <span>Plural & Não-Partidário</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: THEME_COLORS.secondary }} />
                <span>Alinhado à BNCC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" style={{ color: THEME_COLORS.primary }} />
                <span>Gratuito para Educadores</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
