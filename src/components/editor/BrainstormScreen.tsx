import React, { useState } from 'react';
import { ArrowRight, Zap, Circle, CheckCircle2 } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { MOCK_BRAINSTORM_IDEAS } from '../../data/mockBrainstormIdeas';
import { ChatPanel } from './ChatPanel';
import type { ChatMessage } from './ChatPanel';

interface BrainstormScreenProps {
  onProceed: (title: string) => void;
}

export const BrainstormScreen: React.FC<BrainstormScreenProps> = ({ onProceed }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'bs-1',
      role: 'assistant',
      text: 'Gerei ideias para o seu tema "Contrato Social de Hobbes a Rousseau". Explore as sugestões ao lado e me peça ajustes, se quiser.',
    },
  ]);

  const selectedIdea = MOCK_BRAINSTORM_IDEAS.find((i) => i.id === selectedId) ?? null;

  const handleSend = (text: string) => {
    const id = `m-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id, role: 'user', text },
      { id: `${id}-r`, role: 'assistant', text: `Entendido! Refinei as sugestões a partir de: "${text}".` },
    ]);
  };

  return (
    <div className="screen-in flex-1 min-w-0 h-full min-h-0 flex">
      {/* Main suggestion grid */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-y-auto">
        <div className="shrink-0 px-6 pt-5 pb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
            style={{ backgroundColor: THEME_COLORS.lightAccent, color: THEME_COLORS.accentHover }}>
            <Zap className="w-3.5 h-3.5" />
            Modo Brainstorm
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight" style={{ color: THEME_COLORS.textDark }}>
            Sugestões para o seu tema
          </h1>
          <p className="mt-1 text-xs font-semibold" style={{ color: THEME_COLORS.gray }}>
            Selecione uma ideia para detalhar — ou continue conversando com o assistente para refiná-las.
          </p>
        </div>

        <div className="flex-1 px-6 pb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-auto-rows-min gap-4 content-start">
          {MOCK_BRAINSTORM_IDEAS.map((idea) => {
            const isSelected = idea.id === selectedId;
            return (
              <button
                key={idea.id}
                type="button"
                onClick={() => setSelectedId(isSelected ? null : idea.id)}
                className={`text-left rounded-2xl border p-5 flex flex-col transition-all cursor-pointer ${
                  isSelected
                    ? 'shadow-lg row-span-2'
                    : 'hover:shadow-md hover:-translate-y-0.5'
                }`}
                style={{
                  backgroundColor: '#ffffff60',
                  borderColor: isSelected ? idea.accentColor : THEME_COLORS.borderLight,
                  boxShadow: isSelected
                    ? `0 10px 24px ${idea.accentColor}22`
                    : undefined,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors"
                    style={{
                      borderColor: isSelected ? idea.accentColor : THEME_COLORS.borderLight,
                      backgroundColor: isSelected ? idea.accentColor : 'transparent',
                    }}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" style={{ color: THEME_COLORS.borderLight }} />
                    )}
                  </span>
                </div>

                <h3 className={`mt-3 ${isSelected ? 'text-lg' : 'text-sm'} font-black leading-snug`} style={{ color: THEME_COLORS.textDark }}>
                  {idea.title}
                </h3>
                <p className={`mt-1.5 text-xs font-medium leading-relaxed ${isSelected ? '' : 'line-clamp-3'}`} style={{ color: THEME_COLORS.gray }}>
                  {isSelected ? idea.description : idea.summary}
                </p>

                <div className="mt-auto pt-3 flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: THEME_COLORS.primary + '1a', color: THEME_COLORS.primary }}>
                    {idea.format}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: THEME_COLORS.lightAccent, color: THEME_COLORS.accentHover }}>
                    {idea.series}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: `${idea.accentColor}1a`, color: idea.accentColor }}>
                    {idea.content}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action bar */}
        <div className="shrink-0 px-6 py-4 border-t flex items-center justify-end"
          style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: '#ffffff40' }}>
          {selectedIdea ? (
            <button
              type="button"
              onClick={() => onProceed(selectedIdea.title)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black text-white transition-all hover:scale-[1.02] cursor-pointer shadow-md"
              style={{ backgroundColor: selectedIdea.accentColor }}
            >
              Prosseguir com essa ideia
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs font-semibold" style={{ color: THEME_COLORS.gray }}>
              Selecione uma ideia para prosseguir com o editor.
            </span>
          )}
        </div>
      </div>

      {/* Chat */}
      <ChatPanel
        messages={messages}
        onSend={handleSend}
        placeholder="Refine ideias, peça variações..."
        contextLabel="Brainstorm — sugerindo para você"
        contextIcon="document"
        selectionLabel={selectedIdea?.title}
        onClearSelection={() => setSelectedId(null)}
      />
    </div>
  );
};

export default BrainstormScreen;
