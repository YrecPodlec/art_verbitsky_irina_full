import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nextImageIndex} from './imageNavigation';

test('Просмотрщик: следующий и предыдущий кадр', () => {
  assert.equal(nextImageIndex(2, 1, 10), 3); assert.equal(nextImageIndex(2, -1, 10), 1);
});
test('Просмотрщик: циклический переход на границах', () => {
  assert.equal(nextImageIndex(9, 1, 10), 0); assert.equal(nextImageIndex(0, -1, 10), 9);
});
test('Просмотрщик: один кадр и пустой список', () => {
  assert.equal(nextImageIndex(0, 1, 1), 0); assert.equal(nextImageIndex(0, -1, 1), 0); assert.equal(nextImageIndex(0, 1, 0), 0);
});
