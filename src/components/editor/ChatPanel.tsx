import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, FileText, X } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  placeholder?: string;
  contextLabel?: string;
  contextIcon?: 'layer' | 'document';
  selectionLabel?: string;
  onClearSelection?: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSend,
  placeholder = 'Descreva uma mudança...',
  selectionLabel,
  onClearSelection,
}) => {
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expansão até 5 linhas; acima disso, scroll interno.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 16;
    const maxHeight = lineHeight * 8;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [draft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1200);
  };

  return (
    <aside
      className="w-80 shrink-0 h-full flex flex-col border-l bg-white/60"
      style={{ borderColor: THEME_COLORS.borderLight }}
    >
      {/* Header */}
      <div
        className="shrink-0 p-4 border-b"
        style={{ borderColor: THEME_COLORS.borderLight }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: THEME_COLORS.primary }}
          >
            <Sparkles className="w-4 h-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-black tracking-tight" style={{ color: THEME_COLORS.textDark }}>
              Contraponto
            </h2>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] min-w-0 px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] ${
                msg.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
              }`}
              style={
                msg.role === 'user'
                  ? { backgroundColor: THEME_COLORS.primary, color: '#fff' }
                  : { backgroundColor: THEME_COLORS.lightPrimary, color: THEME_COLORS.textDark }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div
              className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-xs font-semibold flex items-center gap-1.5"
              style={{ backgroundColor: THEME_COLORS.lightPrimary, color: THEME_COLORS.gray }}
            >
              <span className="animate-pulse">●</span>
              <span className="animate-pulse" style={{ animationDelay: '150ms' }}>●</span>
              <span className="animate-pulse" style={{ animationDelay: '300ms' }}>●</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="shrink-0 p-3 border-t" style={{ borderColor: THEME_COLORS.borderLight }}>
        {selectionLabel && (
          <div className="mb-2 flex items-center gap-1.5 pl-1">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold max-w-full"
              style={{ backgroundColor: THEME_COLORS.lightPrimary, color: THEME_COLORS.primary }}
            >
              <FileText className="w-3 h-3 shrink-0" />
              <span className="truncate">{selectionLabel}</span>
            </span>
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className="w-4 h-4 rounded-full flex items-center justify-center text-stone-400 hover:bg-black/[0.06] hover:text-stone-600 transition-colors cursor-pointer"
                title="Desselecionar"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
        <div
          className="flex gap-2 rounded-2xl border p-4 transition-all focus-within:border-violet-300"
          style={{ backgroundColor: '#fff', borderColor: THEME_COLORS.borderLight }}
        >
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            rows={1}
            className="flex-1 bg-transparent resize-none text-xs font-medium leading-4 focus:outline-none placeholder-stone-400"
            style={{ color: THEME_COLORS.textDark }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="w-9 h-9 rounded-xl place-self-end flex items-center justify-center text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-default"
            style={{ backgroundColor: THEME_COLORS.primary }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </aside>
  );
};

export default ChatPanel;
