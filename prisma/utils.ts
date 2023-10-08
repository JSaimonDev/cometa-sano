import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const runQuery = async (query: Promise<any>): Promise<void> => {
  query
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
    })
    .finally(() => {
      process.exit(1)
    })
}
