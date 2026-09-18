import React, { useEffect, useRef, useCallback, useState } from 'react';
import { ZoomIn, ZoomOut, ArrowLeft, Maximize, Layers, ChevronLeft, ChevronRight, ChevronDown, Download, FileCode, FileText, FileType, Presentation } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { layerSignature } from '../../utils/htmlLayers';
import type { HtmlLayer } from '../../utils/htmlLayers';
import { FormattingBar } from './FormattingBar';

interface HtmlCanvasProps {
  html: string;
  layers: HtmlLayer[];
  selectedId: string | null;
  onEdit: (layer: HtmlLayer, innerHtml: string) => void;
  onSelectById: (id: string | null) => void;
  onCommitDocument: (pageDoc: Document) => void;
  onBack: () => void;
  title: string;
  pageIndex: number;
  pageCount: number;
  onPageChange: (next: number) => void;
  isSlides: boolean;
}

export const HtmlCanvas: React.FC<HtmlCanvasProps> = ({
  html,
  layers,
  selectedId,
  onEdit,
  onSelectById,
  onCommitDocument,
  onBack,
  title,
  pageIndex,
  pageCount,
  onPageChange,
  orientation,
  isSlides,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.9);
  const [exportOpen, setExportOpen] = useState(false);

  // Folha A4: retrato 794x1123, paisagem (slides) 1123x794.
  const pageW = orientation === 'H' ? 1123 : 794;
  const pageH = orientation === 'H' ? 794 : 1123;

  // Ponte de mensagens do documento injetado (seleção/edição direta na camada)
  const onSelectByIdRef = useRef(onSelectById);
  const onEditRef = useRef(onEdit);
  const layersRef = useRef(layers);
  useEffect(() => {
    onSelectByIdRef.current = onSelectById;
    onEditRef.current = onEdit;
    layersRef.current = layers;
  });

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      const data = e.data;
      if (typeof data !== 'object' || !data || typeof data.type !== 'string') return;
      if (data.type === 'ied-select') {
        onSelectByIdRef.current(typeof data.id === 'string' ? data.id : null);
      } else if (data.type === 'ied-edit') {
        const layer = layersRef.current.find((l) => l.id === data.id);
        if (layer && typeof data.innerHtml === 'string') {
          onEditRef.current(layer, data.innerHtml);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const [renderedHtml, setRenderedHtml] = useState(html);
  const prevSignatureRef = useRef<string>(layerSignature(html));
  const prevSelectorRef = useRef<string | null>(null);

  // O documento do iframe (srcdoc) só é navegável após o evento de load;
  // usamos este tick para (re)ligar os listeners ao documento correto.
  const [loadedTick, setLoadedTick] = useState(0);

  useEffect(() => {
    const sig = layerSignature(html);
    if (sig !== prevSignatureRef.current) {
      prevSignatureRef.current = sig;
      setRenderedHtml(html);
    }
  }, [html]);

  const selectedSelector = layers.find((l) => l.id === selectedId)?.selector ?? null;

  // Aplica destaque e edição inline conforme a camada selecionada
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    // Limpar apenas a camada selecionada anteriormente (não todas, para
    // não remover contenteditable a cada tecla digitada)
    const prev = prevSelectorRef.current;
    if (prev && prev !== selectedSelector) {
      const prevEl = doc.querySelector(prev);
      if (prevEl) {
        prevEl.classList.remove('ied-layer-active');
        prevEl.removeAttribute('contenteditable');
      }
    }
    prevSelectorRef.current = selectedSelector;

    if (!selectedSelector) return;

    const target = doc.querySelector(selectedSelector);
    if (target) {
      (target as HTMLElement).classList.add('ied-layer-active');
      (target as HTMLElement).setAttribute('contenteditable', 'true');
    }
  }, [selectedSelector, loadedTick]);

  // Sincronizar edições via innerHTML: agora acontece pela ponte postMessage
  // (documento injetado), que envia { type: 'ied-edit', id, innerHtml }.

  // Comandos da barra de formatação (bold, headings, tabela, etc.) podem
  // alterar a estrutura do documento; o documento vivo da página é enviado
  // ao pai, que o remonta no documento completo (preserva as demais páginas).
  const handleCommitDocument = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    onCommitDocument(doc);
  }, [onCommitDocument]);

  return (
    <div className="flex-1 min-w-0 h-full flex flex-col">
      {/* Toolbar */}
      <div
        className="shrink-0 px-4 py-2.5 flex items-center gap-2 border-b bg-white/60"
        style={{ borderColor: THEME_COLORS.borderLight }}
      >
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-black/[0.04] transition-colors cursor-pointer"
          style={{ color: THEME_COLORS.primary }}
          title="Voltar às sugestões"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-bold truncate" style={{ color: THEME_COLORS.textDark }}>
          {title}
        </span>

        <span className="flex-1" />

        {pageCount > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
              disabled={pageIndex === 0}
              className="p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
              style={{ color: THEME_COLORS.gray }}
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-black whitespace-nowrap" style={{ color: THEME_COLORS.gray }}>
              Página {pageIndex + 1} de {pageCount}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(pageCount - 1, pageIndex + 1))}
              disabled={pageIndex === pageCount - 1}
              className="p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
              style={{ color: THEME_COLORS.gray }}
              title="Próxima página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {selectedId && (
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: THEME_COLORS.lightPrimary, color: THEME_COLORS.primary }}
          >
            <Layers className="w-3 h-3" />
            Editando camada
          </span>
        )}

        <span className="w-px h-5 bg-black/10 mx-1" />

        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2)))}
          className="p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors cursor-pointer"
          style={{ color: THEME_COLORS.gray }}
          title="Reduzir zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-stone-500 w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))}
          className="p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors cursor-pointer"
          style={{ color: THEME_COLORS.gray }}
          title="Aumentar zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom(1)}
          className="p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors cursor-pointer"
          style={{ color: THEME_COLORS.gray }}
          title="Ajustar zoom"
        >
          <Maximize className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-black/10 mx-1" />

        {/* Exportar (menu visual — exportação real ainda não implementada) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setExportOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
            style={{ backgroundColor: THEME_COLORS.primary }}
            title="Exportar material"
          >
            <Download className="w-4 h-4" />
            Exportar
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
          </button>
          {exportOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setExportOpen(false)}
              />
              <div
                className="absolute right-0 mt-2 w-44 z-20 rounded-xl border bg-white shadow-xl overflow-hidden"
                style={{ borderColor: THEME_COLORS.borderLight }}
              >
                {[
                  { id: 'html', label: 'HTML', Icon: FileCode },
                  { id: 'pdf', label: 'PDF', Icon: FileText },
                  { id: 'docx', label: 'DOCX', Icon: FileType },
                  ...(isSlides ? [{ id: 'pptx', label: 'PPTX', Icon: Presentation }] : []),
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setExportOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-colors hover:bg-black/[0.04] cursor-pointer"
                    style={{ color: THEME_COLORS.textDark }}
                    title={`Exportar como ${label} (em breve)`}
                  >
                    <Icon className="w-4 h-4" style={{ color: THEME_COLORS.primary }} />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Barra fixa de formatação rich text */}
      <FormattingBar
        iframeRef={iframeRef}
        enabled={!!selectedSelector}
        revision={`${renderedHtml}|${loadedTick}`}
        onCommitted={handleCommitDocument}
      />

      {/* Canvas area */}
      <div ref={containerRef} className="flex-1 min-h-0 overflow-auto bg-stone-100 relative">
        <div
          className="min-h-full min-w-full flex justify-center p-6"
          style={{ width: 'fit-content' }}
          onClick={() => onSelectById(null)}
        >
          <div
            className="bg-white shadow-xl shrink-0"
            style={{
              width: pageW * zoom,
              height: pageH * zoom,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <iframe
              ref={iframeRef}
              title="Prévia do editor"
              srcDoc={renderedHtml}
              sandbox="allow-same-origin allow-scripts"
              onLoad={() => setLoadedTick((t) => t + 1)}
              style={{
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: pageW,
                height: pageH,
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                background: '#fff',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HtmlCanvas;