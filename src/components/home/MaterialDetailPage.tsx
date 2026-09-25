import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BookMarked,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Plus,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { MATERIAL_COLORS } from '../../data/mockData';
import { useBackendData } from '../../context/BackendDataContext';
import type { Material, MaterialType } from '../../types';
import * as api from '../../api/client';
import { parseHtmlPages } from '../../utils/htmlLayers';
import { displayFileTitle } from '../../utils/displayNames';
import { HtmlPreview } from '../general/HtmlPreview';
import { CriarMaterialModal } from '../criar/CriarMaterialModal';
import { ConfirmDeleteModal } from '../criar/ConfirmDeleteModal';

const TYPE_LABELS: Record<MaterialType, string> = {
  source: 'Fonte / Livro',
  slide: 'Slides / Apresentação',
  atv: 'Atividade',
};

interface MateriaisSidebarProps {
  materiais: Material[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

const MateriaisSidebar: React.FC<MateriaisSidebarProps> = ({
  materiais,
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
          Materiais
        </h2>
        <span className="text-xs font-bold text-stone-400">{materiais.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {materiais.map((m, idx) => {
          const isActive = m.id === activeId;
          const color = MATERIAL_COLORS[idx % MATERIAL_COLORS.length];
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
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
                className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor: isActive ? '#ffffff33' : color,
                }}
              >
              </span>

              <span className="min-w-0 flex-1">
                <span className={`block text-sm font-bold truncate ${isActive ? 'text-white' : ''}`}>
                  {displayFileTitle(m.title)}
                </span>
                <span
                  className={`block text-[11px] font-semibold truncate ${
                    isActive ? 'text-white/80' : 'text-stone-500'
                  }`}
                >
                  {m.qtd} {m.qtd === 1 ? 'turma' : 'turmas'} • {TYPE_LABELS[m.type]}
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
            <span className="block text-sm font-bold">Novo material</span>
            <span className="block text-[10px] font-medium opacity-70">
              Adicionar material
            </span>
          </span>
        </button>
      </div>
    </aside>
  );
};

export const MaterialDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { materiais, turmas, createMaterial, deleteMaterial } = useBackendData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [pdfPreviewHtml, setPdfPreviewHtml] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const material = useMemo(() => (id ? materiais.find((item) => item.id === id) : undefined), [id, materiais]);
  const turmasAssociadas = useMemo(() => material?.turmaIds ? turmas.filter((turma) => material.turmaIds?.includes(turma.id)) : [], [material, turmas]);
  const previewContent = material?.fileType === 'html' ? material.htmlContent : pdfPreviewHtml ?? '';
  const pages = useMemo(() => previewContent ? parseHtmlPages(previewContent) : [], [previewContent]);
  const safePageIndex = Math.min(pageIndex, Math.max(0, pages.length - 1));

  useEffect(() => {
    setPageIndex(0);
    setDownloadError(null);
  }, [material?.id]);

  useEffect(() => {
    let cancelled = false;
    setPdfPreviewHtml(null);
    setPreviewError(null);

    if (!material || material.fileType !== 'pdf') {
      setPreviewLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setPreviewLoading(true);
    void api.getMaterialPreviewHtml(material.id)
      .then((html) => {
        if (!cancelled) setPdfPreviewHtml(html);
      })
      .catch((cause) => {
        if (!cancelled) {
          setPreviewError(cause instanceof Error ? cause.message : 'Não foi possível carregar a prévia do PDF.');
        }
      })
      .finally(() => {
        if (!cancelled) setPreviewLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [material?.id, material?.fileType]);

  if (!material) {
    return (
      <div className="flex h-full min-h-0 w-full template-page-in">
        <MateriaisSidebar
          materiais={materiais}
          activeId={id ?? ''}
          onSelect={(mId) => navigate(`/home/materiais/${mId}`)}
          onCreate={() => setIsCreateOpen(true)}
        />

        <div className="flex-1 p-8 lg:px-20 lg:py-16 max-w-7xl mx-auto w-full min-w-0">
          <div className="p-12 text-center rounded-3xl mt-8 space-y-3">
            <BookMarked className="w-10 h-10 mx-auto text-stone-400" />
            <h4 className="font-bold text-sm text-stone-700">
              Material não encontrado
            </h4>
            <p className="text-xs text-stone-500">
              O material que você procura não existe ou foi removido.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isLandscape = material.orientation === 'H';

  const handleDownload = async (format: api.MaterialDownloadFormat) => {
    setDownloadError(null);
    try {
      await api.downloadMaterialFile(material.id, format);
    } catch (cause) {
      setDownloadError(cause instanceof Error ? cause.message : 'Não foi possível baixar o arquivo.');
    }
  };

  const downloadButton = (format: api.MaterialDownloadFormat, label: string) => (
    <button
      type="button"
      onClick={() => void handleDownload(format)}
      title={`Baixar como ${label}`}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer"
      style={{
        backgroundColor: THEME_COLORS.bgLight,
        borderColor: THEME_COLORS.borderLight,
        color: THEME_COLORS.textDark,
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full min-h-0 w-full template-page-in">
      <MateriaisSidebar
        materiais={materiais}
        activeId={material.id}
        onSelect={(mId) => navigate(`/home/materiais/${mId}`)}
        onCreate={() => setIsCreateOpen(true)}
      />

      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
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
                  {displayFileTitle(material.title)}
                </h1>


                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(true)}
                  aria-label="Excluir material"
                  title="Excluir material"
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

              {material.fileType === 'html' && (
                <>
                  {downloadButton('html', 'HTML')}
                  {downloadButton('pdf', 'PDF')}
                  {downloadButton('docx', 'DOCX')}
                </>
              )}

              {material.fileType === 'pdf' && downloadButton('pdf', 'PDF')}
              {material.fileType === 'docx' && downloadButton('docx', 'DOCX')}

              <span className="flex-1" />

            </div>

            {downloadError && (
              <p className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700">
                {downloadError}
              </p>
            )}

            {pages.length > 1 && (
              <div
                className="flex items-center justify-center border-b px-4 py-3"
                style={{ borderColor: THEME_COLORS.borderLight, backgroundColor: 'rgba(255,255,255,0.45)' }}
              >
                <div
                  className="inline-flex items-center gap-2 rounded-2xl border bg-white p-1 shadow-sm"
                  style={{ borderColor: THEME_COLORS.borderLight }}
                >
                <button
                  type="button"
                  onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
                  disabled={safePageIndex === 0}
                  className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-all hover:bg-violet-50 hover:text-violet-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
                  style={{ color: THEME_COLORS.textDark }}
                  aria-label="Página anterior"
                  title="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                </button>
                <span className="min-w-[118px] px-2 text-center text-xs font-bold text-stone-600">
                  Página <span className="text-violet-700">{safePageIndex + 1}</span>
                  <span className="mx-1 text-stone-300">/</span>
                  {pages.length}
                </span>
                <button
                  type="button"
                  onClick={() => setPageIndex((current) => Math.min(pages.length - 1, current + 1))}
                  disabled={safePageIndex === pages.length - 1}
                  className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-all hover:bg-violet-50 hover:text-violet-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
                  style={{ color: THEME_COLORS.textDark }}
                  aria-label="Próxima página"
                  title="Próxima página"
                >
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                </div>
              </div>
            )}

            {/* Prévia */}
            <div className="overflow-auto bg-stone-100 p-6 md:p-10 flex justify-center">
              {previewContent ? (
                <div className="shadow-xl shrink-0" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                  <HtmlPreview
                    html={previewContent}
                    width={isLandscape ? 960 : 794}
                    height={isLandscape ? 540 : 1123}
                    pageIndex={safePageIndex}
                  />
                </div>
              ) : (
                <div
                  className="w-[794px] max-w-full shrink-0 flex flex-col items-center justify-center rounded-lg bg-white py-16 px-10 text-center"
                  style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                >
                  <span
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: THEME_COLORS.lightPrimary, color: THEME_COLORS.primary }}
                  >
                    <FileText className="w-10 h-10" />
                  </span>
                  <h4 className="text-base font-bold" style={{ color: THEME_COLORS.textDark }}>
                    Arquivo {material.fileType.toUpperCase()}
                  </h4>
                  <p className="mt-1 text-xs font-semibold text-stone-500 max-w-sm">
                    {previewLoading
                      ? 'Carregando a prévia do arquivo...'
                      : previewError || 'A prévia deste formato não está disponível. Use o botão de download para abrir o arquivo.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isCreateOpen && (
        <CriarMaterialModal
          turmas={turmas}
          onClose={() => setIsCreateOpen(false)}
          onCreated={(newMaterial) => {
            void createMaterial(newMaterial).then((saved) => navigate(`/home/materiais/${saved.id}`)).catch((error) => console.error(error));
          }}
        />
      )}


      {isDeleteOpen && (
        <ConfirmDeleteModal
          title="Excluir material?"
          message={`Tem certeza que deseja excluir "${material.title}"? Esta ação não pode ser desfeita.`}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            void deleteMaterial(material.id).then(() => navigate('/home/materiais')).catch((error) => console.error(error));
          }}
        />
      )}
    </div>
  );
};

export default MaterialDetailPage;
