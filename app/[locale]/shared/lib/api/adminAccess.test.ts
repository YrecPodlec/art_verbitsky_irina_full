import assert from 'node:assert/strict';
import test from 'node:test';
import {checkAdminAccess} from './adminAccess';

const token = 'unit-test-token-not-a-real-secret-12345';
const request = (authorization?: string, origin?: string) => new Request('https://example.com/api/projects', {
  headers: {...(authorization ? {Authorization: authorization} : {}), ...(origin ? {Origin: origin} : {})},
});

test('Без настройки сервер запрещает запись даже в dev', () => {
  assert.equal(checkAdminAccess(request(), '')?.status, 503);
  assert.equal(checkAdminAccess(request(), 'short')?.status, 503);
});
test('Без правильного Bearer-ключа доступ запрещён', () => {
  assert.equal(checkAdminAccess(request(), token)?.status, 401);
  assert.equal(checkAdminAccess(request('Bearer wrong'), token)?.status, 401);
  assert.equal(checkAdminAccess(request(`Basic ${token}`), token)?.status, 401);
});
test('Правильный ключ разрешает запрос своего сайта', () => {
  assert.equal(checkAdminAccess(request(`Bearer ${token}`, 'https://example.com'), token), null);
});
test('Другой origin запрещён даже при правильном ключе', () => {
  assert.equal(checkAdminAccess(request(`Bearer ${token}`, 'https://other.example'), token)?.status, 403);
});
