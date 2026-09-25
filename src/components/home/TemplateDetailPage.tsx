import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Download,
  File,
  Pencil,
  PencilRuler,
  Plus,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { downloadTemplateFile } from '../../api/client';
import { useBackendData } from '../../context/BackendDataContext';
import type { Template } from '../../types';
import { HtmlPreview } from '../general/HtmlPreview';
import { CriarTemplateModal } from '../criar/CriarTemplateModal';
import { EditarTemplateModal } from '../criar/EditarTemplateModal';
import { ConfirmDeleteModal } from '../criar/ConfirmDeleteModal';
import { displayFileTitle } from '../../utils/displayNames';

const TEMPLATE_COLORS = [
  '#7C3AED',
  '#9333EA',
  '#AEF03D',
  '#FFB800',
  '#EC4899',
  '#22C55E',
  '#3B82F6',
  '#F43F5E',
];

interface TemplatesSidebarProps {
  templates: Template[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

const TemplatesSidebar: React.FC<TemplatesSidebarProps> = ({
  templates,
  activeId,
  onSelect,
  onCreate,
}) => {
  return (
    <aside
      className="w-72 shrink-0 flex flex-col border-r h-full overflow-hidden bg-white/60"
      style={{ borderColor: THEME_COLORS.borderLight }}
    >
      <div className="p-5 pb-3 flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight" style={{ color: THEME_COLORS.textDark }}>
          Templates
        </h2>
        <span className="text-xs font-bold text-stone-400">{templates.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {templates.map((t, idx) => {
          const isActive = t.id === activeId;
          const color = TEMPLATE_COLORS[idx % TEMPLATE_COLORS.length];
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`platform-sidebar-button w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#7C3AED] text-white shadow-sm'
                  : 'bg-white/60 hover:scale-[1.01]'
              }`}
              style={{
                borderColor: isActive ? '#7C3AED' : THEME_COLORS.borderLight,
              }}
            >
              <span
                className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-xs font-black text-white"
                style={{
                  backgroundColor: isActive ? '#ffffff33' : color,
                  color: isActive ? '#fff' : '#fff',
                }}
              >
              </span>

              <span className="min-w-0 flex-1">
                <span className={`block text-sm font-bold truncate ${isActive ? 'text-white' : ''}`}>
                  {displayFileTitle(t.title)}
                </span>
                <span
                  className={`block text-[11px] font-semibold truncate ${
                    isActive ? 'text-white/80' : 'text-stone-500'
                  }`}
                >
                  {t.qtd} {t.qtd === 1 ? 'turma' : 'turmas'}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t" style={{ borderColor: THEME_COLORS.borderLight }}>
        <button
          type="button"
          onClick={onCreate}
          className="platform-sidebar-button w-full flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.01] cursor-pointer"
          style={{
            backgroundColor: THEME_COLORS.lightPrimary,
            borderColor: THEME_COLORS.lightPrimary,
            color: THEME_COLORS.primary,
          }}
        >
          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/60">
            <Plus className="w-4 h-4" />
          </span>
          <span className="text-left">
            <span className="block text-sm font-bold">Novo template</span>
            <span className="block text-[10px] font-medium opacity-70">
              Adicionar template
            </span>
          </span>
        </button>
      </div>
    </aside>
  );
};

export const TemplateDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { templates, turmas, createTemplate, updateTemplate, deleteTemplate } = useBackendData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'html' | 'pdf' | 'docx' | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const template = useMemo(() => (id ? templates.find((item) => item.id === id) : undefined), [id, templates]);
  const turmasAssociadas = useMemo(() => template?.turmaIds ? turmas.filter((turma) => template.turmaIds?.includes(turma.id)) : [], [template, turmas]);

  const handleDownload = async (format: 'html' | 'pdf' | 'docx') => {
    if (!template || downloadingFormat) return;
    setDownloadingFormat(format);
    setDownloadError(null);
    try {
      await downloadTemplateFile(template.id, format);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : 'Não foi possível baixar o arquivo.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  if (!template) {
    return (
      <div className="flex h-full min-h-0 w-full template-page-in">
        <TemplatesSidebar
          templates={templates}
          activeId={id ?? ''}
          onSelect={(tId) => navigate(`/home/templates/${tId}`)}
          onCreate={() => setIsCreateOpen(true)}
        />

        <div className="flex-1 p-8 lg:px-20 lg:py-16 max-w-7xl mx-auto w-full min-w-0">
          <div className="p-12 text-center rounded-3xl mt-8 space-y-3">
            <File className="w-10 h-10 mx-auto text-stone-400" />
            <h4 className="font-bold text-sm text-stone-700">
              Template não encontrado
            </h4>
            <p className="text-xs text-stone-500">
              O template que você procura não existe ou foi removido.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full template-page-in">
      <TemplatesSidebar
        templates={templates}
        activeId={template.id}
        onSelect={(tId) => navigate(`/home/templates/${tId}`)}
        onCreate={() => setIsCreateOpen(true)}
      />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div
          className="relative w-full shrink-0"
          style={{ borderColor: THEME_COLORS.borderLight }}
        >
          <div className="w-full p-8 lg:px-20 pb-6 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  className="text-3xl xl:text-4xl font-black pt-6 tracking-tight"
                  style={{ color: THEME_COLORS.textDark }}
                >
                  {displayFileTitle(template.title)}
                </h1>

                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  aria-label="Editar template"
                  title="Editar template"
                  className="p-2.5 rounded-xl transition-all hover:scale-105 cursor-pointer border"
                  style={{
                    backgroundColor: THEME_COLORS.bgLight,
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.primary,
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(true)}
                  aria-label="Excluir template"
                  title="Excluir template"
                  className="p-2.5 rounded-xl transition-all hover:scale-105 cursor-pointer border"
                  style={{
                    backgroundColor: THEME_COLORS.bgLight,
                    borderColor: THEME_COLORS.borderLight,
                    color: '#dc2626',
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Turmas associadas */}
              {turmasAssociadas.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {turmasAssociadas.map((turma) => (
                    <span
                      key={turma.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: `${turma.color ?? THEME_COLORS.primary}1a`,
                        color: turma.color ?? THEME_COLORS.primary,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: turma.color ?? THEME_COLORS.primary }}
                      />
                      {turma.series} {turma.idSeries} · {turma.school}
                    </span>
                  ))}
                </div>
              )}

              {turmasAssociadas.length === 0 && (
                <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-stone-400">
                  <UsersRound className="w-3.5 h-3.5" />
                  Nenhuma turma associada
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VISUALIZAÇÃO + DOWNLOADS */}
        {/* ========================================================= */}

        <div className="px-8 lg:px-20 w-full mb-12">
          <div className="rounded-2xl shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div
              className="px-4 py-3 flex flex-wrap items-center gap-2 border-b"
              style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: THEME_COLORS.bgLight }}
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-stone-500 pr-1">
                <Download className="w-4 h-4" />
                Baixar
              </span>

              <button
                type="button"
                onClick={() => void handleDownload('html')}
                title="Baixar como HTML"
                disabled={Boolean(downloadingFormat)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                style={{
                  backgroundColor: THEME_COLORS.bgLight,
                  borderColor: THEME_COLORS.borderLight,
                  color: THEME_COLORS.textDark,
                }}
              >
                HTML
              </button>

              <button
                type="button"
                onClick={() => void handleDownload('pdf')}
                title="Baixar como PDF"
                disabled={Boolean(downloadingFormat)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                style={{
                  backgroundColor: THEME_COLORS.bgLight,
                  borderColor: THEME_COLORS.borderLight,
                  color: THEME_COLORS.textDark,
                }}
              >
                PDF
              </button>

              <button
                type="button"
                onClick={() => void handleDownload('docx')}
                title="Baixar como DOCX"
                disabled={Boolean(downloadingFormat)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                style={{
                  backgroundColor: THEME_COLORS.bgLight,
                  borderColor: THEME_COLORS.borderLight,
                  color: THEME_COLORS.textDark,
                }}
              >
                DOCX
              </button>

              {downloadError && (
                <span className="basis-full text-xs font-semibold text-red-600" role="alert">
                  {downloadError}
                </span>
              )}

              <span className="flex-1" />

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/home/editor/material?templateId=${encodeURIComponent(template.id)}&title=${encodeURIComponent(template.title)}`
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all hover:scale-105 cursor-pointer"
                style={{ backgroundColor: THEME_COLORS.secondary }}
              >
                <PencilRuler className="w-4 h-4" />
                Editar template
              </button>
            </div>

            {/* Prévia do HTML */}
            <div className="overflow-hidden bg-stone-100 p-6 md:p-10 flex justify-center">
              <div className="shadow-xl shrink-0" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <HtmlPreview
                  html={template.htmlContent}
                  width={794}
                  height="min(760px, calc(100vh - 20rem))"
                  interactive
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCreateOpen && (
        <CriarTemplateModal
          turmas={turmas}
          onClose={() => setIsCreateOpen(false)}
          onCreated={(newTemplate) =>
            createTemplate(newTemplate).then((saved) => navigate(`/home/templates/${saved.id}`))
          }
        />
      )}

      {isEditOpen && (
        <EditarTemplateModal
          template={template}
          turmas={turmas}
          onClose={() => setIsEditOpen(false)}
          onUpdated={(updated) => {
            void updateTemplate(updated).catch((error) => console.error(error));
          }}
        />
      )}

      {isDeleteOpen && (
        <ConfirmDeleteModal
          title="Excluir template?"
          message={`Tem certeza que deseja excluir "${template.title}"? Esta ação não pode ser desfeita.`}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            void deleteTemplate(template.id).then(() => navigate('/home/templates')).catch((error) => console.error(error));
          }}
        />
      )}
    </div>
  );
};

export default TemplateDetailPage;
