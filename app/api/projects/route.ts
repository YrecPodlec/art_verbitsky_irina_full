import {getProjectRecords} from '@/app/[locale]/entities/project/api/getProjectRecords';
import {createProject} from '@/app/[locale]/entities/project/api/createProject';
import {ProjectInputError} from '@/app/[locale]/entities/project/model/parseProjectInput';
import {checkAdminAccess} from '@/app/[locale]/shared/lib/api/adminAccess';
import {readJson} from '@/app/[locale]/shared/lib/api/readJson';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Здесь только HTTP-вход. FSD-логика остаётся внутри app/[locale]/entities и shared.
const json = (body: unknown, status = 200) => Response.json(body, {status, headers: {'Cache-Control': 'no-store'}});

// GET /api/projects?featured=true&limit=3 — JSON-массив без переводов и секретов.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const featuredValue = params.get('featured');
  const limitValue = params.get('limit');
  const limit = limitValue === null ? 30 : Number(limitValue);
  if ([...params.keys()].some((key) => key !== 'featured' && key !== 'limit')
    || (featuredValue !== null && featuredValue !== 'true' && featuredValue !== 'false')
    || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) return json({error: 'INVALID_QUERY'}, 400);
  try {
    const records = await getProjectRecords({featured: featuredValue === null ? undefined : featuredValue === 'true', limit});
    // Поля ответа выбираем явно. Имя/описание/история клиент читает из messages по contentKey.
    return json(records.map(({id, slug, contentKey, type, category, countryCode, citySlug, areaM2, year, featured, coverMediaId, coverPosition, media}) => ({
      id, slug, contentKey, type, category, countryCode, citySlug, areaM2, year, featured, coverMediaId, coverPosition, media,
    })));
  } catch {
    console.error('PROJECTS_API_READ_FAILED');
    return json({error: 'DATABASE_UNAVAILABLE'}, 503);
  }
}

// POST только по явной отправке формы. Ни импорт модуля, ни GET ничего не создают.
export async function POST(request: Request) {
  const accessError = checkAdminAccess(request);
  if (accessError) return json({error: accessError.error}, accessError.status);
  try {
    const project = await createProject(await readJson(request));
    return json(project, 201);
  } catch (error: unknown) {
    if (error instanceof ProjectInputError) return json({error: 'INVALID_PROJECT_INPUT', field: error.field}, 400);
    if (error instanceof Error) {
      if (error.message === 'INVALID_JSON') return json({error: error.message}, 400);
      if (error.message === 'PAYLOAD_TOO_LARGE') return json({error: error.message}, 413);
      if (error.message === 'UNSUPPORTED_MEDIA_TYPE') return json({error: error.message}, 415);
      if ('code' in error && error.code === 'P2002') return json({error: 'PROJECT_EXISTS'}, 409);
    }
    // Не отправляем клиенту ошибку Prisma: в ней может быть адрес БД или другие детали.
    console.error('PROJECTS_API_CREATE_FAILED');
    return json({error: 'DATABASE_UNAVAILABLE'}, 503);
  }
}
