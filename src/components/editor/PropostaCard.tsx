import React from 'react';
import { User } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { AudienciaProposta } from '../../data/mockAudiencias';

export const PropostaCard: React.FC<{ proposta: AudienciaProposta }> = ({ proposta }) => {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: '#ffffff70' }}
    >
      <h4 className="text-xs font-black leading-snug" style={{ color: THEME_COLORS.textDark }}>
        {proposta.titulo}
      </h4>
      <p
        className="mt-1.5 flex items-center gap-1 text-[11px] font-bold"
        style={{ color: THEME_COLORS.gray }}
      >
        <User className="w-3 h-3 shrink-0" />
        Proposta de {proposta.autor}
      </p>
      <p className="mt-1 text-[11px] font-medium leading-relaxed" style={{ color: THEME_COLORS.gray }}>
        {proposta.descricao}
      </p>
    </div>
  );
};

export default PropostaCard;
