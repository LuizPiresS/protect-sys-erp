import { Module } from '@nestjs/common';
import { TenantProvisionService } from './services/tenant-provision.service';
import { TenantController } from './tenant.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [TenantProvisionService, PrismaClient],
  controllers: [TenantController],
})
export class TenantModule {}
