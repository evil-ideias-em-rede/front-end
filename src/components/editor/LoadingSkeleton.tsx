import React from 'react';
import { Sparkles, Send } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';

interface LoadingSkeletonProps {
  message: string;
  subtitle?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ message, subtitle }) => {
  const listItems = 4;
  const chatBubbles = [
    { w: '80%', align: 'start' },
    { w: '60%', align: 'end' },
    { w: '72%', align: 'start' },
  ];

  return (
    <div className="skeleton-fade-in flex-1 min-w-0 h-full relative flex flex-col overflow-hidden">
      {/* Header skeleton */}
      <div
        className="shrink-0 px-4 py-3 flex items-center gap-3 border-b bg-white/60"
        style={{ borderColor: THEME_COLORS.borderLight }}
      >
        <div className="skeleton w-9 h-9 rounded-lg" />
        <div className="skeleton h-6 w-36 rounded-full" />
        <div className="skeleton h-3.5 w-64 rounded" />
        <div className="flex-1" />
        <div className="skeleton h-9 w-60 rounded-xl" />
      </div>

      {/* Barra de progresso */}
      <div className="progress-track shrink-0">
        <div className="progress-bar" />
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Page skeleton */}
        <div className="flex-1 min-w-0 h-full overflow-hidden bg-stone-100">
          <div className="min-h-full flex justify-center py-6 px-6">
            <div className="bg-white shadow-xl shrink-0 px-8 py-7" style={{ width: 794 }}>
              <div className="skeleton h-6 w-3/4 mb-3" />
              <div className="skeleton h-3 w-full mb-2" />
              <div className="skeleton h-3 w-2/3 mb-6" />

              <div className="skeleton h-4 w-1/3 mb-3" />
              <div className="skeleton h-3 w-full mb-2" />
              <div className="skeleton h-3 w-full mb-2" />
              <div className="skeleton h-3 w-4/5 mb-6" />

              <div className="skeleton h-4 w-2/5 mb-3" />
              <div className="flex flex-col gap-2 mb-6">
                {Array.from({ length: listItems }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="skeleton w-3 h-3 rounded-full shrink-0" />
                    <div className="skeleton h-3 rounded" style={{ width: `${78 - i * 10}%` }} />
                  </div>
                ))}
              </div>

              <div className="skeleton h-4 w-1/4 mb-3" />
              <div className="skeleton h-3 w-full mb-2" />
              <div className="skeleton h-3 w-3/4 mb-2" />
              <div className="skeleton h-3 w-5/6" />
            </div>
          </div>
        </div>

        {/* Chat skeleton */}
        <div
          className="w-80 shrink-0 h-full flex flex-col border-l bg-white/60"
          style={{ borderColor: THEME_COLORS.borderLight }}
        >
          <div className="shrink-0 p-4 border-b flex items-center gap-2" style={{ borderColor: THEME_COLORS.borderLight }}>
            <div className="skeleton w-8 h-8 rounded-lg" />
            <div className="flex-1">
              <div className="skeleton h-3.5 w-24 mb-1.5" />
              <div className="skeleton h-2.5 w-40" />
            </div>
          </div>

          <div className="flex-1 p-4 space-y-3">
            {chatBubbles.map((b, i) => (
              <div
                key={i}
                className="flex"
                style={{ justifyContent: b.align === 'end' ? 'flex-end' : 'flex-start' }}
              >
                <div
                  className="skeleton h-8 rounded-2xl"
                  style={{ width: b.w, backgroundSize: '200% 100%' }}
                />
              </div>
            ))}
          </div>

          <div className="shrink-0 p-3 border-t" style={{ borderColor: THEME_COLORS.borderLight }}>
            <div className="flex items-end gap-2 rounded-2xl border p-2" style={{ borderColor: THEME_COLORS.borderLight }}>
              <div className="skeleton h-8 flex-1" />
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: THEME_COLORS.primary }}
              >
                <Send className="w-4 h-4 text-white opacity-70" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status flutuante */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg border"
        style={{ backgroundColor: '#ffffff', borderColor: THEME_COLORS.borderLight, maxWidth: '90%' }}>
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 animate-pulse"
          style={{ backgroundColor: THEME_COLORS.primary }}
        >
          <Sparkles className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black truncate" style={{ color: THEME_COLORS.textDark }}>
            {message}
          </p>
          {subtitle && (
            <p className="text-[10px] font-semibold line-clamp-2" style={{ color: THEME_COLORS.gray }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;