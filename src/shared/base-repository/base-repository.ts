/**
 * Abstract base repository providing common CRUD operations for Prisma models.
 *
 * @template T - The entity type returned by repository methods.
 * @template Where - The type of the unique identifier or filter for queries.
 * @template Create - The type of the data required to create a new entity.
 * @template Update - The type of the data required to update an entity.
 * @template FindManyArgs - The type of the arguments for findMany queries (default: any).
 *
 * @remarks
 * This class is intended to be extended by specific repositories for each model.
 * Subclasses must implement the `getModel` method to return the appropriate Prisma model delegate.
 *
 * @example
 * class UserRepository extends BaseRepository<User, UserWhereUniqueInput, UserCreateInput, UserUpdateInput> {
 *   protected getModel(prisma: PrismaClient) {
 *     return prisma.user;
 *   }
 * }
 */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IBaseRepository } from './interfaces/base-repository.interface';

@Injectable()
export abstract class BaseRepository<
  T,
  Where,
  Create,
  Update,
  FindManyArgs = any,
> implements IBaseRepository<T, Where, Create, Update, FindManyArgs>
{
  protected abstract getModel(prisma: PrismaClient): any;

  async create(prisma: PrismaClient, data: Create): Promise<T> {
    return this.getModel(prisma).create({ data });
  }

  async findByUnique(prisma: PrismaClient, where: Where): Promise<T | null> {
    return this.getModel(prisma).findUnique({ where });
  }

  async findOne(prisma: PrismaClient, where: Where): Promise<T | null> {
    return this.getModel(prisma).findFirst({ where });
  }

  async findAll(prisma: PrismaClient, tenantId: string): Promise<T[]> {
    return this.getModel(prisma).findMany({ where: { tenantId } });
  }

  async findWithFilters(
    prisma: PrismaClient,
    options: FindManyArgs & { tenantId: string },
  ): Promise<T[]> {
    return this.getModel(prisma).findMany(options);
  }

  async update(prisma: PrismaClient, where: Where, data: Update): Promise<T> {
    return this.getModel(prisma).update({ where, data });
  }

  async delete(prisma: PrismaClient, where: Where): Promise<boolean> {
    try {
      await this.getModel(prisma).delete({ where });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  async softDelete(prisma: PrismaClient, where: Where): Promise<T> {
    return this.getModel(prisma).update({
      where,
      data: {
        deletedAt: new Date(),
        isActive: false,
      } as any,
    });
  }

  async count(prisma: PrismaClient, where?: Where): Promise<number> {
    return this.getModel(prisma).count({ where });
  }

  async exists(prisma: PrismaClient, where: Where): Promise<boolean> {
    const count = await this.getModel(prisma).count({ where });
    return count > 0;
  }

  async upsert(
    prisma: PrismaClient,
    where: Where,
    create: Create,
    update: Update,
  ): Promise<T> {
    return this.getModel(prisma).upsert({ where, create, update });
  }
}
