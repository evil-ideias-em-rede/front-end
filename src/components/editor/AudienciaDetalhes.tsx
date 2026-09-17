import React, { useState } from 'react';
import { ArrowRight, ChevronDown, FileText, Users } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { AudienciaDetalhe } from '../../data/mockAudiencias';
import { PropostaCard } from './PropostaCard';

interface AudienciaDetalhesProps {
  detalhe: AudienciaDetalhe | null;
  loading: boolean;
  serie: string | null;
  tipoMaterial: string | null;
  error: string | null;
  onProceed: () => void;
}

export const AudienciaDetalhes: React.FC<AudienciaDetalhesProps> = ({
  detalhe,
  loading,
  serie,
  tipoMaterial,
  error,
  onProceed,
}) => {
  const [participantesExpandidos, setParticipantesExpandidos] = useState(false);

  if (loading) {
    return (
      <div className="p-6 space-y-3 animate-pulse">
        <div className="h-5 w-2/3 rounded bg-black/10" />
        <div className="h-3 w-full rounded bg-black/10" />
        <div className="h-3 w-full rounded bg-black/10" />
        <div className="h-3 w-1/2 rounded bg-black/10" />
      </div>
    );
  }

  if (!detalhe) {
    return (
      <div className="p-6 text-center space-y-2 h-full flex flex-col items-center justify-center">
        <FileText className="w-8 h-8" style={{ color: THEME_COLORS.borderLight }} />
        <p className="text-xs font-bold" style={{ color: THEME_COLORS.textDark }}>
          Selecione uma audiência
        </p>
        <p className="text-[11px] font-medium leading-relaxed max-w-[260px]" style={{ color: THEME_COLORS.gray }}>
          Os detalhes da transcrição — resumo, participantes e propostas — aparecem aqui.
        </p>
      </div>
    );
  }

  const participantesTexto = detalhe.participantes
    .map((p) => `${p.nome} (${p.partido})`)
    .join(', ');

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
        <div>
          <h2 className="text-lg font-black leading-snug tracking-tight" style={{ color: THEME_COLORS.textDark }}>
            {detalhe.titulo}
          </h2>
          {(serie || tipoMaterial) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {serie && (
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-black"
                  style={{ backgroundColor: `${THEME_COLORS.secondary}1a`, color: THEME_COLORS.secondary }}
                >
                  {serie}
                </span>
              )}
              {tipoMaterial && (
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-black"
                  style={{ backgroundColor: `${THEME_COLORS.primary}1a`, color: THEME_COLORS.primary }}
                >
                  {tipoMaterial}
                </span>
              )}
            </div>
          )}
        </div>

        <section className="space-y-1.5">
          <h3 className="text-[11px] font-black uppercase tracking-wider" style={{ color: THEME_COLORS.gray }}>
            Resumo da audiência
          </h3>
          <p className="text-xs font-medium leading-relaxed line-clamp-7" style={{ color: THEME_COLORS.textDark }}>
            {detalhe.resumo}
          </p>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: THEME_COLORS.gray }}>
            <Users className="w-3.5 h-3.5" />
            Participantes
          </h3>
          <p
            className={`text-[11px] font-medium leading-relaxed ${participantesExpandidos ? '' : 'line-clamp-2'}`}
            style={{ color: THEME_COLORS.textDark }}
          >
            {participantesTexto}
          </p>
          <button
            type="button"
            onClick={() => setParticipantesExpandidos((v) => !v)}
            className="inline-flex items-center gap-1 text-[11px] font-black cursor-pointer hover:underline"
            style={{ color: THEME_COLORS.primary }}
          >
            {participantesExpandidos ? 'Ver menos' : 'Ver todos'}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${participantesExpandidos ? 'rotate-180' : ''}`} />
          </button>
        </section>

        <section className="space-y-2.5">
          <h3 className="text-[11px] font-black uppercase tracking-wider" style={{ color: THEME_COLORS.gray }}>
            Propostas identificadas
          </h3>
          {detalhe.propostas.map((proposta) => (
            <PropostaCard key={proposta.id} proposta={proposta} />
          ))}
        </section>
      </div>

      <div
        className="shrink-0 px-6 py-4 border-t space-y-2"
        style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: '#ffffff40' }}
      >
        {error && (
          <p className="text-[11px] font-bold leading-relaxed rounded-xl px-3 py-2" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
            {error}
          </p>
        )}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onProceed}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black text-white transition-all hover:scale-[1.02] cursor-pointer shadow-md"
            style={{ backgroundColor: THEME_COLORS.primary }}
          >
            Usar essa audiência como fonte
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudienciaDetalhes;
