import React from 'react';
import { ArrowLeft, BookOpenText } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { AudienciaDetalhe } from '../../data/mockAudiencias';

interface AudienciaIntegraProps {
  detalhe: AudienciaDetalhe;
  onBack: () => void;
}

export const AudienciaIntegra: React.FC<AudienciaIntegraProps> = ({ detalhe, onBack }) => {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[11px] font-black cursor-pointer hover:underline"
        style={{ color: THEME_COLORS.primary }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar para o resumo
      </button>

      <div className="flex items-center gap-1.5">
        <BookOpenText className="w-3.5 h-3.5" style={{ color: THEME_COLORS.gray }} />
        <h3
          className="text-[11px] font-black uppercase tracking-wider"
          style={{ color: THEME_COLORS.gray }}
        >
          Audiência na íntegra
        </h3>
      </div>

      <div className="space-y-3">
        {detalhe.textoIntegral.map((paragrafo, idx) => (
          <p
            key={idx}
            className="text-xs font-medium leading-relaxed"
            style={{ color: THEME_COLORS.textDark }}
          >
            {paragrafo}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AudienciaIntegra;
