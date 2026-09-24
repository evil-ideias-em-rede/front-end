import React, { useEffect, useRef, useState } from 'react';
import { BookMarked, CheckCircle2, FileText, PenLine, Upload } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { Material, MaterialCategory, MaterialType, Turma } from '../../types';
import { materialHtml } from '../../data/mockData';
import { BaseModal } from './BaseModal';

interface CriarMaterialModalProps {
  turmas: Turma[];
  onClose: () => void;
  onCreated: (material: Material) => void;
}

const inputClassName =
  'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10';

const MATERIAL_TYPES: { id: MaterialType; label: string }[] = [
  { id: 'source', label: 'Fonte / Livro' },
  { id: 'slide', label: 'Slides / Apresentação' },
  { id: 'atv', label: 'Atividade' },
];

const MATERIAL_CATEGORIES: { id: MaterialCategory; label: string }[] = [
  { id: 'plano', label: 'Plano de Aula' },
  { id: 'material', label: 'Material' },
  { id: 'atividade', label: 'Atividade' },
];

const turmaKey = (turma: Turma) =>
  `${turma.school}||${turma.series}||${turma.idSeries}`;

export const CriarMaterialModal: React.FC<CriarMaterialModalProps> = ({
  turmas,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<MaterialType>('source');
  const [category, setCategory] = useState<MaterialCategory>('material');
  const [fileType, setFileType] = useState<'pdf' | 'html'>('html');
  const [isAutoral, setIsAutoral] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [saved, setSaved] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const toggleTurma = (key: string) => {
    setSelectedKeys((current) =>
      current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key]
    );
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file?.name ?? '');
    setFileContent('');
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFileContent(String(reader.result || ''));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaved(true);

    timerRef.current = setTimeout(() => {
      onCreated({
        id: crypto.randomUUID(),
        title: name.trim(),
        autoral: isAutoral,
        orientation: 'V',
        type,
        category,
        fileType,
        fileName: fileName || undefined,
        fileContent: fileContent || undefined,
        qtd: selectedKeys.length,
        htmlContent:
          fileType === 'html'
            ? materialHtml(name.trim())
            : materialHtml(name.trim()),
        turmaIds: turmas
          .filter((t) =>
            selectedKeys.includes(turmaKey(t))
          )
          .map((t) => t.id),
      });
      onClose();
    }, 850);
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
    <BaseModal onClose={onClose}>
      {saved ? (
        <div className="py-10 text-center space-y-3">
          <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-600" />

          <h3
            className="text-lg font-bold"
            style={{ color: THEME_COLORS.textDark }}
          >
            Material criado com sucesso!
          </h3>

          <p className="text-xs font-semibold text-stone-500">
            {name} • {MATERIAL_TYPES.find((t) => t.id === type)?.label}
            {isAutoral ? ' • Autoral' : ''}
            {selectedKeys.length > 0
              ? ` • ${selectedKeys.length} ${
                  selectedKeys.length === 1
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
              Novo Material
            </h2>

            <p className="mt-1 text-xs font-semibold text-stone-500">
              Associe uma ou mais turmas ao material didático
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
              Categoria do conteúdo
            </label>
            <div className="relative">
              <BookMarked className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className={`${inputClassName} appearance-none pr-9 cursor-pointer`}
                style={{
                  backgroundColor: THEME_COLORS.bgLight,
                  borderColor: THEME_COLORS.borderLight,
                  color: THEME_COLORS.textDark,
                }}
              >
                {MATERIAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <svg
                className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
              Nome do Material
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
                Tipo do Material
              </label>
              <div className="relative">
                <BookMarked className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as MaterialType)}
                  className={`${inputClassName} appearance-none pr-9 cursor-pointer`}
                  style={{
                    backgroundColor: THEME_COLORS.bgLight,
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark,
                  }}
                >
                  {MATERIAL_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            <div className="flex items-end pb-2">
              <label
                className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold"
                style={{ color: THEME_COLORS.textDark }}
              >
                <input
                  type="checkbox"
                  checked={isAutoral}
                  onChange={(e) => setIsAutoral(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600"
                />
                <PenLine className="w-3.5 h-3.5" />
                Material autoral
              </label>
            </div>
          </div>

          {/* Tipo do arquivo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
              Tipo do arquivo
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as 'pdf' | 'html')}
                className={`${inputClassName} appearance-none pr-9 cursor-pointer`}
                style={{
                  backgroundColor: THEME_COLORS.bgLight,
                  borderColor: THEME_COLORS.borderLight,
                  color: THEME_COLORS.textDark,
                }}
              >
                <option value="html">HTML</option>
                <option value="pdf">PDF</option>
              </select>
              <svg
                className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* Turmas associadas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
              Turmas associadas
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
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: THEME_COLORS.secondary }} />
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                        {school}
                      </span>
                    </div>

                    {schoolTurmas.map((turma) => {
                      const key = turmaKey(turma);
                      const isChecked = selectedKeys.includes(key);
                      return (
                        <label
                          key={key}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-black/[0.04]"
                          style={{ color: THEME_COLORS.textDark }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTurma(key)}
                            className="w-4 h-4 rounded text-orange-600 shrink-0"
                          />
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: turma.color ?? THEME_COLORS.secondary }} />
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

            {selectedKeys.length > 0 && (
              <p className="mt-1 text-[11px] font-bold" style={{ color: THEME_COLORS.secondary }}>
                {selectedKeys.length} {selectedKeys.length === 1 ? 'turma selecionada' : 'turmas selecionadas'}
              </p>
            )}
          </div>

          {/* Arquivo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
              Arquivo (opcional)
            </label>
            <label
              className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: THEME_COLORS.lightSecondary,
                borderColor: THEME_COLORS.lightSecondary,
                color: THEME_COLORS.secondary,
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
                  PDF, DOCX ou imagem
                </span>
              </span>
              <input type="file" className="hidden" onChange={handleFile} />
            </label>
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
              Criar Material
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};

export default CriarMaterialModal;