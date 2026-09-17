import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { THEME_COLORS } from '../../constants/colors';
import { EDITOR_MOCK_HTML } from '../../data/mockEditorHtml';
import { parseHtmlLayers, updateLayerHtml } from '../../utils/htmlLayers';
import type { HtmlLayer } from '../../utils/htmlLayers';
import { LayerSidebar } from './LayerSidebar';
import { HtmlCanvas } from './HtmlCanvas';
import { ChatPanel } from './ChatPanel';
import type { ChatMessage } from './ChatPanel';

export const MaterialEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasTitle = searchParams.has('title') && searchParams.get('title')?.trim() !== '';
  const documentTitle = searchParams.get('title') ?? 'Plano: Contrato Social de Hobbes a Rousseau';
  const materialType = searchParams.get('type') ?? undefined;
  const serie = searchParams.get('serie') ?? undefined;
  const audienciaId = searchParams.get('audienciaId') ?? undefined;

  const [html, setHtml] = useState<string>(() => parseHtmlLayers(EDITOR_MOCK_HTML).markedHtml);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editorMessages, setEditorMessages] = useState<ChatMessage[]>([
    {
      id: 'ed-1',
      role: 'assistant',
      text: `Material gerado a partir da audiência "${documentTitle}"${serie ? ` para ${serie}` : ''}${audienciaId ? ` (fonte ${audienciaId})` : ''}. Selecione uma camada para editar ou peça mudanças aqui.`,
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

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set('title', documentTitle);
    if (materialType) params.set('type', materialType);
    if (serie) params.set('serie', serie);
    if (audienciaId) params.set('audienciaId', audienciaId);
    navigate(`/home/editor?${params.toString()}`);
  };

  if (!hasTitle) {
    const params = new URLSearchParams();
    if (materialType) params.set('type', materialType);
    const qs = params.toString();
    return <Navigate to={qs ? `/home/editor?${qs}` : '/home/editor'} replace />;
  }

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
          onBack={handleBack}
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
    </div>
  );
};

export default MaterialEditorPage;
