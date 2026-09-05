import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Pilcrow, List, ListOrdered,
  Quote, Table, ImageIcon, Link2, Palette, PaintBucket,
  Eraser,
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';

interface FormattingBarProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  enabled: boolean;
  /** Revisão do documento renderizado; força o listener de seleção a re-ligar após reload */
  revision: string;
  onCommitted: () => void;
}

const COLOR_PALETTE = [
  '#231942', '#7C3AED', '#00B8A9', '#FF4D24', '#FFB800',
  '#EC4899', '#3B82F6', '#22C55E', '#F43F5E', '#000000',
];

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  formatBlock: string;
  foreColor: string;
  hiliteColor: string;
}

const EMPTY_STATE: FormatState = {
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  unorderedList: false,
  orderedList: false,
  formatBlock: '',
  foreColor: '',
  hiliteColor: '',
};

function ToolbarButton({
  icon: Icon,
  title,
  active,
  disabled,
  onClick,
}: {
  icon: React.FC<{ className?: string }>;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onClick();
      }}
      className={`p-1.5 rounded-md transition-colors ${
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
      } ${active ? '' : 'hover:bg-black/[0.05]'}`}
      style={active ? { backgroundColor: THEME_COLORS.lightPrimary, color: THEME_COLORS.primary } : undefined}
      title={title}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function Separator() {
  return <span className="w-px h-4 mx-0.5" style={{ backgroundColor: THEME_COLORS.borderLight }} />;
}

function colorToHex(color: string): string {
  const lower = color.trim().toLowerCase();
  if (lower.startsWith('#')) return lower;
  const m = lower.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) {
    return '#' + [1, 2, 3]
      .map((i) => Number(m[i]).toString(16).padStart(2, '0'))
      .join('');
  }
  return lower;
}

