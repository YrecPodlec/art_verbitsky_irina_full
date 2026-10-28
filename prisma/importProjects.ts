import 'dotenv/config';
import {readFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
import {PrismaClient, type Prisma} from '../app/generated/prisma/client';
import {assertProjectClassification} from '../app/[locale]/entities/project/model/projectClassification';
import {assertProjectTranslations} from '../app/[locale]/entities/project/api/projectTranslations';
import catalog from './project-import.catalog.json';
import {buildProjectImport, type InspectedImage} from './buildProjectImport';
import {projectValidator} from './projectValidator';

const prisma = new PrismaClient({log: []});
const apply = process.argv.includes('--apply');

async function main() {
  // Защита от случайного импорта в другую базу. Секретный URI не выводим.
  if (!process.env.DATABASE_URL || new URL(process.env.DATABASE_URL).pathname !== '/portfolio') {
    throw new Error('EXPECTED_PORTFOLIO_DATABASE');
  }
  const report = JSON.parse(await readFile('.next/blob-inspection/report.json', 'utf8')) as {
    checkedAt: string; files: InspectedImage[];
  };
  const age = Date.now() - Date.parse(report.checkedAt);
  if (!Number.isFinite(age) || age < 0 || age > 86400000) throw new Error('IMAGE_REPORT_EXPIRED');
  const data = catalog.map((entry) => buildProjectImport(entry, report.files));
  for (const project of data) assertProjectTranslations(project);
  if (report.files.some((file) => !catalog.some((entry) => entry.folder === file.folder))) {
    throw new Error('UNMAPPED_BLOB_FOLDER');
  }
  const existing = await prisma.project.findMany();
  for (const project of existing) assertProjectClassification(project);
  const pending = data.filter((project) => {
    const matches = existing.filter((record) => record.slug === project.slug || record.contentKey === project.contentKey);
    if (matches.length && (matches.length !== 1 || matches[0].slug !== project.slug || matches[0].contentKey !== project.contentKey)) {
      throw new Error('PROJECT_IDENTITY_COLLISION');
    }
    // Не обновляем даже существующие переводы/изображения: ручные правки важнее импорта.
    return matches.length === 0;
  });
  const result = await prisma.$runCommandRaw({listCollections: 1, filter: {name: 'projects'}});
  const collection = (result.cursor as {firstBatch: {options?: {validator?: Prisma.InputJsonObject}}[]}).firstBatch[0];
  if (!collection) throw new Error('PROJECTS_COLLECTION_MISSING');
  const previous = collection.options?.validator;
  // Чужие правила нельзя затирать. Здесь допускаем пустое правило или нашу версию.
  if (previous && Object.keys(previous).length && !isDeepStrictEqual(previous, projectValidator)) {
    throw new Error('EXISTING_VALIDATOR_REQUIRES_REVIEW');
  }
  const indexResult = await prisma.$runCommandRaw({listIndexes: 'projects'});
  const indexes = (indexResult.cursor as {firstBatch: {key: Record<string, number>; unique?: boolean}[]}).firstBatch;
  for (const field of ['slug', 'contentKey']) {
    if (!indexes.some((index) => index.unique && Object.keys(index.key).length === 1 && index.key[field] === 1)) {
      throw new Error('UNIQUE_PROJECT_INDEX_MISSING');
    }
  }
  console.log(JSON.stringify({mode: apply ? 'apply' : 'check', existing: existing.length,
    skip: data.length - pending.length, add: pending.length,
    imagesToAdd: pending.reduce((sum, project) => sum + project.media.length, 0), slugs: pending.map((project) => project.slug)}));
  if (!apply) return;
  await prisma.$runCommandRaw({collMod: 'projects', validator: projectValidator,
    validationLevel: 'strict', validationAction: 'error'});
  // Все новые проекты одной транзакцией: ошибка не оставит половину коллекции.
  if (pending.length) await prisma.$transaction(async (tx) => {
    for (const project of pending) await tx.project.create({data: project});
  }, {maxWait: 10000, timeout: 60000});
  const after = await prisma.project.findMany();
  for (const record of existing) {
    if (!isDeepStrictEqual(after.find((project) => project.id === record.id), record)) {
      throw new Error('EXISTING_PROJECT_CHANGED');
    }
  }
  for (const project of after) {assertProjectClassification(project); assertProjectTranslations(project);}
  console.log(JSON.stringify({verified: true, projects: after.length,
    residential: after.filter((project) => project.type === 'residential').length,
    offices: after.filter((project) => project.category === 'office').length,
    images: after.reduce((sum, project) => sum + project.media.length, 0), existingUnchanged: true}));
}

main().catch((error: unknown) => {
  // Prisma/SDK могут включать URI в ошибку. Выводим только технический код.
  const code = error instanceof Error && 'code' in error && /^P\d{4}$/.test(String(error.code)) ? String(error.code) :
    error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'PROJECT_IMPORT_FAILED';
  console.error(JSON.stringify({error: code})); process.exitCode = 1;
}).finally(() => prisma.$disconnect());
