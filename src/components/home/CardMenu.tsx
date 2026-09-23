import React, { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';

interface CardMenuProps {
  onRename: () => void;
  onDelete: () => void;
}

export const CardMenu: React.FC<CardMenuProps> = ({ onRename, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const runAction = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <div
      ref={ref}
      className="absolute top-2.5 right-2.5 z-20"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Opções"
        title="Renomear ou excluir"
        onClick={() => setOpen((current) => !current)}
        className="
          w-8
          h-8
          flex
          items-center
          justify-center
          rounded-full
          bg-white/85
          border
          border-white/60
          text-stone-700
          shadow-sm
          transition-all
          hover:scale-110
          hover:bg-white
          cursor-pointer
        "
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            top-full
            mt-1.5
            w-44
            rounded-xl
            border
            bg-white
            shadow-xl
            overflow-hidden
            animate-in
            zoom-in-95
            fade-in
            duration-150
          "
          style={{ borderColor: THEME_COLORS.borderLight }}
        >
          <button
            type="button"
            onClick={() => runAction(onRename)}
            className="
              w-full
              flex
              items-center
              gap-2.5
              px-4
              py-2.5
              text-xs
              font-bold
              text-stone-700
              hover:bg-stone-100
              transition-colors
              cursor-pointer
            "
          >
            <Pencil className="w-4 h-4 text-stone-400" />
            Renomear
          </button>

          <div className="h-px bg-stone-100 mx-3" />

          <button
            type="button"
            onClick={() => runAction(onDelete)}
            className="
              w-full
              flex
              items-center
              gap-2.5
              px-4
              py-2.5
              text-xs
              font-bold
              text-red-600
              hover:bg-red-50
              transition-colors
              cursor-pointer
            "
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
};

export default CardMenu;