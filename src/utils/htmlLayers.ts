export interface HtmlLayer {
  id: string;
  tag: string;
  label: string;
  /** Selector usado para localizar o elemento dentro do documento renderizado */
  selector: string;
  /** Se a camada representa texto editável inline */
  editable: boolean;
  /** Id do pai na hierarquia (null = raiz) */
  parentId: string | null;
  /** Ids dos filhos nesta camada */
  children: string[];
  /** Profundidade na árvore */
  depth: number;
}

const EDITABLE_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'td', 'th', 'span', 'a', 'blockquote']);

const LABEL_BY_TAG: Record<string, (el: Element, idx: number) => string> = {
  h1: () => 'Título',
  h2: () => 'Subtítulo',
  h3: () => 'Título 3',
  p: (el, i) => (hasLabelWord(el) ? 'Parágrafo c/ rótulo' : `Parágrafo ${i + 1}`),
  li: (_el, i) => `Item de lista ${i + 1}`,
  td: () => 'Célula da tabela',
  th: () => 'Cabeçalho de coluna',
  span: (el) => (hasLabelWord(el) ? 'Rótulo' : 'Trecho'),
  a: () => 'Link',
  blockquote: () => 'Citação',
  ul: () => 'Lista',
  ol: () => 'Lista ordenada',
  table: () => 'Tabela',
  section: () => 'Seção',
  div: () => 'Bloco',
};

function hasLabelWord(el: Element): boolean {
  return el.textContent?.toLowerCase().includes(':') ?? false;
}

/**
 * Percorre o HTML e atribui numeração estável de camadas a elementos que
 * podem ser selecionados/inseridos. Retorna lista de camadas, o selector
 * base para cada uma (via atributo data-ied-layer) e a hierarquia pai-filho.
 */
export function parseHtmlLayers(html: string): {
  layers: HtmlLayer[];
  injectedHtml: string;
  markedHtml: string;
} {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;

  const candidates: Element[] = [];
  body.querySelectorAll(
    'h1,h2,h3,h4,h5,h6,p,li,td,th,span,a,ul,ol,table,blockquote,section'
  ).forEach((el) => {
    candidates.push(el);
  });

  // 1ª passagem: atribuir data-ied-layer
  let nextIdx = 0;
  candidates.forEach((el) => {
    const hasText = (el.textContent ?? '').trim().length > 0;
    if (!hasText) return;
    if (!el.hasAttribute('data-ied-layer')) {
      el.setAttribute('data-ied-layer', String(nextIdx));
    }
    nextIdx += 1;
  });

  // 2ª passagem: construir camadas com hierarquia
  const layers: HtmlLayer[] = [];
  const layerByIndex = new Map<number, HtmlLayer>();

  body.querySelectorAll('[data-ied-layer]').forEach((el) => {
    const idx = Number(el.getAttribute('data-ied-layer'));
    const tag = el.tagName.toLowerCase();
    const labelFn = LABEL_BY_TAG[tag];
    const label = labelFn ? labelFn(el, idx) : `${tag.toUpperCase()} ${idx + 1}`;

    const layer: HtmlLayer = {
      id: `ied-layer-${idx}`,
      tag,
      label,
      selector: `[data-ied-layer="${idx}"]`,
      editable: EDITABLE_TAGS.has(tag) && el.querySelectorAll('p,li,td,th,table,section').length === 0,
      parentId: null,
      children: [],
      depth: 0,
    };

    layers.push(layer);
    layerByIndex.set(idx, layer);
  });

  // Resolver pais via DOM
  layers.forEach((layer) => {
    const idx = Number(layer.selector.match(/\d+/)?.[0] ?? -1);
    const el = body.querySelector(`[data-ied-layer="${idx}"]`);
    if (!el) return;

    // Buscar o pai mais próximo que seja uma camada marcada
    let ancestor = el.parentElement;
    while (ancestor) {
      const parentIdx = ancestor.getAttribute('data-ied-layer');
      if (parentIdx !== null && parentIdx !== undefined) {
        const parentLayer = layerByIndex.get(Number(parentIdx));
        if (parentLayer) {
          layer.parentId = parentLayer.id;
          layer.depth = parentLayer.depth + 1;
          parentLayer.children.push(layer.id);
          break;
        }
      }
      ancestor = ancestor.parentElement;
    }
  });

  const styleTag = doc.querySelector('style');
  const existingStyles = styleTag ? styleTag.outerHTML : '';

  const markedHtml = existingStyles + body.innerHTML;

  const injectedHtml =
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    injectedEditorCss +
    injectedEditorJs +
    existingStyles +
    '</head><body>' +
    body.innerHTML +
    '</body></html>';

  return { layers, injectedHtml, markedHtml };
}

