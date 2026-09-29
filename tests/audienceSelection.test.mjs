import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const compile = async (path) => ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React },
}).outputText;
const pageCode = await compile('../src/components/editor/SuggestPage.tsx');
const storageCode = await compile('../src/utils/viewedAudience.ts');
const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };

// Exercita callbacks reais com hooks/serviços simulados; não substitui teste visual.
function setup(overrides = {}) {
  const slots = [];
  let cursor = 0;
  const values = new Map();
  const sessionStorage = { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v) };
  const storage = { exports: {} };
  vm.runInNewContext(storageCode, { exports: storage.exports, sessionStorage });
  const calls = { messages: [], selections: [] };
  const api = {
    getAudiencia: async id => ({ id, titulo: `Audiência ${id}` }),
    sendWorkflowMessage: async (...args) => { calls.messages.push(args); return { reply: 'Resposta' }; },
    selectWorkflowPlanningItem: async (...args) => { calls.selections.push(args); },
    advanceWorkflow: async () => ({ allowed: false, message: 'Falta informação.' }),
    workflowHtmlExists: async () => false,
    getWorkflowPlanning: async () => [],
    getWorkflowSession: async () => ({ selected_agent: 'lesson_plan' }),
    ...overrides,
  };
  const react = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useState: initial => {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
    },
    useRef: initial => {
      const index = cursor++;
      return slots[index] ?? (slots[index] = { current: initial });
    },
    useCallback: fn => fn,
    useEffect: () => {},
  };
  const exports = {};
  const context = {
    exports, URLSearchParams, document: { cookie: '' },
    require: name => {
      if (name === 'react') return { ...react, default: react };
      if (name === 'react-router-dom') return {
        useNavigate: () => () => {},
        useSearchParams: () => [new URLSearchParams('sessionId=session-1&type=plano')],
      };
      if (name.endsWith('/client')) return api;
      if (name.endsWith('/colors')) return { THEME_COLORS: {} };
      if (name.endsWith('/viewedAudience')) return storage.exports;
      if (name.endsWith('/htmlPresencePolling')) return {};
      const component = name.split('/').pop();
      return { [component]: component };
    },
  };
  vm.runInNewContext(pageCode, context);
  const find = (node, type) => {
    if (!node || typeof node !== 'object') return undefined;
    if (node.type === type) return node.props;
    return node.props?.children.flat(Infinity).map(child => find(child, type)).find(Boolean);
  };
  const render = () => { cursor = 0; const tree = exports.SuggestPage(); return type => find(tree, type); };
  return { render, calls, storage: storage.exports, sessionStorage };
}

test('cliques só carregam detalhes e não confirmam fonte nem enviam mensagens', async () => {
  const app = setup();
  app.render()('AudienciaList').onSelect('158');
  await flush();
  app.render()('AudienciaList').onSelect('183');
  await flush();
  assert.equal(app.render()('AudienciaDetalhes').detalhe.id, '183');
  assert.equal(app.render()('AudienciaList').disabled, false);
  assert.equal(app.calls.messages.length, 0);
  assert.equal(app.calls.selections.length, 0);
  assert.equal(app.storage.restoreViewedAudience('session-1', '158'), '183');
});

test('pergunta captura a audiência no envio e permite navegar durante a resposta', async () => {
  const pending = deferred();
  const sent = [];
  const app = setup({ sendWorkflowMessage: (...args) => { sent.push(args); return pending.promise; } });
  app.render()('AudienciaList').onSelect('158');
  await flush();
  const request = app.render()('ChatPanel').onSend('Quais são os argumentos?');
  await flush();
  assert.equal(app.render()('AudienciaList').disabled, false);
  app.render()('AudienciaList').onSelect('183');
  await flush();
  assert.equal(sent[0][4], '158');
  assert.equal(sent[0][1], 'Quais são os argumentos?');
  pending.resolve({ reply: 'Resposta à audiência 158' });
  await request;
  await app.render()('ChatPanel').onSend('E nesta outra?');
  assert.equal(sent[1][4], '183');
});

test('confirmação bloqueia a lista e libera após pedido de complementação', async () => {
  const pending = deferred();
  const app = setup({ advanceWorkflow: () => pending.promise });
  app.render()('AudienciaList').onSelect('158');
  await flush();
  const request = app.render()('AudienciaDetalhes').onProceed();
  await flush();
  assert.equal(app.render()('AudienciaList').disabled, true);
  app.render()('AudienciaDetalhes').onSelectAudiencia('183');
  assert.equal(app.render()('AudienciaDetalhes').detalhe.id, '158');
  assert.equal(app.calls.selections[0][1], '158');
  pending.resolve({ allowed: false, message: 'Informe a turma.' });
  await request;
  assert.equal(app.render()('AudienciaList').disabled, false);
});

test('resposta atrasada de um card não substitui o último card aberto', async () => {
  const first = deferred();
  const app = setup({ getAudiencia: id => id === '158' ? first.promise : Promise.resolve({ id, titulo: id }) });
  app.render()('AudienciaList').onSelect('158');
  app.render()('AudienciaList').onSelect('183');
  await flush();
  first.resolve({ id: '158', titulo: 'Anterior' });
  await flush();
  assert.equal(app.render()('AudienciaDetalhes').detalhe.id, '183');
});

test('limpar seleção invalida consulta pendente e conserva ausência ao recarregar', async () => {
  const pending = deferred();
  const app = setup({ getAudiencia: () => pending.promise });
  app.render()('AudienciaList').onSelect('158');
  app.render()('ChatPanel').onClearSelection();
  pending.resolve({ id: '158', titulo: 'Anterior' });
  await flush();
  assert.equal(app.render()('AudienciaDetalhes').detalhe, null);
  assert.equal(app.storage.restoreViewedAudience('session-1', '158'), null);
  assert.equal(app.storage.restoreViewedAudience('outra-sessao', '183'), '183');
  await app.render()('ChatPanel').onSend('Buscar outro tema');
  assert.equal(app.calls.messages[0][4], null);
});
