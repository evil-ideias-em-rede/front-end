import React, { useEffect, useState } from 'react';
import { File } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import * as api from '../../api/client';
import { HtmlPreview } from './HtmlPreview';

interface WorkflowPreviewThumbnailProps {
  sessionId: string;
}

/** Miniatura do HTML.html gerado pelo agente e persistido no workflow_files. */
export const WorkflowPreviewThumbnail: React.FC<WorkflowPreviewThumbnailProps> = ({ sessionId }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let active = true;
    setHtml('');
    void api.getWorkflowHtml(sessionId)
      .then((content) => {
        if (active) setHtml(content);
      })
      .catch(() => {
        if (active) setHtml('');
      });

    return () => {
      active = false;
    };
  }, [sessionId]);

  if (!html) {
    return <File className="w-14 h-14" style={{ color: THEME_COLORS.primary }} />;
  }

  return (
    <HtmlPreview
      html={html}
      fit
      className="h-full w-full"
    />
  );
};

export default WorkflowPreviewThumbnail;
