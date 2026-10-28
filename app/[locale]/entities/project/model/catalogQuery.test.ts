import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG_PAGE_SIZE, parseCatalogFilters, catalogHref, matchingContentKeys} from './catalogQuery';

test('Каталог: на странице шесть проектов', () => {
  assert.equal(CATALOG_PAGE_SIZE, 6);
});

test('Каталог: безопасные значения по умолчанию', () => {
  assert.deepEqual(parseCatalogFilters({}), {type: '', category: '', country: '', q: '', page: 1});
});
test('Каталог: категория соответствует типу, страна нормализуется', () => {
  const value = parseCatalogFilters({type: 'residential', category: 'hotel', country: 'us', page: '-2'});
  assert.equal(value.category, ''); assert.equal(value.country, 'US'); assert.equal(value.page, 1);
  assert.equal(parseCatalogFilters({type: 'commercial', category: 'hotel'}).category, 'hotel');
});
test('Каталог: повторные и некорректные параметры не попадают в запрос', () => {
  const value = parseCatalogFilters({type: ['commercial', 'residential'], country: 'USA', page: 'Infinity', q: 'x'.repeat(120)});
  assert.equal(value.type, ''); assert.equal(value.country, ''); assert.equal(value.page, 1); assert.equal(value.q.length, 100);
});
test('Каталог: URL кодирует поиск, сохраняет фильтры и номер страницы', () => {
  const value = parseCatalogFilters({type: 'residential', category: 'house', q: ' Майами & дом ', page: '2'});
  const url = new URL(catalogHref(value), 'https://example.test');
  assert.equal(url.searchParams.get('q'), 'Майами & дом'); assert.equal(url.searchParams.get('page'), '2');
  assert.equal(catalogHref(parseCatalogFilters({})), '/gallery');
});
test('Каталог: поиск по переводам не воспринимает регулярные выражения', () => {
  const projects = {miami: {name: 'Майами', city: 'MIAMI', summary: 'Природа внутри'}, other: {name: 'Другой'}};
  assert.deepEqual(matchingContentKeys(projects, 'МАЙАМИ'), ['miami']);
  assert.deepEqual(matchingContentKeys(projects, '.*'), []);
  assert.deepEqual(matchingContentKeys(projects, 'miami'), ['miami']);
});
