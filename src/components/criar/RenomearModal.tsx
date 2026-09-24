import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { BaseModal } from './BaseModal';

interface RenomearModalProps {
  title: string;
  label: string;
  icon: React.ReactNode;
  initialName: string;
  placeholder?: string;
  confirmLabel?: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

const inputClassName =
  'w-full pl-4 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10';

export const RenomearModal: React.FC<RenomearModalProps> = ({
  title,
  label,
  icon,
  initialName,
  placeholder,
  confirmLabel = 'Salvar',
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [saved, setSaved] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaved(true);

    timerRef.current = setTimeout(() => {
      onSave(name.trim());
      onClose();
    }, 850);
  };

  return (
    <BaseModal onClose={onClose} maxWidthClass="max-w-md">
      {saved ? (
        <div className="py-10 text-center space-y-3">
          <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-600" />

          <h3
            className="text-lg font-bold"
            style={{ color: THEME_COLORS.textDark }}
          >
            Nome atualizado com sucesso!
          </h3>

          <p className="text-xs font-semibold text-stone-500">{name}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">
            <h2
              className="text-2xl font-black tracking-tight"
              style={{ color: THEME_COLORS.textDark }}
            >
              {title}
            </h2>

            <p className="mt-1 text-xs font-semibold text-stone-500">
              Digite o novo nome para aplicar rapidamente.
            </p>
          </div>

          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: THEME_COLORS.textDark }}
            >
              {label}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                {icon}
              </span>
              <input
                type="text"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                placeholder={placeholder}
                className={`${inputClassName} pl-10`}
                style={{
                  backgroundColor: THEME_COLORS.bgLight,
                  borderColor: THEME_COLORS.borderLight,
                  color: THEME_COLORS.textDark,
                }}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer"
              style={{
                backgroundColor: THEME_COLORS.bgLight,
                borderColor: THEME_COLORS.borderLight,
                color: THEME_COLORS.textDark,
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-sm transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: THEME_COLORS.primary }}
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};

export default RenomearModal;