import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requestSource = fs.readFileSync(path.join(root, 'src/utils/request.js'), 'utf8')
  .replace(/^import .*$/gm, '')
  .replace('export default {\n  get, post, put, del,\n};', 'return { get, post, put, del };');
// Uni-only transport regression; exercises production exports without bundler aliases.
// eslint-disable-next-line no-new-func
const createRequest = new Function('BASE_URL', 'toLoginPage', 'setTimeout', requestSource);
const serviceSource = fs.readFileSync(path.join(root, 'src/services/word.js'), 'utf8')
  .replace(/^import .*$/gm, '')
  .replace(/export async function /g, 'async function ');
// eslint-disable-next-line no-new-func
const createWordService = new Function(
  'splitDefinition',
  'request',
  `${serviceSource}\nreturn { getWordDetails };`,
);

function mockUni(responses) {
  const calls = {
    loading: [],
    hidden: 0,
    toasts: [],
    requests: [],
  };
  // eslint-disable-next-line no-undef
  globalThis.uni = {
    showLoading(value) { calls.loading.push(value); },
    hideLoading() { calls.hidden += 1; },
    showToast(value) { calls.toasts.push(value); },
    getStorageSync() { return 'test-token'; },
    request(options) {
      calls.requests.push(options);
      const result = responses.shift();
      return result instanceof Error ? Promise.reject(result) : Promise.resolve(result);
    },
  };
  return calls;
}

const requestApi = (
  scheduleTimeout = setTimeout,
  redirect = () => { throw new Error('unexpected login redirect'); },
) => createRequest('/api', redirect, scheduleTimeout);

test('default request still shows and hides its loading mask', async () => {
  const calls = mockUni([{ statusCode: 200, data: { ok: true } }]);
  const result = await requestApi().get('/words/1');
  assert.deepEqual(result, { ok: true });
  assert.deepEqual(calls.loading, [{ title: '加载中', mask: true }]);
  assert.equal(calls.hidden, 1);
  assert.deepEqual(calls.toasts, []);
});

test('default network failures keep the legacy loading and toast behavior', async () => {
  const calls = mockUni([new Error('offline')]);
  const error = await requestApi().get('/words/1').then(
    () => assert.fail('Expected network failure to reject'),
    (value) => value,
  );
  assert.equal(error.message, 'offline');
  assert.deepEqual(calls.loading, [{ title: '加载中', mask: true }]);
  assert.equal(calls.hidden, 1);
  assert.deepEqual(calls.toasts, [{ title: '网络错误', icon: 'error' }]);
});

test('background success does not touch global loading or toast UI', async () => {
  const calls = mockUni([{ statusCode: 200, data: { ok: true } }]);
  const result = await requestApi().get('/words/1', null, false, { background: true });
  assert.deepEqual(result, { ok: true });
  assert.deepEqual(calls.loading, []);
  assert.equal(calls.hidden, 0);
  assert.deepEqual(calls.toasts, []);
});

test('background HTTP failure rejects without loading, toast or redirect', async () => {
  const scheduled = [];
  const redirects = [];
  const api = requestApi(
    (callback, delay) => {
      scheduled.push({ callback, delay });
      return scheduled.length;
    },
    () => redirects.push(true),
  );

  await Promise.all([401, 403, 404, 500, 503].map(async (statusCode) => {
    const calls = mockUni([{ statusCode, data: { msg: 'http error' } }]);
    const error = await api.get('/words/1', null, false, { background: true }).then(
      () => assert.fail(`Expected HTTP ${statusCode} failure to reject`),
      (value) => value,
    );
    assert.equal(error.statusCode, statusCode);
    assert.deepEqual(calls.loading, []);
    assert.equal(calls.hidden, 0);
    assert.deepEqual(calls.toasts, []);
  }));

  assert.deepEqual(scheduled, []);
  assert.deepEqual(redirects, []);
});

test('background network failure rejects without loading or toast UI', async () => {
  const calls = mockUni([new Error('offline')]);
  const error = await requestApi().get('/words/1', null, false, { background: true }).then(
    () => assert.fail('Expected network failure to reject'),
    (value) => value,
  );
  assert.equal(error.message, 'offline');
  assert.deepEqual(calls.loading, []);
  assert.equal(calls.hidden, 0);
  assert.deepEqual(calls.toasts, []);
});

test('legacy noPrompt suppresses HTTP toast but keeps its loading behavior', async () => {
  const calls = mockUni([{ statusCode: 404, data: { msg: 'not found' } }]);
  const error = await requestApi().get('/words/1', null, true).then(
    () => assert.fail('Expected HTTP failure to reject'),
    (value) => value,
  );
  assert.equal(error.statusCode, 404);
  assert.deepEqual(calls.loading, [{ title: '加载中', mask: true }]);
  assert.equal(calls.hidden, 1);
  assert.deepEqual(calls.toasts, []);
});

test('word service forwards background options and keeps response unwrapping/definitions', async () => {
  const calls = mockUni([{ statusCode: 200, data: { word: { id: 8, word: '家己', definition: '自称' } } }]);
  const api = createWordService(
    (definition) => ['parsed:', definition],
    requestApi(),
  );
  const result = await api.getWordDetails(8, { background: true });
  assert.deepEqual(calls.requests.map(({ method, url, data }) => ({ method, url, data })), [
    { method: 'get', url: '/api/words/8', data: null },
  ]);
  assert.deepEqual(calls.loading, []);
  assert.equal(calls.hidden, 0);
  assert.deepEqual(result, {
    id: 8,
    word: '家己',
    definition: '自称',
    definitions: ['parsed:', '自称'],
  });
});
