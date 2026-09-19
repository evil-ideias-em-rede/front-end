import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  MessageSquareQuote, LayoutTemplate, BookOpen, 
  FileText, Clock,
  FolderOpen, Presentation, Zap
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { HtmlPreview } from '../general/HtmlPreview';
import { useBackendData } from '../../context/BackendDataContext';
import * as api from '../../api/client';

interface HomePageProps {
  onOpenNewIdeaPrompt?: (prompt: string) => void;
}

export const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();
  const { materiais } = useBackendData();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [workflowSessions, setWorkflowSessions] = useState<api.WorkflowSessionSummary[]>([]);
  const [workflowLoading, setWorkflowLoading] = useState(true);
  const [openingSessionId, setOpeningSessionId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadWorkflowSessions = async () => {
      try {
        const sessions = await api.listWorkflowSessions();
        if (active) setWorkflowSessions(sessions);
      } catch {
        if (active) setWorkflowSessions([]);
      } finally {
        if (active) setWorkflowLoading(false);
      }
    };
    void loadWorkflowSessions();
    return () => { active = false; };
  }, []);

  const agentLabels: Record<string, string> = {
    brainstorm: 'Brainstorm',
    debate: 'Roteiro de Debate',
    lesson_plan: 'Plano de Aula',
    political_leteracy: 'Letramento Midiático',
    generic: 'Atividade',
    writing_workshop: 'Oficina de Redação',
    slides: 'Slides',
  };

  const agentTypes: Record<string, string> = {
    brainstorm: 'brainstorm',
    debate: 'debate',
    lesson_plan: 'plano',
    political_leteracy: 'materiais',
    generic: 'generic',
    writing_workshop: 'redacao',
    slides: 'slides',
  };

  const workflowCategories: Record<string, string> = {
    brainstorm: 'atividade',
    debate: 'atividade',
    generic: 'atividade',
    lesson_plan: 'plano',
    political_leteracy: 'material',
    writing_workshop: 'atividade',
    slides: 'material',
  };

  const formatSessionDate = (value: string) => new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });

  // Quick Inspiration Prompts

  // Canva-style Category format badges — cores variadas da paleta vibrante
  const categoryShortcuts = [
    {
      id: 'brainstorm',
      label: 'Brainstorm',
      icon: Zap,
      color: '#F43F5E',
      badge: 'Ideação Livre',
    },
    {
      id: 'debate',
      label: 'Roteiro de Debate',
      icon: MessageSquareQuote,
      color: THEME_COLORS.primary,
      badge: 'Tempo & Réplicas',
    },
    {
      id: 'plano',
      label: 'Plano de Aula',
      icon: LayoutTemplate,
      color: THEME_COLORS.secondary,
      badge: 'Competências 7 e 10',
    },
    {
      id: 'redacao',
      label: 'Oficina de Redação',
      icon: FileText,
      color: THEME_COLORS.sunshine,
      badge: 'Intervenção Social',
    },
    {
      id: 'materiais',
      label: 'Letramento Midiático',
      icon: BookOpen,
      color: '#3B82F6',
      badge: 'Matrizes & Falácias',
    },
    {
      id: 'slides',
      label: 'Slides',
      icon: Presentation,
      color: '#EC4899',
      badge: 'Materiais complementares',
    },
  ];

  // "Continue de onde parou": filtro por categoria + sempre os mais recentes primeiro.
  const filteredMateriais = materiais
    .filter((m) => {
      if (filterCategory === 'all') return true;
      return m.category === filterCategory;
    })
    .sort((a, b) => (b.lastModifiedAt ?? 0) - (a.lastModifiedAt ?? 0));

  const visibleWorkflowSessions = workflowSessions.filter((session) => (
    filterCategory === 'all'
      || workflowCategories[session.selected_agent ?? 'brainstorm'] === filterCategory
  ));
  const continuationCount = workflowSessions.length + materiais.length;
  const categoryCount = (category: string) => (
    workflowSessions.filter((session) => (
      workflowCategories[session.selected_agent ?? 'brainstorm'] === category
    )).length
    + materiais.filter((material) => material.category === category).length
  );

  const openWorkflowSession = async (session: api.WorkflowSessionSummary) => {
    if (openingSessionId) return;
    setOpeningSessionId(session.id);

    const agent = session.selected_agent ?? 'brainstorm';
    const label = agentLabels[agent] ?? agent;
    const type = agentTypes[agent] ?? 'brainstorm';
    const params = new URLSearchParams({
      type,
      sessionId: session.id,
    });

    try {
      let audienciaId: string | null = null;
      try {
        const audiencia = await api.getWorkflowFile<{ id?: string }>(session.id, 'audiencia.json');
        audienciaId = audiencia?.id ? String(audiencia.id) : null;
      } catch {
        // A audiência é opcional enquanto o brainstorm ainda está em andamento.
      }
      if (audienciaId) params.set('audienciaId', audienciaId);

      if (session.current_stage === 'editor') {
        params.set('title', label);
        navigate(`/home/editor/material?${params.toString()}`);
      } else {
        navigate(`/home/editor?${params.toString()}`);
      }
    } finally {
      setOpeningSessionId(null);
    }
  };

  return (
    <div 

    className="relative flex-grow p-6 lg:px-20 lg:py-6 overflow-y-auto max-w-7xl mx-auto w-full">
      <div className="relative z-10 space-y-4">
      {/* ========================================================================= */}
      {/* 1. CANVA-INSPIRED HERO BANNER: "O que você quer criar hoje?"               */}
      {/* ========================================================================= */}
      <section 
        className="rounded-3xl sm:pt-12 relative overflow-hidden"
      >
        
        <div className="max-w-4xl space-y-8 relative z-10">
          
          {/* Main Title with Brand Outline & Solid Typography */}
          <svg
            viewBox="0 0 774 100"
            className=" h-auto hero-title-in"
          >
            <defs>
              <linearGradient id="purpleGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#4C1D95" />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient id="purpleGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4C1D95" />
                <stop offset="50%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>

            <text
              x="0"
              y="70"
              fontSize="56"
              fontWeight="900"
              fill="transparent"
              stroke="url(#purpleGradient1)"
              strokeWidth="2"
            >
              O que você quer
            </text>

            <text
              x="475"
              y="70"
              fontSize="56"
              fontWeight="900"
              fill="url(#purpleGradient2)"
            >
              criar hoje?
            </text>
          </svg>

          {/* Central Search / Idea Creation Input 
          <form onSubmit={handleGenerateIdea} className="relative sm:w-lg md:w-2xl mx-auto input-in"
                style={{
                  animationDelay: "180ms",
                }}
          >
            <div 
              className="flex items-center rounded-2xl border-2 p-2 shadow-md transition-all focus-within:border-[#7C3AED]"
              style={{ 
                backgroundColor: THEME_COLORS.white, 
                borderColor: THEME_COLORS.lightPrimary,
                boxShadow: '0 4px 6px #E9D5FF',
              }}
            >
              <div className="px-3 text-stone-400">
                <PencilSparkles className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={ideaPrompt}
                onChange={(e) => setIdeaPrompt(e.target.value)}
                placeholder="Descreva uma ideia..."
                className="w-full h-10 bg-transparent border-0 text-sm font-semibold focus:outline-none placeholder-stone-400"
                style={{ color: THEME_COLORS.textDark }}
              />
            </div>
          </form>
          */}

          {/* Quick Idea Inspiration Chips 
          <div  className="flex flex-wrap items-center justify-center gap-2 pt-1 chips-in"   
                style={{
                  animationDelay: "350ms",
                }}
          >
            <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1">
              <Zap className="w-3 h-3" style={{color: THEME_COLORS.secondary}} /> Sugestões:
            </span>
              {inspirationChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIdeaPrompt(chip)}
                  className="
                    chip-in
                    hover:bg-[#EBE8F3]/100
                    text-[11px]
                    font-bold
                    px-3
                    py-1.5
                    shadow-sm
                    border
                    rounded-full
                    transition-all
                    hover:border-[#7C3AED]
                    hover:text-[#7C3AED]
                    hover:-translate-y-0.5
                    cursor-pointer
                  "
                  style={{
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark,
                    animationDelay: `${450 + idx * 80}ms`,
                  }}
                >
                  {chip}
                </button>
              ))}
          </div>
          */}

        </div>
      </section>


      <section className="space-y-6">
        <div className="flex items-center justify-between">
          {/* 
          <h2 className="text-xl font-bold" style={{ color: THEME_COLORS.textDark }}>
            Formatos & Ferramentas Rápidas
          </h2>
          <span className="text-xs font-bold text-stone-500">Selecione para estruturar</span>
          */}
          </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categoryShortcuts.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  navigate(
                    `/home/editor?title=${encodeURIComponent(cat.label)}&type=${encodeURIComponent(cat.id)}`
                  )
                }
                className={`p-4 rounded-2xl border-r shadow-sm text-left transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between min-h-[120px] shadow-sm
                }`}
                style={{
                  backgroundColor: '#ffffff40',
                  borderColor: THEME_COLORS.borderLight,
                }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>

                <div className="mt-3">
                  <h3 className="text-xs font-black leading-tight" style={{ color: THEME_COLORS.textDark }}>
                    {cat.label}
                  </h3>
                  <span className="text-[10px] font-bold mt-1 block" style={{ color: THEME_COLORS.gray }}>
                    {cat.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "CONTINUE DE ONDE PAROU" (Unarchived Works & Preview Cards)             */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-8">
        
        {/* Section Header with Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 " style={{ borderColor: THEME_COLORS.borderLight }}>
          <div>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: THEME_COLORS.textDark }}>
              Continue de onde parou
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">

            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all border cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                  : 'bg-white text-stone-700 border-[#f3ebea] hover:bg-black/[0.05]'
              }`}
            >
              Todos ({continuationCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('atividade')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all border cursor-pointer ${
                filterCategory === 'atividade'
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                  : 'bg-white text-stone-700 border-[#f3ebea] hover:bg-black/[0.05]'
              }`}
            >
              Atividades ({categoryCount('atividade')})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('plano')}
              className={`px-3.5 py-1.5 rounded-full text-xs shadow-sm font-bold transition-all border cursor-pointer ${
                filterCategory === 'plano'
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                  : 'bg-white text-stone-700 border-[#f3ebea] hover:bg-black/[0.05]'
              }`}
            >
              Planos de Aula ({categoryCount('plano')})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('material')}
              className={`px-3.5 py-1.5 rounded-full text-xs shadow-sm font-bold transition-all border cursor-pointer ${
                filterCategory === 'material'
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                  : 'bg-white text-stone-700 border-[#f3ebea] hover:bg-black/[0.05]'
              }`}
            >
              Materiais complementares ({categoryCount('material')})
            </button>
          </div>
        </div>

        {/* Conversas do workflow salvas no backend */}
        {visibleWorkflowSessions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 [grid-auto-flow:dense]">
            {visibleWorkflowSessions.map((session) => {
              const agent = session.selected_agent ?? 'brainstorm';
              const label = agentLabels[agent] ?? agent;
              return (
                <div
                  key={`session-${session.id}`}
                  onClick={() => void openWorkflowSession(session)}
                  className={`rounded-3xl shadow-sm border overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer group ${openingSessionId === session.id ? 'opacity-60' : ''}`}
                  style={{ backgroundColor: '#ffffff40', borderColor: THEME_COLORS.borderLight }}
                >
                  <div className="h-40 relative overflow-hidden shrink-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(226, 221, 240, 0.4)' }}>
                    <MessageSquareQuote className="w-14 h-14" style={{ color: THEME_COLORS.primary }} />
                  </div>
                  <div className="p-6 flex flex-col flex-1 space-y-3">
                    <h3 className="line-clamp-1 text-base font-bold leading-snug group-hover:text-[#7C3AED] transition-colors" style={{ color: THEME_COLORS.textDark }}>
                      {label}
                    </h3>
                    <p className="line-clamp-3 text-xs leading-relaxed" style={{ color: THEME_COLORS.gray }}>
                      {session.last_message || 'Sessão iniciada; continue a conversa.'}
                    </p>
                  </div>
                  <div className="p-4 px-6 border-t flex items-center justify-between text-xs" style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: 'rgba(0, 0, 0, 0.015)' }}>
                    <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatSessionDate(session.last_message_at ?? session.created_at)}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500">
                      {session.message_count} mensagens
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Materiais gerados salvos no backend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 [grid-auto-flow:dense]">
          {filteredMateriais.map((material) => {
            return (
              <div
                key={material.id}
                onClick={() =>
                  navigate(
                    `/home/editor/material?title=${encodeURIComponent(material.title)}`
                  )
                }
                className={`
                  rounded-3xl shadow-sm border overflow-hidden flex flex-col
                  transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer group
                  ${material.orientation === 'H' ? 'col-span-2' : 'col-span-1'}
                `}
                style={{ 
                  backgroundColor: '#ffffff40', 
                  borderColor: THEME_COLORS.borderLight 
                }}
              >
                {/* Thumbnail */}
                <div 
                  className="h-40 relative overflow-hidden shrink-0"
                  style={{ backgroundColor: 'rgba(226, 221, 240, 0.4)' }}
                >
                  <HtmlPreview
                    html={material.htmlContent}
                    fit
                    refWidth={material.orientation === 'H' ? 1900 : 900}
                    refHeight={material.orientation === 'H' ? 900 : 1273}
                    className="w-full h-full"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <h3 className="line-clamp-2 text-base font-bold leading-snug group-hover:text-[#7C3AED] transition-colors" style={{ color: THEME_COLORS.textDark }}>
                    {material.title}
                  </h3>
                </div>

                {/* Footer */}
                <div 
                  className="p-4 px-6 border-t flex items-center text-xs"
                  style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: 'rgba(0, 0, 0, 0.015)' }}
                >
                  <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                    {material.lastModified && (
                      <Clock className="w-3 h-3" />
                    )}
                    {material.lastModified}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {!workflowLoading && visibleWorkflowSessions.length === 0 && filteredMateriais.length === 0 && (
          <div className="p-12 mb-8 text-center rounded-3xl space-y-3">
            <FolderOpen className="w-10 h-10 mx-auto text-stone-400" />
            <h4 className="font-bold text-sm text-stone-700">Nenhum material encontrado nesta categoria</h4>
            <p className="text-xs text-stone-500">Utilize a barra de criação acima para iniciar um novo rascunho.</p>
          </div>
        )}

      </section>

      </div>
      <div className='h-12'></div>
    </div>
  );
};
