import React from 'react';
import { Landmark } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { AudienciaResumo } from '../../data/mockAudiencias';

interface AudienciaListProps {
  items: AudienciaResumo[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}

export const AudienciaList: React.FC<AudienciaListProps> = ({
  items,
  selectedId,
  onSelect,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border p-4 animate-pulse"
            style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: '#ffffff60' }}
          >
            <div className="h-3.5 w-3/4 rounded bg-black/10 mb-2" />
            <div className="h-3 w-full rounded bg-black/10" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-6 text-center space-y-2">
        <Landmark className="w-8 h-8 mx-auto" style={{ color: THEME_COLORS.borderLight }} />
        <p className="text-xs font-bold" style={{ color: THEME_COLORS.textDark }}>
          Nenhuma sugestão ainda
        </p>
        <p className="text-[11px] font-medium leading-relaxed" style={{ color: THEME_COLORS.gray }}>
          Pergunte ao chat por um tema e as audiências e fontes que mais combinam aparecem aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2.5 overflow-y-auto">
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className="w-full text-left rounded-2xl border p-4 transition-all cursor-pointer hover:shadow-md"
            style={{
              backgroundColor: isSelected ? '#ffffff' : '#ffffff60',
              borderColor: isSelected ? THEME_COLORS.primary : THEME_COLORS.borderLight,
              boxShadow: isSelected ? `0 8px 20px ${THEME_COLORS.primary}22` : undefined,
            }}
          >
            <h3 className="text-xs font-black leading-snug" style={{ color: THEME_COLORS.textDark }}>
              {item.titulo}
            </h3>
            <p className="mt-1 text-[11px] font-medium leading-relaxed line-clamp-2" style={{ color: THEME_COLORS.gray }}>
              {item.resumoCurto}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {item.temaTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: `${THEME_COLORS.primary}1a`, color: THEME_COLORS.primary }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AudienciaList;
