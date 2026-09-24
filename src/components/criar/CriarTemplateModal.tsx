import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { Turma, Template } from '../../types';
import { BaseModal } from './BaseModal';

interface CriarTemplateModalProps {
  turmas: Turma[];
  onClose: () => void;
  onCreated: (template: Template) => Promise<unknown> | unknown;
}

export const CriarTemplateModal: React.FC<CriarTemplateModalProps> = ({
  turmas,
  onClose,
  onCreated,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const toggleTurma = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((k) => k !== id)
        : [...current, id]
    );
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const f = file?.name ?? '';
    setFileName(f);
    setName(f);
    setFileContent('');
    if (file) {
      const selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => setFileContent(String(reader.result || ''));
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !fileName || !fileContent || saving) return;

    setSaving(true);
    setError('');
    try {
      await onCreated({
        id: crypto.randomUUID(),
        title: name.trim(),
        qtd: selectedIds.length,
        htmlContent: '',
        fileName: fileName || undefined,
        fileContent: fileContent || undefined,
        turmaIds: selectedIds,
      });
      setSaved(true);
      timerRef.current = setTimeout(onClose, 850);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível criar o template.');
    } finally {
      setSaving(false);
    }
  };

  const groupedBySchool = React.useMemo(() => {
    const groups = new Map<string, Turma[]>();
    turmas.forEach((turma) => {
      const list = groups.get(turma.school) ?? [];
      list.push(turma);
      groups.set(turma.school, list);
    });
    return groups;
  }, [turmas]);

  return (
    <BaseModal onClose={onClose} maxWidthClass="max-w-2xl">
      {saved ? (
        <div className="py-10 text-center space-y-3">
          <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-600" />

          <h3
            className="text-lg font-bold"
            style={{ color: THEME_COLORS.textDark }}
          >
            Template criado com sucesso!
          </h3>

          <p className="text-xs font-semibold text-stone-500">
            {fileName}
            {selectedIds.length > 0
              ? ` • ${selectedIds.length} ${
                  selectedIds.length === 1
                    ? 'turma associada'
                    : 'turmas associadas'
                }`
              : ''}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header */}
          <div className="mb-6">
            <h2
              className="text-2xl font-black tracking-tight"
              style={{ color: THEME_COLORS.textDark }}
            >
              Novo Template
            </h2>

            <p className="mt-1 text-xs font-semibold text-stone-500">
              Associe uma ou mais turmas ao template de
              plano de aula
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
              Arquivo do template
            </label>
            <label
              className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: THEME_COLORS.lightPrimary,
                borderColor: THEME_COLORS.lightPrimary,
                color: THEME_COLORS.primary,
              }}
            >
              <span className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/60">
                <Upload className="w-5 h-5" />
              </span>
              <span className="text-left min-w-0">
                <span className="block text-sm font-bold truncate">
                  {fileName || 'Carregar arquivo'}
                </span>
                <span className="block text-[10px] font-medium opacity-70">
                  HTML ou PDF
                </span>
              </span>
              <input type="file" accept=".html,.htm,.pdf" className="hidden" onChange={handleFile} />
            </label>
            <div className="mt-3">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
                Nome do template (nome do arquivo)
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="O nome aparecerá após selecionar o arquivo"
                className="w-full px-4 py-2.5 rounded-xl text-sm border bg-white/50 focus:outline-none"
                style={{
                  borderColor: THEME_COLORS.borderLight,
                  color: THEME_COLORS.textDark,
                }}
              />
            </div>
            {error && (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* Turmas associadas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
              Turmas associadas ao template
            </label>

            <div
              className="border rounded-xl overflow-y-auto max-h-44 p-2 space-y-1"
              style={{
                borderColor: THEME_COLORS.borderLight,
                backgroundColor: THEME_COLORS.bgLight,
              }}
            >
              {turmas.length === 0 && (
                <p className="text-xs font-semibold text-stone-500 px-2 py-3 text-center">
                  Nenhuma turma cadastrada.
                </p>
              )}

              {[...groupedBySchool.entries()].map(
                ([school, schoolTurmas]) => (
                  <div key={school}>
                    <div className="flex items-center gap-2 mt-1 first:mt-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: THEME_COLORS.primary }} />
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                        {school}
                      </span>
                    </div>

                    {schoolTurmas.map((turma) => {
                      const isChecked = selectedIds.includes(turma.id);
                      return (
                        <label
                          key={turma.id}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-black/[0.04]"
                          style={{ color: THEME_COLORS.textDark }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTurma(turma.id)}
                            className="w-4 h-4 rounded text-orange-600 shrink-0"
                          />
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: turma.color ?? THEME_COLORS.primary }} />
                          <span className="text-xs font-semibold truncate">
                            {turma.series} {turma.idSeries}
                          </span>
                          <span className="text-[10px] font-medium text-stone-400 truncate">
                            {turma.qtd} {turma.qtd === 1 ? 'aluno' : 'alunos'}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )
              )}
            </div>

            {selectedIds.length > 0 && (
              <p className="mt-1 text-[11px] font-bold" style={{ color: THEME_COLORS.primary }}>
                {selectedIds.length} {selectedIds.length === 1 ? 'turma selecionada' : 'turmas selecionadas'}
              </p>
            )}
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
              disabled={!name.trim() || !fileName || !fileContent || saving}
            >
              {saving ? 'Salvando...' : 'Criar Template'}
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};

export default CriarTemplateModal;