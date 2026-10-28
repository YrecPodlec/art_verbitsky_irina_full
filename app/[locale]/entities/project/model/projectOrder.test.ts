import test from 'node:test';
import assert from 'node:assert/strict';
import {FIRST_PROJECT_CONTENT_KEY, projectPagePlan} from './projectOrder';

test('Майами закреплён первым независимо от даты и featured', () => {
  assert.equal(FIRST_PROJECT_CONTENT_KEY, 'miami');
});
test('Закреплённый проект занимает одно из шести мест первой страницы', () => {
  assert.deepEqual(projectPagePlan(0, 6, true), {includeFirst: true, skip: 0, take: 5});
  assert.deepEqual(projectPagePlan(0, 1, true), {includeFirst: true, skip: 0, take: 0});
});
test('Следующие страницы не теряют и не повторяют записи', () => {
  assert.deepEqual(projectPagePlan(6, 6, true), {includeFirst: false, skip: 5, take: 6});
  assert.deepEqual(projectPagePlan(18, 6, true), {includeFirst: false, skip: 17, take: 6});
});
test('Фильтр без Майами сохраняет обычную пагинацию', () => {
  assert.deepEqual(projectPagePlan(0, 6, false), {includeFirst: false, skip: 0, take: 6});
  assert.deepEqual(projectPagePlan(6, 6, false), {includeFirst: false, skip: 6, take: 6});
});
test('Запрос без лимита не теряет остальные проекты', () => {
  assert.deepEqual(projectPagePlan(0, undefined, true), {includeFirst: true, skip: 0, take: undefined});
});
