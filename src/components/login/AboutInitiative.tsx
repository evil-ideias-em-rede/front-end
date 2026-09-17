import React from 'react';
import { Target, CheckCircle2, HeartHandshake, Scale, BookMarked } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';

export const AboutInitiative: React.FC = () => {
  const pillars = [
    {
      icon: Scale,
      title: 'Pluralismo de Ideias & Ética',
      description: 'Garantia de um ambiente seguro e não-partidário, onde diferentes correntes de pensamento e teorias políticas são apresentadas com rigor histórico e respeito mútuo.',
      accentColor: THEME_COLORS.primary,
    },
    {
      icon: Target,
      title: 'Pensamento Crítico & Letramento',
      description: 'Capacita os estudantes a distinguir fatos de opiniões, identificar falácias argumentativas, analisar fontes de informação e combater a desinformação.',
      accentColor: THEME_COLORS.secondary,
    },
    {
      icon: HeartHandshake,
      title: 'Cidadania Ativa & Empatia',
      description: 'Exercício contínuo de escuta atenta, mediação de conflitos e construção coletiva de soluções para os desafios reais da comunidade escolar.',
      accentColor: THEME_COLORS.primary,
    },
    {
      icon: BookMarked,
      title: 'Práticas Alinhadas à BNCC',
      description: 'Planejamentos integrados às Competências Gerais 7 (Argumentação) e 10 (Responsabilidade e Cidadania), facilitando a documentação pedagógica.',
      accentColor: THEME_COLORS.secondary,
    },
  ];

  return (
    <section id="sobre-iniciativa" className="py-24 relative overflow-hidden" style={{ backgroundColor: THEME_COLORS.bgLight2 }}>
      
      {/* Background Abstract Geometric Shapes */}
      <div 
        className="absolute top-1/3 -right-40 w-80 h-80 rounded-tl-[100%] pointer-events-none opacity-20"
        style={{ backgroundColor: THEME_COLORS.primary }}
      />
      <div 
        className="absolute rotate-10 bottom-14 -left-46 w-80 h-80 pointer-events-none opacity-25"
        style={{ backgroundColor: THEME_COLORS.secondary }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header with Mixed Outline and Solid Typography */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            <span className="text-outline-dark">Sobre a </span>
            <span style={{ color: THEME_COLORS.textDark }}>Iniciativa</span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed font-medium" style={{ color: THEME_COLORS.gray }}>
            Uma plataforma desenhada para potencializar o trabalho de professores do Ensino Fundamental e Médio na formação cidadã e no pensamento crítico.
          </p>
        </div>

        {/* Narrative Box with Soft Organic Container (No Pure White) */}
        <div 
          className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center rounded-3xl p-8 sm:p-12 shadow-sm backdrop-blur-sm"
          style={{ 
            backgroundColor: 'rgba(255,255, 255, 0.4)', 
            borderColor: THEME_COLORS.borderLight 
          }}
        >
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug" style={{ color: THEME_COLORS.textDark }}>
              Por que abordar política e cidadania na Educação Básica?
            </h3>
            <p className="text-base leading-relaxed font-medium" style={{ color: THEME_COLORS.gray }}>
              Trabalhar política na escola não é doutrinação partidária — é ensinar os jovens a <strong>ler o mundo com discernimento</strong>, compreender as instituições republicanas, conhecer seus direitos e deveres e defender ideias com base em fatos e respeito.
            </p>
            <p className="text-base leading-relaxed font-medium" style={{ color: THEME_COLORS.gray }}>
              O <strong>Contraponto</strong> instrumentaliza os educadores com roteiros de mediação, modelos de simulações e materiais didáticos imparciais, permitindo que a sala de aula seja um espaço de aprendizado vivo e inspirador.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-4">
              <div 
                className="flex items-center gap-2.5 text-sm font-bold px-4 shadow-sm py-3 rounded-2xl"
                style={{ 
                  backgroundColor: 'rgba(255,255, 255, 0.4)',
                  color: THEME_COLORS.textDark 
                }}
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: THEME_COLORS.primary }} />
                <span>Roteiros Didáticos Estruturados</span>
              </div>
              <div 
                className="flex items-center gap-2.5 text-sm font-bold shadow-sm px-4 py-3 rounded-2xl"
                style={{ 
                  backgroundColor: 'rgba(255,255, 255, 0.4)',
                  color: THEME_COLORS.textDark 
                }}
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: THEME_COLORS.secondary }} />
                <span>Material Didático Imparcial</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div 
              className="relative rounded-3xl overflow-hidden shadow-md aspect-[4/3]"
            >
              <img 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80" 
                alt="Alunos e professor em debate em sala de aula"
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0 flex items-end p-6"
                style={{ background: 'linear-gradient(to top, rgba(32,20,54,0.85) 0%, transparent 70%)' }}
              >
                <div style={{ color: THEME_COLORS.textLight }}>
                  <span className="text-xs uppercase tracking-wider font-extrabold" style={{ color: THEME_COLORS.textLight }}>Ambiente Colaborativo</span>
                  <p className="text-sm font-medium mt-1">Escuta qualificada, argumentação e respeito à diversidade de ideias.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Cards (No pure white) */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl shadow-md hover:cursor-pointer hover:shadow-lg transition-all group backdrop-blur-xs"
                style={{ 
                  backgroundColor: 'rgba(255,255, 255, 0.4)', 
                  borderColor: THEME_COLORS.borderLight 
                }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-transform group-hover:scale-105 mb-5"
                  style={{ 
                    borderColor: pillar.accentColor, 
                    backgroundColor: THEME_COLORS.borderLightBg,
                    color: pillar.accentColor 
                  }}
                >
                  <Icon className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h4 className="text-lg font-black tracking-tight" style={{ color: THEME_COLORS.textDark }}>
                  {pillar.title}
                </h4>
                <p className="text-xs sm:text-sm mt-2.5 leading-relaxed font-medium" style={{ color: THEME_COLORS.gray }}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
