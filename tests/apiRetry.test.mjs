import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = (await readFile(new URL('../src/api/client.ts', import.meta.url), 'utf8'))
  .replaceAll('import.meta.env', '({ DEV: true })');
const code = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;

function setup(fetch) {
  const exports = {};
  vm.runInNewContext(code, {
    exports, fetch, Headers, FormData,
    localStorage: { getItem: () => null },
    window: { setTimeout: callback => callback() },
  });
  return exports;
}

test('falha de rede não reenvia mensagem nem duplica geração', async () => {
  let requests = 0;
  const api = setup(async () => { requests++; throw new TypeError('Failed to fetch'); });
  await assert.rejects(api.sendWorkflowMessage('session', 'Meu pedido', 'lesson_plan'), /conectar ao servidor/);
  assert.equal(requests, 1);
});

test('consulta pode tentar de novo após falha transitória', async () => {
  let requests = 0;
  const api = setup(async () => {
    if (++requests < 3) throw new TypeError('Failed to fetch');
    return Response.json({ id: 'session', messages: [] });
  });
  assert.equal((await api.getWorkflowSession('session')).id, 'session');
  assert.equal(requests, 3);
});

test('erro tratado pelo backend chega ao chat sem repetição', async () => {
  let requests = 0;
  const api = setup(async () => {
    requests++;
    return Response.json({ detail: 'Conteúdo grande demais.' }, { status: 422 });
  });
  await assert.rejects(api.sendWorkflowMessage('session', 'Gerar', 'lesson_plan'), /Conteúdo grande demais/);
  assert.equal(requests, 1);
});
