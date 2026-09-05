import React, { useEffect, useRef, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Hash,
  ImagePlus,
  Layers,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { MOCK_TEACHER_PROFILE } from '../../data/mockData';
import type { Turma } from '../../types';
import { BaseModal } from './BaseModal';

interface EditarTurmaModalProps {
  turma: Turma;
  onClose: () => void;
  onUpdated: (turma: Turma) => void;
}

const SERIES = [
  '6º Ano',
  '7º Ano',
  '8º Ano',
  '9º Ano',
  '1º Ano EM',
  '2º Ano EM',
  '3º Ano EM',
];

const TURMA_COLORS = [
  '#7C3AED',
  '#9333EA',
  '#00B8A9',
  '#FFB800',
  '#EC4899',
  '#22C55E',
  '#3B82F6',
  '#F43F5E',
];

const inputClassName =
  'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10';

export const EditarTurmaModal: React.FC<EditarTurmaModalProps> = ({
  turma,
  onClose,
  onUpdated,
}) => {
  const [school, setSchool] = useState(turma.school);
  const [series, setSeries] = useState(turma.series);
  const [idLabel, setIdLabel] = useState(turma.idSeries);
  const [students, setStudents] = useState(turma.qtd);
  const [disciplina, setDisciplina] = useState(turma.disciplina ?? '');
  const [color, setColor] = useState(turma.color ?? TURMA_COLORS[0]);
  const [image, setImage] = useState(turma.image ?? '');
  const [saved, setSaved] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!school.trim() || !series.trim() || !disciplina.trim()) return;

    setSaved(true);

    timerRef.current = setTimeout(() => {
      onUpdated({
        ...turma,
        school,
        series,
        idSeries: idLabel.trim() || 'A',
        qtd: Math.max(0, Number(students) || 0),
        disciplina: disciplina.trim(),
        color,
        image: image || undefined,
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
            Turma atualizada com sucesso!
          </h3>

          <p className="text-xs font-semibold text-stone-500">
            {series} - {disciplina} — {school}
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
              Editar Turma
            </h2>

            <p className="mt-1 text-xs font-semibold text-stone-500">
              Atualize as informações da turma para
              mantê-las sempre organizadas
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
              Instituição de Ensino
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className={`${inputClassName} appearance-none pr-9 cursor-pointer`}
                style={{
                  backgroundColor: THEME_COLORS.bgLight,
                  borderColor: THEME_COLORS.borderLight,
                  color: THEME_COLORS.textDark,
                }}
              >
                {MOCK_TEACHER_PROFILE.schools.length === 0 && (
                  <option value="">Nenhuma instituição cadastrada</option>
                )}
                {MOCK_TEACHER_PROFILE.schools.map((s) => (
                  <option key={s} value={s}>
                    {s}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
                Série
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <select
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  className={`${inputClassName} appearance-none pr-9 cursor-pointer`}
                  style={{
                    backgroundColor: THEME_COLORS.bgLight,
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark,
                  }}
                >
                  {SERIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
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
                Identificador
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={idLabel}
                  maxLength={4}
                  onChange={(e) => setIdLabel(e.target.value)}
                  placeholder="Ex: A"
                  className={inputClassName}
                  style={{
                    backgroundColor: THEME_COLORS.bgLight,
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
                Qtd. de Alunos
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  min={0}
                  value={students}
                  onChange={(e) => setStudents(Number(e.target.value))}
                  className={inputClassName}
                  style={{
                    backgroundColor: THEME_COLORS.bgLight,
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark,
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
                Disciplina
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={disciplina}
                  maxLength={40}
                  onChange={(e) => setDisciplina(e.target.value)}
                  placeholder="Ex: Português"
                  className={inputClassName}
                  style={{
                    backgroundColor: THEME_COLORS.bgLight,
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Cor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
              Cor da turma
            </label>
            <div className="flex flex-wrap gap-2.5">
              {TURMA_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Cor ${c}`}
                  className={`w-8 h-8 rounded-full transition-all cursor-pointer ${
                    color === c
                      ? 'scale-110 ring-2 ring-offset-2'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: c,
                    boxShadow:
                      color === c ? `0 0 0 1px ${c}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
              Imagem (opcional)
            </label>

            {image ? (
              <div className="relative w-full h-32 rounded-2xl overflow-hidden border" style={{ borderColor: THEME_COLORS.borderLight }}>
                <img src={image} alt="Prévia" className="w-full h-full object-cover" />
                <span
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-white/80 shadow-sm"
                  style={{ color: THEME_COLORS.primary }}
                >
                  <ImagePlus className="w-4 h-4" />
                </span>
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <label
                    className="p-2 rounded-full bg-white/80 shadow-sm cursor-pointer hover:scale-105 transition-all"
                    style={{ color: THEME_COLORS.primary }}
                  >
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                  </label>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    aria-label="Remover imagem"
                    className="p-2 rounded-full bg-white/80 shadow-sm cursor-pointer hover:scale-105 transition-all text-stone-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label
                className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: THEME_COLORS.lightPrimary,
                  borderColor: THEME_COLORS.lightPrimary,
                  color: THEME_COLORS.primary,
                }}
              >
                <span className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/60">
                  <ImagePlus className="w-5 h-5" />
                </span>
                <span className="text-left min-w-0">
                  <span className="block text-sm font-bold">Enviar imagem</span>
                  <span className="block text-[10px] font-medium opacity-70">
                    PNG, JPG ou GIF
                  </span>
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
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
              Salvar Alterações
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};

export default EditarTurmaModal;
