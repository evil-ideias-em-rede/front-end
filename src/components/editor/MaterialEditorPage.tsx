import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { THEME_COLORS } from '../../constants/colors';
import { EDITOR_MOCK_HTML } from '../../data/mockEditorHtml';
import { parseHtmlLayers, parseHtmlPages, buildPageDocument, mergePageIntoDocument, updateLayerHtml } from '../../utils/htmlLayers';
import type { HtmlLayer } from '../../utils/htmlLayers';
import { LayerSidebar } from './LayerSidebar';
import { HtmlCanvas } from './HtmlCanvas';
import { ChatPanel } from './ChatPanel';
import type { ChatMessage } from './ChatPanel';
import { ConfirmDeleteModal } from '../criar/ConfirmDeleteModal';
import { useBackendData } from '../../context/BackendDataContext';
import * as api from '../../api/client';

function backendAgentFromType(type?: string): string {
  if (type === 'debate') return 'debate';
  if (type === 'plano') return 'lesson_plan';
  if (type === 'materiais') return 'political_leteracy';
  if (type === 'redacao') return 'writing_workshop';
  if (type === 'slides') return 'slides';
  return 'generic';
}

export const MaterialEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasTitle = searchParams.has('title') && searchParams.get('title')?.trim() !== '';
  const initialTitle = searchParams.get('title') ?? 'Novo material';
  const materialId = searchParams.get('materialId') ?? undefined;
  const materialType = searchParams.get('type') ?? undefined;
  const serie = searchParams.get('serie') ?? undefined;
  const audienciaId = searchParams.get('audienciaId') ?? undefined;
  const sessionId = searchParams.get('sessionId') ?? undefined;
  const finalAgent = backendAgentFromType(materialType);

  // Título próprio do material, editável pelo professor no toolbar.
  const [documentTitle, setDocumentTitle] = useState(initialTitle);

  const { materiais, deleteMaterial } = useBackendData();

  // Material salvo correspondente ao título de abertura, se existir.
  const savedMaterial = useMemo(
    () => materialId
      ? materiais.find((material) => material.id === materialId)
      : materiais.find((material) => material.title === initialTitle),
    [materiais, materialId, initialTitle]
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Slides editam em folha horizontal (paisagem); demais formatos em retrato.
  const orientation: 'V' | 'H' = materialType === 'slides' ? 'H' : 'V';

  const [html, setHtml] = useState<string>(() => (
    sessionId
      ? ''
      : parseHtmlLayers(savedMaterial?.htmlContent || EDITOR_MOCK_HTML).markedHtml
  ));
  const loadedMaterialIdRef = useRef<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [llmBusy, setLlmBusy] = useState(Boolean(sessionId));
  const [exportingPdf, setExportingPdf] = useState(false);
  const [hasPendingManualEdits, setHasPendingManualEdits] = useState(false);
  const manualEditVersionRef = useRef(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [serverRevision, setServerRevision] = useState(0);
  const [editorMessages, setEditorMessages] = useState<ChatMessage[]>([
    {
      id: 'ed-1',
      role: 'assistant',
      text: `Material gerado a partir da audiência "${documentTitle}"${serie ? ` para ${serie}` : ''}${audienciaId ? ` (fonte ${audienciaId})` : ''}. Selecione uma camada para editar ou peça mudanças aqui.`,
    },
  ]);

  useEffect(() => {
    if (sessionId || !savedMaterial?.htmlContent || loadedMaterialIdRef.current === savedMaterial.id) return;
    setHtml(parseHtmlLayers(savedMaterial.htmlContent).markedHtml);
    loadedMaterialIdRef.current = savedMaterial.id;
  }, [sessionId, savedMaterial]);

  useEffect(() => {
    if (sessionId) {
      void api.updateWorkflowStage(sessionId, 'editor').catch(() => undefined);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    const restoreMaterial = async () => {
      try {
        setLlmBusy(true);
        setBackendError(null);
        const [session, existingHtml] = await Promise.all([
          api.getWorkflowSession(sessionId),
          api.getWorkflowHtml(sessionId).catch(() => ''),
        ]);

        const persistedMessages: ChatMessage[] = session.messages
          .filter((message) => (
            (message.role === 'user' || message.role === 'assistant')
            && message.hidden !== true
            && Boolean(String(message.content ?? '').trim())
          ))
          .map((message, index) => ({
            id: `${sessionId}-message-${index}`,
            role: message.role as 'user' | 'assistant',
            text: String(message.content),
          }));

        if (active) {
          setEditorMessages((current) => {
            const initialMessage = current.find((message) => message.id === 'ed-1') ?? {
              id: 'ed-1',
              role: 'assistant' as const,
              text: `Material gerado a partir da audiência "${documentTitle}"${serie ? ` para ${serie}` : ''}${audienciaId ? ` (fonte ${audienciaId})` : ''}. Selecione uma camada para editar ou peça mudanças aqui.`,
            };
            return [initialMessage, ...persistedMessages];
          });
        }

        let generated = existingHtml;
        if (!generated) {
          // Só gera na primeira abertura, quando ainda não existe HTML salvo.
          await api.sendWorkflowMessage(
            sessionId,
            `Gere agora o material final "${documentTitle}"${serie ? ` para ${serie}` : ''}. Use a audiência selecionada e salve o resultado em HTML.html.`,
            finalAgent,
          );
          for (let attempt = 0; attempt < 4 && !generated; attempt += 1) {
            try {
              generated = await api.getWorkflowHtml(sessionId);
            } catch {
              await new Promise((resolve) => window.setTimeout(resolve, 800));
            }
          }
        }

        if (!generated) throw new Error('O agente não produziu HTML.html.');
        if (active) {
          setHtml(parseHtmlLayers(generated).markedHtml);
          setServerRevision((revision) => revision + 1);
          // Uma tentativa anterior pode ter deixado um aviso transitório
          // (por exemplo, limite de tokens). O HTML recuperado com sucesso
          // representa o estado atual da sessão e deve limpar esse aviso.
          setBackendError(null);
        }
      } catch (cause) {
        if (active) setBackendError(cause instanceof Error ? cause.message : 'Não foi possível gerar o material.');
      } finally {
        if (active) setLlmBusy(false);
      }
    };
    void restoreMaterial();
    return () => { active = false; };
  // A sessão só gera o material quando ainda não existe HTML persistido.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !html) return;
    const timer = window.setTimeout(() => {
      void api.uploadWorkflowFile(sessionId, 'HTML.html', html).catch((error) => {
        setBackendError(error instanceof Error ? error.message : 'Não foi possível salvar o HTML.');
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [html, sessionId]);

  const { layers } = useMemo(() => parseHtmlLayers(html), [html]);
  const pages = useMemo(() => parseHtmlPages(html), [html]);
  const safePageIndex = Math.min(pageIndex, pages.length - 1);
  const pageLayers = useMemo(
    () => layers.filter((l) => (l.pageIndex ?? 0) === safePageIndex),
    [layers, safePageIndex]
  );
  const pageDocument = useMemo(
    () => buildPageDocument(html, safePageIndex),
    [html, safePageIndex]
  );

  // Garante índice válido se o nº de páginas mudar (ex.: edição estrutural)
  useEffect(() => {
    setPageIndex((i) => Math.min(i, pages.length - 1));
  }, [pages.length]);

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedId) ?? null,
    [layers, selectedId]
  );

  const markManualEdit = useCallback(() => {
    manualEditVersionRef.current += 1;
    setHasPendingManualEdits(true);
  }, []);

  const handlePageChange = useCallback((next: number) => {
    setPageIndex(next);
    setSelectedId(null);
  }, []);

  const handleCommitPage = useCallback(
    (pageDoc: Document) => {
      markManualEdit();
      setHtml((prev) => {
        return mergePageIntoDocument(prev, safePageIndex, pageDoc);
      });
    },
    [markManualEdit, safePageIndex]
  );

  const handleEdit = useCallback((layer: HtmlLayer, newHtml: string) => {
    markManualEdit();
    setHtml((prev) => {
      return updateLayerHtml(prev, layer.selector, newHtml);
    });
  }, [markManualEdit]);

  const handleSelectById = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const handleSelectLayer = useCallback(
    (layer: HtmlLayer) => {
      setSelectedId(layer.id === selectedId ? null : layer.id);
    },
    [selectedId]
  );

  const handleSelectDocument = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleEditorChat = async (text: string) => {
    if (llmBusy) return;
    setLlmBusy(true);
    const id = `m-${Date.now()}`;
    const target = selectedLayer ? `a camada "${selectedLayer.label}"` : 'o documento';
    const pageSuffix = pages.length > 1 ? ` (página ${safePageIndex + 1})` : '';
    setEditorMessages((prev) => [...prev, { id, role: 'user', text }]);
    if (!sessionId) {
      setEditorMessages((prev) => [...prev, { id: `${id}-r`, role: 'assistant', text: `Aplicarei mudanças em ${target}${pageSuffix} conforme: "${text}".` }]);
      setLlmBusy(false);
      return;
    }
    try {
      setBackendError(null);
      const editVersionAtSend = manualEditVersionRef.current;
      const userEdited = hasPendingManualEdits;
      // Garante que o agente leia exatamente a versão editada no canvas.
      // O autosave continua existindo, mas não deve haver corrida com o Enter.
      await api.uploadWorkflowFile(sessionId, 'HTML.html', html);
      const response = await api.sendEditorMessage(sessionId, text, finalAgent, userEdited);
      if (manualEditVersionRef.current === editVersionAtSend) {
        setHasPendingManualEdits(false);
      }
      const generated = await api.getWorkflowHtml(sessionId);
      setHtml(parseHtmlLayers(generated).markedHtml);
      setServerRevision((revision) => revision + 1);
      setBackendError(null);
      const responseText = typeof response?.message?.content === 'string'
        ? response.message.content.trim()
        : '';
      setEditorMessages((prev) => [...prev, {
        id: `${id}-r`,
        role: 'assistant',
        text: responseText || 'Atualizei o material conforme solicitado.',
      }]);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Não foi possível atualizar o material.';
      setBackendError(message);
      setEditorMessages((prev) => [...prev, { id: `${id}-r`, role: 'assistant', text: message }]);
    } finally {
      setLlmBusy(false);
    }
  };

  const handleExportPdf = async () => {
    if (!sessionId) {
      setBackendError('Salve o material em uma sessão antes de exportar o PDF.');
      return;
    }

    try {
      setBackendError(null);
      setExportingPdf(true);
      await api.downloadWorkflowPdf(sessionId, html, orientation);
    } catch (cause) {
      setBackendError(cause instanceof Error ? cause.message : 'Não foi possível exportar o PDF.');
    } finally {
      setExportingPdf(false);
    }
  };

  const handleBack = () => {
    if (llmBusy) return;
    const params = new URLSearchParams();
    params.set('title', documentTitle);
    if (materialType) params.set('type', materialType);
    if (serie) params.set('serie', serie);
    if (audienciaId) params.set('audienciaId', audienciaId);
    if (sessionId) params.set('sessionId', sessionId);
    if (materialId) params.set('materialId', materialId);
    navigate(`/home/editor?${params.toString()}`);
  };

  if (!hasTitle) {
    const params = new URLSearchParams();
    if (materialType) params.set('type', materialType);
    const qs = params.toString();
    return <Navigate to={qs ? `/home/editor?${qs}` : '/home/editor'} replace />;
  }

  return (
    <div
      className="flex-grow h-full flex flex-col min-w-0 overflow-hidden"
      style={{
        background: `linear-gradient(
          to bottom,
          ${THEME_COLORS.lightPrimary} -15%,
          ${THEME_COLORS.bgLight} 10%,
          #EBE8F3 60%
        )`,
        color: THEME_COLORS.textDark,
      }}
    >
      <div className="screen-in flex-1 flex h-full min-h-0">
        {backendError && (
          <div className="absolute z-40 top-3 left-1/2 -translate-x-1/2 max-w-xl rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 shadow-sm">
            {backendError}
          </div>
        )}
        <div className={`flex flex-1 min-w-0 min-h-0 ${llmBusy ? 'pointer-events-none opacity-60' : ''}`}>
        <LayerSidebar
          layers={pageLayers}
          selectedId={selectedId}
          onSelect={handleSelectLayer}
          onSelectDocument={handleSelectDocument}
          pageLabel={pages.length > 1 ? pages[safePageIndex]?.label : undefined}
        />

        <HtmlCanvas
          html={pageDocument}
          layers={pageLayers}
          selectedId={selectedId}
          onEdit={handleEdit}
          onSelectById={handleSelectById}
          onCommitDocument={handleCommitPage}
          onBack={handleBack}
          navigationLocked={llmBusy}
          title={documentTitle}
          onTitleChange={(nextTitle) => {
            setDocumentTitle(nextTitle);
            markManualEdit();
          }}
          pageIndex={safePageIndex}
          pageCount={pages.length}
          onPageChange={handlePageChange}
          orientation={orientation}
          isSlides={materialType === 'slides'}
          onExportPdf={() => void handleExportPdf()}
          exportingPdf={exportingPdf}
          serverRevision={serverRevision}
          onDelete={
            savedMaterial
              ? () => {
                  setDeleteError(null);
                  setIsDeleteOpen(true);
                }
              : undefined
          }
        />
        </div>

        <ChatPanel
          messages={editorMessages}
          onSend={handleEditorChat}
          placeholder={
            selectedLayer
              ? `Mudar "${selectedLayer.label}"...`
              : 'Peça mudanças gerais no documento...'
          }
          contextLabel={selectedLayer ? selectedLayer.label : documentTitle}
          contextIcon={selectedLayer ? 'layer' : 'document'}
          busy={llmBusy}
        />
      </div>

      {isDeleteOpen && savedMaterial && (
        <ConfirmDeleteModal
          title="Excluir material?"
          message={`Tem certeza que deseja excluir "${savedMaterial.title}"? Esta ação não pode ser desfeita.`}
          onCancel={() => setIsDeleteOpen(false)}
          loading={isDeleting}
          error={deleteError}
          onConfirm={() => {
            if (isDeleting) return;
            setIsDeleting(true);
            setDeleteError(null);
            void deleteMaterial(savedMaterial.id)
              .then(() => {
                navigate('/home/materiais', { replace: true });
              })
              .catch((error) => {
                setDeleteError(error instanceof Error ? error.message : 'Não foi possível excluir o material.');
                setIsDeleting(false);
              });
          }}
        />
      )}
    </div>
  );
};

export default MaterialEditorPage;
