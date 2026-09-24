import React, { useEffect, useRef, useState } from 'react';
import { File } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { buildPageDocument } from '../../utils/htmlLayers';

interface HtmlPreviewProps {
  html: string;
  className?: string;
  fit?: boolean;
  refWidth?: number;
  refHeight?: number;
  width?: number;
  height?: number;
  pageIndex?: number;
}

const extractDocumentPart = (html: string, tag: 'head' | 'body'): string => {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*)</${tag}>`, 'i'));
  return match?.[1] ?? '';
};

const wrapContent = (html: string, scrollable: boolean): string => {
  const hasDocument = /<html\b/i.test(html);
  const head = hasDocument
    ? extractDocumentPart(html, 'head').replace(/<script\b[\s\S]*?<\/script>/gi, '')
    : '';
  const body = hasDocument ? extractDocumentPart(html, 'body') : html;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${head}<style>*{box-sizing:border-box}body{margin:0;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;line-height:1.5;overflow:${scrollable ? 'hidden' : 'auto'}}</style></head><body>${body}</body></html>`;
};

export const HtmlPreview: React.FC<HtmlPreviewProps> = ({
  html,
  className,
  fit,
  refWidth = 900,
  refHeight = 1273,
  width,
  height,
  pageIndex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setScale] = useState<number | null>(fit ? 1 : null);

  useEffect(() => {
    if (!fit || !containerRef.current) return;

    const container = containerRef.current;
    const updateScale = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      const scale = Math.min(w / refWidth, h / refHeight);
      setScale(scale);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(container);
    return () => ro.disconnect();
  }, [fit, refWidth, refHeight]);

  const content = html?.trim();
  const pageContent = content && pageIndex !== undefined
    ? buildPageDocument(content, pageIndex)
    : content;
  if (!pageContent) {
    return (
      <span
        className={`flex items-center justify-center ${className ?? ''}`}
        style={{ backgroundColor: THEME_COLORS.lightPrimary, color: THEME_COLORS.primary }}
      >
        <File className="w-5 h-5" />
      </span>
    );
  }

  if (!fit) {
    return (
      <iframe
        title="Prévia do HTML"
        srcDoc={wrapContent(pageContent, false)}
        className={className}
        sandbox=""
        style={{
          border: 'none',
          pointerEvents: 'none',
          width: width ?? '100%',
          height: height ?? 'auto',
        }}
      />
    );
  }

  return (
    <div ref={containerRef} className={`w-full h-full sm:zoom-50 lg:zoom-23 relative ${className ?? ''}`}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: refWidth,
          height: refHeight,
          transformOrigin: 'top left',
        }}
      >
        <iframe
          title="Prévia do HTML"
          srcDoc={wrapContent(pageContent, true)}
          sandbox=""
          style={{
            border: 'none',
            pointerEvents: 'none',
            width: refWidth,
            height: refHeight,
            background: '#fff',
          }}
        />
      </div>
    </div>
  );
};

export default HtmlPreview;
