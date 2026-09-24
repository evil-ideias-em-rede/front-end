import type { Material } from '../types';

const sanitizeFilename = (name: string): string =>
  (name || 'material')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .replace(/\s+/g, '_');

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadMaterialHtml = (material: Material) => {
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>${material.title}</title></head><body>${material.htmlContent}</body></html>`;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  triggerDownload(blob, `${sanitizeFilename(material.title)}.html`);
};


