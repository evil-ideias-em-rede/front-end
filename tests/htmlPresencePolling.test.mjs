import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/htmlPresencePolling.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ESNext },
});
const { startHtmlPresencePolling } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

test('consulta a cada 5s e sinaliza apenas quando existe conteúdo', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let checks = 0;
  let detected = 0;
  const stop = startHtmlPresencePolling(async () => ++checks >= 2, () => detected++);
  t.after(stop);
  t.mock.timers.tick(4999);
  assert.equal(checks, 0);
  t.mock.timers.tick(1);
  await flush();
  assert.equal(checks, 1);
  assert.equal(detected, 0);
  t.mock.timers.tick(5000);
  await flush();
  assert.equal(checks, 2);
  assert.equal(detected, 1);
  // Conteúdo parcial não encerra sozinho a espera pela resposta.
  t.mock.timers.tick(5000);
  await flush();
  assert.equal(checks, 3);
});

test('não sobrepõe consultas lentas', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let checks = 0;
  let resolve;
  const stop = startHtmlPresencePolling(() => {
    checks++;
    return new Promise((done) => { resolve = done; });
  }, () => {});
  t.after(stop);
  t.mock.timers.tick(5000);
  t.mock.timers.tick(20000);
  assert.equal(checks, 1);
  resolve(false);
  await flush();
  t.mock.timers.tick(5000);
  assert.equal(checks, 2);
});

test('falha transitória permite nova consulta', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let checks = 0;
  let detected = 0;
  const stop = startHtmlPresencePolling(async () => {
    if (++checks === 1) throw new Error('offline');
    return true;
  }, () => detected++);
  t.after(stop);
  t.mock.timers.tick(5000);
  await flush();
  assert.equal(detected, 0);
  t.mock.timers.tick(5000);
  await flush();
  assert.equal(detected, 1);
});

test('cancelamento antes da primeira consulta não faz requisições', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let checks = 0;
  const stop = startHtmlPresencePolling(async () => { checks++; return true; }, () => {});
  stop();
  t.mock.timers.tick(30000);
  assert.equal(checks, 0);
});

test('cancelamento ao receber resposta/falha não agenda mais consultas', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let checks = 0;
  const stop = startHtmlPresencePolling(async () => { checks++; return true; }, () => {});
  t.mock.timers.tick(5000);
  await flush();
  stop();
  t.mock.timers.tick(30000);
  assert.equal(checks, 1);
});

test('resposta atrasada após sair/trocar de sessão é ignorada', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let checks = 0;
  let detected = 0;
  let resolve;
  const stop = startHtmlPresencePolling(() => {
    checks++;
    return new Promise((done) => { resolve = done; });
  }, () => detected++);
  t.mock.timers.tick(5000);
  stop();
  resolve(true);
  await flush();
  t.mock.timers.tick(30000);
  assert.equal(detected, 0);
  assert.equal(checks, 1);
});
