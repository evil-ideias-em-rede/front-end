import React, { useMemo, useState } from 'react';
import {
  Heading1,
  Type,
  List,
  Table,
  Quote,
  ChevronRight,
  ChevronDown,
  FileText,
  MousePointerClick,
  Layers as LayersIcon,
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { HtmlLayer } from '../../utils/htmlLayers';

interface LayerSidebarProps {
  layers: HtmlLayer[];
  selectedId: string | null;
  onSelect: (layer: HtmlLayer) => void;
  onSelectDocument: () => void;
}

const INDENT = 16;

function LayerIcon({ tag }: { tag: string }) {
  switch (tag) {
    case 'h1':
    case 'h2':
    case 'h3':
      return <Heading1 className="w-4 h-4" />;
    case 'ul':
    case 'ol':
    case 'li':
      return <List className="w-4 h-4" />;
    case 'table':
    case 'td':
    case 'th':
      return <Table className="w-4 h-4" />;
    case 'blockquote':
      return <Quote className="w-4 h-4" />;
    default:
      return <Type className="w-4 h-4" />;
  }
}

export const LayerSidebar: React.FC<LayerSidebarProps> = ({
  layers,
  selectedId,
  onSelect,
  onSelectDocument,
}) => {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const roots = useMemo(() => layers.filter((l) => l.parentId === null), [layers]);
  const childrenOf = useMemo(() => {
    const map = new Map<string, HtmlLayer[]>();
    layers.forEach((l) => {
      if (l.parentId) {
        const arr = map.get(l.parentId) ?? [];
        arr.push(l);
        map.set(l.parentId, arr);
      }
    });
    return map;
  }, [layers]);

  const hasChildren = (id: string) => (childrenOf.get(id)?.length ?? 0) > 0;

  const renderNode = (layer: HtmlLayer, depth: number) => {
    const isActive = layer.id === selectedId;
    const isCollapsed = collapsed.has(layer.id);
    const canExpand = hasChildren(layer.id);

    return (
      <React.Fragment key={layer.id}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect(layer)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(layer);
            }
          }}
          className={`w-full flex items-center gap-1.5 pl-2 pr-2 py-2 rounded-lg border text-left transition-all cursor-pointer ${
            isActive ? 'shadow-sm' : 'hover:bg-black/[0.03]'
          }`}
          style={{
            backgroundColor: isActive ? THEME_COLORS.lightPrimary : 'transparent',
            borderColor: isActive ? THEME_COLORS.primary : 'transparent',
            color: THEME_COLORS.textDark,
            paddingLeft: 8 + depth * INDENT,
          }}
        >
          {canExpand ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed((prev) => {
                  const next = new Set(prev);
                  if (next.has(layer.id)) next.delete(layer.id);
                  else next.add(layer.id);
                  return next;
                });
              }}
              className="shrink-0 p-0.5 rounded hover:bg-black/10 cursor-pointer"
              style={{ color: THEME_COLORS.gray }}
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-[18px] shrink-0" />
          )}

          <span
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{
              backgroundColor: isActive ? THEME_COLORS.primary : 'rgba(226,221,240,0.5)',
              color: isActive ? '#fff' : THEME_COLORS.primary,
            }}
          >
            <LayerIcon tag={layer.tag} />
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block text-[11px] font-bold line-clamp-1 ${isActive ? 'text-[#7C3AED]' : ''}`}>
              {layer.label}
            </span>
            <span className="block text-[9px] font-semibold text-stone-400 uppercase tracking-wide">
              {layer.tag}
            </span>
          </span>
        </div>

        {canExpand && !isCollapsed && (
          <div>
            {(childrenOf.get(layer.id) ?? []).map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <aside
      className="w-64 shrink-0 h-full flex flex-col border-r bg-white/50"
      style={{ borderColor: THEME_COLORS.borderLight }}
    >
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayersIcon className="w-4 h-4" style={{ color: THEME_COLORS.primary }} />
          <h2 className="text-sm font-black tracking-tight" style={{ color: THEME_COLORS.textDark }}>
            Camadas
          </h2>
        </div>
        <span className="text-[10px] font-bold text-stone-400">{layers.length}</span>
      </div>

      <div className="px-3 pb-2 flex items-center gap-1.5 text-[10px] font-semibold text-stone-400">
        <MousePointerClick className="w-3 h-3" />
        Clique no texto para editar
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 space-y-1">
        {/* Item Documento */}
        <button
          type="button"
          onClick={onSelectDocument}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border text-left transition-all cursor-pointer ${
            selectedId === null ? 'shadow-sm' : 'hover:bg-black/[0.03]'
          }`}
          style={{
            backgroundColor: selectedId === null ? THEME_COLORS.lightPrimary : 'transparent',
            borderColor: selectedId === null ? THEME_COLORS.primary : 'transparent',
          }}
        >
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{
              backgroundColor: selectedId === null ? THEME_COLORS.primary : 'rgba(226,221,240,0.5)',
              color: selectedId === null ? '#fff' : THEME_COLORS.primary,
            }}
          >
            <FileText className="w-4 h-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block text-xs font-bold line-clamp-1 ${selectedId === null ? 'text-[#7C3AED]' : ''}`}>
              Documento
            </span>
            <span className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wide">
              página completa
            </span>
          </span>
        </button>

        <div className="my-2 border-t" style={{ borderColor: THEME_COLORS.borderLight }} />

        {roots.map((root) => renderNode(root, 0))}

        {layers.length === 0 && (
          <p className="px-3 py-6 text-center text-[11px] font-semibold text-stone-400">
            Nenhuma camada detectada neste documento.
          </p>
        )}
      </div>
    </aside>
  );
};

export default LayerSidebar;
