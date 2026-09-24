import React, { useState } from 'react';
import { 
  Search, Bot, PenLine, Download, CheckCircle2, 
  ArrowRight, RotateCcw, Sparkles, Layers
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';

export const TeachingGuide: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const guides = [
    {
      id: 0,
      title: 'Escolha o debate',
      subtitle: 'Encontre a audiência certa para o seu tema',
      icon: Search,
      description: 'Descreva o tema em linguagem natural e localize audiências públicas da Câmara dos Deputados por similaridade semântica. Cada resultado traz resumo, participantes e indicadores discursivos para você examinar antes de incorporar ao planejamento.',
      tips: [
        'Busque pelo tema da aula e compare os resumos dos debates ranqueados.',
        'Verifique participantes, posições distintas e categorias discursivas identificadas.',
        'Abra os dados completos do debate e retorne à transcrição original quando precisar de contexto.',
        'A escolha das fontes já é uma decisão pedagógica: prefira recortes plurais.',
      ],
      suggestedActivity: '"Quero montar uma oficina de redação para o 6º ano sobre igualdade de gênero. Quais audiências da Câmara tratam desse tema?"',
    },
    {
      id: 1,
      title: 'Planeje com os agentes',
      subtitle: 'Do tema ao roteiro da aula',
      icon: Bot,
      description: 'Os agentes recuperam audiências relevantes para o tipo de material que você deseja criar e maturam as ideias com você, sempre esperando você aprovar cada decisão antes de avançar.',
      tips: [
        'Descreva série, componente curricular e objetivos da aula no chat.',
        'Revise o planejamento proposto antes de autorizar a geração.',
        'Ajuste complexidade, extensão e vocabulário ao nível da sua turma.',
        'Selecione as habilidades da BNCC adequadas à etapa de ensino.',
      ],
      suggestedActivity: '"A turma tem 30 alunos do 8º ano. Monte um plano de 2 aulas com leitura de trechos, discussão em grupos e uma atividade escrita alinhada à BNCC."',
    },
    {
      id: 2,
      title: 'Gere e edite no canvas',
      subtitle: 'Material estruturado e editável',
      icon: PenLine,
      description: 'Escolha entre plano de aula, atividade, debate e muito mais. O agente de implementação transforma suas ideias em material editável, deixando que você manualmente ajuste ou solicite ajustes o quanto precisar em um canvas editável ao lado do chat.',
      tips: [
        'Edite títulos, enunciados e blocos diretamente no canvas, sem regenerar tudo.',
        'Peça pelo chat mudanças amplas: reformular questões, adequar a linguagem, acrescentar um contraponto.',
        'Confira cada afirmação no excerto original antes de aceitar.',
        'Combine evidências dos debates com seus próprios livros e modelos de plano.',
      ],
      suggestedActivity: '"Reformule a questão 3 com uma linguagem mais simples e acrescente um contraponto favorável ao tema."',
    },
    {
      id: 3,
      title: 'Revise e exporte',
      subtitle: 'Aprovação docente e sala de aula',
      icon: Download,
      description: 'Conversas, fontes externas e decisões pedagógicas ficam registradas para rastreabilidade. Aprove o material final, salve na sua base e exporte no melhor formato para usar em sala de aula.',
      tips: [
        'Faça a revisão final: coerência entre objetivos, atividades e avaliação.',
        'Aprove o material para armazená-lo na sua base de materiais.',
        'Exporte em PDF preservando a estrutura definida no editor.',
        'Reutilize e adapte o material para outras turmas quando precisar.',
      ],
      suggestedActivity: '"Aprovado. Salve o material na minha base e gere o PDF em formato retrato."',
    },
  ];

  return (
    <section id="como-aprimorar" className="py-24 relative overflow-hidden" style={{ borderColor: THEME_COLORS.borderLight }}>
      
      {/* Background Abstract Geometric Shapes */}
      <div 
        className="absolute top-10 -left-16 w-72 h-72 rounded-tr-[100%] pointer-events-none opacity-20"
        style={{ backgroundColor: THEME_COLORS.secondary }}
      />
      <div 
        className="absolute bottom-10 right-0 w-80 h-80 rounded-bl-full pointer-events-none opacity-20"
        style={{ backgroundColor: THEME_COLORS.primary }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header with Mixed Outline and Solid Typography */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            <span className="text-outline-dark">Como funciona o </span>
            <span style={{ color: THEME_COLORS.textDark }}>Contraponto</span>
          </h2>

          <p className="text-base sm:text-lg font-medium" style={{ color: THEME_COLORS.gray }}>
            Da escolha do debate ao plano de aula: um fluxo em 4 etapas com o professor no comando.
          </p>
        </div>

        {/* Categories Tab Capsule Navigation */}
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {guides.map((item, index) => {
            const Icon = item.icon;
            const isSelected = activeCategory === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveCategory(index)}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-md focus:outline-none"
                style={{
                  backgroundColor: isSelected ? THEME_COLORS.primary : THEME_COLORS.cardBg,
                  color: isSelected ? THEME_COLORS.textLight : THEME_COLORS.textDark,
                }}
              >
                <Icon className="w-4 h-4 shrink-0 stroke-[2.5]" />
                <span>{item.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Guide Content Display */}
        {(() => {
          const current = guides[activeCategory];
          const Icon = current.icon;
          return (
            <div 
              className="mt-10 rounded-3xl p-8 sm:p-12 shadow-md animate-in fade-in duration-300 backdrop-blur-sm"
              style={{ 
                backgroundColor: THEME_COLORS.cardBg,
                borderColor: THEME_COLORS.borderLight 
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left Side Info */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 px-4 rounded-2xl text-white flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: THEME_COLORS.primary }}
                    >
                      <Icon className="w-7 h-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest" style={{ color: THEME_COLORS.primary }}>
                        Etapa do fluxo
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black leading-snug" style={{ color: THEME_COLORS.textDark }}>
                        {current.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-base leading-relaxed font-medium" style={{ color: THEME_COLORS.gray }}>
                    {current.description}
                  </p>

                  {/* Exemplo de interação (etapas 1–3) ou formatos suportados (última etapa) */}
                  {activeCategory < guides.length - 1 ? (
                    <div 
                      className="p-6 rounded-2xl border-2 space-y-2"
                      style={{ 
                        backgroundColor: THEME_COLORS.bgLight, 
                        borderColor: THEME_COLORS.borderLight 
                      }}
                    >
                      <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide" style={{ color: THEME_COLORS.primary }}>
                        <Sparkles className="w-4 h-4" />
                        <span>Exemplo de interação</span>
                      </div>
                      <p className="text-sm font-bold leading-relaxed" style={{ color: THEME_COLORS.textDark }}>
                        {current.suggestedActivity}
                      </p>
                    </div>
                  ) : (
                    <div 
                      className="p-6 rounded-2xl border-2 space-y-4"
                      style={{ 
                        backgroundColor: THEME_COLORS.bgLight, 
                        borderColor: THEME_COLORS.borderLight 
                      }}
                    >
                      <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide" style={{ color: THEME_COLORS.primary }}>
                        <Download className="w-4 h-4" />
                        <span>Formatos suportados</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['HTML', 'DOCX', 'PDF', 'PPTX'].map((format) => (
                          <span
                            key={format}
                            className="px-4 py-1.5 rounded-full text-xs font-black tracking-wider border"
                            style={{
                              backgroundColor: THEME_COLORS.lightPrimary,
                              borderColor: THEME_COLORS.lightPrimary,
                              color: THEME_COLORS.primary,
                            }}
                          >
                            {format}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] font-medium" style={{ color: THEME_COLORS.gray }}>
                        PPTX disponível para apresentações de slides.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Side Step Tips */}
                <div 
                  className="lg:col-span-6 rounded-2xl p-6 sm:p-8 border-2 space-y-5"
                  style={{ 
                    backgroundColor: THEME_COLORS.bgLight,
                    borderColor: THEME_COLORS.borderLight 
                  }}
                >
                  <h4 className="font-black text-base flex items-center gap-2.5" style={{ color: THEME_COLORS.textDark }}>
                    <Layers className="w-5 h-5" style={{ color: THEME_COLORS.secondary }} />
                    <span>Passo a passo da etapa:</span>
                  </h4>

                  <ul className="space-y-4">
                    {current.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 text-sm" style={{ color: THEME_COLORS.textDark }}>
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: THEME_COLORS.primary }} />
                        <span className="leading-relaxed font-medium">{tip}</span>
                      </li>
                    ))}
                  </ul>

                  <div 
                    className="pt-4 border-t flex items-center justify-end text-xs font-bold"
                    style={{ borderColor: THEME_COLORS.borderLight }}
                  >
                    {activeCategory < guides.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setActiveCategory(activeCategory + 1)}
                        className="flex items-center gap-1.5 font-extrabold cursor-pointer transition-all hover:gap-2.5"
                        style={{ color: THEME_COLORS.secondaryText }}
                      >
                        <span>Próxima etapa: {guides[activeCategory + 1].title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveCategory(0)}
                        className="flex items-center gap-1.5 font-extrabold cursor-pointer transition-all hover:gap-2.5"
                        style={{ color: THEME_COLORS.secondaryText }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Voltar ao início do fluxo</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
};
