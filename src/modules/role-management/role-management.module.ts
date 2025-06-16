import { Module } from '@nestjs/common';
import { RolesController } from './presentation/http/controllers/roles.controller';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { ListRolesUseCase } from './application/use-cases/list-roles.use-case';
import { RolesRepository } from './infrastructure/persistence/repositories/roles.repository';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Module({
  controllers: [RolesController],
  providers: [
    CreateRoleUseCase,
    ListRolesUseCase,
    RolesRepository,
    PrismaService,
  ],
  exports: [RolesRepository],
})
export class RoleManagementModule {}
