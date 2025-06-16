import { Injectable } from '@nestjs/common';
import { RoleCreateInputDto } from '../../../presentation/http/dtos/role-create.input.dto';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: RoleCreateInputDto) {
    const { tenantId, name, description, permissions } = input;
    return this.prisma.role.create({
      data: {
        name,
        description: description ?? '', // Garante valor padrão
        permissions,
        tenant: { connect: { id: tenantId } },
      },
    });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }
}
