import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from './project-import.catalog.json';
import {buildProjectImport, type InspectedImage} from './buildProjectImport';

const entry = {folder: 'test', slug: 'test-project', contentKey: 'test', type: 'residential', category: 'apartment'};
function image(n: number): InspectedImage {
  return {folder: 'test', file: `${n}.webp`, storageKey: `projects/test/${n}.webp`,
    url: `https://mstvzrmidf14lpdu.public.blob.vercel-storage.com/projects/test/${n}.webp`,
    contentKey: `image${n}`, width: 1200, height: 1600, mimeType: 'image/webp', sizeBytes: 1000, verified: true};
}
test('natural order, stable keys, real metadata and no invented area/year', () => {
  const result = buildProjectImport(entry, [image(10), image(2), image(1)]);
  assert.deepEqual(result.media.map((file) => file.contentKey), ['cover', 'image2', 'image10']);
  assert.equal(result.coverMediaId, 'test-project-cover');
  assert.equal(result.media[0].width, 1200);
  assert.equal(result.media[0].height, 1600);
  assert.equal(result.areaM2, undefined);
  assert.equal(result.year, undefined);
  assert.equal(result.featured, false);
  assert.equal(result.publicationStatus, 'published');
});
test('explicit cover remains stable regardless of input order', () => {
  const result = buildProjectImport({...entry, coverFile: '2.webp'}, [image(10), image(2), image(1)]);
  assert.equal(result.media.find((file) => file.id === result.coverMediaId)?.url, image(2).url);
});
test('missing, unverified, foreign and duplicate images are rejected', () => {
  assert.throws(() => buildProjectImport(entry, []));
  assert.throws(() => buildProjectImport({...entry, coverFile: 'absent.webp'}, [image(1)]));
  assert.throws(() => buildProjectImport(entry, [{...image(1), verified: false}]));
  assert.throws(() => buildProjectImport(entry, [{...image(1), url: 'https://example.com/1.webp'}]));
  assert.throws(() => buildProjectImport(entry, [image(1), image(1)]));
});
test('office is commercial only', () => {
  assert.equal(buildProjectImport({...entry, type: 'commercial', category: 'office'}, [image(1)]).category, 'office');
  assert.throws(() => buildProjectImport({...entry, category: 'office'}, [image(1)]));
});
test('catalog has unique folders, slugs and translation keys, with one commercial office', () => {
  for (const key of ['folder', 'slug', 'contentKey'] as const) {
    assert.equal(new Set(catalog.map((entry) => entry[key])).size, catalog.length);
  }
  assert.equal(catalog.length, 19);
  assert.deepEqual(catalog.filter((entry) => entry.type === 'commercial').map((entry) => entry.folder), ['office_miami']);
  for (const entry of catalog) assert.doesNotThrow(() => buildProjectImport(entry, [{...image(1),
    folder: entry.folder, file: entry.coverFile ?? '1.webp',
    storageKey: `projects/${entry.folder}/${entry.coverFile ?? '1.webp'}`,
    url: `https://mstvzrmidf14lpdu.public.blob.vercel-storage.com/projects/${entry.folder}/${entry.coverFile ?? '1.webp'}`,
  }]));
});
