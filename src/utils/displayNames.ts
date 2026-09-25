const DOCUMENT_EXTENSIONS = /\.(html?|pdf|docx?|pptx?|txt)$/i;

export const displayFileTitle = (name: string): string =>
  (name || '').replace(DOCUMENT_EXTENSIONS, '');

export const keepOriginalFileExtension = (name: string, originalName: string): string => {
  const extension = originalName.match(DOCUMENT_EXTENSIONS)?.[0] ?? '';
  return `${displayFileTitle(name).trim()}${extension}`;
};
