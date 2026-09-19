import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { THEME_COLORS } from '../../constants/colors';
import { ChatPanel } from './ChatPanel';
import type { ChatMessage } from './ChatPanel';
import { AudienciaList } from './AudienciaList';
import { AudienciaDetalhes } from './AudienciaDetalhes';
import { Toast } from '../general/Toast';
import * as api from '../../api/client';
import type { AudienciaDetalhe, AudienciaResumo } from '../../data/mockAudiencias';

function parseSerie(text: string): string | null {
  const serieMatch = text.match(/\b([1-9])\s?º?\s?(ano|série|serie)(\s?(do\s?)?(ensino\s?médio|em|fundamental))?/i);
  if (serieMatch) {
    return serieMatch[0].trim();
  }
  if (/ensino\s?médio/i.test(text)) return 'Ensino Médio';
  if (/ensino\s?fundamental/i.test(text)) return 'Ensino Fundamental';
  if (/\beja\b/i.test(text)) return 'EJA';
  return null;
}

function parseTipoMaterial(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes('plano de aula') || lower.includes('plano')) return 'Plano de aula';
  if (lower.includes('roteiro de debate') || lower.includes('debate')) return 'Roteiro de debate';
  if (lower.includes('oficina de redação') || lower.includes('oficina de redacao') || lower.includes('redação') || lower.includes('redacao')) return 'Oficina de redação';
  if (lower.includes('letramento')) return 'Letramento midiático';
  if (lower.includes('slide')) return 'Slides';
  if (lower.includes('complementar')) return 'Materiais complementares';
  if (lower.includes('material') || lower.includes('atividade')) return 'Material';
  return null;
}

function tipoInicialFromUrl(type?: string): string | null {
  switch (type) {
    case 'plano':
      return 'Plano de aula';
    case 'debate':
      return 'Roteiro de debate';
    case 'redacao':
      return 'Oficina de redação';
    case 'materiais':
      return 'Letramento midiático';
    case 'slides':
      return 'Slides';
    case 'complementares':
      return 'Materiais complementares';
    default:
      return null;
  }
}

function tipoLabelToId(label: string | null, fallback?: string): string {
  if (label === 'Plano de aula') return 'plano';
  if (label === 'Roteiro de debate') return 'debate';
  if (label === 'Oficina de redação') return 'redacao';
  if (label === 'Letramento midiático') return 'materiais';
  if (label === 'Slides') return 'slides';
  if (label === 'Materiais complementares') return 'complementares';
  return fallback ?? 'brainstorm';
}

function backendAgentFromType(type?: string): string | undefined {
  switch (type) {
    case 'debate': return 'debate';
    case 'plano': return 'lesson_plan';
    case 'materiais': return 'political_leteracy';
    case 'redacao': return 'writing_workshop';
    case 'slides': return 'slides';
    case 'complementares': return 'generic';
    default: return undefined;
  }
}

interface PlanningItem {
  id: string | number;
  titulo: string;
  resumo?: string;
}

const INITIAL_BRAINSTORM_MESSAGE: ChatMessage = {
  id: 'bs-1',
  role: 'assistant',
  text: 'Me conte qual tema você quer trabalhar — e, se já souber, a série e o tipo de material (plano de aula, roteiro de debate, oficina de redação). Vou buscar as audiências que mais combinam.',
};

function truncate(text: string, max = 180): string {
  const normalized = text.trim();
  return normalized.length <= max ? normalized : `${normalized.slice(0, max - 1)}…`;
}

function normalizeAudiencia(raw: any): AudienciaDetalhe {
  const discursos = Array.isArray(raw?.discursos) ? raw.discursos : [];
  const participantes = Array.isArray(raw?.participantes) ? raw.participantes : [];
  const posicionamentos = raw?.posicionamentos ?? {};
  const positionByParticipant = new Map<string, string>();
  for (const [position, people] of Object.entries(posicionamentos)) {
    if (!Array.isArray(people)) continue;
    for (const person of people as Array<{ participanteId?: string; resumo?: string }>) {
      if (person.participanteId) positionByParticipant.set(person.participanteId, position);
    }
  }
  const participantById = new Map<string, any>(participantes.map((person: any) => [String(person.id), person]));

  return {
    id: String(raw?.id ?? ''),
    titulo: String(raw?.titulo ?? ''),
    resumoCurto: truncate(String(raw?.resumo ?? '')),
    resumo: String(raw?.resumo ?? ''),
    textoIntegral: discursos
      .slice()
      .sort((a: any, b: any) => Number(a.ordem ?? 0) - Number(b.ordem ?? 0))
      .map((fala: any) => String(fala.texto ?? ''))
      .filter(Boolean),
    participantes: participantes.map((person: any) => ({
      nome: String(person.nome ?? ''),
      partido: person.partido,
      papel: String(person.papel ?? '').toLowerCase() === 'presidente' ? 'presidente' as const : 'participante' as const,
      resumoArgumentos: String((() => {
        const position = positionByParticipant.get(String(person.id));
        const group = position ? (posicionamentos as Record<string, any[]>)[position] ?? [] : [];
        return group.find((item: any) => String(item.participanteId) === String(person.id))?.resumo
          ?? 'Sem resumo de posicionamento registrado.';
      })()),
    })),
    falas: discursos.map((fala: any, index: number) => ({
      id: String(fala.id ?? `${raw?.id ?? 'audiencia'}-fala-${index}`),
      autor: String(fala.orador ?? ''),
      ordem_no_debate: Number(fala.ordem ?? index + 1),
      texto: String(fala.texto ?? ''),
      resumo: truncate(String(fala.texto ?? ''), 220),
      objeto_do_posicionamento: String(fala.posicionamento ?? ''),
      taxonomia: { Posicionamento: [String(fala.posicionamento ?? 'neutro')] },
    })),
    propostas: (Array.isArray(raw?.propostas) ? raw.propostas : []).map((proposta: any) => ({
      id: String(proposta.id ?? ''),
      titulo: String(proposta.titulo ?? ''),
      descricao: String(proposta.descricao ?? ''),
      autor: String(
        proposta.autorNome ?? participantById.get(String(proposta.autorId))?.nome ?? ''
      ),
    })),
  };
}

