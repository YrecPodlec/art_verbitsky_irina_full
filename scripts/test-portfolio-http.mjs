import assert from 'node:assert/strict';

// Интеграционная проверка запущенного локального Next. Только GET: данные БД не меняются.
const base = new URL(process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:3000');
if (!['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) throw new Error('Only a local server may be tested');
let checks = 0;
async function read(path) {
  const response = await fetch(new URL(path, base), {signal: AbortSignal.timeout(45000)});
  const html = await response.text();
  assert.equal(response.status, 200, `HTTP ${path}`);
  assert.ok(!html.includes('PROJECT_CATALOG_LOAD_FAILED') && !html.includes('NEXT_HTTP_ERROR_FALLBACK;500'), `Server error: ${path}`);
  return html;
}
function check(condition, label) {assert.ok(condition, label); checks++; console.log(`OK: ${label}`);}
const response = await fetch(new URL('/api/projects?limit=100', base), {signal: AbortSignal.timeout(30000)});
assert.equal(response.status, 200, 'API is available');
const records = await response.json();
check(Array.isArray(records), 'API returns projects from MongoDB');
const miami = records.find((item) => item.contentKey === 'miami');
if (miami) check(records[0].id === miami.id, 'API: Miami is first regardless of creation date');
const project = records[0];
const isCard = (html, id) => new RegExp(`<article[^>]*data-project-id="${id}"`).test(html);
const cardIds = (html) => [...html.matchAll(/<article[^>]*data-project-id="([^"]+)"/g)].map((match) => match[1]);
const pageSize = 6;
function checkPagination(html, current, total, label) {
  const nav = html.match(/<nav\b[^>]*data-pagination="true"[^>]*>[\s\S]*?<\/nav>/)?.[0];
  check(Boolean(nav), `${label}: pagination is present`);
  const numbers = [...nav.matchAll(/<a\b[^>]*>(\d+)<\/a>/g)].map((match) => Number(match[1]));
  check(JSON.stringify(numbers) === JSON.stringify(Array.from({length: total}, (_, index) => index + 1)), `${label}: one numbered link per page`);
  check(new RegExp(`aria-current="page"[^>]*>${current}</a>`).test(nav), `${label}: current page is highlighted`);
  check((nav.match(/<svg\b/g) ?? []).length === 2 && nav.includes('M20 12H4') && nav.includes('M4 12h16'), `${label}: both horizontal arrows are always present`);
  const disabled = (nav.match(/<button\b[^>]*\bdisabled(?:="")?[^>]*>/g) ?? []).length;
  check(disabled === Number(current === 1) + Number(current === total), `${label}: only boundary arrows are disabled`);
  check(nav.includes('rel="prev"') === (current > 1) && nav.includes('rel="next"') === (current < total), `${label}: available arrows are real navigation links`);
}

for (const locale of ['ru', 'en']) {
  const catalog = await read(`/${locale}/gallery`);
  check(catalog.includes('id="catalog"'), `${locale}: catalog renders on server`);
  if (!project) continue;
  check(isCard(catalog, project.id), `${locale}: published project has a card`);
  check(catalog.includes(`/${locale}/gallery/${project.slug}`), `${locale}: card links to its case`);
  if (miami) check(cardIds(catalog)[0] === miami.id, `${locale}: Miami is the first catalog card`);
  for (const [page, html] of [['gallery', catalog], ['interior', await read(`/${locale}/interior`)]]) {
    // Асинхронные серверные изображения могут прийти отдельным сегментом потока Next.
    const covers = [...html.matchAll(/<img\b[^>]*data-project-cover="([^"]+)"[^>]*>/g)];
    check(covers.length === 1, `${locale}: ${page} has one static Miami cover`);
    check(covers.every((match) => match[1] === 'miami'), `${locale}: ${page} background covers are Miami only`);
    check(!html.includes('data-hero-controls') && !html.includes('data-hero-projects'), `${locale}: ${page} has no slideshow or image switcher`);
    check(html.includes('interior-evening') === (page === 'interior'), `${locale}: ${page} uses its configured hero image`);
    const cover = miami.media.find((image) => image.id === miami.coverMediaId);
    check(covers.every((match) => match[0].includes(encodeURIComponent(cover.url))), `${locale}: ${page} uses the actual Miami database cover`);
    if (page === 'interior') {
      check(covers.some((match) => match[0].includes('loading="lazy"')), `${locale}: lower Miami background loads lazily`);
      check(/<img\b[^>]*src="[^"]*irina\.[^>]*>/.test(html), `${locale}: designer portrait uses the local Irina photo`);
    }
  }
  const pages = Math.ceil(records.length / pageSize);
  check(cardIds(catalog).length === Math.min(records.length, pageSize), `${locale}: first page shows at most six projects`);
  checkPagination(catalog, 1, pages, `${locale}: first page`);
  if (pages > 1) {
    const last = await read(`/${locale}/gallery?page=${pages}`);
    checkPagination(last, pages, pages, `${locale}: last page`);
    check(cardIds(last).length === records.length - (pages - 1) * pageSize, `${locale}: final page contains the remaining projects`);
  }
  if (pages > 2) checkPagination(await read(`/${locale}/gallery?page=2`), 2, pages, `${locale}: middle page`);
  const officePage = await read(`/${locale}/gallery?type=commercial&category=office`);
  const officeCount = records.filter((item) => item.type === 'commercial' && item.category === 'office').length;
  if (officeCount > 0 && officeCount <= pageSize) {
    checkPagination(officePage, 1, 1, `${locale}: single-page office filter`);
  }
  const details = await read(`/${locale}/gallery/${project.slug}`);
  check(details.includes('id="visuals"') && details.includes('id="documents"'), `${locale}: visuals and drawings sections exist`);
  check(details.includes('<dialog'), `${locale}: native image viewer is rendered`);
  if (project.media.some((image) => image.category === 'visualization')) {
    check(details.includes('data-layout="masonry"'), `${locale}: visualizations use the Pinterest layout`);
    check(details.includes('q=90'), `${locale}: high-quality image previews`);
  }
  check(!details.includes('MISSING_MESSAGE'), `${locale}: translations resolve`);
  const byType = await read(`/${locale}/gallery?type=${project.type}`);
  check(isCard(byType, project.id), `${locale}: project type filter`);
  const bySearch = await read(`/${locale}/gallery?q=${encodeURIComponent(project.slug)}`);
  check(isCard(bySearch, project.id), `${locale}: search finds the project`);
  const empty = await read(`/${locale}/gallery?q=portfolio-empty-check-8f32a91`);
  check(!/<article[^>]*data-project-id=/.test(empty), `${locale}: unmatched search has no fake cards`);
  const missingResponse = await fetch(new URL(`/${locale}/gallery/project-does-not-exist-8f32a91`, base), {signal: AbortSignal.timeout(30000)});
  const missing = await missingResponse.text();
  check([200, 404].includes(missingResponse.status) && /name="robots" content="noindex/.test(missing), `${locale}: missing project is not indexed`);
}

if (process.argv.includes('--all-projects') && records.length) {
  // Полная проверка после импорта: пагинация и оба языка каждого кейса. Только GET.
  const found = [];
  for (let page = 1; page <= Math.ceil(records.length / pageSize); page++) {
    const ids = cardIds(await read(`/ru/gallery?page=${page}`));
    check(ids.length <= pageSize && ids.length > 0, `pagination: page ${page} contains 1–6 projects`);
    found.push(...ids);
  }
  check(found.length === records.length && new Set(found).size === records.length,
    'pagination: every published project appears exactly once');
  for (const item of records) {
    for (const locale of ['ru', 'en']) {
      const html = await read(`/${locale}/gallery/${item.slug}`);
      check(html.includes('id="visuals"') && !html.includes('MISSING_MESSAGE') &&
        !html.includes('NEXT_NOT_FOUND') && html.includes(item.media[0].url.split('/').pop()),
      `${locale}: ${item.slug} case resolves with images and translations`);
    }
    const cover = item.media.find((image) => image.id === item.coverMediaId) ?? item.media[0];
    const url = new URL('/_next/image', base);
    url.searchParams.set('url', cover.url); url.searchParams.set('w', '640'); url.searchParams.set('q', '90');
    const result = await fetch(url, {headers: {Accept: 'image/webp'}, signal: AbortSignal.timeout(45000)});
    check(result.status === 200 && result.headers.get('content-type')?.startsWith('image/') &&
      (await result.arrayBuffer()).byteLength > 0, `cover optimizer: ${item.slug}`);
  }
  const offices = records.filter((item) => item.type === 'commercial' && item.category === 'office');
  for (const locale of ['ru', 'en']) {
    const ids = cardIds(await read(`/${locale}/gallery?type=commercial&category=office`));
    check(ids.length === offices.length && offices.every((item) => ids.includes(item.id)), `${locale}: office filter excludes residential projects`);
  }
}

if (project) {
  // Проверяем оптимизатор Next, а не только прямые URL Blob. Маленький размер ограничивает трафик.
  for (const image of project.media) {
    const url = new URL('/_next/image', base);
    url.searchParams.set('url', image.url); url.searchParams.set('w', '640'); url.searchParams.set('q', '90');
    const result = await fetch(url, {headers: {Accept: 'image/webp'}, signal: AbortSignal.timeout(45000)});
    assert.equal(result.status, 200, `Next image: ${image.id}`);
    check(result.headers.get('content-type')?.startsWith('image/') && (await result.arrayBuffer()).byteLength > 0, `Next image optimizer: ${image.id}`);
  }
}
console.log(`Passed: ${checks} HTTP checks. No records were created or changed.`);
