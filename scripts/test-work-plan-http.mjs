import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

// Проверка только чтением: исходный PNG должен дойти до браузера без изменения байтов.
const base = new URL(process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:3000');
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname));
const original = readFileSync('public/plan.png');
assert.equal(original.subarray(1, 4).toString(), 'PNG');
const width = original.readUInt32BE(16), height = original.readUInt32BE(20);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const urls = new Set();
for (const locale of ['ru', 'en']) {
  const response = await fetch(new URL(`/${locale}/interior`, base), {signal: AbortSignal.timeout(20000)});
  assert.equal(response.status, 200);
  // Страница может ждать MongoDB в других блоках. Читаем только до готового img плана.
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let html = '', image;
  try {
    while (!image) {
      const {done, value} = await reader.read();
      if (done) break;
      html += decoder.decode(value, {stream: true});
      image = html.match(/<img\b[^>]*data-work-plan="true"[^>]*>/)?.[0];
    }
  } finally { await reader.cancel(); }
  assert.ok(image, `${locale}: plan is in server HTML`);
  const src = image.match(/\bsrc="([^"]+)"/)?.[1];
  assert.ok(src && !src.includes('/_next/image'), `${locale}: no image optimizer`);
  assert.ok(!html.includes(`href="${src}"`), `${locale}: plan does not open on click`);
  assert.ok(!image.includes('srcSet=') && !image.includes('srcset='), `${locale}: no reduced-size variants`);
  assert.ok(image.includes(`width="${width}"`) && image.includes(`height="${height}"`), `${locale}: original dimensions`);
  urls.add(src);
  console.log(`OK: ${locale}: original-size PNG, no optimizer or srcset`);
}
for (const src of urls) {
  const response = await fetch(new URL(src, base), {signal: AbortSignal.timeout(15000)});
  assert.equal(response.status, 200);
  assert.ok(response.headers.get('content-type')?.includes('image/png'));
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(hash(bytes), hash(original), 'Served bytes must exactly match public/plan.png');
  console.log(`OK: PNG matches the source byte-for-byte (${bytes.length} bytes)`);
}
