import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  MessageSquareQuote, LayoutTemplate, BookOpen,
  FileText, Clock,
  FolderOpen, Presentation, Zap, MoreVertical, Pencil, Trash2, X
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { ConfirmDeleteModal } from '../criar/ConfirmDeleteModal';
import { WorkflowPreviewThumbnail } from '../general/WorkflowPreviewThumbnail';
import * as api from '../../api/client';

interface HomePageProps {
  onOpenNewIdeaPrompt?: (prompt: string) => void;
}

export const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [workflowSessions, setWorkflowSessions] = useState<api.WorkflowSessionSummary[]>([]);
  const [workflowLoading, setWorkflowLoading] = useState(true);
  const [openingSessionId, setOpeningSessionId] = useState<string | null>(null);
  const [titleOverrides, setTitleOverrides] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('contraponto.workflow_titles') ?? '{}'); } catch { return {}; }
  });
  const [optionsSessionId, setOptionsSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [deletedSessionIds, setDeletedSessionIds] = useState<Set<string>>(() => new Set());
  const [editingTitle, setEditingTitle] = useState('');
  const [workflowDeleteTarget, setWorkflowDeleteTarget] = useState<api.WorkflowSessionSummary | null>(null);
  const [isDeletingWorkflow, setIsDeletingWorkflow] = useState(false);
  const [workflowDeleteError, setWorkflowDeleteError] = useState<string | null>(null);

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

  const formatEditedDate = (value?: string | number) => {
    if (value === undefined) return null;

    const date = typeof value === 'number' ? new Date(value) : new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return {
      date: date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }),
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  // Quick Inspiration Prompts

  // Canva-style Category format badges — cores variadas da paleta vibrante
  const categoryShortcuts = [
    {
      id: 'brainstorm',
      label: 'Brainstorm Livre',
      icon: Zap,
      color: '#823DF5',
      badge: 'Ideação Livre',
    },
    {
      id: 'debate',
      label: 'Roteiro de Debate',
      icon: MessageSquareQuote,
      color: '#2CB3ED',
      badge: 'Tempo & Réplicas',
    },
    {
      id: 'plano',
      label: 'Plano de Aula',
      icon: LayoutTemplate,
      color: '#95C913',
      badge: 'Competências 7 e 10',
    },
    {
      id: 'redacao',
      label: 'Oficina de Redação',
      icon: FileText,
      color: '#EDB00C',
      badge: 'Intervenção Social',
    },
    {
      id: 'materiais',
      label: 'Letramento Midiático',
      icon: BookOpen,
      color: '#F64379',
      badge: 'Matrizes & Falácias',
    },
    {
      id: 'slides',
      label: 'Apresentação de Slides',
      icon: Presentation,
      color: '#397BF9',
      badge: 'Materiais complementares',
    },
  ];

  const visibleWorkflowSessions = workflowSessions.filter((session) => (
    !deletedSessionIds.has(session.id) &&
    (filterCategory === 'all'
      || workflowCategories[session.selected_agent ?? 'brainstorm'] === filterCategory)
  ));
  const continuationCount = workflowSessions.length;
  const categoryCount = (category: string) => (
    workflowSessions.filter((session) => (
      workflowCategories[session.selected_agent ?? 'brainstorm'] === category
    )).length
  );

  const openWorkflowSession = async (session: api.WorkflowSessionSummary) => {
    if (openingSessionId) return;
    setOpeningSessionId(session.id);

    const agent = session.selected_agent ?? 'brainstorm';
    const label = titleOverrides[session.id] ?? agentLabels[agent] ?? agent;
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

  const deleteWorkflow = (session: api.WorkflowSessionSummary) => {
    setWorkflowDeleteError(null);
    setWorkflowDeleteTarget(session);
    setOptionsSessionId(null);
    setEditingSessionId(null);
  };

  const confirmDeleteWorkflow = async () => {
    if (!workflowDeleteTarget || isDeletingWorkflow) return;
    const session = workflowDeleteTarget;
    setIsDeletingWorkflow(true);
    setWorkflowDeleteError(null);
    setDeletedSessionIds((current) => new Set(current).add(session.id));
    setWorkflowSessions((current) => current.filter((item) => item.id !== session.id));
    try {
      await api.deleteWorkflowSession(session.id);
      setWorkflowDeleteTarget(null);
    } catch (error) {
      // Se a exclusão falhar, repõe o card para não esconder uma sessão válida.
      setDeletedSessionIds((current) => {
        const next = new Set(current);
        next.delete(session.id);
        return next;
      });
      setWorkflowSessions((current) => [session, ...current]);
      setWorkflowDeleteError(error instanceof Error ? error.message : 'Não foi possível excluir o plano.');
    } finally {
      setIsDeletingWorkflow(false);
    }
  };

  const renameWorkflow = (session: api.WorkflowSessionSummary, title: string) => {
    const normalizedTitle = title.trim().slice(0, 13);
    if (!normalizedTitle) return;
    const next = { ...titleOverrides, [session.id]: normalizedTitle };
    setTitleOverrides(next);
    localStorage.setItem('contraponto.workflow_titles', JSON.stringify(next));
    setOptionsSessionId(null);
    setEditingSessionId(null);
  };

  return (
    <div 

    className="relative flex-grow p-6 lg:px-20 lg:py-6 overflow-y-auto max-w-7xl mx-auto w-full template-page-in">
      <div className="relative z-10 pt-4 space-y-4">
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
              stroke={THEME_COLORS.textDark}
              strokeWidth="2"
            >
              O que você quer 
            </text>

            <text
              x="442"
              y="70"
              fontSize="56"
              fontWeight="900"
              fill={THEME_COLORS.textDark}
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


      <section className="space-y-6 template-page-in" style={{ animationDelay: '150ms' }}>
        <div className="flex items-center justify-between">
          {/* 
          <h2 className="text-xl font-bold" style={{ color: THEME_COLORS.textDark }}>
            Formatos & Ferramentas Rápidas
          </h2>
          <span className="text-xs font-bold text-stone-500">Selecione para estruturar</span>
          */}
          </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categoryShortcuts.map((cat, idx) => {
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
                className="platform-shortcut-card template-card-in p-4 rounded-2xl border text-white transition-all hover:scale-[1.02] hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between min-h-[112px] shadow-md"
                style={{
                  backgroundColor: cat.color,
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  animationDelay: `${200 + idx * 70}ms`,
                }}
              >
                <Icon className="w-10 h-10 p-0 m-0 shrink-0 self-start stroke-[2.25]" />

                <div className="self-end p-0 m-0 text-right pb-1">
                  <h3 className="text-base pl-10 font-black leading-tight text-white">
                    {cat.label}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "CONTINUE DE ONDE PAROU" (Unarchived Works & Preview Cards)             */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-8 template-page-in" style={{ animationDelay: '250ms' }}>
        
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
            {visibleWorkflowSessions.map((session, idx) => {
              const agent = session.selected_agent ?? 'brainstorm';
              const label = titleOverrides[session.id] ?? agentLabels[agent] ?? agent;
              return (
                <div
                  key={`session-${session.id}`}
                  onClick={() => void openWorkflowSession(session)}
                  className={`template-card-in relative rounded-3xl shadow-sm border overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer group ${openingSessionId === session.id ? 'opacity-60' : ''}`}
                  style={{ backgroundColor: '#ffffff40', borderColor: THEME_COLORS.borderLight, animationDelay: `${350 + idx * 90}ms` }}
                >
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setOptionsSessionId((current) => current === session.id ? null : session.id);
                      setEditingTitle(titleOverrides[session.id] ?? label);
                    }}
                    className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-2 text-stone-500 shadow-sm hover:bg-violet-50 hover:text-violet-600 cursor-pointer"
                    title="Opções: editar título ou excluir"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {optionsSessionId === session.id && (
                    <div
                      className="absolute top-12 right-3 z-20 w-44 rounded-xl border bg-white p-1.5 shadow-xl"
                      style={{ borderColor: THEME_COLORS.borderLight }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => { setEditingSessionId(session.id); setOptionsSessionId(null); }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-bold text-stone-700 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar título
                      </button>
                      <button
                        type="button"
                        onClick={(event) => { event.stopPropagation(); void deleteWorkflow(session); }}
                        className="mt-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Excluir plano
                      </button>
                    </div>
                  )}
                  {editingSessionId === session.id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4" onClick={() => setEditingSessionId(null)}>
                      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-black" style={{ color: THEME_COLORS.textDark }}>Editar título</h3>
                            <p className="mt-0.5 text-xs text-stone-500">Use até 13 caracteres no card.</p>
                          </div>
                          <button type="button" onClick={() => setEditingSessionId(null)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 cursor-pointer"><X className="h-4 w-4" /></button>
                        </div>
                        <input
                          autoFocus
                          value={editingTitle}
                          maxLength={13}
                          onChange={(event) => setEditingTitle(event.target.value)}
                          className="w-full rounded-xl border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-200"
                          style={{ borderColor: THEME_COLORS.borderLight }}
                        />
                        <div className="mt-4 flex justify-end gap-2">
                          <button type="button" onClick={() => setEditingSessionId(null)} className="rounded-xl px-3 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer">Cancelar</button>
                          <button type="button" onClick={() => renameWorkflow(session, editingTitle)} className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700 cursor-pointer">Salvar</button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="h-40 relative overflow-hidden shrink-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(226, 221, 240, 0.4)' }}>
                    {agent === 'lesson_plan' || agent === 'debate' || agent === 'political_leteracy' || agent === 'generic' || agent === 'writing_workshop' || agent === 'slides' ? (
                      <WorkflowPreviewThumbnail sessionId={session.id} />
                    ) : (
                      <MessageSquareQuote className="w-14 h-14" style={{ color: THEME_COLORS.primary }} />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1 space-y-3">
                    <h3 className="line-clamp-1 text-base font-bold leading-snug group-hover:text-[#7C3AED] transition-colors" style={{ color: THEME_COLORS.textDark }}>
                      {titleOverrides[session.id] ?? label}
                    </h3>
                    <p className="line-clamp-3 text-xs leading-relaxed" style={{ color: THEME_COLORS.gray }}>
                      {session.last_message || 'Sessão iniciada; continue a conversa.'}
                    </p>
                  </div>
                  <div className="p-4 px-6 border-t flex items-center text-xs" style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: 'rgba(0, 0, 0, 0.015)' }}>
                    {(() => {
                      const editedAt = formatEditedDate(session.last_message_at ?? session.created_at);
                      return editedAt ? (
                        <span className="w-full text-[11px] font-semibold text-stone-500 flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Editado em {editedAt.date}
                          </span>
                          <span>{editedAt.time}</span>
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!workflowLoading && visibleWorkflowSessions.length === 0 && (
          <div className="template-card-in pt-12 mb-8 text-center rounded-3xl space-y-3">
            <FolderOpen className="w-10 h-10 mx-auto text-stone-400" />
            <h4 className="font-bold text-sm text-stone-700">Nenhum material encontrado nesta categoria</h4>
            <p className="text-xs text-stone-500">Utilize a barra de criação acima para iniciar um novo rascunho.</p>
          </div>
        )}

      </section>

      {workflowDeleteTarget && (
        <ConfirmDeleteModal
          title="Excluir plano?"
          message={`Tem certeza que deseja excluir "${titleOverrides[workflowDeleteTarget.id] ?? agentLabels[workflowDeleteTarget.selected_agent ?? 'brainstorm'] ?? 'este plano'}" e todo o seu progresso? Esta ação não pode ser desfeita.`}
          onCancel={() => {
            if (!isDeletingWorkflow) setWorkflowDeleteTarget(null);
          }}
          loading={isDeletingWorkflow}
          error={workflowDeleteError}
          onConfirm={() => { void confirmDeleteWorkflow(); }}
        />
      )}

      </div>
      <div className='h-12'></div>
    </div>
  );
};
