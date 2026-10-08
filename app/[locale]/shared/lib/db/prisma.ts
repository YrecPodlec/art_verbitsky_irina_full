import 'server-only';
import {PrismaClient} from '@/app/generated/prisma/client';

// В dev Next перезагружает модули: сохраняем клиент, чтобы не множить подключения.
// В браузер этот модуль импортировать нельзя — это контролирует server-only.
const globalForPrisma = globalThis as unknown as {prisma?: PrismaClient};
export const prisma = globalForPrisma.prisma ?? new PrismaClient({log: []});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
