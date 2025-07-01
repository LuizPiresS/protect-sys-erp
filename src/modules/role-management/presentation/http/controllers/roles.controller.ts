import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateRoleUseCase } from '../../../application/use-cases/create-role.use-case';
import { ListRolesUseCase } from '../../../application/use-cases/list-roles.use-case';
import { RoleCreateInputDto } from '../dtos/role-create.input.dto';
import { Request } from 'express';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly listRolesUseCase: ListRolesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo role' })
  @ApiBody({ type: RoleCreateInputDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Role criado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  async create(@Body() dto: RoleCreateInputDto, @Req() req: Request) {
    // Captura o tenant do request (injetado pelo middleware)
    const tenant = req['tenant'];
    if (!tenant) {
      throw new BadRequestException('Tenant não identificado');
    }

    return this.createRoleUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os roles do tenant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de roles retornada com sucesso',
  })
  async list(@Req() req: Request) {
    // Captura o tenant do request (injetado pelo middleware)
    const tenant = req['tenant'];
    if (!tenant) {
      throw new BadRequestException('Tenant não identificado');
    }

    return this.listRolesUseCase.execute(tenant.id);
  }
}
