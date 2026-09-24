import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  LayoutTemplate,
  Upload,
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import type { Turma, Template } from '../../types';
import { buildTemplateHtml } from '../../data/mockData';
import { BaseModal } from './BaseModal';

interface CriarTemplateModalProps {
  turmas: Turma[];
  onClose: () => void;
  onCreated: (template: Template) => void;
}

const inputClassName =
  'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10';
const textareaClassName =
  'w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10 resize-none';

export const CriarTemplateModal: React.FC<CriarTemplateModalProps> = ({
  turmas,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [saved, setSaved] = useState(false);

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
    setFileContent('');
    if (file) {
      setDescription('');
      const selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => setFileContent(String(reader.result || ''));
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaved(true);

    timerRef.current = setTimeout(() => {
      onCreated({
        id: crypto.randomUUID(),
        title: fileName || name.trim(),
        description: description.trim() || undefined,
        qtd: selectedIds.length,
        htmlContent: buildTemplateHtml(name.trim()),
        fileName: fileName || undefined,
        fileContent: fileContent || undefined,
        turmaIds: selectedIds,
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
            {name}
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
              Nome do Template
            </label>
            <div className="relative">
              <LayoutTemplate className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Plano de Aula Padrão - Escola XYZ"
                className={inputClassName}
                style={{
                  backgroundColor: THEME_COLORS.bgLight,
                  borderColor: THEME_COLORS.borderLight,
                  color: THEME_COLORS.textDark,
                }}
              />
            </div>
          </div>

          {/* Geração do template: descrição OU arquivo */}
          <div className="rounded-2xl space-y-4" style={{ borderColor: THEME_COLORS.borderLight }}>
            <div>
              <h3 className="text-sm font-black tracking-tight" style={{ color: THEME_COLORS.textDark }}>
                Como você quer gerar o template?
              </h3>
              <p className="mt-1 text-[11px] font-semibold text-stone-500">
                Escolha uma das duas opções: descreva o template abaixo{' '}
                <span className="font-black">ou</span> anexe um arquivo.
              </p>
            </div>

            <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Opção 1: descrição */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
                  Descrição do template
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (e.target.value.trim()) setFileName('');
                  }}
                  rows={5}
                  disabled={!!fileName}
                  placeholder="Descreva como você imagina o layout do seu template, que seções são necessárias..."
                  className={`${textareaClassName} disabled:opacity-50 ${fileName ? 'cursor-not-allowed' : ''}`}
                  style={{
                    backgroundColor: THEME_COLORS.bgLight,
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark,
                  }}
                />
              </div>

              {/* Opção 2: arquivo */}
              <div className="flex flex-col h-full">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
                  Arquivo da estrutura
                </label>
                <div className="flex-1 flex flex-col">
                  <label
                    className={`flex-1 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                      description.trim() ? 'opacity-50 pointer-events-none' : ''
                    }`}
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
                        DOCX, PDF ou texto
                      </span>
                    </span>
                    <input type="file" className="hidden" onChange={handleFile} />
                  </label>
                  {fileName && (
                    <button
                      type="button"
                      onClick={() => { setFileName(''); setFileContent(''); }}
                      className="mt-1 text-[10px] font-bold text-stone-500 hover:text-red-600 text-left cursor-pointer"
                    >
                      Remover arquivo
                    </button>
                  )}
                </div>
              </div>
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
            >
              Criar Template
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};

export default CriarTemplateModal;