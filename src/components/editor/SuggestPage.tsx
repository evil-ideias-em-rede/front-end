import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { THEME_COLORS } from '../../constants/colors';
import { ChatPanel } from './ChatPanel';
import type { ChatMessage } from './ChatPanel';
import { AudienciaList } from './AudienciaList';
import { AudienciaDetalhes } from './AudienciaDetalhes';
import { Toast } from '../general/Toast';
import * as api from '../../api/client';
import type { AudienciaDetalhe, AudienciaResumo } from '../../data/mockAudiencias';
import { startHtmlPresencePolling } from '../../utils/htmlPresencePolling';
import { rememberViewedAudience, restoreViewedAudience } from '../../utils/viewedAudience';

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

function typeFromBackendAgent(agent?: string | null): string | undefined {
  switch (agent) {
    case 'debate': return 'debate';
    case 'lesson_plan': return 'plano';
    case 'political_leteracy': return 'materiais';
    case 'writing_workshop': return 'redacao';
    case 'slides': return 'slides';
    case 'generic': return 'complementares';
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

const HTML_AUTO_REDIRECT_COOKIE_PREFIX = 'contraponto_html_redirected_';
const HTML_AUTO_REDIRECT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function htmlAutoRedirectCookieName(sessionId: string): string {
  return `${HTML_AUTO_REDIRECT_COOKIE_PREFIX}${encodeURIComponent(sessionId)}`;
}

function hasHtmlAutoRedirected(sessionId: string): boolean {
  const cookieName = `${htmlAutoRedirectCookieName(sessionId)}=`;
  return document.cookie
    .split(';')
    .some((cookie) => cookie.trim().startsWith(cookieName));
}

function markHtmlAutoRedirected(sessionId: string): void {
  document.cookie = [
    `${htmlAutoRedirectCookieName(sessionId)}=1`,
    `Max-Age=${HTML_AUTO_REDIRECT_COOKIE_MAX_AGE}`,
    'Path=/',
    'SameSite=Lax',
  ].join('; ');
}

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
  for (const fala of discursos) {
    const taxonomia = fala?.taxonomia;
    const posicionamento = Array.isArray(taxonomia?.Posicionamento)
      ? taxonomia.Posicionamento[0]
      : fala?.posicionamento;
    if (fala?.participanteId && posicionamento && !positionByParticipant.has(String(fala.participanteId))) {
      positionByParticipant.set(String(fala.participanteId), String(posicionamento));
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
        const falaDoParticipante = discursos
          .filter((fala: any) => String(fala.participanteId) === String(person.id))
          .map((fala: any) => String(fala.resumo ?? '').trim())
          .find(Boolean);
        return group.find((item: any) => String(item.participanteId) === String(person.id))?.resumo
          ?? falaDoParticipante
          ?? 'Sem resumo de posicionamento registrado.';
      })()),
    })),
    falas: discursos.map((fala: any, index: number) => ({
      id: String(fala.id ?? `${raw?.id ?? 'audiencia'}-fala-${index}`),
      autor: String(fala.orador ?? ''),
      ordem_no_debate: Number(fala.ordem ?? index + 1),
      texto: String(fala.texto ?? ''),
      resumo: String(fala.resumo ?? '').trim() || truncate(String(fala.texto ?? ''), 220),
      objeto_do_posicionamento: String(fala.objeto_do_posicionamento ?? fala.posicionamento ?? ''),
      taxonomia: fala.taxonomia && typeof fala.taxonomia === 'object'
        ? fala.taxonomia
        : { Posicionamento: fala.posicionamento ? [String(fala.posicionamento)] : [] },
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

function detalheInicialDaSugestao(sugestao: AudienciaResumo): AudienciaDetalhe {
  return {
    id: sugestao.id,
    titulo: sugestao.titulo,
    resumoCurto: sugestao.resumoCurto,
    resumo: sugestao.resumoCurto,
    textoIntegral: [],
    participantes: [],
    falas: [],
    propostas: [],
  };
}

export const SuggestPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlType = searchParams.get('type') ?? undefined;
  const isBrainstorm = urlType === 'brainstorm';

  const sessionIdParam = searchParams.get('sessionId');
  const audienciaIdParam = searchParams.get('audienciaId');
  const serieParam = searchParams.get('serie');

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_BRAINSTORM_MESSAGE]);
  const [sugestoes, setSugestoes] = useState<AudienciaResumo[]>([]);
  const [loadingSugestoes, setLoadingSugestoes] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<AudienciaDetalhe | null>(null);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [serie, setSerie] = useState<string | null>(serieParam);
  const [tipoMaterial, setTipoMaterial] = useState<string | null>(() => tipoInicialFromUrl(urlType));
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(sessionIdParam);
  const [restoringSession, setRestoringSession] = useState(Boolean(sessionIdParam));
  const createdSessionId = useRef<string | null>(null);
  const [htmlReady, setHtmlReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const creatingSession = useRef<Promise<string> | null>(null);
  const detalheRequestRef = useRef(0);
  const [partialHtmlSession, setPartialHtmlSession] = useState<string | null>(null);
  const [pollingSession, setPollingSession] = useState<string | null>(null);
  const [restoredGenerationPending, setRestoredGenerationPending] = useState(false);
  const agentPending = sendingMessage || advancing;
  const agentPendingRef = useRef(agentPending);
  agentPendingRef.current = agentPending;
  const initialHtmlChecks = useRef(new Map<string, Promise<boolean>>());

  useEffect(() => {
    if (!pollingSession || pollingSession !== sessionId || isBrainstorm || htmlReady || hasHtmlAutoRedirected(pollingSession)) return;
    return startHtmlPresencePolling(
      () => api.workflowHtmlExists(pollingSession),
      () => setPartialHtmlSession(pollingSession),
    );
  }, [sessionId, pollingSession, isBrainstorm, htmlReady]);

  const withHtmlPolling = async <T,>(currentSessionId: string, request: () => Promise<T>): Promise<T> => {
    setPartialHtmlSession(null);
    setRestoredGenerationPending(false);
    if (!isBrainstorm && !htmlReady && !hasHtmlAutoRedirected(currentSessionId)) {
      setPollingSession(currentSessionId);
    }
    try {
      return await request();
    } finally {
      // Para assim que a resposta chega (ou falha), antes da confirmação final.
      setPollingSession(null);
    }
  };

  const ensureSession = async (): Promise<string> => {
    if (sessionId) return sessionId;
    if (!creatingSession.current) {
      creatingSession.current = api.createWorkflowSession(backendAgentFromType(urlType))
        .then((session) => {
          // A URL passa a identificar a conversa que já está aberta localmente.
          // Restaurá-la agora poderia trocar o prompt por um histórico ainda vazio.
          createdSessionId.current = session.id;
          setSessionId(session.id);
          const params = new URLSearchParams(searchParams);
          params.set('sessionId', session.id);
          navigate({ search: params.toString() }, { replace: true });
          return session.id;
        })
        .finally(() => { creatingSession.current = null; });
    }
    return creatingSession.current;
  };

  const refreshHtmlReady = async (currentSessionId: string): Promise<boolean> => {
    try {
      const exists = await api.workflowHtmlExists(currentSessionId);
      setHtmlReady(exists);
      return exists;
    } catch {
      setHtmlReady(false);
      return false;
    }
  };

  const buildMaterialEditorUrl = useCallback(async (currentSessionId: string): Promise<string> => {
    let sessionAgent: string | null | undefined;
    try {
      sessionAgent = (await api.getWorkflowSession(currentSessionId)).selected_agent;
    } catch {
      // O tipo atual da interface serve como fallback se a sessão não puder ser recarregada.
    }

    const titulo = `${tipoMaterial ?? 'Novo material'}${serie ? ` — ${serie}` : ''}`;
    const params = new URLSearchParams();
    params.set('title', titulo);
    params.set('type', typeFromBackendAgent(sessionAgent) ?? tipoLabelToId(tipoMaterial, urlType));
    if (serie) params.set('serie', serie);
    if (detalhe) params.set('audienciaId', detalhe.id);
    params.set('sessionId', currentSessionId);
    return `/home/editor/material?${params.toString()}`;
  }, [detalhe, serie, tipoMaterial, urlType]);

  const loadPlanning = async (currentSessionId: string, retries = 0): Promise<void> => {
    let planning: PlanningItem[];
    try {
      planning = await api.getWorkflowPlanning<PlanningItem>(currentSessionId);
    } catch (cause) {
      if (retries <= 0) throw cause;
      await new Promise((resolve) => window.setTimeout(resolve, 1000));
      return loadPlanning(currentSessionId, retries - 1);
    }
    const nextSugestoes = planning.map((item) => ({
      id: String(item.id),
      titulo: item.titulo,
      resumoCurto: item.resumo ?? '',
    }));

    setSugestoes((current) => {
      const mudou = current.length !== nextSugestoes.length
        || current.some((item, index) => {
          const next = nextSugestoes[index];
          return !next
            || item.id !== next.id
            || item.titulo !== next.titulo
            || item.resumoCurto !== next.resumoCurto;
        });
      return mudou ? nextSugestoes : current;
    });
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
    if (!sessionId || isBrainstorm || agentPending || !htmlReady || hasHtmlAutoRedirected(sessionId)) return undefined;

    let active = true;

    const redirectToEditor = async () => {
      const target = await buildMaterialEditorUrl(sessionId);
      if (!active) return;
      markHtmlAutoRedirected(sessionId);
      navigate(target);
    };

    void redirectToEditor().catch(() => undefined);

    return () => {
      active = false;
    };
  }, [buildMaterialEditorUrl, htmlReady, navigate, sessionId, isBrainstorm, agentPending]);

  useEffect(() => {
    let active = true;

    if (!sessionIdParam) {
      createdSessionId.current = null;
      setRestoringSession(false);
      setSessionId(null);
      setHtmlReady(false);
      setPartialHtmlSession(null);
      setRestoredGenerationPending(false);
      setMessages([INITIAL_BRAINSTORM_MESSAGE]);
      setSugestoes([]);
      setSelectedId(null);
      setDetalhe(null);
      setSerie(serieParam);
      return () => { active = false; };
    }

    setSessionId(sessionIdParam);
    if (createdSessionId.current === sessionIdParam) {
      setRestoringSession(false);
      return () => { active = false; };
    }
    createdSessionId.current = null;
    setSerie(serieParam);
    setRestoringSession(true);
    setLoadingSugestoes(true);

    const restoreSession = async () => {
      try {
        // Uma consulta inicial, inclusive no replay de efeitos do StrictMode.
        if (!initialHtmlChecks.current.has(sessionIdParam)) {
          initialHtmlChecks.current.set(sessionIdParam, api.workflowHtmlExists(sessionIdParam).catch(() => false));
        }
        const [session, planning, restoredHtmlReady] = await Promise.all([
          api.getWorkflowSession(sessionIdParam),
          api.getWorkflowPlanning<PlanningItem>(sessionIdParam),
          initialHtmlChecks.current.get(sessionIdParam)!,
        ]);

        const audienciaId = restoreViewedAudience(sessionIdParam,
          audienciaIdParam
            ?? (session.selected_audience_id ? String(session.selected_audience_id) : null)
            ?? (planning.length === 1 ? String(planning[0].id) : null),
        );
        const audiencia = audienciaId
          ? await api.getAudiencia<any>(audienciaId)
          : null;

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
        setSelectedId(audiencia?.id ? String(audiencia.id) : null);
        setDetalhe(audiencia ? normalizeAudiencia(audiencia) : null);
        // HTML parcial após reload não comprova que o agente já respondeu.
        // Mensagens internas (hidden) também podem iniciar uma geração.
        const lastTurn = [...session.messages].reverse().find((message) => message.role === 'user' || message.role === 'assistant');
        const waitingForReply = lastTurn?.role === 'user' && !hasHtmlAutoRedirected(sessionIdParam);
        if (!agentPendingRef.current) {
          setHtmlReady(restoredHtmlReady && !waitingForReply);
          setRestoredGenerationPending(restoredHtmlReady && waitingForReply);
        }
        setSessionError(null);
      } catch (cause) {
        if (active) {
          setSessionError(cause instanceof Error ? cause.message : 'Não foi possível retomar a sessão.');
        }
      } finally {
        if (active) {
          setLoadingSugestoes(false);
          setRestoringSession(false);
        }
      }
    };

    void restoreSession();
    return () => { active = false; };
  }, [audienciaIdParam, sessionIdParam, serieParam]);

  const handleSelect = async (id: string) => {
    if (advancing) return;
    const detalheRequestId = ++detalheRequestRef.current;
    setSelectedId(id);
    rememberViewedAudience(sessionId, id);
    setError(null);
    const sugestao = sugestoes.find((item) => item.id === id);
    setDetalhe(sugestao ? detalheInicialDaSugestao(sugestao) : null);
    setLoadingDetalhe(true);
    try {
      const audiencia = await api.getAudiencia<any>(id);
      if (detalheRequestId !== detalheRequestRef.current) return;
      const normalized = normalizeAudiencia(audiencia);
      setDetalhe(normalized);
    } catch (cause) {
      if (detalheRequestId !== detalheRequestRef.current) return;
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar a audiência.');
    } finally {
      if (detalheRequestId === detalheRequestRef.current) setLoadingDetalhe(false);
    }
  };

  const handleSend = async (text: string) => {
    if (sendingMessage || advancing || restoringSession) return;
    // Capture a audiência desta pergunta; navegar durante a resposta é permitido.
    const viewedAudienceId = selectedId;

    const id = `m-${Date.now()}`;
    const foundSerie = parseSerie(text);
    const foundTipo = parseTipoMaterial(text);
    const nextSerie = foundSerie ?? serie;
    const nextTipo = foundTipo ?? tipoMaterial;
    setSerie(nextSerie);
    setTipoMaterial(nextTipo);

    const showPlanningLoader = sugestoes.length === 0;
    if (showPlanningLoader) setLoadingSugestoes(true);
    setSendingMessage(true);

    const confirmacoes: string[] = [];
    if (foundSerie) confirmacoes.push(`série ${foundSerie}`);
    if (foundTipo) confirmacoes.push(foundTipo.toLowerCase());

    setMessages((prev) => [...prev, { id, role: 'user', text }]);
    try {
      const currentSessionId = await ensureSession();
      const response = await withHtmlPolling(currentSessionId, () => api.sendWorkflowMessage(currentSessionId, text, 'brainstorm', false, viewedAudienceId));
      const replyText = String(response?.message?.content ?? response?.reply ?? 'Recebi sua mensagem.');
      setMessages((prev) => [...prev, {
        id: `${id}-r`,
        role: 'assistant',
        text: `${replyText}${confirmacoes.length > 0 ? ` Anotei: ${confirmacoes.join(' + ')}.` : ''}`,
      }]);
      try {
        await Promise.all([
          loadPlanning(currentSessionId, 10),
          refreshHtmlReady(currentSessionId),
        ]);
        setSessionError(null);
      } catch (syncCause) {
        const syncMessage = syncCause instanceof Error ? syncCause.message : 'Falha de conexão';
        setSessionError(syncMessage);
        setError('A resposta chegou, mas não foi possível atualizar as audiências automaticamente. Tente novamente em alguns instantes.');
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Não foi possível conversar com o agente.';
      setSessionError(message);
      setMessages((prev) => [...prev, { id: `${id}-r`, role: 'assistant', text: `Não consegui concluir esta mensagem: ${message}` }]);
    } finally {
      setSendingMessage(false);
      if (showPlanningLoader) setLoadingSugestoes(false);
    }
  };

  const handleProceed = async () => {
    if (isBrainstorm || advancing || sendingMessage || loadingDetalhe || restoringSession) return;
    setAdvancing(true);
    // Validação de série/tipo temporariamente desativada para prototipação:
    // o alerta de erro (inline + toast) foi ocultado e o fluxo segue normal.
    // Para reativar, basta restaurar os blocos de setError/setToast abaixo.
    setError(null);
    if (!sessionId) {
      setError(sessionError ?? 'Envie uma mensagem ao brainstorm antes de avançar.');
      setAdvancing(false);
      return;
    }
    if (!detalhe?.id) {
      setError('Selecione uma audiência antes de avançar.');
      setAdvancing(false);
      return;
    }
    try {
      // A consulta do card é local. A confirmação é que grava a audiência no
      // sandbox, criando audiencia.json para a validação do backend.
      await api.selectWorkflowPlanningItem(sessionId, detalhe.id);
      const result = await withHtmlPolling(sessionId, () => api.advanceWorkflow(sessionId));
      if (!result.allowed) {
        const advanceReply = typeof result.message === 'object' && result.message
          ? String(
            (result.message as { content?: unknown; text?: unknown }).content
              ?? (result.message as { text?: unknown }).text
              ?? '',
          ).trim()
          : String(result.message ?? '').trim();
        if (advanceReply) {
          setMessages((prev) => [
            ...prev,
            {
              id: `advance-feedback-${Date.now()}`,
              role: 'assistant',
              text: advanceReply,
            },
          ]);
        }
        setError('O brainstorm ainda não concluiu o planejamento. Converse mais um pouco com o agente.');
        setAdvancing(false);
        return;
      }

      const selectedAudienceMessage = `Escolhi a audiência de ID ${detalhe?.id ?? 'desconhecido'}: ${detalhe?.titulo ?? 'sem título'}.`;
      const mensagemUsuario = [...messages].reverse().find((message) => message.role === 'user')?.text ?? '';
      const contextoSelecao = `O usuário clicou na audiência de ID ${detalhe?.id ?? 'desconhecido'}, título "${detalhe?.titulo ?? 'sem título'}". Mensagem do usuário: "${mensagemUsuario}".`;
      setMessages((prev) => [...prev, {
        id: `selected-audience-${Date.now()}`,
        role: 'user',
        text: selectedAudienceMessage,
      }]);
      const workflowSession = await api.getWorkflowSession(sessionId);
      const finalAgent = workflowSession.selected_agent
        ?? backendAgentFromType(tipoLabelToId(tipoMaterial, urlType))
        ?? 'generic';
      if (!htmlReady) {
        const generationResponse = await withHtmlPolling(sessionId, () => api.sendWorkflowMessage(
          sessionId,
          `${contextoSelecao} Use essa audiência como fonte do material final "${tipoMaterial ?? 'Novo material'}"${serie ? ` para ${serie}` : ''}. Verifique primeiro se há informações indispensáveis faltando. Se estiver tudo completo, gere o HTML completo e salve-o em HTML.html. Se faltar qualquer informação, não gere nem salve o HTML; responda em português informando claramente ao professor o que ele precisa fornecer.`,
          finalAgent,
          true,
        ));
        const generationReply = String(
          generationResponse?.message?.content
            ?? generationResponse?.reply
            ?? '',
        ).trim();
        if (generationReply) {
          setMessages((prev) => [...prev, {
            id: `generation-${Date.now()}`,
            role: 'assistant',
            text: generationReply,
          }]);
        }
        const generatedHtmlReady = await refreshHtmlReady(sessionId);
        if (!generatedHtmlReady) {
          setError(
            generationReply
              ? 'O agente identificou informações faltantes. Veja no chat o que precisa ser informado antes de gerar o material.'
              : 'O agente não terminou de gerar o material HTML e não informou o que está faltando.',
          );
          setAdvancing(false);
          return;
        }
        markHtmlAutoRedirected(sessionId);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível avançar para o agente final.');
      setAdvancing(false);
      return;
    }
    const target = await buildMaterialEditorUrl(sessionId);
    markHtmlAutoRedirected(sessionId);
    navigate(target);
    setAdvancing(false);
  };

  return (
    <div
      className="flex-grow h-full flex flex-col min-w-0 overflow-hidden"
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
              onSelect={(id) => { void handleSelect(id); }}
              loading={loadingSugestoes}
              // Somente a confirmação da fonte bloqueia a navegação.
              disabled={advancing}
            />
          </div>
        </div>

        {/* Centro — detalhes da sugestão */}
        <div className="flex-1 min-w-0 h-full min-h-0">
          <AudienciaDetalhes
            detalhe={detalhe}
            loading={loadingDetalhe && !detalhe}
            serie={serie}
            tipoMaterial={tipoMaterial}
            error={error}
            onProceed={handleProceed}
            showProceed={!isBrainstorm}
            generatingDocument={!htmlReady && ((agentPending && partialHtmlSession === sessionId) || restoredGenerationPending)}
            proceedDisabled={agentPending || restoredGenerationPending || loadingSugestoes || loadingDetalhe}
            htmlReady={htmlReady}
            onSelectAudiencia={(id) => { void handleSelect(id); }}
          />
        </div>

        {/* Direita — chat */}
        <ChatPanel
          messages={messages}
          onSend={handleSend}
          placeholder={restoringSession ? 'Carregando conversa...' : 'Pergunte ao Contraponto...'}
          contextLabel="Fontes primárias — audiências"
          contextIcon="document"
          busy={advancing || sendingMessage}
          disabled={restoringSession}
          selectionLabel={detalhe?.titulo}
          onClearSelection={() => {
            if (advancing) return;
            ++detalheRequestRef.current;
            rememberViewedAudience(sessionId, null);
            setSelectedId(null);
            setDetalhe(null);
            setLoadingDetalhe(false);
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
