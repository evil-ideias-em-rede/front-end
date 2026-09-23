import React from 'react';
import { FileText, UserCheck, Scale, BookMarked } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';

export const AboutInitiative: React.FC = () => {
  const pillars = [
    {
      icon: FileText,
      title: 'Fontes Primárias Reais',
      description: 'Centenas de transcrições de audiências públicas da Câmara dos Deputados, com participantes, posicionamentos e contexto preservados.',
      accentColor: THEME_COLORS.primary,
    },
    {
      icon: BookMarked,
      title: 'Alinhamento à BNCC',
      description: 'Cada atividade é articulada a habilidades e competências curriculares, facilitando o planejamento e a documentação pedagógica.',
      accentColor: THEME_COLORS.secondary,
    },
    {
      icon: UserCheck,
      title: 'Professor Protagonista',
      description: 'Você seleciona as fontes, ajusta critérios, revisa e modifica até aprovar cada material. A IA apoia, mas as decisões pedagógicas são suas.',
      accentColor: THEME_COLORS.primary,
    },
    {
      icon: Scale,
      title: 'Neutralidade e Pluralidade',
      description: 'Posições favoráveis e contrárias apresentadas lado a lado, com rastreabilidade até a transcrição original e atenção a vieses.',
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
            Um ecossistema que ajuda o contato e a conversão de fontes primárias extensas em materiais didáticos, exercícios e planos de aula, feito para auxiliar professores do Ensino Fundamental e Médio na medida certa.
          </p>
        </div>

        {/* Narrative Box with Soft Organic Container (No Pure White) */}
        <div 
          className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start rounded-3xl p-8 sm:p-12 shadow-sm backdrop-blur-sm"
          style={{ 
            backgroundColor: 'rgba(255,255, 255, 0.4)', 
            borderColor: THEME_COLORS.borderLight 
          }}
        >
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug" style={{ color: THEME_COLORS.textDark }}>
              Por que partir de fontes primárias?
            </h3>
            <p className="text-base leading-relaxed font-medium" style={{ color: THEME_COLORS.gray }}>
              Transcrições de audiências públicas registram posições reais sobre temas de interesse público, mas são documentos <strong>extensos e dispersos</strong>, com dezenas de páginas e múltiplos participantes. Localizar trechos relevantes, contextualizar falas e transformá-las em atividades didáticas exige tempo que o professor nem sempre tem.
            </p>
            <p className="text-base leading-relaxed font-medium" style={{ color: THEME_COLORS.gray }}>
              Nós cruzamos esses debates com dados educacionais e habilidades da BNCC, organizando evidências, argumentos e referências para que você monte seu material <strong>revisando, refinando e validando cada etapa</strong> antes de levar para a sala de aula.
            </p>
            
            {/** 
            <div className="pt-2 flex flex-wrap gap-4">
              <div 
                className="flex items-center gap-2.5 text-sm font-bold px-4 shadow-sm py-3 rounded-2xl"
                style={{ 
                  backgroundColor: 'rgba(255,255, 255, 0.4)',
                  color: THEME_COLORS.textDark 
                }}
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: THEME_COLORS.primary }} />
                <span>551 transcrições da Câmara dos Deputados</span>
              </div>
              <div 
                className="flex items-center gap-2.5 text-sm font-bold shadow-sm px-4 py-3 rounded-2xl"
                style={{ 
                  backgroundColor: 'rgba(255,255, 255, 0.4)',
                  color: THEME_COLORS.textDark 
                }}
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: THEME_COLORS.secondary }} />
                <span>Rastreabilidade até a fonte original</span>
              </div>
            </div>*/}
          </div>

          <div className="lg:col-span-6 relative">
            <div 
              className="relative h-90 place-self-end rounded-3xl overflow-hidden shadow-md aspect-[4/3]"
            >
              <img 
                src="https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Alunos e professor em debate em sala de aula"
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0 flex items-end p-6"
                style={{ background: 'linear-gradient(to top, rgba(50, 17, 110, 0.85) 0%, transparent 70%)' }}
              >
                {/** 
                <div style={{ color: THEME_COLORS.textLight }}>
                  <span className="text-xs uppercase tracking-wider font-extrabold" style={{ color: THEME_COLORS.textLight }}>Ambiente Colaborativo</span>
                  <p className="text-sm font-medium mt-1">Escuta qualificada, argumentação e respeito à diversidade de ideias.</p>
                </div>*/}
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
