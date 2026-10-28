import {test} from 'node:test';
import assert from 'node:assert/strict';
import {galleryImageSizes} from './galleryPresentation';

test('Masonry: одинаковая ширина колонок для первого и остальных кадров', () => {
  assert.equal(galleryImageSizes('masonry', 0), galleryImageSizes('masonry', 9));
  assert.match(galleryImageSizes('masonry', 0), /\/ 2/);
});
test('Обычная сетка: первый кадр получает полноширинный источник', () => {
  assert.notEqual(galleryImageSizes('grid', 0), galleryImageSizes('grid', 1));
  assert.match(galleryImageSizes('grid', 0), /70vw/);
});
test('Обычная сетка: ширина остальных кадров не зависит от их порядкового номера', () => {
  assert.equal(galleryImageSizes('grid', 1), galleryImageSizes('grid', 10));
});