/**
 * Script injetado no documento de prévia: cuida da seleção/edição direta na
 * camada (contenteditable + cursor) e avisa o React via postMessage. Assim o
 * comportamento não depende da corrida de carregamento do contentDocument.
 */
export const injectedEditorJs = `
<script>
(function () {
  function closestLayer(node) {
    while (node && node.nodeType === 1 && node !== document.documentElement) {
      if (node.hasAttribute && node.hasAttribute('data-ied-layer')) return node;
      node = node.parentNode;
    }
    return null;
  }
  function layerId(layer) {
    var idx = layer.getAttribute('data-ied-layer');
    return idx === null ? null : 'ied-layer-' + idx;
  }
  function post(type, payload) {
    try {
      parent.postMessage(Object.assign({ type: type }, payload || {}), '*');
    } catch (err) {}
  }
  function activate(layer) {
    layer.classList.add('ied-layer-active');
    layer.setAttribute('contenteditable', 'true');
  }
  document.addEventListener('mousedown', function (e) {
    var layer = closestLayer(e.target);
    if (layer) activate(layer);
  });
  document.addEventListener('mouseup', function (e) {
    var layer = closestLayer(e.target);
    if (layer) {
      activate(layer);
      post('ied-select', { id: layerId(layer) });
    } else {
      post('ied-select', { id: null });
    }
  });
  document.addEventListener('input', function (e) {
    var layer = closestLayer(document.activeElement);
    if (layer) {
      post('ied-edit', { id: layerId(layer), innerHtml: layer.innerHTML });
    }
  });
})();
</script>
`;

/** CSS de apoio ao editor sempre injetado no documento de prévia. */
export const injectedEditorCss = `
<style id="ied-editor-style">
  [data-ied-layer] { cursor: pointer; transition: outline 0.15s ease; }
  [data-ied-layer].ied-layer-active {
    outline: 2px solid #7C3AED !important;
    outline-offset: 2px;
    border-radius: 3px;
  }
  [data-ied-layer]:not(.ied-layer-active):hover {
    outline: 1px dashed #7C3AED80 !important;
    outline-offset: 2px;
  }
  [contenteditable="true"] { cursor: text; }
  [contenteditable="true"]:focus { outline: 2px solid #7C3AED !important; outline-offset: 2px; background: #EDE9FE; }
</style>
`;

/**
 * Serializa uma Document (iframe) de volta para o formato de fragmento marcado,
 * extraindo apenas o <style> original (ignorando o CSS de apoio do editor).
 */
export function serializeMarkedFragment(doc: Document): string {
  const style = doc.querySelector('style:not([id="ied-editor-style"])')?.outerHTML ?? '';
  return style + doc.body.innerHTML;
}

/** Assinatura estrutural do HTML, usada para detectar mudanças de estrutura. */
export function layerSignature(html: string): string {
  const match = html.match(/data-ied-layer="\d+"/g);
  return match?.join('|') ?? 'none';
}

/**
 * Atualiza o conteúdo de uma camada via innerHTML (preservando formatação
 * inline, labels, imagens, etc.) e retorna o HTML editado para realimentar o parse.
 */
export function updateLayerHtml(html: string, selector: string, innerHtml: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const target = doc.querySelector(selector);
  if (!target) return html;

  // Preservar data-ied-layer de quaisquer filhos marcados que sejam DOM reais
  // (não deveria acontecer se não editamos o container inteiro, mas por segurança)
  const childMarks: Array<{ idx: string; el: Element }> = [];
  target.querySelectorAll('[data-ied-layer]').forEach((child) => {
    childMarks.push({ idx: child.getAttribute('data-ied-layer')!, el: child });
  });

  target.innerHTML = innerHtml;

  // Restaurar attrs se foram perdidos
  childMarks.forEach(({ idx, el: saved }) => {
    const match = target.querySelector(`[data-ied-layer="${idx}"]`);
    if (!match) {
      // re-anexar attribute se o elemento que o tinha foi recriado
      target.appendChild(saved);
    }
  });

  const style = doc.querySelector('head style')?.outerHTML ?? '';
  return style + doc.body.innerHTML;
}
