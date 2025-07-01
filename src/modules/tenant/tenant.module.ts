import { Module } from '@nestjs/common';
import { TenantProvisionService } from './services/tenant-provision.service';
import { TenantController } from './tenant.controller';

@Module({
  providers: [TenantProvisionService],
  controllers: [TenantController],
})
export class TenantModule {}
