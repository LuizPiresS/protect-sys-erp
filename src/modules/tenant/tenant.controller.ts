import { Controller, Post, Body } from '@nestjs/common';
import { TenantProvisionService } from './services/tenant-provision.service';
import { CreateTenantInputDto } from './presentation/controllers/create-tenant.input.dto';

@Controller('tenants')
export class TenantController {
  constructor(private readonly provisionService: TenantProvisionService) {}

  @Post()
  async create(@Body() dto: CreateTenantInputDto) {
    return this.provisionService.createNewTenant(dto.name, dto.slug);
  }
}
