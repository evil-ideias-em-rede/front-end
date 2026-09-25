import React, { useEffect, useRef, useState } from 'react';
import { BookMarked, CheckCircle2 } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { Material } from '../../types';
import { displayFileTitle, keepOriginalFileExtension } from '../../utils/displayNames';
import { BaseModal } from './BaseModal';

interface EditarMaterialModalProps {
  material: Material;
  onClose: () => void;
  onUpdated: (material: Material) => void;
}

const inputClassName =
  'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10';

export const EditarMaterialModal: React.FC<EditarMaterialModalProps> = ({
  material,
  onClose,
  onUpdated,
}) => {
  const [name, setName] = useState(displayFileTitle(material.title));
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
      onUpdated({
        ...material,
        title: keepOriginalFileExtension(name, material.title),
      });
      onClose();
    }, 850);
  };

  return (
    <BaseModal onClose={onClose}>
      {saved ? (
        <div className="py-10 text-center space-y-3">
          <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-600" />

          <h3
            className="text-lg font-bold"
            style={{ color: THEME_COLORS.textDark }}
          >
            Material atualizado com sucesso!
          </h3>

          <p className="text-xs font-semibold text-stone-500">{name}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header */}
          <div className="mb-6">
            <h2
              className="text-2xl font-black tracking-tight"
              style={{ color: THEME_COLORS.textDark }}
            >
              Editar Material
            </h2>

            <p className="mt-1 text-xs font-semibold text-stone-500">
              Renomeie o arquivo deste material
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
              Nome do material
            </label>
            <div className="relative">
              <BookMarked className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Livro de Português Ensino Médio Vol. 1"
                className={inputClassName}
                style={{
                  backgroundColor: THEME_COLORS.bgLight,
                  borderColor: THEME_COLORS.borderLight,
                  color: THEME_COLORS.textDark,
                }}
              />
            </div>
          </div>

          {/* Footer */}
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
              Salvar Alterações
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};

export default EditarMaterialModal;
