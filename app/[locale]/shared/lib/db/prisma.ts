import 'server-only';
import {PrismaClient} from '@/app/generated/prisma/client';
import {ProjectCategory} from '@/app/generated/prisma/enums';

// В dev Next перезагружает модули: сохраняем клиент, чтобы не множить подключения.
// В браузер этот модуль импортировать нельзя — это контролирует server-only.
// При добавлении категории прежний dev-клиент ещё помнит старый enum.
// Меняем экземпляр только при изменении справочника, не при каждом обновлении JSX.
const schemaKey = Object.values(ProjectCategory).join('|');
const globalForPrisma = globalThis as unknown as {prisma?: PrismaClient; prismaSchemaKey?: string};
export const prisma = globalForPrisma.prismaSchemaKey === schemaKey && globalForPrisma.prisma
  ? globalForPrisma.prisma
  : new PrismaClient({log: []});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchemaKey = schemaKey;
}
