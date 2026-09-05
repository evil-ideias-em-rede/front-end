import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowDownAZ,
  File,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import {
  getTurmaById,
  getAllTurmas,
  getMateriaisByTurmaId,
  updateTurma,
  addTurma,
  removeTurma,
} from '../../data/mockData';
import type { Turma, ContentStatus } from '../../types';
import { HtmlPreview } from '../general/HtmlPreview';
import { EditarTurmaModal } from '../criar/EditarTurmaModal';
import { CriarTurmaModal } from '../criar/CriarTurmaModal';
import { ConfirmDeleteModal } from '../criar/ConfirmDeleteModal';

type ContentFilter = 'all' | 'plano' | 'atividade' | 'material';

type StatusFilter = 'all' | ContentStatus;

type SortDirection = 'asc' | 'desc';

const STATUS_COLORS: Record<ContentStatus, string> = {
  'Criando': '#FFB800',
  'Pronto para usar': '#00B8A9',
};

const CONTENT_TYPE_LABEL: Record<ContentFilter, string> = {
  all: 'Todos',
  plano: 'Plano de Aula',
  atividade: 'Atividade',
  material: 'Material',
};

export const TurmaDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [filter, setFilter] = useState<ContentFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [version, setVersion] = useState(0);

  const turmasList = useMemo(
    () => getAllTurmas(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version]
  );

  const turma = useMemo(
    () => (id ? getTurmaById(id) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, version]
  );

  const materiais = useMemo(() => (id ? getMateriaisByTurmaId(id) : []), [id]);

  const allContent = useMemo(() => {
    const items: Array<{
      key: string;
      title: string;
      type: ContentFilter;
      subtitle: string;
      color: string;
      status: ContentStatus;
      htmlContent: string;
      orientation: 'V' | 'H';
    }> = [];

    materiais.forEach((m) =>
      items.push({
        key: m.id,
        title: m.title,
        type: m.category,
        subtitle: CONTENT_TYPE_LABEL[m.category],
        color: STATUS_COLORS[m.status],
        status: m.status,
        htmlContent: m.htmlContent,
        orientation: m.orientation,
      })
    );

    return items;
  }, [materiais]);

  const filteredContent = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return [...allContent]
      .filter((item) => (filter === 'all' ? true : item.type === filter))
      .filter((item) =>
        statusFilter === 'all' ? true : item.status === statusFilter
      )
      .filter((item) =>
        normalizedSearch
          ? item.title.toLowerCase().includes(normalizedSearch)
          : true
      )
      .sort((a, b) => {
        const comparison = a.title.localeCompare(b.title, 'pt-BR', {
          sensitivity: 'base',
        });
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [allContent, filter, statusFilter, search, sortDirection]);

  const hasActiveFilters =
    filter !== 'all' || statusFilter !== 'all' || search.trim() !== '';

  const clearFilters = () => {
    setFilter('all');
    setStatusFilter('all');
    setSearch('');
  };

  const handleSort = () => {
    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
  };

  if (!turma) {
    return (
      <div className="flex min-h-screen w-full template-page-in">
        <TurmasSidebar
          turmas={turmasList}
          activeId={id ?? ''}
          onSelect={(turmaId) => navigate(`/home/turmas/${turmaId}`)}
          onCreate={() => setIsCreateOpen(true)}
        />

        <div className="flex-1 p-8 lg:px-20 lg:py-16 max-w-7xl mx-auto w-full min-w-0">
          <div className="p-12 text-center rounded-3xl mt-8 space-y-3">
            <File className="w-10 h-10 mx-auto text-stone-400" />
            <h4 className="font-bold text-sm text-stone-700">
              Turma não encontrada
            </h4>
            <p className="text-xs text-stone-500">
              A turma que você procura não existe ou foi removida.
            </p>
          </div>
        </div>

        {isCreateOpen && (
          <CriarTurmaModal
            onClose={() => setIsCreateOpen(false)}
            onCreated={(novaTurma) => {
              addTurma(novaTurma);
              setVersion((v) => v + 1);
              navigate(`/home/turmas/${novaTurma.id}`);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full template-page-in">
      <TurmasSidebar
        turmas={turmasList}
        activeId={turma.id}
        onSelect={(turmaId) => navigate(`/home/turmas/${turmaId}`)}
        onCreate={() => setIsCreateOpen(true)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* ========================================================= */}
        {/* BANNER HEADER: imagem/cor full-width */}
        {/* ========================================================= */}

        <div
          className="relative w-full h-56 sm:h-64 lg:h-72 flex items-end overflow-hidden shrink-0"
          style={{ backgroundColor: turma.color ?? 'rgba(226, 221, 240, 0.4)' }}
        >
          {turma.image && (
            <img
              src={turma.image}
              alt={`${turma.series} ${turma.idSeries}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0" />

          <div className="relative w-full p-8 lg:px-20 pb-6 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                  {turma.series} - {turma.disciplina}
                </h1>

                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  aria-label="Editar turma"
                  title="Editar turma"
                  className="p-2.5 rounded-xl bg-white/20 border border-white/40 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30 cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(true)}
                  aria-label="Excluir turma"
                  title="Excluir turma"
                  className="p-2.5 rounded-xl bg-white/20 border border-white/40 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="mt-1 text-sm font-semibold text-white/90 drop-shadow-sm">
                {turma.school}
              </p>
            </div>

            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white text-stone-700 shadow-sm"
            >
              <UsersRound className="w-4 h-4" style={{ color: turma.color }} />
              {turma.qtd} {turma.qtd === 1 ? 'aluno' : 'alunos'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CONTEÚDO */}
        {/* ========================================================= */}

        <div className="p-8 lg:px-20 lg:py-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* FILTER + SEARCH + SORT */}
          <div className="space-y-4">
            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar conteúdo por nome..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl border bg-white/60 text-sm font-semibold outline-none transition-all focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10"
                  style={{
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleSort}
                className="h-10 inline-flex items-center justify-center gap-2 px-4 rounded-xl border bg-white/60 text-xs font-bold text-stone-600 transition-all cursor-pointer hover:-translate-y-0.5 hover:border-[#7C3AED]"
                style={{ borderColor: THEME_COLORS.borderLight }}
              >
                <ArrowDownAZ className="w-4 h-4" />
                <span>{sortDirection === 'asc' ? 'A–Z' : 'Z–A'}</span>
              </button>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Label */}
              <div className="flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-xs font-bold text-stone-500">Filtrar:</span>
              </div>

              {/* Tipo */}
              <div className="flex items-center gap-1">
                {[
                  { value: 'all' as ContentFilter, label: 'Todos' },
                  { value: 'plano' as ContentFilter, label: 'Planos de Aula' },
                  { value: 'atividade' as ContentFilter, label: 'Atividades' },
                  { value: 'material' as ContentFilter, label: 'Materiais' },
                ].map((option) => {
                  const active = filter === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilter(option.value)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        active
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                          : 'bg-white/60 text-stone-600 hover:border-[#7C3AED]'
                      }`}
                      style={
                        active
                          ? undefined
                          : { borderColor: THEME_COLORS.borderLight }
                      }
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* Separador */}
              <div className="h-5 w-px bg-stone-200 mx-1" />

              {/* Status */}
              <div className="flex items-center gap-1">
                {[
                  { value: 'all' as StatusFilter, label: 'Todos' },
                  { value: 'Criando' as StatusFilter, label: 'Criando' },
                  { value: 'Pronto para usar' as StatusFilter, label: 'Pronto para usar' },
                ].map((option) => {
                  const active = statusFilter === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStatusFilter(option.value)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        active
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                          : 'bg-white/60 text-stone-600 hover:border-[#7C3AED]'
                      }`}
                      style={
                        active
                          ? undefined
                          : { borderColor: THEME_COLORS.borderLight }
                      }
                    >
                      {option.value !== 'all' && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: STATUS_COLORS[option.value as ContentStatus],
                          }}
                        />
                      )}
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* Limpar filtros */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-stone-400 hover:text-[#7C3AED] transition-all cursor-pointer"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* RESULT COUNT */}
          {hasActiveFilters && (
            <p className="text-xs font-semibold text-stone-500">
              {filteredContent.length}{' '}
              {filteredContent.length === 1 ? 'item encontrado' : 'itens encontrados'}
            </p>
          )}

          {/* CONTENT GRID / EMPTY */}
          {filteredContent.length === 0 ? (
            <div className="p-12 text-center rounded-3xl">
              <Search className="w-10 h-10 mx-auto text-stone-400 mb-3" />
              <h4 className="font-bold text-sm text-stone-700">
                Nenhum conteúdo encontrado
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Tente alterar o termo da pesquisa ou o filtro selecionado.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: THEME_COLORS.primary }}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 [grid-auto-flow:dense]">
              {filteredContent.map((item, idx) => (
                <div
                  key={item.key}
                  onClick={() => navigate(`/home/materiais/${item.key}`)}
                  className={`template-card-in cursor-pointer transition-all hover:scale-105 rounded-2xl border shadow-sm flex flex-col overflow-hidden ${
                    item.orientation === 'H' ? 'col-span-2' : 'col-span-1'
                  }`}
                  style={{
                    backgroundColor: '#ffffff60',
                    borderColor: THEME_COLORS.borderLight,
                    animationDelay: `${300 + idx * 80}ms`,
                  }}
                >
                  {/* Thumbnail do conteúdo */}
                  <div
                    className="h-36 relative overflow-hidden shrink-0"
                    style={{ backgroundColor: 'rgba(226, 221, 240, 0.4)' }}
                  >
                    <HtmlPreview
                      html={item.htmlContent}
                      fit
                      refWidth={item.orientation === 'H' ? 1900 : 900}
                      refHeight={item.orientation === 'H' ? 900 : 1273}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1 space-y-4">
                    <h3 className="line-clamp-2 text-base font-bold">
                      {item.title}
                    </h3>

                    {/* Status */}
                    <span
                      className="inline-flex items-center self-start mt-auto px-4 py-1 rounded-full text-[10px] font-bold border"
                      style={{
                        backgroundColor:
                          item.status === 'Pronto para usar'
                            ? '#eaf5e1'
                            : '#f7f1e5',
                        borderColor:
                          item.status === 'Pronto para usar'
                            ? '#CCFBF1'
                            : '#FEF3C7',
                        color:
                          item.status === 'Pronto para usar'
                            ? '#009489'
                            : '#B45309',
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isEditOpen && turma && (
        <EditarTurmaModal
          turma={turma}
          onClose={() => setIsEditOpen(false)}
          onUpdated={(updated) => {
            updateTurma(updated);
            setVersion((v) => v + 1);
          }}
        />
      )}

      {isCreateOpen && (
        <CriarTurmaModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={(novaTurma) => {
            addTurma(novaTurma);
            setVersion((v) => v + 1);
            setIsCreateOpen(false);
          }}
        />
      )}

      {isDeleteOpen && turma && (
        <ConfirmDeleteModal
          title="Excluir turma?"
          message={`Tem certeza que deseja excluir a turma "${turma.series} - ${turma.disciplina}"? Esta ação não pode ser desfeita.`}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            removeTurma(turma.id);
            navigate('/home/turmas');
          }}
        />
      )}
    </div>
  );
};

interface TurmasSidebarProps {
  turmas: Turma[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

const TurmasSidebar: React.FC<TurmasSidebarProps> = ({
  turmas,
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
          Turmas
        </h2>
        <span className="text-xs font-bold text-stone-400">{turmas.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {turmas.map((t) => {
          const isActive = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
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
                  backgroundColor: isActive ? '#ffffff33' : (t.color ?? 'rgba(0,0,0,0.05)'),
                }}
              >
                {t.image ? (
                  <img src={t.image} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <></>
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className={`block text-sm font-bold truncate ${isActive ? 'text-white' : ''}`}>
                  {t.series} - {t.disciplina}
                </span>
                <span
                  className={`block text-[11px] font-semibold truncate ${
                    isActive ? 'text-white/80' : 'text-stone-500'
                  }`}
                >
                  {t.school}
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
            <span className="block text-sm font-bold">Nova turma</span>
            <span className="block text-[10px] font-medium opacity-70">
              Adicionar turma
            </span>
          </span>
        </button>
      </div>
    </aside>
  );
};

export default TurmaDetailPage;
