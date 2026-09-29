import React, { useState } from 'react';
import { BookMarked } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { Material, Turma } from '../../types';
import { displayFileTitle, keepOriginalFileExtension } from '../../utils/displayNames';
import { BaseModal } from './BaseModal';

interface EditarMaterialModalProps {
  material: Material;
  turmas: Turma[];
  onClose: () => void;
  onUpdated: (material: Material) => Promise<unknown>;
}

export const EditarMaterialModal: React.FC<EditarMaterialModalProps> = ({
  material, turmas, onClose, onUpdated,
}) => {
  const [name, setName] = useState(displayFileTitle(material.title));
  const [turmaIds, setTurmaIds] = useState<string[]>(material.turmaIds ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await onUpdated({
        ...material,
        title: keepOriginalFileExtension(name.trim(), material.title),
        turmaIds,
        qtd: turmaIds.length,
      });
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar o material.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BaseModal onClose={() => { if (!saving) onClose(); }}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-black" style={{ color: THEME_COLORS.textDark }}>Editar material</h2>
        <p className="text-sm text-stone-500">Altere o nome e as turmas vinculadas ao material.</p>
        <fieldset disabled={saving} className="space-y-4">
          <label className="block text-sm font-bold">
            Nome do material
            <span className="relative mt-2 block">
              <BookMarked className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border font-normal"
              />
            </span>
          </label>
          <fieldset className="space-y-2">
            <legend className="text-sm font-bold mb-2">Turmas vinculadas</legend>
            <p className="text-xs text-stone-500">Selecione uma ou mais turmas. Desmarque todas para remover os vínculos.</p>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {turmas.map((turma) => (
                <label key={turma.id} className="flex items-center gap-3 rounded-xl border p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={turmaIds.includes(turma.id)}
                    onChange={(event) => setTurmaIds((current) => event.target.checked
                      ? [...current, turma.id]
                      : current.filter((id) => id !== turma.id))}
                    className="accent-purple-600"
                  />
                  <span className="text-sm">
                    <span className="block font-bold">{turma.series} {turma.idSeries} · {turma.school}</span>
                    <span className="text-xs text-stone-500">{turma.disciplina} · {turma.qtd} alunos</span>
                  </span>
                </label>
              ))}
              {turmas.length === 0 && <p className="text-sm text-stone-500">Nenhuma turma cadastrada. Crie uma na aba Turmas.</p>}
            </div>
          </fieldset>
        </fieldset>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <div className="pt-2 flex justify-end gap-3">
          <button type="button" disabled={saving} onClick={onClose} className="px-5 py-2.5 rounded-xl border disabled:opacity-50">Cancelar</button>
          <button type="submit" disabled={saving || !name.trim()} className="px-5 py-2.5 rounded-xl text-white font-bold disabled:opacity-50" style={{ backgroundColor: THEME_COLORS.primary }}>
            {saving ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditarMaterialModal;
