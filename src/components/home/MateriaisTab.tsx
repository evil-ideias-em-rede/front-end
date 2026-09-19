import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  File,
  Plus,
  Search,
  ArrowDownAZ,
  Clock,
  Filter,
} from 'lucide-react';

import { THEME_COLORS } from '../../constants/colors';
import { CriarMaterialModal } from '../criar/CriarMaterialModal';
import { HtmlPreview } from '../general/HtmlPreview';
import { useBackendData } from '../../context/BackendDataContext';

interface MateriaisTabProps {}

export const MateriaisTab: React.FC<MateriaisTabProps> = () => {
  const navigate = useNavigate();
  const { materiais, turmas, createMaterial } = useBackendData();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [search, setSearch] = useState('');

  const [sortOption, setSortOption] =
    useState<'recent' | 'alphabetical'>('recent');

  const [sortDirection, setSortDirection] =
    useState<'asc' | 'desc'>('desc');

  const [autoralFilter, setAutoralFilter] =
    useState<'all' | 'autoral' | 'nao-autoral'>('all');

  const [typeFilter, setTypeFilter] =
    useState<'all' | 'source' | 'slide' | 'atv'>('all');

  const handleRecentSort = () => {
    if (sortOption === 'recent') {
      setSortDirection((current) =>
        current === 'desc' ? 'asc' : 'desc'
      );
      return;
    }

    setSortOption('recent');
    setSortDirection('desc');
  };

  const handleAlphabeticalSort = () => {
    if (sortOption === 'alphabetical') {
      setSortDirection((current) =>
        current === 'asc' ? 'desc' : 'asc'
      );
      return;
    }

    setSortOption('alphabetical');
    setSortDirection('asc');
  };

  const filteredMateriais = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return [...materiais]
      // Pesquisa
      .filter((material) =>
        material.title
          .toLowerCase()
          .includes(normalizedSearch)
      )

      // Filtro autoral
      .filter((material) => {
        if (autoralFilter === 'autoral') {
          return material.autoral;
        }

        if (autoralFilter === 'nao-autoral') {
          return !material.autoral;
        }

        return true;
      })

      // Filtro por tipo
      .filter((material) => {
        if (typeFilter === 'all') {
          return true;
        }

        return material.type === typeFilter;
      })

      // Ordenação
      .sort((a, b) => {
        if (sortOption === 'recent') {
          const comparison =
            (b.lastModifiedAt ?? 0) -
            (a.lastModifiedAt ?? 0);
          return sortDirection === 'desc'
            ? comparison
            : -comparison;
        }

        const comparison = a.title.localeCompare(
          b.title,
          'pt-BR',
          {
            sensitivity: 'base',
          }
        );

        return sortDirection === 'asc'
          ? comparison
          : -comparison;
      });
  }, [
    materiais,
    search,
    autoralFilter,
    typeFilter,
    sortOption,
    sortDirection,
  ]);

  const hasActiveFilters =
    search.trim() !== '' ||
    autoralFilter !== 'all' ||
    typeFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setAutoralFilter('all');
    setTypeFilter('all');
  };

  return (
    <div
      className="
        mt-12
        p-8
        lg:px-20
        lg:py-6
        space-y-6
        max-w-7xl
        mx-auto
        w-full
        template-page-in
      "
    >
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <div
        className="border-b pb-4"
        style={{
          borderColor: THEME_COLORS.borderLight,
        }}
      >
        <h1
          className="
            text-4xl
            xl:text-5xl
            font-black
            tracking-tight
            template-page-in
          "
          style={{
            color: THEME_COLORS.textDark,
            animationDelay: '80ms',
          }}
        >
          <span className="text-outline-dark">
            Materiais
          </span>

          <span> Didáticos</span>
        </h1>

        <p
          className="
            mt-3
            text-sm
            font-semibold
            text-stone-500
            template-page-in
          "
          style={{
            animationDelay: '180ms',
          }}
        >
          Gerencie os materiais utilizados na elaboração
          das suas aulas.
        </p>
      </div>

      {/* ========================================================= */}
      {/* EMPTY STATE — NENHUM MATERIAL CADASTRADO */}
      {/* ========================================================= */}

      {materiais.length === 0 ? (
        <div
          className="
            p-12
            mb-8
            text-center
            rounded-3xl
            space-y-3
          "
        >
          <File className="w-10 h-10 mx-auto text-stone-400" />

          <h4 className="font-bold text-sm text-stone-700">
            Nenhum material cadastrado
          </h4>

          <p className="text-xs text-stone-500">
            Carregue um arquivo ou crie um novo material
            para começar.
          </p>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="
              mt-2
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              text-xs
              font-bold
              text-white
              transition-all
              hover:scale-105
              cursor-pointer
            "
            style={{
              backgroundColor: THEME_COLORS.primary,
            }}
          >
            <Plus className="w-4 h-4" />

            Adicionar material
          </button>
        </div>
      ) : (
        <>
          {/* ===================================================== */}
          {/* SEARCH + FILTERS */}
          {/* ===================================================== */}

          <div
            className="
              flex
              flex-col
              gap-3
              template-page-in
            "
            style={{
              animationDelay: '250ms',
            }}
          >
            {/* --------------------------------------------------- */}
            {/* SEARCH + SORT */}
            {/* --------------------------------------------------- */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-3
              "
            >
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    w-4
                    h-4
                    text-stone-400
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Pesquisar materiais..."
                  className="
                    w-full
                    h-10
                    pl-10
                    pr-4
                    rounded-xl
                    border
                    bg-white/60
                    text-sm
                    font-semibold
                    outline-none
                    transition-all
                    focus:border-[#7C3AED]
                    focus:ring-2
                    focus:ring-[#7C3AED]/10
                  "
                  style={{
                    borderColor:
                      THEME_COLORS.borderLight,
                    color:
                      THEME_COLORS.textDark,
                  }}
                />
              </div>

              {/* Ordenação por mais recente */}
              <button
                type="button"
                onClick={handleRecentSort}
                className={`
                  h-10
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  rounded-xl
                  border
                  text-xs
                  font-bold
                  transition-all
                  cursor-pointer
                  hover:-translate-y-0.5
                  ${
                    sortOption === 'recent'
                      ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                      : 'bg-white/60 text-stone-600 hover:border-[#7C3AED]'
                  }
                `}
                style={
                  sortOption === 'recent'
                    ? undefined
                    : {
                        borderColor:
                          THEME_COLORS.borderLight,
                      }
                }
              >
                <Clock className="w-4 h-4" />

                <span>Recentes</span>
              </button>

              {/* Ordenação alfabética */}
              <button
                type="button"
                onClick={handleAlphabeticalSort}
                className={`
                  h-10
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  rounded-xl
                  border
                  text-xs
                  font-bold
                  transition-all
                  cursor-pointer
                  hover:-translate-y-0.5
                  ${
                    sortOption === 'alphabetical'
                      ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                      : 'bg-white/60 text-stone-600 hover:border-[#7C3AED]'
                  }
                `}
                style={
                  sortOption === 'alphabetical'
                    ? undefined
                    : {
                        borderColor:
                          THEME_COLORS.borderLight,
                      }
                }
              >
                <ArrowDownAZ className="w-4 h-4" />

                <span>
                  {sortDirection === 'asc' ? 'A–Z' : 'Z–A'}
                </span>
              </button>
            </div>

            {/* --------------------------------------------------- */}
            {/* FILTERS */}
            {/* --------------------------------------------------- */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              {/* Label */}
              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  mr-1
                "
              >
                <Filter className="w-3.5 h-3.5 text-stone-400" />

                <span className="text-xs font-bold text-stone-500">
                  Filtrar:
                </span>
              </div>

              {/* ------------------------------------------------- */}
              {/* AUTORAL */}
              {/* ------------------------------------------------- */}

              <div className="flex items-center gap-1">
                {[
                  {
                    value: 'all',
                    label: 'Todos',
                  },
                  {
                    value: 'autoral',
                    label: 'Autorais',
                  },
                  {
                    value: 'nao-autoral',
                    label: 'Não autorais',
                  },
                ].map((option) => {
                  const active =
                    autoralFilter === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setAutoralFilter(
                          option.value as
                            | 'all'
                            | 'autoral'
                            | 'nao-autoral'
                        )
                      }
                      className={`
                        px-3
                        py-1.5
                        rounded-lg
                        text-[11px]
                        font-bold
                        border
                        transition-all
                        cursor-pointer
                        ${
                          active
                            ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                            : 'bg-white/60 text-stone-600 hover:border-[#7C3AED]'
                        }
                      `}
                      style={
                        active
                          ? undefined
                          : {
                              borderColor:
                                THEME_COLORS.borderLight,
                            }
                      }
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* Separador */}
              <div className="h-5 w-px bg-stone-200 mx-1" />

              {/* ------------------------------------------------- */}
              {/* TIPO */}
              {/* ------------------------------------------------- */}

              <div className="flex items-center gap-1">
                {[
                  {
                    value: 'all',
                    label: 'Todos',
                  },
                  {
                    value: 'source',
                    label: 'Fontes',
                  },
                  {
                    value: 'slide',
                    label: 'Slides',
                  },
                  {
                    value: 'atv',
                    label: 'Atividades',
                  },
                  {
                    value: 'draft',
                    label: 'Rascunhos livres',
                  },
                ].map((option) => {
                  const active =
                    typeFilter === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setTypeFilter(
                          option.value as
                            | 'all'
                            | 'source'
                            | 'slide'
                            | 'atv'
                        )
                      }
                      className={`
                        px-3
                        py-1.5
                        rounded-lg
                        text-[11px]
                        font-bold
                        border
                        transition-all
                        cursor-pointer
                        ${
                          active
                            ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                            : 'bg-white/60 text-stone-600 hover:border-[#7C3AED]'
                        }
                      `}
                      style={
                        active
                          ? undefined
                          : {
                              borderColor:
                                THEME_COLORS.borderLight,
                            }
                      }
                    >
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
                  className="
                    ml-1
                    px-3
                    py-1.5
                    rounded-lg
                    text-[11px]
                    font-bold
                    text-stone-400
                    hover:text-[#7C3AED]
                    transition-all
                    cursor-pointer
                  "
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* ===================================================== */}
          {/* RESULTS COUNT */}
          {/* ===================================================== */}

          {hasActiveFilters && (
            <p className="text-xs font-semibold text-stone-500">
              {filteredMateriais.length}{' '}
              {filteredMateriais.length === 1
                ? 'material encontrado'
                : 'materiais encontrados'}
            </p>
          )}

          {/* ===================================================== */}
          {/* GRID */}
          {/* ===================================================== */}

          {filteredMateriais.length > 0 ? (
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-5
                gap-6
                [grid-auto-flow:dense]
              "
            >
              {/* ================================================= */}
              {/* ADD MATERIAL */}
              {/* ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  template-action-in
                "
                style={{
                  animationDelay: `350ms`,
                }}
              >
                <span className="text-lg font-bold mb-2 pl-1">
                  Adicionar material
                </span>

                <div className="mt-2">
                  {/* Create */}
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      p-3
                      rounded-xl
                      border
                      transition-all
                      hover:scale-[1.02]
                      cursor-pointer
                    "
                    style={{
                      backgroundColor:
                        THEME_COLORS.lightSecondary,
                      borderColor:
                        THEME_COLORS.lightSecondary,
                      color:
                        THEME_COLORS.secondary,
                    }}
                  >
                    <div
                      className="
                        w-10
                        h-10
                        rounded-lg
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Plus className="w-5 h-5" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-bold">
                        Criar material
                      </p>

                      <p className="text-[10px] font-medium opacity-70">
                        Crie um novo material
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {filteredMateriais.map(
                (material, idx) => (
                  <div
                    key={material.id}
                    onClick={() =>
                      navigate(`/home/materiais/${material.id}`)
                    }
                    className={`
                      template-card-in
                      cursor-pointer
                      transition-all
                      hover:scale-105
                      rounded-2xl
                      border
                      shadow-sm
                      flex
                      flex-col

                      ${
                        material.orientation === 'H'
                          ? 'col-span-2'
                          : 'col-span-1'
                      }
                    `}
                    style={{
                      backgroundColor:
                        '#ffffff60',
                      borderColor:
                        THEME_COLORS.borderLight,
                      animationDelay: `${
                        350 + idx * 90
                      }ms`,
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="
                        h-36
                        relative
                        overflow-hidden
                        shrink-0
                      "
                      style={{
                        backgroundColor:
                          'rgba(226, 221, 240, 0.4)',
                      }}
                    >
                      <HtmlPreview
                        html={material.htmlContent}
                        fit
                        refWidth={material.orientation === 'H' ? 1900 : 900}
                        refHeight={material.orientation === 'H' ? 900 : 1273}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Content */}
                    <div
                      className="
                        p-6
                        flex
                        flex-col
                        flex-1
                        space-y-4
                      "
                    >
                      <h3 className="line-clamp-2 text-base font-bold">
                        {material.title}
                      </h3>

                      {/* Tags */}
                      <div className="mt-auto flex flex-wrap gap-2">

                        {/* Turmas */}
                        <span
                          className="
                            inline-flex
                            items-center
                            px-3
                            py-1
                            rounded-full
                            text-[10px]
                            font-bold
                            border
                          "
                          style={{
                            backgroundColor:
                              material.qtd === 0
                                ? THEME_COLORS.lightSecondary
                                : THEME_COLORS.lightPrimary,

                            borderColor:
                              material.qtd === 0
                                ? THEME_COLORS.lightSecondary
                                : THEME_COLORS.lightPrimary,

                            color:
                              material.qtd === 0
                                ? THEME_COLORS.secondary
                                : THEME_COLORS.primary,
                          }}
                        >
                          {material.qtd}{' '}
                          {material.qtd === 1
                            ? 'turma associada'
                            : 'turmas associadas'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            /* =================================================== */
            /* NO RESULTS */
            /* =================================================== */

            <div
              className="
                p-12
                text-center
                rounded-3xl
                template-card-in
              "
              style={{
                borderColor:
                  THEME_COLORS.borderLight,
              }}
            >
              <Search
                className="
                  w-10
                  h-10
                  mx-auto
                  text-stone-400
                  mb-3
                "
              />

              <h4 className="font-bold text-sm text-stone-700">
                Nenhum material encontrado
              </h4>

              <p className="text-xs text-stone-500 mt-1">
                Tente alterar os termos da pesquisa ou
                os filtros selecionados.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="
                  mt-4
                  px-4
                  py-2
                  rounded-xl
                  text-xs
                  font-bold
                  text-white
                  transition-all
                  hover:scale-105
                  cursor-pointer
                "
                style={{
                  backgroundColor:
                    THEME_COLORS.primary,
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </>
      )}

      {isCreateOpen && (
        <CriarMaterialModal
          turmas={turmas}
          onClose={() => setIsCreateOpen(false)}
          onCreated={(material) => {
            void createMaterial(material).catch((error) => console.error(error));
          }}
        />
      )}
    </div>
  );
};

export default MateriaisTab;
