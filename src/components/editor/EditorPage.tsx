import React, { useMemo, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { THEME_COLORS } from '../../constants/colors';
import { EDITOR_MOCK_HTML } from '../../data/mockEditorHtml';
import { parseHtmlLayers, updateLayerHtml } from '../../utils/htmlLayers';
import type { HtmlLayer } from '../../utils/htmlLayers';
import { LayerSidebar } from './LayerSidebar';
import { HtmlCanvas } from './HtmlCanvas';
import { ChatPanel } from './ChatPanel';
import { BrainstormScreen } from './BrainstormScreen';
import { SpecScreen } from './SpecScreen';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EDITOR_SPEC_HTML } from '../../data/mockSpecHtml';
import type { ChatMessage } from './ChatPanel';

type EditorMode = 'brainstorm' | 'spec' | 'editor';
type LoadingPhase = 'spec' | 'editor' | null;

export const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // O início do fluxo pode ser configurado pela URL:
  // - /home/editor                  -> tela de brainstorm (padrão)
  // - /home/editor?start=spec       -> direto para a especificação
  // - /home/editor?start=editor     -> direto para a edição
  const startParam = searchParams.get('start');
  const startMode: EditorMode =
    startParam === 'spec' ? 'spec' : startParam === 'editor' ? 'editor' : 'brainstorm';
  const urlTitle = searchParams.get('title') ?? 'Plano: Contrato Social de Hobbes a Rousseau';

  // O botão "voltar" retorna para a página de onde a tela veio:
  // - entrada direta pela URL -> volta para a página anterior do histórico.
  // - entrada via fluxo interno -> volta para a tela anterior do fluxo.
  const handleSpecBack = startParam === 'spec' ? () => navigate(-1) : () => setMode('brainstorm');
  const handleEditorBack =
    startParam === 'editor' ? () => navigate(-1) : () => setMode('spec');

  const [mode, setMode] = useState<EditorMode>(startMode);
  const [loading, setLoading] = useState<LoadingPhase>(null);

  const [html, setHtml] = useState<string>(() => parseHtmlLayers(EDITOR_MOCK_HTML).markedHtml);
  const [specHtml, setSpecHtml] = useState<string>(EDITOR_SPEC_HTML);
  const [documentTitle, setDocumentTitle] = useState(urlTitle);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Chat do fluxo principal (editor)
  const [editorMessages, setEditorMessages] = useState<ChatMessage[]>([
    {
      id: 'ed-1',
      role: 'assistant',
      text: 'Pronto para editar o seu plano. Selecione uma camada na barra à esquerda para editar o texto diretamente na prévia, ou peça mudanças aqui.',
    },
  ]);

  const { layers, injectedHtml } = useMemo(() => parseHtmlLayers(html), [html]);

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedId) ?? null,
    [layers, selectedId]
  );

  const handleEdit = useCallback((layer: HtmlLayer, newHtml: string) => {
    setHtml((prev) => updateLayerHtml(prev, layer.selector, newHtml));
  }, []);

  const handleSelectById = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const handleSelectLayer = useCallback(
    (layer: HtmlLayer) => {
      setSelectedId(layer.id === selectedId ? null : layer.id);
    },
    [selectedId]
  );

  const handleSelectDocument = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleEditorChat = (text: string) => {
    const id = `m-${Date.now()}`;
    const target = selectedLayer ? `a camada "${selectedLayer.label}"` : 'o documento';
    setEditorMessages((prev) => [
      ...prev,
      { id, role: 'user', text },
      { id: `${id}-r`, role: 'assistant', text: `Aplicarei mudanças em ${target} conforme: "${text}".` },
    ]);
  };

  const handleProceedFromBrainstorm = (ideaTitle: string) => {
    setDocumentTitle(ideaTitle);
    setSpecHtml(EDITOR_SPEC_HTML);
    setLoading('spec');
    window.setTimeout(() => {
      setLoading(null);
      setMode('spec');
    }, 1700);
  };

  const handleGenerateFromSpec = (html: string) => {
    setSpecHtml(html);
    setLoading('editor');
    window.setTimeout(() => {
      setHtml(parseHtmlLayers(html).markedHtml);
      setSelectedId(null);
      setMode('editor');
      setEditorMessages([
        {
          id: 'ed-1',
          role: 'assistant',
          text: `Material gerado a partir da especificação de "${documentTitle}". Selecione uma camada para editar ou peça mudanças aqui.`,
        },
      ]);
      setLoading(null);
    }, 1700);
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
      {loading && (
        <LoadingSkeleton
          message={
            loading === 'spec'
              ? 'Estruturando a especificação da atividade...'
              : 'Gerando material/atividade/plano de aula...'
          }
          subtitle={
            loading === 'spec'
              ? 'O assistente está organizando objetivos, desenvolvimento e avaliação a partir da ideia escolhida. Pode levar alguns segundos.'
              : 'O assistente está convertendo a especificação em um material pronto para edição por camadas. Pode levar alguns segundos.'
          }
        />
      )}

      {!loading && mode === 'brainstorm' && (
        <BrainstormScreen onProceed={handleProceedFromBrainstorm} />
      )}

      {!loading && mode === 'spec' && (
        <SpecScreen
          title={documentTitle}
          initialHtml={specHtml}
          onBack={handleSpecBack}
          onGenerate={handleGenerateFromSpec}
        />
      )}

      {!loading && mode === 'editor' && (
        <div className="screen-in flex-1 flex h-full min-h-0">
          <LayerSidebar
            layers={layers}
            selectedId={selectedId}
            onSelect={handleSelectLayer}
            onSelectDocument={handleSelectDocument}
          />

          <HtmlCanvas
            html={injectedHtml}
            layers={layers}
            selectedId={selectedId}
            onEdit={handleEdit}
            onSelectById={handleSelectById}
            onCommitDocument={setHtml}
            onBack={handleEditorBack}
            title={documentTitle}
          />

          <ChatPanel
            messages={editorMessages}
            onSend={handleEditorChat}
            placeholder={
              selectedLayer
                ? `Mudar "${selectedLayer.label}"...`
                : 'Peça mudanças gerais no documento...'
            }
            contextLabel={selectedLayer ? selectedLayer.label : documentTitle}
            contextIcon={selectedLayer ? 'layer' : 'document'}
          />
        </div>
      )}
    </div>
  );
};

export default EditorPage;
