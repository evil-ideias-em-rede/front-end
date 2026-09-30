import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const compile = async path => ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React },
}).outputText;
const modalCode = await compile('../src/components/criar/CriarTemplateModal.tsx');
const namesCode = await compile('../src/utils/displayNames.ts');

// Executa os callbacks reais do modal, simulando apenas hooks e leitura do upload.
function setup() {
  const slots = [];
  const created = [];
  let cursor = 0;
  const react = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useState: initial => {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { slots[index] = value; }];
    },
    useRef: initial => {
      const index = cursor++;
      return slots[index] ?? (slots[index] = { current: initial });
    },
    useEffect: () => {},
    useMemo: calculate => calculate(),
  };
  const names = { exports: {} };
  vm.runInNewContext(namesCode, names);
  const exports = {};
  vm.runInNewContext(modalCode, {
    exports,
    crypto: { randomUUID: () => 'template-id' },
    setTimeout: () => 1,
    clearTimeout: () => {},
    FileReader: class {
      readAsDataURL() {
        this.result = 'data:application/pdf;base64,cGRm';
        this.onload();
      }
    },
    require: name => {
      if (name === 'react') return { ...react, default: react };
      if (name === 'lucide-react') return { Upload: 'Upload', CheckCircle2: 'CheckCircle2' };
      if (name.endsWith('/colors')) return { THEME_COLORS: {} };
      if (name.endsWith('/displayNames')) return names.exports;
      if (name.endsWith('/BaseModal')) return { BaseModal: 'BaseModal' };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  const find = (node, predicate) => {
    if (!node || typeof node !== 'object') return undefined;
    if (predicate(node)) return node.props;
    return node.props?.children.flat(Infinity).map(child => find(child, predicate)).find(Boolean);
  };
  const render = () => {
    cursor = 0;
    const tree = exports.CriarTemplateModal({
      turmas: [], onClose: () => {}, onCreated: template => { created.push(template); },
    });
    return {
      input: find(tree, node => node.type === 'input' && node.props.type === 'text'),
      file: find(tree, node => node.type === 'input' && node.props.type === 'file'),
      submit: find(tree, node => node.type === 'button' && node.props.type === 'submit'),
      form: find(tree, node => node.type === 'form'),
      hasText: text => Boolean(find(tree, node => node.props.children.includes(text))),
    };
  };
  const upload = name => render().file.onChange({ target: { files: [{ name }] } });
  return { render, upload, created };
}

test('upload mantém o nome original no destaque e remove apenas a extensão do input', () => {
  for (const [original, expected] of [
    ['xyz.pdf', 'xyz'], ['modelo.html', 'modelo'], ['modelo.HTM', 'modelo'],
    ['PTCC - Levi Júnior - 121210472 (1).pdf', 'PTCC - Levi Júnior - 121210472 (1)'],
    ['plano.v2.PDF', 'plano.v2'],
  ]) {
    const app = setup();
    app.upload(original);
    assert.equal(app.render().input.value, expected);
    assert.equal(app.render().hasText(original), true);
  }
});

test('renomear xyz.pdf para wxy envia wxy.html sem alterar o arquivo original', async () => {
  const app = setup();
  app.upload('xyz.pdf');
  app.render().input.onChange({ target: { value: 'wxy' } });
  assert.equal(app.render().input.value, 'wxy');
  assert.equal(app.render().hasText('xyz.pdf'), true);
  await app.render().form.onSubmit({ preventDefault() {} });
  assert.equal(app.created.length, 1);
  assert.equal(app.created[0].title, 'wxy.html');
  assert.equal(app.created[0].fileName, 'xyz.pdf');
  assert.equal(app.render().hasText('wxy'), true);
});

test('nome com pontos internos não perde versão ao salvar', async () => {
  const app = setup();
  app.upload('plano.v2.pdf');
  await app.render().form.onSubmit({ preventDefault() {} });
  assert.equal(app.created[0].title, 'plano.v2.html');
});

test('extensão digitada manualmente é normalizada sem duplicar o sufixo HTML', async () => {
  for (const name of ['wxy.pdf', 'wxy.html', ' wxy.PDF ']) {
    const app = setup();
    app.upload('xyz.pdf');
    app.render().input.onChange({ target: { value: name } });
    await app.render().form.onSubmit({ preventDefault() {} });
    assert.equal(app.created[0].title, 'wxy.html');
  }
});

test('nome vazio ou composto apenas de extensão não permite criar', async () => {
  for (const name of ['', '   ', '.pdf', ' .html ']) {
    const app = setup();
    app.upload('xyz.pdf');
    app.render().input.onChange({ target: { value: name } });
    assert.equal(app.render().submit.disabled, true);
    await app.render().form.onSubmit({ preventDefault() {} });
    assert.equal(app.created.length, 0);
  }
});