export const SuggestPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlType = searchParams.get('type') ?? undefined;

  const sessionIdParam = searchParams.get('sessionId');
  const audienciaIdParam = searchParams.get('audienciaId');
  const serieParam = searchParams.get('serie');

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_BRAINSTORM_MESSAGE]);
  const [sugestoes, setSugestoes] = useState<AudienciaResumo[]>([]);
  const [loadingSugestoes, setLoadingSugestoes] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<AudienciaDetalhe | null>(null);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);
  const [serie, setSerie] = useState<string | null>(serieParam);
  const [tipoMaterial, setTipoMaterial] = useState<string | null>(() => tipoInicialFromUrl(urlType));
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(sessionIdParam);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const creatingSession = useRef<Promise<string> | null>(null);

  const ensureSession = async (): Promise<string> => {
    if (sessionId) return sessionId;
    if (!creatingSession.current) {
      creatingSession.current = api.createWorkflowSession(backendAgentFromType(urlType))
        .then((session) => {
          setSessionId(session.id);
          return session.id;
        })
        .finally(() => { creatingSession.current = null; });
    }
    return creatingSession.current;
  };

  const loadPlanning = async (currentSessionId: string) => {
    const planning = await api.getWorkflowPlanning<PlanningItem>(currentSessionId);
    setSugestoes(planning.map((item) => ({
      id: String(item.id),
      titulo: item.titulo,
      resumoCurto: item.resumo ?? '',
    })));
  };

  useEffect(() => {
    setSessionError(null);
  }, [urlType]);

  useEffect(() => {
    if (sessionId) {
      void api.updateWorkflowStage(sessionId, 'audiences').catch(() => undefined);
    }
  }, [sessionId]);

  useEffect(() => {
    let active = true;

    if (!sessionIdParam) {
      setSessionId(null);
      setMessages([INITIAL_BRAINSTORM_MESSAGE]);
      setSugestoes([]);
      setSelectedId(null);
      setDetalhe(null);
      setSerie(serieParam);
      return () => { active = false; };
    }

    setSessionId(sessionIdParam);
    setSerie(serieParam);
    setLoadingSugestoes(true);

    const restoreSession = async () => {
      try {
        const [session, planning, audiencia] = await Promise.all([
          api.getWorkflowSession(sessionIdParam),
          api.getWorkflowPlanning<PlanningItem>(sessionIdParam),
          audienciaIdParam
            ? api.getAudiencia<any>(audienciaIdParam)
            : api.getWorkflowFile<any>(sessionIdParam, 'audiencia.json').catch(() => null),
        ]);

        if (!active) return;

        const persistedMessages: ChatMessage[] = session.messages
          .filter((message) => (
            (message.role === 'user' || message.role === 'assistant')
            && message.hidden !== true
            && Boolean(String(message.content ?? '').trim())
          ))
          .map((message, index) => ({
            id: `${sessionIdParam}-message-${index}`,
            role: message.role as 'user' | 'assistant',
            text: String(message.content),
          }));

        setMessages([INITIAL_BRAINSTORM_MESSAGE, ...persistedMessages]);
        setSugestoes(planning.map((item) => ({
          id: String(item.id),
          titulo: item.titulo,
          resumoCurto: item.resumo ?? '',
        })));
        setSelectedId(audiencia?.id ? String(audiencia.id) : audienciaIdParam);
        setDetalhe(audiencia ? normalizeAudiencia(audiencia) : null);
        setSessionError(null);
      } catch (cause) {
        if (active) {
          setSessionError(cause instanceof Error ? cause.message : 'Não foi possível retomar a sessão.');
        }
      } finally {
        if (active) setLoadingSugestoes(false);
      }
    };

    void restoreSession();
    return () => { active = false; };
  }, [audienciaIdParam, sessionIdParam, serieParam]);

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    setError(null);
    setLoadingDetalhe(true);
    try {
      const audiencia = await api.getAudiencia<any>(id);
      if (sessionId) await api.selectWorkflowPlanningItem(sessionId, id);
      setDetalhe(normalizeAudiencia(audiencia));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar a audiência.');
    } finally {
      setLoadingDetalhe(false);
    }
  };

  const handleSend = async (text: string) => {
    const id = `m-${Date.now()}`;
    const foundSerie = parseSerie(text);
    const foundTipo = parseTipoMaterial(text);
    const nextSerie = foundSerie ?? serie;
    const nextTipo = foundTipo ?? tipoMaterial;
    setSerie(nextSerie);
    setTipoMaterial(nextTipo);

    setLoadingSugestoes(true);

    const confirmacoes: string[] = [];
    if (foundSerie) confirmacoes.push(`série ${foundSerie}`);
    if (foundTipo) confirmacoes.push(foundTipo.toLowerCase());

    setMessages((prev) => [...prev, { id, role: 'user', text }]);
    try {
      const currentSessionId = await ensureSession();
      const response = await api.sendWorkflowMessage(currentSessionId, text, 'brainstorm');
      const replyText = String(response?.message?.content ?? response?.reply ?? 'Recebi sua mensagem.');
      setMessages((prev) => [...prev, {
        id: `${id}-r`,
        role: 'assistant',
        text: `${replyText}${confirmacoes.length > 0 ? ` Anotei: ${confirmacoes.join(' + ')}.` : ''}`,
      }]);
      await loadPlanning(currentSessionId);
      setSessionError(null);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Não foi possível conversar com o agente.';
      setSessionError(message);
      setMessages((prev) => [...prev, { id: `${id}-r`, role: 'assistant', text: `Não consegui concluir esta mensagem: ${message}` }]);
    } finally {
      setLoadingSugestoes(false);
    }
  };

  const handleProceed = async () => {
    // Validação de série/tipo temporariamente desativada para prototipação:
    // o alerta de erro (inline + toast) foi ocultado e o fluxo segue normal.
    // Para reativar, basta restaurar os blocos de setError/setToast abaixo.
    setError(null);
    if (!sessionId) {
      setError(sessionError ?? 'Envie uma mensagem ao brainstorm antes de avançar.');
      return;
    }
    try {
      const result = await api.advanceWorkflow(sessionId);
      if (!result.allowed) {
        setError('O brainstorm ainda não concluiu o planejamento. Converse mais um pouco com o agente.');
        return;
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível avançar para o agente final.');
      return;
    }
    // O material ganha um título próprio (editável no editor), não o da audiência.
    const titulo = `${tipoMaterial ?? 'Novo material'}${serie ? ` — ${serie}` : ''}`;
    const params = new URLSearchParams();
    params.set('title', titulo);
    params.set('type', tipoLabelToId(tipoMaterial, urlType));
    if (serie) params.set('serie', serie);
    if (detalhe) params.set('audienciaId', detalhe.id);
    params.set('sessionId', sessionId);
    navigate(`/home/editor/material?${params.toString()}`);
  };

  return (
    <div
      className="flex-grow h-screen flex flex-col min-w-0 overflow-hidden"
      style={{
        background: `linear-gradient(
          to bottom,
          ${THEME_COLORS.lightPrimary} -15%,
          ${THEME_COLORS.bgLight} 10%,
          #EBE8F3 60%
        )`,
        color: THEME_COLORS.textDark,
      }}
    >
      <div className="screen-in flex-1 min-w-0 h-full min-h-0 flex">
        {/* Esquerda — lista de sugestões */}
        <div className="w-72 shrink-0 h-full flex flex-col border-r" style={{ borderColor: THEME_COLORS.borderLight }}>
          <div className="shrink-0 px-4 pt-5 pb-2">
            <h1 className="text-sm font-black tracking-tight" style={{ color: THEME_COLORS.textDark }}>
              Audiências sugeridas
            </h1>
            <p className="mt-0.5 text-[11px] font-semibold" style={{ color: THEME_COLORS.gray }}>
              Fontes primárias para a sua aula
            </p>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <AudienciaList
              items={sugestoes}
              selectedId={selectedId}
              onSelect={handleSelect}
              loading={loadingSugestoes}
            />
          </div>
        </div>

        {/* Centro — detalhes da sugestão */}
        <div className="flex-1 min-w-0 h-full min-h-0">
          <AudienciaDetalhes
            detalhe={detalhe}
            loading={loadingDetalhe}
            serie={serie}
            tipoMaterial={tipoMaterial}
            error={error}
            onProceed={handleProceed}
            onSelectAudiencia={handleSelect}
          />
        </div>

        {/* Direita — chat */}
        <ChatPanel
          messages={messages}
          onSend={handleSend}
          placeholder="Pergunte ao Contraponto..."
          contextLabel="Fontes primárias — audiências"
          contextIcon="document"
          selectionLabel={detalhe?.titulo}
          onClearSelection={() => {
            setSelectedId(null);
            setDetalhe(null);
          }}
        />
      </div>

      {toast && (
        <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default SuggestPage;
