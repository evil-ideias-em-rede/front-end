import React, { useMemo, useState } from 'react';
import {
  File,
  Plus,
  Search,
  ArrowDownAZ,
  UsersRound,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { THEME_COLORS } from '../../constants/colors';
import { CriarTemplateModal } from '../criar/CriarTemplateModal';
import { HtmlPreview } from '../general/HtmlPreview';
import { useBackendData } from '../../context/BackendDataContext';

type SortOption = 'alphabetical' | 'quantity' | 'recent';

type SortDirection = 'asc' | 'desc';

interface TemplatesTabProps {}

export const TemplatesTab: React.FC<TemplatesTabProps> = () => {
  const navigate = useNavigate();
  const { templates, turmas, createTemplate } = useBackendData();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [search, setSearch] = useState('');

  const [sortOption, setSortOption] =
    useState<SortOption>('recent');

  const [sortDirection, setSortDirection] =
    useState<SortDirection>('desc');

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = search
      .toLowerCase()
      .trim();

    return [...templates]
      // Pesquisa
      .filter((template) =>
        template.title
          .toLowerCase()
          .includes(normalizedSearch)
      )

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

        if (sortOption === 'alphabetical') {
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
        }

        const comparison = a.qtd - b.qtd;

        return sortDirection === 'asc'
          ? comparison
          : -comparison;
      });
  }, [search, sortOption, sortDirection, templates]);

  const hasActiveSearch = search.trim() !== '';

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

  const handleQuantitySort = () => {
    if (sortOption === 'quantity') {
      setSortDirection((current) =>
        current === 'asc' ? 'desc' : 'asc'
      );
      return;
    }

    setSortOption('quantity');
    setSortDirection('desc');
  };

  const clearSearch = () => {
    setSearch('');
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
            Templates de{' '}
          </span>

          <span>Plano de Aula</span>
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
          Adicione estruturas de planos de aula
          alinhadas à sua realidade
        </p>
      </div>

      {/* ========================================================= */}
      {/* EMPTY STATE — NENHUM TEMPLATE CADASTRADO */}
      {/* ========================================================= */}

      {templates.length === 0 ? (
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
            Nenhum template cadastrado
          </h4>

          <p className="text-xs text-stone-500">
            Carregue um arquivo ou configure um template
            para começar a estruturar suas aulas.
            <br />
            Um template pode ser um arquivo em branco que
            sua instituição precisa seguir, ou um arquivo
            que você próprio já utiliza para se organizar.
            <br />
            Se você não possui essas estruturas ainda,
            crie uma com a gente!
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
              backgroundColor:
                THEME_COLORS.primary,
            }}
          >
            <Plus className="w-4 h-4" />

            Adicionar template
          </button>
        </div>
      ) : (
        <>
          {/* ===================================================== */}
          {/* SEARCH + SORT */}
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
                  placeholder="Pesquisar templates..."
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
                    sortOption ===
                    'alphabetical'
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
                  {sortDirection === 'asc'
                    ? 'A-Z'
                    : 'Z-A'}
                </span>
              </button>

              {/* Ordenação por quantidade */}
              <button
                type="button"
                onClick={handleQuantitySort}
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
                    sortOption === 'quantity'
                      ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                      : 'bg-white/60 text-stone-600 hover:border-[#7C3AED]'
                  }
                `}
                style={
                  sortOption === 'quantity'
                    ? undefined
                    : {
                        borderColor:
                          THEME_COLORS.borderLight,
                      }
                }
              >
                <UsersRound className="w-4 h-4" />

                <span>Turmas</span>

                {sortOption === 'quantity' && (
                  <span className="text-[10px]">
                    {sortDirection === 'asc'
                      ? '↑'
                      : '↓'}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ===================================================== */}
          {/* RESULT COUNT */}
          {/* ===================================================== */}

          {hasActiveSearch && (
            <p className="text-xs font-semibold text-stone-500">
              {filteredTemplates.length}{' '}
              {filteredTemplates.length === 1
                ? 'template encontrado'
                : 'templates encontrados'}
            </p>
          )}

          {/* ===================================================== */}
          {/* NO RESULTS */}
          {/* ===================================================== */}

          {filteredTemplates.length === 0 ? (
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
                Nenhum template encontrado
              </h4>

              <p className="text-xs text-stone-500 mt-1">
                Tente alterar o termo da pesquisa.
              </p>

              <button
                type="button"
                onClick={clearSearch}
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
                Limpar pesquisa
              </button>
            </div>
          ) : (
            /* =================================================== */
            /* TEMPLATES GRID */
            /* =================================================== */

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-5
                gap-6
              "
            >
              {/* ================================================= */}
              {/* ADD TEMPLATE */}
              {/* ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  template-action-in
                "
                style={{
                  animationDelay: `300ms`,
                }}
              >
                <span className="text-lg font-bold mb-2 pl-1">
                  Adicionar template
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
                        Criar template
                      </p>

                      <p className="text-[10px] font-medium opacity-70">
                        Crie uma nova estrutura
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {filteredTemplates.map(
                (tmpl, idx) => (
                  <div
                    key={tmpl.id}
                    onClick={() =>
                      navigate(`/home/templates/${tmpl.id}`)
                    }
                    className="
                      template-card-in
                      cursor-pointer
                      transition-all
                      hover:scale-105
                      rounded-2xl
                      border
                      shadow-sm
                      flex
                      flex-col
                      overflow-hidden
                    "
                    style={{
                      backgroundColor:
                        '#ffffff60',
                      borderColor:
                        THEME_COLORS.borderLight,
                      animationDelay: `${
                        300 + idx * 90
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
                        html={tmpl.htmlContent}
                        fit
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
                      <h3
                        className="
                          line-clamp-2
                          text-base
                          font-bold
                        "
                      >
                        {tmpl.title}
                      </h3>

                      {/* Turmas — sempre no bottom */}
                      <span
                        className="
                          inline-flex
                          items-center
                          self-start
                          mt-auto
                          px-4
                          py-1
                          rounded-full
                          text-[10px]
                          font-bold
                          border
                        "
                        style={{
                          backgroundColor:
                            tmpl.qtd === 0
                              ? THEME_COLORS.lightSecondary
                              : THEME_COLORS.lightPrimary,

                          borderColor:
                            tmpl.qtd === 0
                              ? THEME_COLORS.lightSecondary
                              : THEME_COLORS.lightPrimary,

                          color:
                            tmpl.qtd === 0
                              ? THEME_COLORS.secondary
                              : THEME_COLORS.primary,
                        }}
                      >
                        {tmpl.qtd}{' '}
                        {tmpl.qtd === 1
                          ? 'turma associada'
                          : 'turmas associadas'}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}

      {isCreateOpen && (
        <CriarTemplateModal
          turmas={turmas}
          onClose={() => setIsCreateOpen(false)}
          onCreated={(template) => {
            void createTemplate(template).catch((error) => console.error(error));
          }}
        />
      )}
    </div>
  );
};

export default TemplatesTab;
