import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BookMarked,
  Download,
  FileText,
  Pencil,
  PencilRuler,
  Plus,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import {
  getAllMateriais,
  addMaterial,
  updateMaterial,
  removeMaterial,
  getMaterialById,
  getTurmasByMaterialId,
  MOCK_TURMAS,
  MATERIAL_COLORS,
} from '../../data/mockData';
import type { Material, MaterialType } from '../../types';
import { downloadMaterialHtml } from '../../utils/downloadMaterial';
import { HtmlPreview } from '../general/HtmlPreview';
import { CriarMaterialModal } from '../criar/CriarMaterialModal';
import { EditarMaterialModal } from '../criar/EditarMaterialModal';
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
      className="w-72 shrink-0 flex flex-col border-r sticky top-0 h-screen overflow-hidden bg-white/60"
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
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
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
                  {m.title}
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
          className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.01] cursor-pointer"
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

  const [version, setVersion] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const materiais = useMemo(() => getAllMateriais(), [version]);

  const material = useMemo(
    () => (id ? getMaterialById(id) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, version]
  );

  const turmasAssociadas = useMemo(
    () => (id ? getTurmasByMaterialId(id) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, version]
  );

  if (!material) {
    return (
      <div className="flex min-h-screen w-full template-page-in">
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

  return (
    <div className="flex min-h-screen w-full template-page-in">
      <MateriaisSidebar
        materiais={materiais}
        activeId={material.id}
        onSelect={(mId) => navigate(`/home/materiais/${mId}`)}
        onCreate={() => setIsCreateOpen(true)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
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
                  {material.title}
                </h1>

                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  aria-label="Editar material"
                  title="Editar material"
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
                  <button
                    type="button"
                    onClick={() => downloadMaterialHtml(material)}
                    title="Baixar como HTML"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer"
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
                    title="Baixar como PDF"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer"
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
                    title="Baixar como DOCX"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer"
                    style={{
                      backgroundColor: THEME_COLORS.bgLight,
                      borderColor: THEME_COLORS.borderLight,
                      color: THEME_COLORS.textDark,
                    }}
                  >
                    DOCX
                  </button>

                  {material.type === 'slide' && (
                    <button
                      type="button"
                      title="Baixar como PPTX"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer"
                      style={{
                        backgroundColor: THEME_COLORS.bgLight,
                        borderColor: THEME_COLORS.borderLight,
                        color: THEME_COLORS.textDark,
                      }}
                    >
                      PPTX
                    </button>
                  )}
                </>
              )}

              {material.fileType === 'pdf' && (
                <button
                  type="button"
                  title="Baixar como PDF"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: THEME_COLORS.bgLight,
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark,
                  }}
                >
                  PDF
                </button>
              )}

              <span className="flex-1" />

              <button
                type="button"
                onClick={() =>
                  navigate(`/home/editor?start=editor&title=${encodeURIComponent(material.title)}`)
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all hover:scale-105 cursor-pointer"
                style={{ backgroundColor: THEME_COLORS.secondary }}
              >
                <PencilRuler className="w-4 h-4" />
                Editar material
              </button>
            </div>

            {/* Prévia */}
            <div className="overflow-auto bg-stone-100 p-6 md:p-10 flex justify-center">
              {material.fileType === 'html' ? (
                <div className="shadow-xl shrink-0" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                  <HtmlPreview
                    html={material.htmlContent}
                    width={isLandscape ? 960 : 794}
                    height={isLandscape ? 540 : 1123}
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
                    Arquivo PDF
                  </h4>
                  <p className="mt-1 text-xs font-semibold text-stone-500 max-w-sm">
                    A visualização do PDF estará disponível quando o arquivo estiver
                    vinculado a este material.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isCreateOpen && (
        <CriarMaterialModal
          turmas={MOCK_TURMAS}
          onClose={() => setIsCreateOpen(false)}
          onCreated={(newMaterial) => {
            addMaterial(newMaterial);
            setVersion((v) => v + 1);
            navigate(`/home/materiais/${newMaterial.id}`);
          }}
        />
      )}

      {isEditOpen && (
        <EditarMaterialModal
          material={material}
          onClose={() => setIsEditOpen(false)}
          onUpdated={(updated) => {
            updateMaterial(updated);
            setVersion((v) => v + 1);
          }}
        />
      )}

      {isDeleteOpen && (
        <ConfirmDeleteModal
          title="Excluir material?"
          message={`Tem certeza que deseja excluir "${material.title}"? Esta ação não pode ser desfeita.`}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            removeMaterial(material.id);
            navigate('/home/materiais');
          }}
        />
      )}
    </div>
  );
};

export default MaterialDetailPage;
