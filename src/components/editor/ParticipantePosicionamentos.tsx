import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, FileText, History, ListChecks, ScrollText } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { AudienciaDetalhe, AudienciaParticipante } from '../../data/mockAudiencias';
import { findAudienciasByParticipante } from '../../data/mockAudiencias';
import {
  POSICAO_TEMA_META,
  corCategoriaTaxonomia,
  posicaoDaFala,
} from '../../utils/posicaoTema';

interface ParticipantePosicionamentosProps {
  participante: AudienciaParticipante;
  detalhe: AudienciaDetalhe;
  onBack: () => void;
  onSelectAudiencia: (id: string) => void;
}

export const ParticipantePosicionamentos: React.FC<ParticipantePosicionamentosProps> = ({
  participante,
  detalhe,
  onBack,
  onSelectAudiencia,
}) => {
  const [falasAbertas, setFalasAbertas] = useState<Record<string, boolean>>({});

  const toggleFala = (falaId: string) => {
    setFalasAbertas((prev) => ({ ...prev, [falaId]: !prev[falaId] }));
  };

  const falas = detalhe.falas
    .filter((f) => f.autor === participante.nome)
    .sort((a, b) => a.ordem_no_debate - b.ordem_no_debate);

  const propostas = detalhe.propostas.filter((p) => p.autor === participante.nome);

  const outrosDebates = findAudienciasByParticipante(participante.nome).filter(
    (d) => d.id !== detalhe.id
  );

  // Seção "outros debates" oculta apenas visualmente — lógica mantida para reativação futura.
  const MOSTRAR_OUTROS_DEBATES = false;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[11px] font-black cursor-pointer hover:underline"
        style={{ color: THEME_COLORS.primary }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar para a audiência
      </button>

      <div className="rounded-2xl py-4 flex items-center gap-3">
        <div className="flex justify-center gap-2">
          <p className="text-md font-black leading-snug" style={{ color: THEME_COLORS.textDark }}>
            {participante.nome}
            {participante.partido ? ` - ${participante.partido}` : ''}
          </p>
        </div>
      </div>

      <section className="space-y-2.5">
        <h3 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: THEME_COLORS.gray }}>
          <FileText className="w-3.5 h-3.5" />
          Posicionamentos e argumentos perante ao tema
        </h3>
        {falas.length === 0 ? (
          <p className="text-[11px] font-medium" style={{ color: THEME_COLORS.gray }}>
            Nenhuma fala registrada para este participante.
          </p>
        ) : (
          falas.map((fala) => {
            const posicao = posicaoDaFala(fala);
            const meta = POSICAO_TEMA_META[posicao];
            const aberta = !!falasAbertas[fala.id];
            const tags = Object.entries(fala.taxonomia ?? {}).filter(
              ([categoria]) => categoria !== 'Posicionamento'
            );
            return (
              <div
                key={fala.id}
                className="rounded-2xl border p-4"
                style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: '#ffffff70' }}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-black"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    {meta.label}
                  </span>
                  {tags.flatMap(([categoria, valores]) =>
                    valores.map((valor) => {
                      const cor = corCategoriaTaxonomia(categoria);
                      return (
                        <span
                          key={`${categoria}-${valor}`}
                          title={categoria}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ backgroundColor: cor.bg, color: cor.color }}
                        >
                          {valor}
                        </span>
                      );
                    })
                  )}
                </div>
                <p className="mt-1.5 text-[11px] font-medium leading-relaxed" style={{ color: THEME_COLORS.textDark }}>
                  {fala.resumo}
                </p>
                <button
                  type="button"
                  onClick={() => toggleFala(fala.id)}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-black cursor-pointer hover:underline"
                  style={{ color: THEME_COLORS.primary }}
                >
                  <ScrollText className="w-3.5 h-3.5" />
                  {aberta ? 'Ocultar fala completa' : 'Ver fala completa'}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${aberta ? 'rotate-180' : ''}`} />
                </button>
                {aberta && (
                  <p
                    className="mt-2 border-t pt-2 text-[11px] font-medium leading-relaxed whitespace-pre-wrap"
                    style={{ borderColor: THEME_COLORS.borderLight, color: THEME_COLORS.gray }}
                  >
                    {fala.texto}
                  </p>
                )}
              </div>
            );
          })
        )}
      </section>

      <section className="space-y-2.5">
        <h3 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: THEME_COLORS.gray }}>
          <ListChecks className="w-3.5 h-3.5" />
          Propostas trazidas pelo participante
        </h3>
        {propostas.length === 0 ? (
          <p className="text-[11px] font-medium" style={{ color: THEME_COLORS.gray }}>
            Nenhuma proposta registrada para este participante.
          </p>
        ) : (
          propostas.map((proposta) => (
            <div
              key={proposta.id}
              className="rounded-2xl border p-4"
              style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: '#ffffff70' }}
            >
              <h4 className="text-xs font-black leading-snug" style={{ color: THEME_COLORS.textDark }}>
                {proposta.titulo}
              </h4>
              <p className="mt-1 text-[11px] font-medium leading-relaxed" style={{ color: THEME_COLORS.gray }}>
                {proposta.descricao}
              </p>
            </div>
          ))
        )}
      </section>

      {MOSTRAR_OUTROS_DEBATES && (
      <section className="space-y-2.5">
        <h3 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: THEME_COLORS.gray }}>
          <History className="w-3.5 h-3.5" />
          Encontrar outros debates com este participante
        </h3>
        {outrosDebates.length === 0 ? (
          <p className="text-[11px] font-medium" style={{ color: THEME_COLORS.gray }}>
            Nenhum outro debate registrado com este participante.
          </p>
        ) : (
          outrosDebates.map((debate) => (
            <button
              key={debate.id}
              type="button"
              onClick={() => onSelectAudiencia(debate.id)}
              className="w-full text-left rounded-2xl border p-4 transition-all cursor-pointer hover:shadow-md"
              style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: '#ffffff70' }}
            >
              <p className="text-xs font-black leading-snug" style={{ color: THEME_COLORS.textDark }}>
                {debate.titulo}
              </p>
              <p className="mt-1 text-[11px] font-medium leading-relaxed line-clamp-2" style={{ color: THEME_COLORS.gray }}>
                {debate.resumoCurto}
              </p>
            </button>
          ))
        )}
      </section>
      )}
    </div>
  );
};

export default ParticipantePosicionamentos;
