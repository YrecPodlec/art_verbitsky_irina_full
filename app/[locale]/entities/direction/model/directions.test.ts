import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {directions, type Direction} from './directions';
import ru from '@/messages/ru.json';
import en from '@/messages/en.json';

test('Направления: уникальные id и ключи, реальные локальные изображения и внутренние ссылки', () => {
  assert.ok(directions.length > 0);
  for (const key of ['id', 'contentKey'] as const) assert.equal(new Set(directions.map((item) => item[key])).size, directions.length);
  for (const item of directions) {
    assert.match(item.href, /^\/(?!\/)/);
    assert.ok(existsSync(path.join(process.cwd(), 'public', item.image)));
  }
});
test('Все карточки имеют полный набор переводов в обеих локалях', () => {
  for (const messages of [ru, en]) {
    const dictionary = messages.home.directions.items as Record<string, Record<string, string>>;
    for (const item of directions) for (const key of ['code', 'tag', 'kicker', 'title', 'description', 'action', 'imageAlt']) {
      assert.ok(dictionary[item.contentKey]?.[key]?.trim(), `${item.contentKey}.${key}`);
    }
  }
});
test('Модель не ограничивает число карточек двумя или тремя', () => {
  const items: Direction[] = Array.from({length: 15}, (_, index) => ({id: `direction-${index}`, contentKey: `direction${index}`, href: `/direction-${index}`, image: '/interior/interior-evening.png'}));
  assert.equal(new Set(items.map((item) => item.id)).size, 15);
  const widget = readFileSync(new URL('../../../widgets/homeDirections/ui/HomeDirections.tsx', import.meta.url), 'utf8');
  assert.ok(widget.includes('directions.map('));
  assert.ok(!widget.includes('.slice('));
});
test('Прокрутка списка ограничена высотой, имеет клавиатурный доступ и не перехватывает wheel', () => {
  const widget = readFileSync(new URL('../../../widgets/homeDirections/ui/HomeDirections.tsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../../../widgets/homeDirections/ui/HomeDirections.module.scss', import.meta.url), 'utf8');
  assert.ok(widget.includes('tabIndex={0}'));
  assert.ok(widget.includes('aria-describedby='));
  assert.match(css, /overflow-y:\s*auto/);
  assert.match(css, /block-size:\s*clamp/);
  assert.match(css, /@media/);
  assert.ok(!widget.includes('onWheel'));
});
