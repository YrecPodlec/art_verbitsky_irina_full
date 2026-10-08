import assert from 'node:assert/strict';
import test from 'node:test';
import {readJson} from './readJson';

const request = (body: string, contentType = 'application/json') => new Request('https://example.com/api/projects', {
  method: 'POST', headers: {'Content-Type': contentType}, body,
});

test('Читает обычный JSON с charset', async () => {
  assert.deepEqual(await readJson(request('{"contentKey":"miami"}', 'application/json; charset=utf-8')), {contentKey: 'miami'});
});
test('Отклоняет неправильный JSON и Content-Type', async () => {
  await assert.rejects(readJson(request('{')), /INVALID_JSON/);
  await assert.rejects(readJson(request('{}', 'text/plain')), /UNSUPPORTED_MEDIA_TYPE/);
});
test('Ограничение считает байты, включая многобайтный текст', async () => {
  await assert.rejects(readJson(request('"яяяя"'), 5), /PAYLOAD_TOO_LARGE/);
});
