import React, { useState } from 'react';
import { ChevronDown, MessageSquareQuote } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { AudienciaProposta } from '../../data/mockAudiencias';

export const PropostaCard: React.FC<{ proposta: AudienciaProposta }> = ({ proposta }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: '#ffffff70' }}
    >
      <h4 className="text-xs font-black leading-snug" style={{ color: THEME_COLORS.textDark }}>
        {proposta.titulo}
      </h4>
      <p className="mt-1 text-[11px] font-medium leading-relaxed" style={{ color: THEME_COLORS.gray }}>
        {proposta.descricao}
      </p>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 inline-flex items-center gap-1 text-[11px] font-black cursor-pointer hover:underline"
        style={{ color: THEME_COLORS.primary }}
      >
        <MessageSquareQuote className="w-3.5 h-3.5" />
        {expanded ? 'Ocultar posicionamentos' : 'Ver posicionamentos'}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 border-t pt-2" style={{ borderColor: THEME_COLORS.borderLight }}>
          {proposta.posicionamentos.map((pos, idx) => (
            <div key={idx} className="rounded-xl p-2.5" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
              <p className="text-[11px] font-black" style={{ color: THEME_COLORS.textDark }}>
                {pos.autor}
                {pos.partido ? <span style={{ color: THEME_COLORS.gray }}> ({pos.partido})</span> : null}
              </p>
              <p className="mt-0.5 text-[11px] font-medium leading-relaxed" style={{ color: THEME_COLORS.gray }}>
                {pos.texto}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropostaCard;
