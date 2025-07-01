import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IBaseRepositoryWithDI } from './interfaces/base-repository-with-di.interface';

@Injectable()
export abstract class BaseRepositoryWithDI<
  T,
  Where,
  Create,
  Update,
  FindManyArgs = any,
> implements IBaseRepositoryWithDI<T, Where, Create, Update, FindManyArgs>
{
  constructor(protected readonly prisma: PrismaClient) {}

  protected abstract getModel(): any;

  async create(data: Create): Promise<T> {
    return this.getModel().create({ data });
  }

  async findByUnique(where: Where): Promise<T | null> {
    return this.getModel().findUnique({ where });
  }

  async findOne(where: Where): Promise<T | null> {
    return this.getModel().findFirst({ where });
  }

  async findAll(tenantId: string): Promise<T[]> {
    return this.getModel().findMany({ where: { tenantId } });
  }

  async findWithFilters(
    options: FindManyArgs & { tenantId: string },
  ): Promise<T[]> {
    return this.getModel().findMany(options);
  }

  async update(where: Where, data: Update): Promise<T> {
    return this.getModel().update({ where, data });
  }

  async delete(where: Where): Promise<boolean> {
    try {
      await this.getModel().delete({ where });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  async softDelete(where: Where): Promise<T> {
    return this.getModel().update({
      where,
      data: {
        deletedAt: new Date(),
        isActive: false,
      } as any,
    });
  }

  async count(where?: Where): Promise<number> {
    return this.getModel().count({ where });
  }

  async exists(where: Where): Promise<boolean> {
    const count = await this.getModel().count({ where });
    return count > 0;
  }

  async upsert(where: Where, create: Create, update: Update): Promise<T> {
    return this.getModel().upsert({ where, create, update });
  }

  // Métodos utilitários extras
  async findMany(options?: FindManyArgs): Promise<T[]> {
    return this.getModel().findMany(options);
  }

  async findFirst(where: Where): Promise<T | null> {
    return this.getModel().findFirst({ where });
  }

  async findManyWithPagination(
    page: number = 1,
    limit: number = 10,
    where?: Where,
    orderBy?: any,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.getModel().findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.getModel().count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