export const FormattingBar: React.FC<FormattingBarProps> = ({
  iframeRef,
  enabled,
  revision,
  onCommitted,
}) => {
  const [fmt, setFmt] = useState<FormatState>(EMPTY_STATE);
  const [menu, setMenu] = useState<{ kind: 'table' } | { kind: 'color'; mode: 'text' | 'bg' } | null>(null);
  const [menuRect, setMenuRect] = useState<DOMRect | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const syncStates = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const q = (cmd: string): boolean => {
      try {
        return doc.queryCommandState(cmd);
      } catch {
        return false;
      }
    };
    const block = doc.queryCommandValue('formatBlock').toLowerCase();
    setFmt({
      bold: q('bold'),
      italic: q('italic'),
      underline: q('underline'),
      strikeThrough: q('strikeThrough'),
      unorderedList: q('insertUnorderedList'),
      orderedList: q('insertOrderedList'),
      formatBlock: block,
      foreColor: colorToHex(doc.queryCommandValue('foreColor')),
      hiliteColor: colorToHex(doc.queryCommandValue('hiliteColor')),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision]);

  // Manter estados ativos sincronizados com a seleção dentro do documento
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    const handleSelectionChange = () => syncStates();
    const handleKeyUp = () => syncStates();

    doc.addEventListener('selectionchange', handleSelectionChange);
    doc.addEventListener('keyup', handleKeyUp);
    return () => {
      doc.removeEventListener('selectionchange', handleSelectionChange);
      doc.removeEventListener('keyup', handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision, syncStates]);

  const exec = useCallback(
    (command: string, value?: string) => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      doc.defaultView?.focus();
      doc.execCommand(command, false, value ?? undefined);
      onCommitted();
      syncStates();
    },
    // iframeRef é estável; acessado apenas em callbacks de eventos
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCommitted, syncStates]
  );

  const handleLink = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    const url = doc?.defaultView?.prompt('URL do link:');
    if (url) exec('createLink', url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exec]);

  const handleImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        exec('insertImage', reader.result as string);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [exec]
  );

  const handleTable = useCallback(
    (rows: number, cols: number) => {
      let tableHtml = '<table style="border-collapse:collapse;width:100%;margin:8px 0;"><tbody>';
      for (let r = 0; r < rows; r++) {
        tableHtml += '<tr>';
        for (let c = 0; c < cols; c++) {
          const tag = r === 0 ? 'th' : 'td';
          const style = r === 0
            ? 'border:1px solid #ddd;padding:8px;background:#EDE9FE;text-align:left;'
            : 'border:1px solid #ddd;padding:8px;text-align:left;';
          tableHtml += `<${tag} style="${style}">${r === 0 ? 'Cabeçalho' : 'Célula'}</${tag}>`;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody></table>';
      exec('insertHTML', tableHtml);
      setMenu(null);
    },
    [exec]
  );

  const handleColor = useCallback(
    (color: string) => {
      if (menu?.kind === 'color') {
        if (menu.mode === 'text') exec('foreColor', color);
        else exec('hiliteColor', color);
      }
      setMenu(null);
    },
    [menu, exec]
  );

  const toggleMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    next: { kind: 'table' } | { kind: 'color'; mode: 'text' | 'bg' }
  ) => {
    e.preventDefault();
    if (!enabled) return;
    const sameKind = menu?.kind === next.kind;
    const isSame =
      next.kind !== 'color'
        ? sameKind
        : sameKind && menu.kind === 'color' && menu.mode === next.mode;
    setMenuRect(e.currentTarget.getBoundingClientRect());
    setMenu(isSame ? null : next);
  };

  // Fechar menu de cor/tabela ao clicar fora (a popover é renderizada em
  // portal, fora da barra; por isso checamos barRef e menuRef)
  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      const inBar = barRef.current?.contains(e.target as Node) ?? false;
      const inMenu = menuRef.current?.contains(e.target as Node) ?? false;
      if (!inBar && !inMenu) setMenu(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menu]);

  return (
    <>
      <div
        ref={barRef}
        className="shrink-0 flex items-center gap-0.5 px-3 py-1.5 border-b overflow-x-auto"
      style={{
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderColor: THEME_COLORS.borderLight,
        color: THEME_COLORS.textDark,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFile}
      />

      <ToolbarButton
        icon={Bold}
        title="Negrito (Ctrl+B)"
        active={fmt.bold}
        disabled={!enabled}
        onClick={() => exec('bold')}
      />
      <ToolbarButton
        icon={Italic}
        title="Itálico (Ctrl+I)"
        active={fmt.italic}
        disabled={!enabled}
        onClick={() => exec('italic')}
      />
      <ToolbarButton
        icon={Underline}
        title="Sublinhado (Ctrl+U)"
        active={fmt.underline}
        disabled={!enabled}
        onClick={() => exec('underline')}
      />
      <ToolbarButton
        icon={Strikethrough}
        title="Riscado"
        active={fmt.strikeThrough}
        disabled={!enabled}
        onClick={() => exec('strikeThrough')}
      />
      <ToolbarButton
        icon={Eraser}
        title="Limpar formatação"
        disabled={!enabled}
        onClick={() => exec('removeFormat')}
      />
      <Separator />
      <ToolbarButton
        icon={Heading1}
        title="Título 1"
        active={fmt.formatBlock === 'h1'}
        disabled={!enabled}
        onClick={() => exec('formatBlock', 'h1')}
      />
      <ToolbarButton
        icon={Heading2}
        title="Título 2"
        active={fmt.formatBlock === 'h2'}
        disabled={!enabled}
        onClick={() => exec('formatBlock', 'h2')}
      />
      <ToolbarButton
        icon={Pilcrow}
        title="Parágrafo"
        active={fmt.formatBlock === 'p'}
        disabled={!enabled}
        onClick={() => exec('formatBlock', 'p')}
      />
      <Separator />
      <ToolbarButton
        icon={List}
        title="Lista com marcadores"
        active={fmt.unorderedList}
        disabled={!enabled}
        onClick={() => exec('insertUnorderedList')}
      />
      <ToolbarButton
        icon={ListOrdered}
        title="Lista numerada"
        active={fmt.orderedList}
        disabled={!enabled}
        onClick={() => exec('insertOrderedList')}
      />
      <ToolbarButton
        icon={Quote}
        title="Citação"
        active={fmt.formatBlock === 'blockquote'}
        disabled={!enabled}
        onClick={() => exec('formatBlock', 'blockquote')}
      />
      <Separator />
      <button
        type="button"
        disabled={!enabled}
        onMouseDown={(e) => toggleMenu(e, { kind: 'table' })}
        className={`p-1.5 rounded-md transition-colors ${
          enabled ? 'cursor-pointer hover:bg-black/[0.05]' : 'cursor-not-allowed opacity-40'
        }`}
        title="Inserir tabela"
      >
        <Table className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        disabled={!enabled}
        onMouseDown={(e) => { e.preventDefault(); if (enabled) handleImage(); }}
        className={`p-1.5 rounded-md transition-colors ${
          enabled ? 'cursor-pointer hover:bg-black/[0.05]' : 'cursor-not-allowed opacity-40'
        }`}
        title="Inserir imagem"
      >
        <ImageIcon className="w-3.5 h-3.5" />
      </button>
      <ToolbarButton
        icon={Link2}
        title="Inserir link"
        disabled={!enabled}
        onClick={handleLink}
      />
      <Separator />
      <button
        type="button"
        disabled={!enabled}
        onMouseDown={(e) => toggleMenu(e, { kind: 'color', mode: 'text' })}
        className={`p-1.5 rounded-md transition-colors ${
          enabled ? 'cursor-pointer hover:bg-black/[0.05]' : 'cursor-not-allowed opacity-40'
        }`}
        title="Cor do texto"
        style={fmt.foreColor ? { color: fmt.foreColor } : undefined}
      >
        <Palette className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        disabled={!enabled}
        onMouseDown={(e) => toggleMenu(e, { kind: 'color', mode: 'bg' })}
        className={`p-1.5 rounded-md transition-colors ${
          enabled ? 'cursor-pointer hover:bg-black/[0.05]' : 'cursor-not-allowed opacity-40'
        }`}
        title="Cor de fundo"
        style={fmt.hiliteColor ? { color: fmt.hiliteColor } : undefined}
      >
        <PaintBucket className="w-3.5 h-3.5" />
      </button>
    </div>

    {/* Popover de tabela/cores renderizado em portal (fora da barra com overflow) */}
    {menu && menuRect && createPortal(
      <div
        ref={menuRef}
        className="fixed z-[60] p-2 rounded-lg shadow-xl border"
        style={{
          top: menuRect.bottom + 6,
          left: menuRect.left + menuRect.width / 2,
          transform: 'translateX(-50%)',
          backgroundColor: '#fff',
          borderColor: THEME_COLORS.borderLight,
        }}
      >
        {menu.kind === 'table' ? (
          <div className="grid grid-cols-3 gap-0.5">
            {[2, 3, 4, 3, 4, 5, 4, 5, 6].map((cols, i) => {
              const rows = [2, 2, 2, 3, 3, 3, 4, 4, 4][i];
              return (
                <button
                  key={`${rows}x${cols}`}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleTable(rows, cols); }}
                  className="px-2 py-1 text-[10px] font-bold rounded hover:bg-black/[0.05] transition-colors cursor-pointer"
                  style={{ color: THEME_COLORS.primary }}
                >
                  {rows}×{cols}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-1">
            {COLOR_PALETTE.map((c) => {
              const current = menu.mode === 'text' ? fmt.foreColor : fmt.hiliteColor;
              return (
                <button
                  key={c}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleColor(c); }}
                  className={`w-5 h-5 rounded-full border hover:scale-125 transition-transform cursor-pointer ${
                    current === colorToHex(c) ? 'border-black ring-2' : 'border-black/10'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              );
            })}
          </div>
        )}
      </div>,
      document.body
    )}
    </>
  );
};

export default FormattingBar;