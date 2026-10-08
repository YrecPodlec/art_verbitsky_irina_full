import assert from 'node:assert/strict';
import test from 'node:test';
import {categoriesByType, isProjectClassification} from '../app/[locale]/entities/project/model/projectClassification';
import {projectValidator} from './projectValidator';

test('MongoDB требует оба поля классификации и объект документа', () => {
  assert.equal(projectValidator.$jsonSchema.bsonType, 'object');
  assert.deepEqual(projectValidator.$jsonSchema.required, ['type', 'category']);
});

for (const type of Object.keys(categoriesByType)) {
  for (const category of Object.values(categoriesByType).flat()) {
    test(`MongoDB oneOf и проверка приложения согласованы: ${type}/${category}`, () => {
      const matches = projectValidator.$jsonSchema.oneOf.filter(({properties}) =>
        properties.type.enum.includes(type) && (properties.category.enum as string[]).includes(category),
      );
      assert.equal(matches.length === 1, isProjectClassification({type, category}));
    });
  }
}
