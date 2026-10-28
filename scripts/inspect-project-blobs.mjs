import 'dotenv/config';
import {list} from '@vercel/blob';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

// Только чтение Blob. Локальные отчёт и контактные листы — артефакты проверки,
// а не новые версии исходников; в хранилище ничего не загружается.
const output = path.resolve('.next/blob-inspection');
const prefix = 'projects/';
const host = 'mstvzrmidf14lpdu.public.blob.vercel-storage.com';
const collator = new Intl.Collator('en', {numeric: true});
await mkdir(output, {recursive: true});

async function inspect() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('BLOB_TOKEN_MISSING');
  const blobs = [];
  let cursor;
  do {
    const page = await list({prefix, cursor, limit: 1000, token, abortSignal: AbortSignal.timeout(30000)});
    blobs.push(...page.blobs);
    if (page.hasMore && (!page.cursor || page.cursor === cursor)) throw new Error('INVALID_BLOB_CURSOR');
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const groups = new Map();
  for (const blob of blobs) {
    if (!/\.(webp|png|jpe?g|avif)$/i.test(blob.pathname)) continue;
    const parts = blob.pathname.split('/');
    if (parts.length !== 3 || !/^[a-zA-Z0-9_-]+$/.test(parts[1])) throw new Error('UNSUPPORTED_BLOB_FOLDER');
    const url = new URL(blob.url);
    if (url.protocol !== 'https:' || url.hostname !== host || url.pathname.slice(1) !== blob.pathname || url.search) throw new Error('UNEXPECTED_BLOB_URL');
    if (!groups.has(parts[1])) groups.set(parts[1], []);
    groups.get(parts[1]).push(blob);
  }

  const files = [];
  const summary = [];
  for (const [folder, group] of groups) {
    group.sort((a, b) => collator.compare(a.pathname, b.pathname));
    const thumbnails = new Array(group.length);
    const entries = new Array(group.length);
    let next = 0;
    async function worker() {
      while (next < group.length) {
        const index = next++;
        const blob = group[index];
        const response = await fetch(blob.url, {redirect: 'error', signal: AbortSignal.timeout(30000)});
        if (!response.ok) throw new Error('IMAGE_HTTP_' + response.status);
        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length !== blob.size) throw new Error('BLOB_SIZE_CHANGED');
        const image = sharp(buffer, {failOn: 'warning'});
        const metadata = await image.metadata();
        if (!metadata.width || !metadata.height || !['webp', 'png', 'jpeg', 'avif'].includes(metadata.format)) throw new Error('INVALID_IMAGE');
        // Создание миниатюры декодирует пиксели, в отличие от одного чтения заголовка файла.
        const thumbnail = await image.rotate().resize(224, 160, {fit: 'inside', withoutEnlargement: true}).png().toBuffer();
        const stem = path.basename(blob.pathname, path.extname(blob.pathname));
        const contentKey = 'image' + stem.replace(/[^a-zA-Z0-9_]/g, '_');
        entries[index] = {
          folder, storageKey: blob.pathname, url: blob.url, file: path.basename(blob.pathname), contentKey,
          width: metadata.width, height: metadata.height, mimeType: metadata.format === 'jpeg' ? 'image/jpeg' : 'image/' + metadata.format,
          sizeBytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex'), verified: true,
        };
        thumbnails[index] = {input: thumbnail, left: (index % 5) * 240, top: Math.floor(index / 5) * 196};
      }
    }
    await Promise.all([worker(), worker(), worker()]);
    const rows = Math.ceil(group.length / 5);
    const labels = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${rows * 196}">${entries.map((entry, index) => `<text x="${(index % 5) * 240 + 4}" y="${Math.floor(index / 5) * 196 + 184}" fill="white" font-family="Arial" font-size="14">${index + 1}: ${entry.file.replace(/[<>&"]/g, '')}</text>`).join('')}</svg>`);
    await sharp({create: {width: 1200, height: rows * 196, channels: 3, background: '#202020'}})
      .composite([...thumbnails, {input: labels, left: 0, top: 0}]).webp({quality: 65}).toFile(path.join(output, folder + '.webp'));
    files.push(...entries);
    summary.push({folder, images: entries.length});
    console.log(JSON.stringify({checked: folder, images: entries.length}));
  }
  const hashes = new Map();
  for (const file of files) {
    if (!hashes.has(file.sha256)) hashes.set(file.sha256, []);
    hashes.get(file.sha256).push(file.storageKey);
  }
  const duplicateFiles = [...hashes.values()].filter((paths) => paths.length > 1);
  const report = {checkedAt: new Date().toISOString(), prefix, files, summary, duplicateFiles};
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({verifiedImages: files.length, folders: summary.length, duplicateGroups: duplicateFiles.length, report: '.next/blob-inspection/report.json'}));
}

inspect().catch((error) => {
  // Не печатаем объект ошибки SDK: он может содержать детали запроса с секретом.
  console.error(JSON.stringify({error: /^[A-Z0-9_]+$/.test(error.message) ? error.message : 'BLOB_INSPECTION_FAILED'}));
  process.exitCode = 1;
});
