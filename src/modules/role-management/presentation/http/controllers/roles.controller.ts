import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateRoleUseCase } from '../../../application/use-cases/create-role.use-case';
import { ListRolesUseCase } from '../../../application/use-cases/list-roles.use-case';
import { RoleCreateInputDto } from '../dtos/role-create.input.dto';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly listRolesUseCase: ListRolesUseCase,
  ) {}

  @Post()
  async create(@Body() dto: RoleCreateInputDto) {
    return this.createRoleUseCase.execute(dto);
  }

  @Get()
  async list() {
    return this.listRolesUseCase.execute();
  }
}
