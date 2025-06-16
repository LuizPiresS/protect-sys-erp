import { Injectable } from '@nestjs/common';
import { RolesRepository } from '../../infrastructure/persistence/repositories/roles.repository';

@Injectable()
export class ListRolesUseCase {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async execute() {
    return this.rolesRepository.findAll();
  }
}
