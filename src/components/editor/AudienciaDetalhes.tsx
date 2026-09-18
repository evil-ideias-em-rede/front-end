import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpenText, ChevronDown, FileText, ListChecks, Scale, Users } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { AudienciaDetalhe } from '../../data/mockAudiencias';
import { PropostaCard } from './PropostaCard';
import { ParticipantePosicionamentos } from './ParticipantePosicionamentos';
import { AudienciaIntegra } from './AudienciaIntegra';
import { POSICAO_ORDEM, POSICAO_TEMA_META, isPresidente, posicaoAgregada } from '../../utils/posicaoTema';

interface AudienciaDetalhesProps {
  detalhe: AudienciaDetalhe | null;
  loading: boolean;
  serie: string | null;
  tipoMaterial: string | null;
  error: string | null;
  onProceed: () => void;
  onSelectAudiencia: (id: string) => void;
}

export const AudienciaDetalhes: React.FC<AudienciaDetalhesProps> = ({
  detalhe,
  loading,
  serie,
  tipoMaterial,
  error,
  onProceed,
  onSelectAudiencia,
}) => {
  const [participanteSelecionado, setParticipanteSelecionado] = useState<string | null>(null);
  const [mostrarIntegra, setMostrarIntegra] = useState(false);
  const [participantesExpandidos, setParticipantesExpandidos] = useState(false);
  const [participantesOverflow, setParticipantesOverflow] = useState(false);
  const participantesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setParticipanteSelecionado(null);
    setMostrarIntegra(false);
    setParticipantesExpandidos(false);
  }, [detalhe?.id]);

  useEffect(() => {
    if (participantesExpandidos) return;
    const el = participantesRef.current;
    if (el) {
      setParticipantesOverflow(el.scrollHeight > el.clientHeight + 2);
    }
  }, [detalhe?.id, participantesExpandidos, detalhe?.participantes.length]);

  const gruposPosicionamento = useMemo(() => {
    if (!detalhe) return [];
    return POSICAO_ORDEM.map((posicao) => ({
      posicao,
      meta: POSICAO_TEMA_META[posicao],
      participantes: detalhe.participantes.filter(
        (p) =>
          !isPresidente(p) &&
          posicaoAgregada(detalhe.falas.filter((f) => f.autor === p.nome)) === posicao
      ),
    }));
  }, [detalhe]);

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

  const participanteAtivo = participanteSelecionado
    ? detalhe.participantes.find((p) => p.nome === participanteSelecionado) ?? null
    : null;

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

        {mostrarIntegra ? (
          <AudienciaIntegra detalhe={detalhe} onBack={() => setMostrarIntegra(false)} />
        ) : participanteAtivo ? (
          <ParticipantePosicionamentos
            participante={participanteAtivo}
            detalhe={detalhe}
            onBack={() => setParticipanteSelecionado(null)}
            onSelectAudiencia={onSelectAudiencia}
          />
        ) : (
          <>
        <section className="space-y-1.5">
          <h3 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: THEME_COLORS.gray }}>
            <FileText className="w-3.5 h-3.5" />
            Resumo da audiência
          </h3>
          <p className="text-xs font-medium leading-relaxed line-clamp-7" style={{ color: THEME_COLORS.textDark }}>
            {detalhe.resumo}
          </p>
          <button
            type="button"
            onClick={() => setMostrarIntegra(true)}
            className="inline-flex items-center gap-1 text-[11px] font-black cursor-pointer hover:underline"
            style={{ color: THEME_COLORS.primary }}
          >
            <BookOpenText className="w-3.5 h-3.5" />
            Ver audiência na íntegra
          </button>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: THEME_COLORS.gray }}>
            <Users className="w-3.5 h-3.5" />
            Participantes
          </h3>
          <div
            ref={participantesRef}
            className="flex flex-wrap gap-1.5 overflow-hidden"
            style={participantesExpandidos ? undefined : { maxHeight: '64px' }}
          >
            {detalhe.participantes.map((p) =>
              isPresidente(p) ? (
                <span
                  key={p.nome}
                  aria-disabled="true"
                  title="Presidente da sessão — mediação imparcial"
                  className="px-2.5 py-1.5 rounded-full border text-[11px] font-bold opacity-70"
                  style={{
                    borderColor: THEME_COLORS.borderLight,
                    backgroundColor: 'transparent',
                    color: THEME_COLORS.gray,
                  }}
                >
                  {p.nome}
                  {p.partido ? ` (${p.partido})` : ''} - Presidente
                </span>
              ) : (
                <button
                  key={p.nome}
                  type="button"
                  onClick={() => setParticipanteSelecionado(p.nome)}
                  className="px-2.5 py-1.5 rounded-full border text-[11px] font-bold transition-all cursor-pointer hover:shadow-md"
                  style={{
                    borderColor: THEME_COLORS.borderLight,
                    backgroundColor: '#ffffff70',
                    color: THEME_COLORS.textDark,
                  }}
                >
                  {p.nome}
                  {p.partido ? (
                    <span className="ml-1 font-black" style={{ color: THEME_COLORS.gray }}>
                      ({p.partido})
                    </span>
                  ) : null}
                </button>
              )
            )}
          </div>
          {(participantesOverflow || participantesExpandidos) && (
            <button
              type="button"
              onClick={() => setParticipantesExpandidos((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] font-black cursor-pointer hover:underline"
              style={{ color: THEME_COLORS.primary }}
            >
              {participantesExpandidos ? 'Ver menos' : 'Ver todos'}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${participantesExpandidos ? 'rotate-180' : ''}`} />
            </button>
          )}
        </section>

        <section className="space-y-2.5">
          <h3 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: THEME_COLORS.gray }}>
            <Scale className="w-3.5 h-3.5" />
            Posicionamentos e argumentos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
          {gruposPosicionamento.map((grupo) => (
            <div
              key={grupo.posicao}
              className="rounded-2xl border p-4"
              style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: '#ffffff70' }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: grupo.meta.color }}
                />
                <h4 className="text-xs font-black leading-snug" style={{ color: THEME_COLORS.textDark }}>
                  {grupo.posicao === 'contra' && 'Posicionamentos contra'}
                  {grupo.posicao === 'neutro' && 'Posicionamentos neutros'}
                  {grupo.posicao === 'favor' && 'Posicionamentos a favor'}
                  {grupo.posicao === 'ambiguo' && 'Posicionamentos ambíguos'}
                </h4>
              </div>
              {grupo.participantes.length === 0 ? (
                <p className="mt-1.5 text-[11px] font-medium" style={{ color: THEME_COLORS.gray }}>
                  Nenhum participante nesta categoria.
                </p>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {grupo.participantes.map((p) => (
                    <button
                      key={p.nome}
                      type="button"
                      onClick={() => setParticipanteSelecionado(p.nome)}
                      className="w-full text-left rounded-xl p-2.5 transition-all cursor-pointer hover:shadow-md border-l-[3px]"
                      style={{
                        backgroundColor: 'transparent',
                        borderLeftColor: grupo.meta.color,
                      }}
                    >
                      <p className="text-[11px] font-black" style={{ color: THEME_COLORS.textDark }}>
                        {p.nome}
                        {p.partido ? ` - ${p.partido}` : ''}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium leading-relaxed line-clamp-2" style={{ color: THEME_COLORS.gray }}>
                        {p.resumoArgumentos}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>
        </section>

        <section className="space-y-2.5">
          <h3 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: THEME_COLORS.gray }}>
            <ListChecks className="w-3.5 h-3.5" />
            Propostas identificadas
          </h3>
          {detalhe.propostas.map((proposta) => (
            <PropostaCard key={proposta.id} proposta={proposta} />
          ))}
        </section>
          </>
        )}
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
