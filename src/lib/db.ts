import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Filter noise socket idle timeout pada PostgreSQL serverless
    log: ['warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
