import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TenantProvisionService {
  constructor(private readonly prisma: PrismaClient) {}

  async createNewTenant(name: string, slug: string) {
    // 1. Verifica unicidade do slug
    const existing = await this.prisma.tenant.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException({
        message: 'Já existe um tenant com esse slug',
        field: 'slug',
      });
    }

    // 2. Cria registro do tenant
    const tenant = await this.prisma.tenant.create({
      data: { name, slug },
    });

    // Não precisa criar schema nem rodar migração!

    return tenant;
  }
}
