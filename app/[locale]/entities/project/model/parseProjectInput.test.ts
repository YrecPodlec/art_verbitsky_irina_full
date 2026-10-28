import assert from 'node:assert/strict';
import test from 'node:test';
import {parseProjectInput, ProjectInputError} from './parseProjectInput';

const draft = {slug: 'test-project', contentKey: 'testProject', type: 'residential', category: 'house'};
const image = {id: '123-cover', contentKey: 'cover', category: 'visualization', url: '/projects/test/cover.webp', width: 2028, height: 1525};

test('Офис допустим только для коммерческого проекта', () => {
  assert.equal(parseProjectInput({...draft, type: 'commercial', category: 'office'}).category, 'office');
  assert.throws(() => parseProjectInput({...draft, type: 'residential', category: 'office'}), ProjectInputError);
});

test('Минимальная запись — черновик без изображений, текстов и клиентского ID', () => {
  const result = parseProjectInput({...draft, id: 'forged', name: 'Do not store', createdAt: 'forged'});
  assert.equal(result.publicationStatus, 'draft');
  assert.equal(result.featured, false);
  assert.deepEqual(result.media, []);
  assert.equal('id' in result, false);
  assert.equal('name' in result, false);
  assert.equal('createdAt' in result, false);
});

test('Публикация требует обложку, дата выставляется сервером', () => {
  assert.throws(() => parseProjectInput({...draft, publicationStatus: 'published'}), ProjectInputError);
  const result = parseProjectInput({...draft, publicationStatus: 'published', media: [image]});
  assert.equal(result.coverMediaId, image.id);
  assert.ok(result.publishedAt instanceof Date);
});

test('Разрешён публичный Blob и корректные проценты кадрирования', () => {
  const result = parseProjectInput({...draft, media: [{...image, url: 'https://mstvzrmidf14lpdu.public.blob.vercel-storage.com/projects/test/cover.webp'}], coverPosition: {x: 70, y: 50}});
  assert.deepEqual(result.coverPosition, {x: 70, y: 50});
});

for (const [field, value] of Object.entries({
  slug: '../unsafe', contentKey: 'miami.name', category: 'hotel', type: 'unknown',
  publicationStatus: 'unknown', featured: 'true', countryCode: 'USA', citySlug: 'New York',
  areaM2: -1, year: 2020.5, coverPosition: {x: 101, y: 50}, coverMediaId: 'absent', media: {},
})) {
  test(`Некорректное поле ${field} отклоняется`, () => {
    assert.throws(() => parseProjectInput({...draft, [field]: value}), ProjectInputError);
  });
}

for (const url of ['http://localhost/a.webp', 'https://example.com/a.webp', 'data:image/png;base64,abc', '//example.com/a.webp', '/projects/../../a.webp', 'https://mstvzrmidf14lpdu.public.blob.vercel-storage.com/projects/a.webp?token=x']) {
  test(`Небезопасный адрес отклоняется: ${url}`, () => {
    assert.throws(() => parseProjectInput({...draft, media: [{...image, url}]}), ProjectInputError);
  });
}

test('Изображения проверяются: размеры, категория, ID и ключи не дублируются', () => {
  for (const invalid of [{width: 0}, {height: 1.5}, {category: 'video'}, {contentKey: 'cover.alt'}]) {
    assert.throws(() => parseProjectInput({...draft, media: [{...image, ...invalid}]}), ProjectInputError);
  }
  assert.throws(() => parseProjectInput({...draft, media: [image, image]}), ProjectInputError);
  assert.throws(() => parseProjectInput({...draft, media: Array(61).fill(image)}), ProjectInputError);
});

test('Проверка не изменяет исходный объект', () => {
  const source = {...draft, media: [image]};
  const snapshot = JSON.stringify(source);
  parseProjectInput(source);
  assert.equal(JSON.stringify(source), snapshot);
});
