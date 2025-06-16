import { PrismaClient } from '@prisma/client';

export interface IBaseRepository<T, Where, Create, Update, FindManyArgs = any> {
  create(prisma: PrismaClient, data: Create): Promise<T>;
  findByUnique(prisma: PrismaClient, where: Where): Promise<T | null>;
  findOne(prisma: PrismaClient, where: Where): Promise<T | null>;
  findAll(prisma: PrismaClient, tenantId: string): Promise<T[]>;
  findWithFilters(
    prisma: PrismaClient,
    options: FindManyArgs & { tenantId: string },
  ): Promise<T[]>;
  update(prisma: PrismaClient, where: Where, data: Update): Promise<T>;
  delete(prisma: PrismaClient, where: Where): Promise<boolean>;
  softDelete(prisma: PrismaClient, where: Where): Promise<T>;
  count(prisma: PrismaClient, where?: Where): Promise<number>;
  exists(prisma: PrismaClient, where: Where): Promise<boolean>;
  upsert(
    prisma: PrismaClient,
    where: Where,
    create: Create,
    update: Update,
  ): Promise<T>;
}
