import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import test from 'node:test';
import {ProjectCategory, ProjectType} from '../../../../generated/prisma/enums.ts';
import {assertProjectClassification, categoriesByType, isProjectClassification} from './projectClassification.ts';

// Тесты запускаются встроенным runner Node 22.18+, без дополнительных зависимостей.
// Генерируемый enum позволяет обнаружить новую категорию без обновления справочника.
test('справочник покрывает все типы и категории Prisma ровно один раз', () => {
  assert.deepEqual(Object.keys(categoriesByType).sort(), Object.values(ProjectType).sort());
  assert.deepEqual(Object.values(categoriesByType).flat().sort(), Object.values(ProjectCategory).sort());
});

test('названия всех типов, категорий и ошибка заполнены в каждой JSON-локали', () => {
  const folder = new URL('../../../../../messages/', import.meta.url);
  const files = readdirSync(folder).filter((name) => name.endsWith('.json'));
  assert.ok(files.length > 0);

  for (const name of files) {
    const {projectClassification: copy} = JSON.parse(readFileSync(new URL(name, folder), 'utf8'));
    assert.ok(copy, name);
    assert.deepEqual(Object.keys(copy.types).sort(), Object.values(ProjectType).sort(), name);
    assert.deepEqual(Object.keys(copy.categories).sort(), Object.values(ProjectCategory).sort(), name);

    for (const label of [...Object.values(copy.types), ...Object.values(copy.categories)]) {
      assert.equal(typeof label, 'string', name);
      assert.ok(label.trim().length > 0, name);
    }
    assert.equal(typeof copy.errors.invalidClassification, 'string', name);
    assert.ok(copy.errors.invalidClassification.trim().length > 0, name);
  }
});

// Проверяем всю матрицу, а не только одно удачное и одно ошибочное сочетание.
const validCategories = {
  residential: ['house', 'apartment'],
  commercial: ['hotel', 'cafe', 'office'],
};

for (const type of Object.values(ProjectType)) {
  for (const category of Object.values(ProjectCategory)) {
    test(`${type} + ${category}`, () => {
      const input = {type, category};
      const expected = validCategories[type].includes(category);
      assert.equal(isProjectClassification(input), expected);

      if (expected) {
        assert.doesNotThrow(() => assertProjectClassification(input));
      } else {
        assert.throws(() => assertProjectClassification(input), {
          name: 'TypeError',
          message: 'INVALID_PROJECT_CLASSIFICATION',
        });
      }
    });
  }
}

test('неполные данные, неизвестные значения и неверные типы отклоняются', () => {
  const invalidInputs = [
    null,
    undefined,
    [],
    'residential',
    42,
    {},
    {type: 'residential'},
    {category: 'house'},
    {type: 'unknown', category: 'house'},
    {type: 'residential', category: 'unknown'},
    {type: 'commercial', category: ''},
    {type: null, category: 'house'},
    {type: 'residential', category: ['house']},
    {type: 'residential', category: 1},
    {type: 'constructor', category: 'house'},
    {type: '__proto__', category: 'house'},
  ];

  for (const input of invalidInputs) {
    assert.equal(isProjectClassification(input), false);
    assert.throws(() => assertProjectClassification(input), TypeError);
  }
});

test('проверка полного объекта проекта не удаляет и не меняет другие поля', () => {
  const input = {type: 'residential', category: 'house', slug: 'miami-house', featured: true};
  const original = {...input};
  assertProjectClassification(input);
  assert.deepEqual(input, original);
});

test('при частичном обновлении проверяем сочетание с сохранённым вторым полем', () => {
  const saved = {type: 'residential', category: 'house'};
  assert.equal(isProjectClassification({...saved, type: 'commercial'}), false);
  assert.equal(isProjectClassification({...saved, category: 'hotel'}), false);
  assert.equal(isProjectClassification({...saved, type: 'commercial', category: 'hotel'}), true);
});
