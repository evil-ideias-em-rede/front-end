import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, FilePlus2, Lightbulb } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { ChatPanel } from './ChatPanel';
import type { ChatMessage } from './ChatPanel';

interface SpecScreenProps {
  title: string;
  initialHtml: string;
  onBack: () => void;
  onGenerate: (html: string) => void;
}

const splitStyleAndBody = (html: string): { style: string; body: string } => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const style = doc.querySelector('head style:not(#ied-spec-style)')?.outerHTML ?? '';
  return { style, body: doc.body.innerHTML };
};

const wrapSpec = (html: string): string => {
  const { style, body } = splitStyleAndBody(html);
  return (
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    style +
    injectedSpecCss +
    '</head><body contenteditable="true" spellcheck="false">' +
    body +
    '</body>' +
    injectedSpecJs +
    '</html>'
  );
};

const injectedSpecJs = `
<script>
  (function () {
    function height() {
      return Math.max(document.documentElement.scrollHeight || 0, document.body.scrollHeight || 0);
    }
    function report() {
      try {
        parent.postMessage({ type: 'ied-spec-edit', html: document.documentElement.outerHTML, height: height() }, '*');
      } catch (err) {}
    }
    document.addEventListener('input', report);
    document.addEventListener('paste', function () { setTimeout(report, 0); });
  })();
</script>
`;

const serializeBody = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const style = doc.querySelector('head style:not(#ied-spec-style)')?.outerHTML ?? '';
  return style + doc.body.innerHTML;
};

const injectedSpecCss = `
<style id="ied-spec-style">
  [contenteditable="true"] { cursor: text; }
  [contenteditable="true"]:focus { outline: none; }
  ::selection { background: #EDE9FE; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif; color: #333; margin: 28px;
    line-height: 1.65; overflow: hidden; box-sizing: border-box;
  }
</style>
`;

export const SpecScreen: React.FC<SpecScreenProps> = ({
  title,
  initialHtml,
  onBack,
  onGenerate,
}) => {
  const [html, setHtml] = useState<string>(initialHtml);
  // HTML exibido no iframe. Só muda quando vem do chat; edição direta não o toca,
  // senão React recarregaria o srcdoc a cada tecla e perderia o cursor.
  const [renderedHtml, setRenderedHtml] = useState<string>(initialHtml);
  const [fitHeight, setFitHeight] = useState<number>(1123);
  const htmlRef = useRef(html);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sp-1',
      role: 'assistant',
      text: 'Aqui está o rascunho da atividade. Edite o texto diretamente na área ao lado ou peça ajustes aqui — por exemplo: adicione um cronograma, inclua uma pergunta disparadora ou detalhe a avaliação.',
    },
  ]);

  useEffect(() => {
    htmlRef.current = html;
  }, [html]);

  // Ajusta a altura do iframe ao conteúdo, eliminando o scroll interno no documento.
  const fitIframe = useCallback(() => {
    const frame = iframeRef.current;
    const doc = frame?.contentDocument;
    if (!doc) return;
    const h = Math.max(
      doc.documentElement.scrollHeight || 0,
      doc.body.scrollHeight || 0
    );
    setFitHeight(h > 0 ? h : 1123);
  }, []);

  // Ponte: o documento vivo avisa sobre edições diretas do professor.
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      const data = e.data;
      if (typeof data !== 'object' || !data) return;
      if (data.type === 'ied-spec-edit' && typeof data.html === 'string') {
        setHtml(serializeBody(data.html));
        if (typeof data.height === 'number' && data.height > 0) {
          setFitHeight(data.height);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const id = `m-${Date.now()}`;
      const next = appendSpecChange(htmlRef.current, text);
      setHtml(next);
      setRenderedHtml(next);
      setMessages((prev) => [
        ...prev,
        { id, role: 'user', text },
        {
          id: `${id}-r`,
          role: 'assistant',
          text: `Ajustei a especificação conforme: "${text}". Você pode editar o texto diretamente ou pedir novas mudanças.`,
        },
      ]);
    },
    []
  );

  return (
    <div className="screen-in flex-1 min-w-0 h-full flex">
      {/* Main content */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
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

          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: THEME_COLORS.lightAccent, color: THEME_COLORS.accentHover }}
          >
            <Lightbulb className="w-3 h-3" />
            Detalhando atividade
          </span>

          <span className="text-xs font-bold truncate" style={{ color: THEME_COLORS.textDark }}>
            {title}
          </span>

          <span className="flex-1" />

          <button
            type="button"
            onClick={() => onGenerate(html)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white transition-all hover:scale-[1.02] cursor-pointer shadow-md"
            style={{ backgroundColor: THEME_COLORS.primary }}
          >
            <FilePlus2 className="w-4 h-4" />
            Gerar material/atividade/plano de aula
          </button>
        </div>

        {/* Editable HTML canvas */}
        <div className="flex-1 min-h-0 overflow-auto bg-stone-100 relative">
          <div className="min-h-full min-w-full flex justify-center p-6" style={{ width: 'fit-content' }}>
            <div className="bg-white shadow-xl shrink-0 relative" style={{ width: 794 }}>
              <iframe
                ref={iframeRef}
                title="Especificação editável"
                srcDoc={wrapSpec(renderedHtml)}
                onLoad={fitIframe}
                sandbox="allow-same-origin allow-scripts"
                style={{
                  border: 'none',
                  display: 'block',
                  width: 794,
                  height: fitHeight,
                  background: '#fff',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <ChatPanel
        messages={messages}
        onSend={handleSend}
        placeholder="Peça ajustes na especificação..."
        contextLabel="Especificação da atividade"
        contextIcon="document"
      />
    </div>
  );
};

/**
 * Mock de aplicação de mudança: as respostas do chat aqui não provêm de um LLM,
 * então apenas acresentamos um marcador demonstrativo ao final do documento para
 * evidenciar que o chat também edita o HTML. Em produção, um backend aplicaria
 * as transformações reais (listas, seletores, etc.).
 */
function appendSpecChange(html: string, text: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;
  const note = doc.createElement('p');
  note.innerHTML = `<b>Nota do assistente:</b> ajuste aplicado a partir de "<em>${escapeHtml(text)}</em>".`;
  body.appendChild(note);
  const style = doc.querySelector('head style')?.outerHTML ?? '';
  return style + body.innerHTML;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default SpecScreen;
