import assert from 'node:assert/strict';
import test from 'node:test';
import {getProjectCover} from './getProjectCover';
import type {ProjectMedia} from '@/app/generated/prisma/client';

const image = (id: string): ProjectMedia => ({
  id, contentKey: id, category: 'visualization', url: `/projects/${id}.webp`,
  width: 1000, height: 1000, storageKey: null, mimeType: 'image/webp', sizeBytes: null, room: null,
});
const first = image('first');
const cover = image('cover');

test('Выбранная обложка определяется по ID, а не позиции в массиве', () => {
  assert.equal(getProjectCover({coverMediaId: 'cover', media: [first, cover]}), cover);
  assert.equal(getProjectCover({coverMediaId: 'cover', media: [cover, first]}), cover);
});

test('Без явного ID используется первое изображение', () => {
  assert.equal(getProjectCover({coverMediaId: null, media: [first, cover]}), first);
});

test('Несуществующую обложку нельзя молча подменить', () => {
  assert.throws(() => getProjectCover({coverMediaId: 'missing', media: [first]}), /PROJECT_COVER_NOT_FOUND/);
});

test('Без изображений проект не готов к карточке', () => {
  assert.throws(() => getProjectCover({coverMediaId: null, media: []}), /PROJECT_COVER_NOT_FOUND/);
});
