import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';

// Только GET к локальному Next. Главная и Art не должны зависеть от MongoDB.
const base = new URL(process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:3000');
if (!['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) throw new Error('LOCAL_SERVER_REQUIRED');
let count = 0;
const directions = JSON.parse(readFileSync(path.join('app', '[locale]', 'entities', 'direction', 'model', 'directions.mock.json'), 'utf8'));
function check(value, label) { assert.ok(value, label); count++; console.log(`OK: ${label}`); }
async function read(route) {
  const start = Date.now();
  const response = await fetch(new URL(route, base), {signal: AbortSignal.timeout(20000)});
  const html = await response.text();
  check(response.status === 200, `${route}: HTTP 200 (${Date.now() - start} ms)`);
  check(!/MISSING_MESSAGE|FORMATTING_ERROR|NEXT_HTTP_ERROR_FALLBACK;500|PROJECT_CATALOG_LOAD_FAILED/.test(html), `${route}: no render/translation errors`);
  return html;
}
for (const locale of ['ru', 'en']) {
  const messages = JSON.parse(readFileSync(path.join('messages', `${locale}.json`), 'utf8'));
  const html = await read(`/${locale}`);
  check(html.includes(`lang="${locale}"`), `${locale}: document language`);
  check((html.match(/<h1\b/g) ?? []).length === 1, `${locale}: one main heading`);
  check(html.includes('data-home-page="true"'), `${locale}: new home page`);
  check((html.match(/data-home-header="true"/g) ?? []).length === 1 && !html.includes('data-interior-header="true"'), `${locale}: only the home header`);
  check((html.match(/data-site-footer="true"/g) ?? []).length === 1, `${locale}: one common footer`);
  check(html.includes('data-directions-scroll="true"') && html.includes('tabindex="0"'), `${locale}: keyboard-accessible scroll panel`);
  const ids = [...html.matchAll(/data-direction-id="([^"]+)"/g)].map((match) => match[1]);
  check(JSON.stringify(ids) === JSON.stringify(directions.map((item) => item.id)), `${locale}: mock directions rendered in order`);
  check(directions.every((item) => html.includes(`href="/${locale}${item.href}"`)), `${locale}: localized direction links`);
  check(directions.every((item) => html.includes(messages.home.directions.items[item.contentKey].title)), `${locale}: direction titles from messages`);
  check(html.includes('aria-controls=') && html.includes('aria-expanded="false"') && /\/_next\/static\/media\/(?:ru|us)\.[^"<>]+\.svg/.test(html), `${locale}: existing dropdown language switcher with local flags`);
  check(html.includes('irina.') && html.includes('q=90'), `${locale}: local portrait and optimized images`);
  const art = await read(`/${locale}/art`);
  check(art.includes('/home/art-study.svg') && art.includes(messages.home.artPreview.title), `${locale}: art preview is a real route`);
  check(art.includes('name="robots" content="noindex'), `${locale}: placeholder is not indexed`);
  check(art.includes('data-home-header="true"') && (art.match(/data-site-footer="true"/g) ?? []).length === 1, `${locale}: preview reuses its layout`);
}
for (const asset of ['/home/monogram.svg', '/home/art-study.svg', '/interior/irina.jpg', '/interior/interior-evening.png']) {
  const response = await fetch(new URL(asset, base), {signal: AbortSignal.timeout(15000)});
  check(response.ok && (await response.arrayBuffer()).byteLength > 0, `local asset ${asset}`);
}
// Два типичных размера через реальный оптимизатор Next, без запросов к Blob.
for (const asset of ['/interior/irina.jpg', '/interior/interior-evening.png']) {
  const url = new URL('/_next/image', base); url.searchParams.set('url', asset); url.searchParams.set('w', '640'); url.searchParams.set('q', '90');
  const response = await fetch(url, {signal: AbortSignal.timeout(20000)});
  check(response.status === 200 && response.headers.get('content-type')?.startsWith('image/') && (await response.arrayBuffer()).byteLength > 0, `Next optimizer ${asset}`);
}
console.log(`Passed ${count} home HTTP checks. No data was created or changed.`);
