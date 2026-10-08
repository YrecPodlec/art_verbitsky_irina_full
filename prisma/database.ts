import 'dotenv/config';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {PrismaClient, type Prisma} from '../app/generated/prisma/client';
import {assertProjectClassification} from '../app/[locale]/entities/project/model/projectClassification';
import {projectValidator} from './projectValidator';

const prisma = new PrismaClient({log: []});
const require = createRequire(import.meta.url);
const action = process.argv[2];

// Первый проект: неизвестные площадь, год и история намеренно не выдуманы.
const miami = {
  slug: 'miami-house',
  contentKey: 'miami',
  publicationStatus: 'published',
  type: 'residential',
  category: 'house',
  countryCode: 'US',
  citySlug: 'miami',
  featured: true,
  coverMediaId: 'miami-cover',
  coverPosition: {x: 50, y: 50},
  publishedAt: new Date(),
  media: [{
    id: 'miami-cover',
    contentKey: 'cover',
    category: 'visualization',
    url: 'https://mstvzrmidf14lpdu.public.blob.vercel-storage.com/projects/miami/1.webp',
    storageKey: 'projects/miami/1.webp',
    width: 2028,
    height: 1525,
    mimeType: 'image/webp',
    sizeBytes: 283932,
  }],
} satisfies Prisma.ProjectCreateInput;

async function inspectDatabase() {
  await prisma.$runCommandRaw({ping: 1});
  const collections = await prisma.$runCommandRaw({listCollections: 1, filter: {name: 'projects'}});
  const cursor = collections.cursor as {firstBatch: {options?: {validator?: Prisma.InputJsonObject}}[]};
  const collection = cursor.firstBatch[0];
  const count = collection ? await prisma.project.count() : 0;
  console.log(`Соединение с MongoDB работает. Проектов: ${count}.`);
  return {collection, count};
}

async function initialize() {
  const {collection, count} = await inspectDatabase();
  // Повторный запуск допускает только созданную этим скриптом запись и не обновляет её.
  // Чужую наполненную базу этим стартовым скриптом не изменяем.
  const existing = count === 1 ? await prisma.project.findUnique({where: {contentKey: miami.contentKey}}) : null;
  if (count > 0 && !existing) throw new Error('DATABASE_NOT_EMPTY');

  const previousValidator = collection?.options?.validator;
  const rules = previousValidator && Object.keys(previousValidator).length
    ? JSON.stringify(previousValidator).includes(JSON.stringify(projectValidator))
      ? previousValidator
      : {$and: [previousValidator, projectValidator]}
    : projectValidator;

  // Существующие ограничения сохраняем. Новую коллекцию сразу создаём с проверкой.
  await prisma.$runCommandRaw({
    ...(collection ? {collMod: 'projects'} : {create: 'projects'}),
    validator: rules,
    validationLevel: 'strict',
    validationAction: 'error',
  });
  console.log('В MongoDB установлена строгая проверка type/category.');

  // Индексы берутся из schema.prisma, а не дублируются вручную в скрипте.
  // Не используем --accept-data-loss и --force-reset; вывод с адресом БД не печатаем.
  const result = spawnSync(process.execPath, [require.resolve('prisma/build/index.js'), 'db', 'push', '--skip-generate'], {
    encoding: 'utf8', env: {...process.env, CHECKPOINT_DISABLE: '1'},
  });
  if (result.status !== 0) throw new Error('DB_PUSH_FAILED');
  console.log('Индексы Prisma применены.');

  assertProjectClassification(miami);
  if (!existing) await prisma.project.create({data: miami});
  console.log(existing ? 'Майами уже существует; данные не перезаписаны.' : 'Добавлен проект Майами с обложкой из Blob.');
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL_MISSING');
  if (action === 'check') await inspectDatabase();
  else if (action === 'init') await initialize();
  else throw new Error('UNKNOWN_DATABASE_ACTION');
}

main().catch((error: unknown) => {
  // Ошибки подключения могут содержать секреты: скрываем URL, логин и пароль.
  const code = error instanceof Error && 'code' in error ? String(error.code) :
    error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'DATABASE_OPERATION_FAILED';
  console.error(`Операция с БД не выполнена: ${code}. Проверь подключение и права пользователя MongoDB.`);
  if (error instanceof Error) {
    let detail = error.message;
    const connection = process.env.DATABASE_URL;
    if (connection) {
      detail = detail.split(connection).join('[DATABASE_URL скрыт]');
      try {
        const parsed = new URL(connection);
        for (const secret of [parsed.username, parsed.password]) {
          if (secret) detail = detail.split(secret).join('[скрыто]').split(decodeURIComponent(secret)).join('[скрыто]');
        }
      } catch { /* Некорректный URL не разбираем; полную строку уже скрыли выше. */ }
    }
    console.error(detail.replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, '[MongoDB URL скрыт]'));
  }
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
