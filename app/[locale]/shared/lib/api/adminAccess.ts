import {createHash, timingSafeEqual} from 'node:crypto';

// Временная защита формы: длинный секрет только в окружении сервера.
// Не храним ключ в URL, NEXT_PUBLIC_ или localStorage. Позже заменим на авторизацию аккаунта.
export function checkAdminAccess(request: Request, token = process.env.PROJECT_ADMIN_TOKEN) {
  if (!token || token.length < 32) return {error: 'ADMIN_NOT_CONFIGURED', status: 503} as const;
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ') || authorization.length > 1024) return {error: 'UNAUTHORIZED', status: 401} as const;
  const digest = (value: string) => createHash('sha256').update(value).digest();
  if (!timingSafeEqual(digest(authorization.slice(7)), digest(token))) return {error: 'UNAUTHORIZED', status: 401} as const;
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return {error: 'FORBIDDEN', status: 403} as const;
  return null;
}
