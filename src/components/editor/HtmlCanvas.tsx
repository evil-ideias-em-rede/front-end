import React, { useEffect, useRef, useCallback, useState } from 'react';
import { ZoomIn, ZoomOut, ArrowLeft, Maximize, Layers } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { layerSignature, serializeMarkedFragment } from '../../utils/htmlLayers';
import type { HtmlLayer } from '../../utils/htmlLayers';
import { FormattingBar } from './FormattingBar';

interface HtmlCanvasProps {
  html: string;
  layers: HtmlLayer[];
  selectedId: string | null;
  onEdit: (layer: HtmlLayer, innerHtml: string) => void;
  onSelectById: (id: string | null) => void;
  onCommitDocument: (fragment: string) => void;
  onBack: () => void;
  title: string;
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
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.9);

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
  // alterar a estrutura do documento; serializamos o documento vivo de volta
  // ao estado para capturar formatação e elementos novos.
  const handleCommitDocument = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    onCommitDocument(serializeMarkedFragment(doc));
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
          title="Voltar ao Brainstorm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-bold truncate" style={{ color: THEME_COLORS.textDark }}>
          {title}
        </span>

        <span className="flex-1" />

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
              width: 794 * zoom,
              height: 1123 * zoom,
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
                width: 794,
                height: 1123,
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