import React, { useState } from 'react';
import { 
  MessageSquare, Lightbulb, FileText, CheckCircle2, 
  ArrowRight, ShieldAlert, Sparkles, Layers
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';

export const TeachingGuide: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const guides = [
    {
      id: 0,
      title: 'Debates Estruturados & Simulações Parlamentares',
      subtitle: 'Como evitar o caos e promover a escuta recíproca',
      icon: MessageSquare,
      description: 'Estruturar o tempo de fala e definir critérios claros de pontuação e réplica transforma o debate de um conflito inflamado para um enriquecedor exercício de retórica e respeito.',
      tips: [
        'Adote o modelo de "Inversão de Papéis": peça para o aluno defender argumentos da corrente oposta à sua convicção pessoal.',
        'Use uma Matriz de Argumentação: premissa maior, evidência concreta e conclusão.',
        'Institua a regra do cartão de falácia: quando houver ataque pessoal (ad hominem), o tempo do orador é pausado para reflexão pedagógica.',
        'Defina um cronômetro visível com tempo para exposição (3 min), réplica (2 min) e tréplica (1 min).',
      ],
      suggestedActivity: 'Simulação de Audiência Pública na Câmara Municipal para debater transporte escolar gratuito ou uso de celulares na escola.',
    },
    {
      id: 1,
      title: 'Filosofias & Teorias Políticas sem Abstração',
      subtitle: 'Conectando os clássicos aos dilemas dos jovens contemporâneos',
      icon: Lightbulb,
      description: 'Apresente os contratualistas (Hobbes, Locke, Rousseau) e pensadores modernos (Arendt, Bobbio, Habermas) não como estátuas do passado, mas como chaves de leitura para o mundo digital.',
      tips: [
        'Relacione "O Contrato Social" às regras de convivência escolar e termos de uso das redes sociais.',
        'Apresente o "Estado de Natureza" hobbesiano ao debater a necessidade de leis contra o cyberbullying.',
        'Utilize o conceito de "Esfera Pública" de Habermas para analisar os comentários em vídeos e fóruns online.',
        'Trabalhe a "Banalidade do Mal" de Hannah Arendt para conscientizar sobre conformismo social e pensamento crítico.',
      ],
      suggestedActivity: 'Painel "Filósofos em Rede": criação de posts fictícios de cada autor comentando uma notícia atual.',
    },
    {
      id: 2,
      title: 'Letramento Político & Detecção de Falácias',
      subtitle: 'Imunizando a sala de aula contra fake news e desinformação',
      icon: ShieldAlert,
      description: 'Ensinar o estudante a verificar fontes primárias, checar dados oficiais em portais de transparência e identificar falácias lógicas recorrentes no discurso público.',
      tips: [
        'Oficina do "Espantalho e do Arenque Defumado": reconhecer quando um argumento distorce o tema original.',
        'Busca reversa de imagens e checagem cruzada em agências de fact-checking reconhecidas.',
        'Diferenciar claramente: Poder Executivo, Legislativo e Judiciário e as atribuições de cada esfera de poder.',
        'Análise da linguagem apelativa, títulos sensacionalistas e viés de confirmação.',
      ],
      suggestedActivity: 'Laboratório "Detetives da Informação": desconstrução em grupos de manchetes sensacionalistas virais com apresentação de contrapontos.',
    },
    {
      id: 3,
      title: 'Escrita Argumentativa & Proposta de Intervenção',
      subtitle: 'Da oratória ao texto dissertativo com respeito aos Direitos Humanos',
      icon: FileText,
      description: 'Metodologia para consolidar a opinião crítica em textos estruturados (ensaios, cartas abertas, artigos de opinião e redação no padrão ENEM/Vestibulares).',
      tips: [
        'Ensine a fórmula da Proposta de Intervenção: Agente + Ação + Meio/Modo + Efeito + Detalhamento.',
        'Treine o uso de repertório sociocultural legitimado: citações filosóficas, dados estatísticos e marcos legais como a Constituição de 1988.',
        'Estimule a redação de Cartas Abertas endereçadas a autoridades locais (vereadores, secretários de educação).',
        'Avaliação por pares: alunos revisam a coerência e coesão dos argumentos dos colegas.',
      ],
      suggestedActivity: 'Concurso de Redação Cidadã com publicação dos melhores artigos de opinião no mural da escola ou blog comunitário.',
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
            <span className="text-outline-dark">Como Aprimorar meu </span>
            <span style={{ color: THEME_COLORS.textDark }}>Ensino de Política</span>
          </h2>

          <p className="text-base sm:text-lg font-medium" style={{ color: THEME_COLORS.gray }}>
            Metodologias práticas e dinâmicas para tornar as aulas envolventes, respeitosas e fundamentadas.
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
                        Estratégia Pedagógica
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black leading-snug" style={{ color: THEME_COLORS.textDark }}>
                        {current.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-base leading-relaxed font-medium" style={{ color: THEME_COLORS.gray }}>
                    {current.description}
                  </p>

                  {/* Suggested Activity Highlight Box */}
                  <div 
                    className="p-6 rounded-2xl border-2 space-y-2"
                    style={{ 
                      backgroundColor: THEME_COLORS.bgLight, 
                      borderColor: THEME_COLORS.borderLight 
                    }}
                  >
                    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide" style={{ color: THEME_COLORS.primary }}>
                      <Sparkles className="w-4 h-4" />
                      <span>Sugestão de Atividade em Sala de Aula</span>
                    </div>
                    <p className="text-sm font-bold leading-relaxed" style={{ color: THEME_COLORS.textDark }}>
                      {current.suggestedActivity}
                    </p>
                  </div>
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
                    <span>Passo a Passo de Aplicação:</span>
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
                    className="pt-4 border-t flex items-center justify-between text-xs font-bold"
                    style={{ borderColor: THEME_COLORS.borderLight, color: THEME_COLORS.gray }}
                  >
                    <span>Disponível nos templates do professor</span>
                    <span className="flex items-center gap-1 font-extrabold" style={{ color: THEME_COLORS.secondaryText }}>
                      Contraponto <ArrowRight className="w-3.5 h-3.5" />
                    </span>
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
