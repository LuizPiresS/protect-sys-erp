import { Injectable } from '@nestjs/common';
import { RolesRepository } from '../../infrastructure/persistence/repositories/roles.repository';
import { RoleCreateInputDto } from '../../presentation/http/dtos/role-create.input.dto';

@Injectable()
export class CreateRoleUseCase {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async execute(input: RoleCreateInputDto) {
    return this.rolesRepository.create(input);
  }
}
