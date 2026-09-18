import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { THEME_COLORS } from '../../constants/colors';
import { ChatPanel } from './ChatPanel';
import type { ChatMessage } from './ChatPanel';
import { AudienciaList } from './AudienciaList';
import { AudienciaDetalhes } from './AudienciaDetalhes';
import { Toast } from '../general/Toast';
import {
  MOCK_AUDIENCIAS_RESUMO,
  getMockAudienciaDetalhe,
  type AudienciaDetalhe,
  type AudienciaResumo,
} from '../../data/mockAudiencias';

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

export const SuggestPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlType = searchParams.get('type') ?? undefined;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'bs-1',
      role: 'assistant',
      text: 'Me conte qual tema você quer trabalhar — e, se já souber, a série e o tipo de material (plano de aula, roteiro de debate, oficina de redação). Vou buscar as audiências que mais combinam.',
    },
  ]);
  const [sugestoes, setSugestoes] = useState<AudienciaResumo[]>([]);
  const [loadingSugestoes, setLoadingSugestoes] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<AudienciaDetalhe | null>(null);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);
  const [serie, setSerie] = useState<string | null>(null);
  const [tipoMaterial, setTipoMaterial] = useState<string | null>(() => tipoInicialFromUrl(urlType));
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  // Mantido para reativar a validação depois (evita unused var enquanto o alerta está oculto).
  void setToast;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setError(null);
    setLoadingDetalhe(true);
    window.setTimeout(() => {
      setDetalhe(getMockAudienciaDetalhe(id));
      setLoadingDetalhe(false);
    }, 800);
  };

  const handleSend = (text: string) => {
    const id = `m-${Date.now()}`;
    const foundSerie = parseSerie(text);
    const foundTipo = parseTipoMaterial(text);
    const nextSerie = foundSerie ?? serie;
    const nextTipo = foundTipo ?? tipoMaterial;
    setSerie(nextSerie);
    setTipoMaterial(nextTipo);

    const isFirstQuestion = sugestoes.length === 0 && !loadingSugestoes;
    if (isFirstQuestion) {
      setLoadingSugestoes(true);
    }

    const confirmacoes: string[] = [];
    if (foundSerie) confirmacoes.push(`série ${foundSerie}`);
    if (foundTipo) confirmacoes.push(foundTipo.toLowerCase());

    setMessages((prev) => [
      ...prev,
      { id, role: 'user', text },
      {
        id: `${id}-r`,
        role: 'assistant',
        text: isFirstQuestion
          ? `Boa! Encontrei ${MOCK_AUDIENCIAS_RESUMO.length} audiências sobre "${text}". Selecione uma na lista para ver resumo, participantes e propostas.${confirmacoes.length > 0 ? ` Anotei: ${confirmacoes.join(' + ')}.` : ' Quando souber, me diga a série e o tipo de material.'}`
          : `Entendido! Ajustei as sugestões a partir de: "${text}".${confirmacoes.length > 0 ? ` Anotei: ${confirmacoes.join(' + ')}.` : ''}`,
      },
    ]);

    if (isFirstQuestion) {
      window.setTimeout(() => {
        setSugestoes(MOCK_AUDIENCIAS_RESUMO);
        setLoadingSugestoes(false);
      }, 900);
    }
  };

  const handleProceed = () => {
    // Validação de série/tipo temporariamente desativada para prototipação:
    // o alerta de erro (inline + toast) foi ocultado e o fluxo segue normal.
    // Para reativar, basta restaurar os blocos de setError/setToast abaixo.
    setError(null);
    // O material ganha um título próprio (editável no editor), não o da audiência.
    const titulo = `${tipoMaterial ?? 'Novo material'}${serie ? ` — ${serie}` : ''}`;
    const params = new URLSearchParams();
    params.set('title', titulo);
    params.set('type', tipoLabelToId(tipoMaterial, urlType));
    if (serie) params.set('serie', serie);
    if (detalhe) params.set('audienciaId', detalhe.id);
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
