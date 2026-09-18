import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { THEME_COLORS } from '../../constants/colors';
import { EDITOR_MOCK_HTML } from '../../data/mockEditorHtml';
import { parseHtmlLayers, parseHtmlPages, buildPageDocument, mergePageIntoDocument, updateLayerHtml } from '../../utils/htmlLayers';
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

  // Slides editam em folha horizontal (paisagem); demais formatos em retrato.
  const orientation: 'V' | 'H' = materialType === 'slides' ? 'H' : 'V';

  const [html, setHtml] = useState<string>(() => parseHtmlLayers(EDITOR_MOCK_HTML).markedHtml);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [editorMessages, setEditorMessages] = useState<ChatMessage[]>([
    {
      id: 'ed-1',
      role: 'assistant',
      text: `Material gerado a partir da audiência "${documentTitle}"${serie ? ` para ${serie}` : ''}${audienciaId ? ` (fonte ${audienciaId})` : ''}. Selecione uma camada para editar ou peça mudanças aqui.`,
    },
  ]);

  const { layers } = useMemo(() => parseHtmlLayers(html), [html]);
  const pages = useMemo(() => parseHtmlPages(html), [html]);
  const safePageIndex = Math.min(pageIndex, pages.length - 1);
  const pageLayers = useMemo(
    () => layers.filter((l) => (l.pageIndex ?? 0) === safePageIndex),
    [layers, safePageIndex]
  );
  const pageDocument = useMemo(
    () => buildPageDocument(html, safePageIndex),
    [html, safePageIndex]
  );

  // Garante índice válido se o nº de páginas mudar (ex.: edição estrutural)
  useEffect(() => {
    setPageIndex((i) => Math.min(i, pages.length - 1));
  }, [pages.length]);

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedId) ?? null,
    [layers, selectedId]
  );

  const handlePageChange = useCallback((next: number) => {
    setPageIndex(next);
    setSelectedId(null);
  }, []);

  const handleCommitPage = useCallback(
    (pageDoc: Document) => {
      setHtml((prev) => mergePageIntoDocument(prev, safePageIndex, pageDoc));
    },
    [safePageIndex]
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
    const pageSuffix = pages.length > 1 ? ` (página ${safePageIndex + 1})` : '';
    setEditorMessages((prev) => [
      ...prev,
      { id, role: 'user', text },
      { id: `${id}-r`, role: 'assistant', text: `Aplicarei mudanças em ${target}${pageSuffix} conforme: "${text}".` },
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
          layers={pageLayers}
          selectedId={selectedId}
          onSelect={handleSelectLayer}
          onSelectDocument={handleSelectDocument}
          pageLabel={pages.length > 1 ? pages[safePageIndex]?.label : undefined}
        />

        <HtmlCanvas
          html={pageDocument}
          layers={pageLayers}
          selectedId={selectedId}
          onEdit={handleEdit}
          onSelectById={handleSelectById}
          onCommitDocument={handleCommitPage}
          onBack={handleBack}
          title={documentTitle}
          pageIndex={safePageIndex}
          pageCount={pages.length}
          onPageChange={handlePageChange}
          orientation={orientation}
          isSlides={materialType === 'slides'}
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
