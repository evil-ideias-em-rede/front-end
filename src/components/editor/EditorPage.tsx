import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';

/**
 * @deprecated Rota dividida em duas:
 * - /home/editor -> SuggestPage (cards de sugestão)
 * - /home/editor/material -> MaterialEditorPage (editor do material)
 * Mantido apenas para compatibilidade com links legados ?start=editor.
 */
export const EditorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const startParam = searchParams.get('start');

  if (startParam === 'editor') {
    const params = new URLSearchParams();
    const title = searchParams.get('title');
    const type = searchParams.get('type');
    if (title) params.set('title', title);
    if (type) params.set('type', type);
    const qs = params.toString();
    return <Navigate to={qs ? `/home/editor/material?${qs}` : '/home/editor'} replace />;
  }

  const qs = searchParams.toString();
  return <Navigate to={qs ? `/home/editor?${qs}` : '/home/editor'} replace />;
};

export default EditorPage;
